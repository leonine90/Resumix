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

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Create a comprehensive prompt with the exact JSON structure needed
    const prompt = `You are a resume parsing AI. Convert the following resume text into the EXACT JSON structure provided below. 

IMPORTANT RULES:
1. Follow the JSON structure EXACTLY as shown
2. Extract information from the resume text and map it to the appropriate fields
3. If information is missing, use appropriate defaults or empty values
4. For arrays, create entries based on the information available
5. Maintain the same field names and structure
6. Return ONLY valid JSON, no additional text or explanations

TARGET JSON STRUCTURE:
{
  "editable": true,
  "enableVersions": false,
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
    "researchInterests": false,
    "education": true,
    "experience": true,
    "publications": false,
    "skills": true,
    "volunteering": false,
    "languages": false,
    "signature": false
  },
  "sectionOrder": ["summary", "education", "experience", "skills"],
  "personal": {
    "name": "Full Name",
    "title": "Job Title",
    "address": "City, Country",
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
      "location": "City, Country",
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
      "location": "City, Country",
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
  "publications": [],
  "languages": [],
  "volunteering": [],
  "researchInterests": {},
  "signature": {
    "name": "",
    "date": ""
  }
}

RESUME TEXT TO CONVERT:
${resumeText}

Convert this resume into the JSON structure above. Extract all relevant information and populate the appropriate fields. Return ONLY the JSON structure, no additional text.`

    // Generate content using Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedText = response.text()
    
    // Parse the generated JSON
    let parsedData
    try {
      // Clean the response to extract only the JSON part
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }
      
      parsedData = JSON.parse(jsonMatch[0])
      
      // Validate that required fields exist
      if (!parsedData.personal || !parsedData.personal.name) {
        throw new Error('Invalid resume data structure')
      }
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('AI Response:', generatedText)
      return {
        success: false,
        error: 'Failed to parse AI response. The AI might have returned invalid JSON. Please try again or check your resume text.'
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