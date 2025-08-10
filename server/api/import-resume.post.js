import { GoogleGenerativeAI } from '@google/generative-ai'

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

    // Get the resume text from the request body
    const { resumeText } = await readBody(event)
    
    if (!resumeText || typeof resumeText !== 'string') {
      return {
        success: false,
        error: 'Resume text is required.'
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
  "summary": "Professional summary text here",
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
  "researchInterests": [
    {
      "title": "Research Interests",
      "description": "Research interests and areas of focus"
    }
  ],
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
      
      // Ensure summary is a string
      if (parsedData.summary && typeof parsedData.summary === 'object') {
        parsedData.summary = parsedData.summary.default || parsedData.summary.text || ''
      }
      
      // Ensure researchInterests is an array and hide section if empty
      if (parsedData.researchInterests) {
        if (typeof parsedData.researchInterests === 'object' && !Array.isArray(parsedData.researchInterests)) {
          const defaultText = parsedData.researchInterests.default || parsedData.researchInterests.text || ''
          if (defaultText.trim()) {
            parsedData.researchInterests = [{
              title: 'Research Interests',
              description: defaultText
            }]
          } else {
            parsedData.researchInterests = []
            parsedData.sections.researchInterests = false
          }
        } else if (Array.isArray(parsedData.researchInterests) && parsedData.researchInterests.length === 0) {
          parsedData.sections.researchInterests = false
        }
      } else {
        parsedData.researchInterests = []
        parsedData.sections.researchInterests = false
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

  } catch (error) {
    console.error('AI processing error:', error)
    
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
      error: 'An error occurred while processing your resume. Please try again.'
    }
  }
})