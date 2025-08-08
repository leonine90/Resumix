import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFile } from 'fs/promises'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.GOOGLE_AI_API_KEY
    
    if (!apiKey) {
      return {
        success: false,
        error: 'AI service is not configured. Please check the server configuration.'
      }
    }

    // Get the uploaded file
    const formData = await readFormData(event)
    const file = formData.get('file')
    
    if (!file) {
      return {
        success: false,
        error: 'No file uploaded.'
      }
    }

    // Validate file type
    const allowedTypes = [
      'text/plain',
      'application/rtf',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]
    
    const allowedExtensions = ['.txt', '.rtf', '.pdf', '.doc', '.docx']
    const fileName = file.name || ''
    const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return {
        success: false,
        error: 'Unsupported file type. Please upload a .txt, .rtf, .doc, .docx, or .pdf file.'
      }
    }

    // Save file temporarily
    const tempDir = tmpdir()
    const tempFileName = `${uuidv4()}-${fileName}`
    const tempFilePath = join(tempDir, tempFileName)
    
    try {
      // Convert file to buffer and save
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await writeFile(tempFilePath, buffer)
      
      // Extract text from file based on type
      let resumeText = ''
      
      if (file.type === 'text/plain' || fileExtension === '.txt') {
        // Simple text file
        resumeText = await readFile(tempFilePath, 'utf-8')
      } else if (file.type === 'application/rtf' || fileExtension === '.rtf') {
        // RTF file - basic text extraction (remove RTF markup)
        const rtfContent = await readFile(tempFilePath, 'utf-8')
        resumeText = rtfContent
          .replace(/\\[a-z]+\d*\s?/g, ' ') // Remove RTF commands
          .replace(/\{[^}]*\}/g, ' ') // Remove RTF groups
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim()
      } else if (file.type === 'application/pdf' || fileExtension === '.pdf') {
        // PDF file - extract text using pdf2json
        try {
          console.log('Processing PDF file:', file.name)
          const PDFParser = (await import('pdf2json')).default
          console.log('PDF2JSON module loaded successfully')
          
          const pdfBuffer = await readFile(tempFilePath)
          console.log('PDF file read, buffer size:', pdfBuffer.length)
          
          // Create a new PDF parser instance
          const pdfParser = new PDFParser()
          
          // Parse the PDF and extract text
          const pdfData = await new Promise((resolve, reject) => {
            pdfParser.on('pdfParser_dataReady', (pdfData) => {
              console.log('PDF parsed successfully, pages:', pdfData.Pages.length)
              resolve(pdfData)
            })
            
            pdfParser.on('pdfParser_dataError', (errData) => {
              console.error('PDF parsing error:', errData)
              reject(new Error(errData.parserError))
            })
            
            // Parse the buffer
            pdfParser.parseBuffer(pdfBuffer)
          })
          
          // Extract text from all pages
          let extractedText = ''
          for (let pageIndex = 0; pageIndex < pdfData.Pages.length; pageIndex++) {
            const page = pdfData.Pages[pageIndex]
            for (let textIndex = 0; textIndex < page.Texts.length; textIndex++) {
              const textItem = page.Texts[textIndex]
              // Decode the text (pdf2json encodes text)
              const decodedText = decodeURIComponent(textItem.R[0].T)
              extractedText += decodedText + ' '
            }
            extractedText += '\n'
          }
          
          resumeText = extractedText.trim()
          console.log('PDF text extraction successful, text length:', resumeText.length)
          
          // Validate that we actually got text
          if (!resumeText || resumeText.trim().length === 0) {
            console.log('No text extracted from PDF')
            throw new Error('No text extracted from PDF')
          }
          
          console.log('PDF text extraction successful')
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError)
          return {
            success: false,
            error: `Could not extract text from the PDF file. Error: ${pdfError.message}. The file might be corrupted, password-protected, or contain only images. Please try copying the text manually.`
          }
        }
      } else if (fileExtension === '.docx') {
        // Word document (.docx) - extract text using mammoth
        try {
          console.log('Processing DOCX file:', file.name)
          const mammothModule = await import('mammoth')
          const mammoth = mammothModule.default || mammothModule
          console.log('Mammoth module loaded successfully')
          
          const docxBuffer = await readFile(tempFilePath)
          console.log('DOCX file read, buffer size:', docxBuffer.length)
          
          const result = await mammoth.extractRawText({ buffer: docxBuffer })
          console.log('DOCX parsed successfully, text length:', result.value ? result.value.length : 0)
          
          resumeText = result.value
          
          // Validate that we actually got text
          if (!resumeText || resumeText.trim().length === 0) {
            console.log('No text extracted from DOCX')
            throw new Error('No text extracted from DOCX')
          }
          
          console.log('DOCX text extraction successful')
        } catch (docxError) {
          console.error('DOCX parsing error:', docxError)
          return {
            success: false,
            error: `Could not extract text from the Word document. Error: ${docxError.message}. Please try copying the text manually.`
          }
        }
      } else if (fileExtension === '.doc') {
        // Legacy Word document (.doc) - not supported by mammoth
        return {
          success: false,
          error: 'Legacy .doc files are not supported. Please save your document as .docx format or copy the text manually.'
        }
      }
      
      // Clean up temp file
      await unlink(tempFilePath)
      
      if (!resumeText.trim()) {
        return {
          success: false,
          error: 'Could not extract text from the uploaded file. Please try copying and pasting the text instead.'
        }
      }

      // Clean and preprocess the resume text
      const cleanedResumeText = resumeText
        .trim()
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\n{3,}/g, '\n\n') // Reduce excessive line breaks
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\n\s+/g, '\n') // Remove leading spaces on new lines
      
      // Check if the text is too long (Google AI has token limits)
      if (cleanedResumeText.length > 10000) {
        return {
          success: false,
          error: 'Resume text is too long. Please use a shorter version (max 10,000 characters).'
        }
      }

      // Initialize Google AI
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

      // Create a comprehensive prompt with the exact JSON structure needed
      const prompt = `You are a resume parsing AI. Convert the following resume text into the EXACT JSON structure provided below. 

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON - no explanations, no markdown blocks, no additional text
2. Follow the JSON structure EXACTLY as shown
3. Extract ALL available information from the resume text and map it to the appropriate fields
4. For missing information, use empty arrays [] for array fields or empty strings "" for text fields
5. Extract dates in the format shown in the text (e.g., "October 2024 - Now", "May 8th, 1997")
6. For dateOfBirth, look for "Date of Birth", "DOB", or birth date information
7. For education: extract institution, degree, period, location from education sections. If location is not mentioned, use empty string "" instead of default values
8. For experience: extract company, position, period, location, and convert job descriptions into achievement bullet points. If location is not mentioned, use empty string "" instead of default values
9. For skills: extract individual skills, technologies, and competencies mentioned
10. For volunteering: look for volunteer activities, community involvement, or similar sections. If location is not mentioned, use empty string "" instead of default values
11. For languages: if mentioned, extract language skills and proficiency levels. Format as "Language Name (Proficiency Level)" - e.g., "English (Fluent)", "Spanish (Intermediate)"
12. For publications: if any research papers, articles, or publications are mentioned
13. Parse name and contact information carefully from the header. If address is not mentioned, use empty string "" instead of default values
14. The JSON must be syntactically perfect and parseable
15. IMPORTANT: Never use placeholder text like "City, Country" or "University Name" - use empty strings "" for missing information

TARGET JSON STRUCTURE:
{
  "editable": true,
  
  "headerElements": {
    "headshot": true,
    "address": true,
    "dateOfBirth": false,
    "phone": true,
    "email": true,
    "linkedin": true
  },
  "sections": {
    "summary": true,
    "researchInterests": true,
    "education": true,
    "experience": true,
    "publications": true,
    "skills": true,
    "volunteering": true,
    "languages": true,
    "signature": true
  },
  "sectionOrder": ["summary", "researchInterests", "education", "experience", "publications", "skills", "languages", "volunteering", "signature"],
  "personal": {
    "name": "Full Name",
    "title": "Job Title",
    "address": "",
    "dateOfBirth": "",
    "phone": "Phone Number",
    "email": "email@example.com",
    "linkedin": "https://linkedin.com/in/username",
    "linkedinText": "/username",
    "headshot": ""
  },
  "education": [
    {
      "institution": "University Name",
      "location": "",
      "degree": "Degree Name",
      "period": "Start Year - End Year",
      "gpa": "",
      "coursework": [],
      "description": ""
    }
  ],
  "summary": {
    "default": "Professional summary text here"
  },
  "experience": [
    {
      "company": "Company Name",
      "location": "",
      "position": "Job Title",
      "period": "Start Date - End Date",
      "achievements": [
        "Achievement or responsibility 1",
        "Achievement or responsibility 2"
      ]
    }
  ],
  "skills": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
  ],
  "publications": [
    {
      "title": "Publication Title",
      "authors": "Author names",
      "journal": "Journal/Conference Name",
      "year": "2024",
      "status": "Published/Submitted",
      "link": ""
    }
  ],
  "languages": [
    "Language Name (Proficiency Level)"
  ],
  "volunteering": [
    {
      "organization": "Organization Name",
      "position": "Volunteer Position",
      "period": "Start Date - End Date",
      "description": "Brief description of volunteer work"
    }
  ],
  "researchInterests": {
    "default": "Research interests and areas of focus"
  },
  "signature": {
    "name": "",
    "date": ""
  }
}

RESUME TEXT TO CONVERT:
${cleanedResumeText}

IMPORTANT: Convert this resume into the JSON structure above. Extract all relevant information and populate the appropriate fields. Return ONLY the JSON structure starting with { and ending with }. No explanations, no markdown, no additional text before or after the JSON.`

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const generatedText = response.text()
      
      // Parse the generated JSON
      let parsedData
      try {
        // Clean the response to extract only the JSON part
        let cleanedText = generatedText.trim()
        
        // Remove any markdown code blocks
        cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        
        // Try to find JSON object
        let jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          // If no match, maybe the entire response is JSON
          if (cleanedText.startsWith('{') && cleanedText.endsWith('}')) {
            jsonMatch = [cleanedText]
          } else {
            throw new Error('No valid JSON found in AI response')
          }
        }
        
        // Clean up any trailing text after the last }
        let jsonString = jsonMatch[0]
        const lastBraceIndex = jsonString.lastIndexOf('}')
        if (lastBraceIndex !== -1) {
          jsonString = jsonString.substring(0, lastBraceIndex + 1)
        }
        
        parsedData = JSON.parse(jsonString)
        
        // Validate that required fields exist
        if (!parsedData.personal || !parsedData.personal.name) {
          throw new Error('Invalid resume data structure - missing personal information')
        }
        
        // Fix common issues in parsed data
        if (parsedData.headerElements && parsedData.personal.dateOfBirth) {
          parsedData.headerElements.dateOfBirth = true
        }
        
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        console.error('AI Response length:', generatedText.length)
        console.error('AI Response (first 500 chars):', generatedText.substring(0, 500))
        console.error('AI Response (last 500 chars):', generatedText.substring(Math.max(0, generatedText.length - 500)))
        
        return {
          success: false,
          error: `Failed to parse AI response. Please try with shorter resume text or check formatting. Error: ${parseError.message}`
        }
      }

      return {
        success: true,
        data: parsedData
      }

    } catch (fileError) {
      // Clean up temp file if it exists
      try {
        await unlink(tempFilePath)
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      
      throw fileError
    }

  } catch (error) {
    console.error('File processing error:', error)
    
    // Handle specific Google AI errors
    if (error.message?.includes('API_KEY')) {
      return {
        success: false,
        error: 'AI API key is invalid. Please check the configuration.'
      }
    }
    
    if (error.message?.includes('quota')) {
      return {
        success: false,
        error: 'AI service quota exceeded. Please try again later.'
      }
    }
    
    return {
      success: false,
      error: 'An error occurred while processing your file. Please try again.'
    }
  }
}) 