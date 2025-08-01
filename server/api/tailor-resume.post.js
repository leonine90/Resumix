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

    // Get the request data
    const { currentResume, jobPost, resumeData } = await readBody(event)
    
    if (!currentResume || !jobPost || !resumeData) {
      return {
        success: false,
        error: 'Missing required data for resume optimization.'
      }
    }

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Create a specialized prompt for job tailoring
    const prompt = `You are an expert resume optimization AI. Your task is to tailor ONLY specific sections of a resume to better match a job posting while preserving ALL other information.

CRITICAL INSTRUCTIONS:
1. ONLY optimize these 3 sections: Summary, Experience achievements, and Skills
2. PRESERVE all existing company names, positions, dates, and personal information
3. DO NOT remove or change any existing resume structure
4. Focus on enhancing content with job-relevant keywords and impact
5. Keep all factual information accurate - don't add fake experiences
6. Return ONLY the optimized sections in valid JSON format
7. Maintain the exact same experience structure but improve achievement descriptions

CURRENT RESUME:
${currentResume}

JOB POSTING:
${jobPost}

CURRENT RESUME DATA (for reference):
${JSON.stringify(resumeData, null, 2)}

OUTPUT FORMAT (JSON only, no explanations):
{
  "summary": "Optimized professional summary that incorporates job keywords and highlights relevant skills",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title", 
      "period": "Start Date - End Date",
      "location": "City, Country",
      "achievements": [
        "Optimized achievement 1 with job-relevant keywords",
        "Optimized achievement 2 highlighting relevant impact",
        "Optimized achievement 3 focusing on job requirements"
      ]
    }
  ],
  "skills": [
    "Skill 1 (prioritized based on job requirements)",
    "Skill 2 (relevant to job posting)",
    "Skill 3 (mentioned in job requirements)"
  ]
}

OPTIMIZATION GUIDELINES:
- ONLY modify: summary text, experience achievements, and skills list
- PRESERVE exactly: company names, job titles, dates, locations, personal info
- Rewrite summary to incorporate job keywords while keeping it authentic
- Enhance experience achievements with job-relevant language and impact
- Reorder skills to prioritize those mentioned in the job posting
- DO NOT change the number of experience entries
- DO NOT modify any structural information
- Use action verbs and quantifiable results in achievements
- Ensure all company names and dates remain exactly the same

IMPORTANT: If the existing resume data has specific company names, positions, or dates, use those EXACT values in your output. Only improve the description/achievement text.

Generate the optimized content for these 3 sections only:`

    // Generate content using Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedText = response.text()
    
    // Parse the generated JSON
    let optimizedData
    try {
      // Clean the response to extract only the JSON part
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }
      
      optimizedData = JSON.parse(jsonMatch[0])
      
      // Validate that required fields exist
      if (!optimizedData.summary || !optimizedData.experience || !optimizedData.skills) {
        throw new Error('Invalid optimization data structure')
      }
      
      // Ensure skills is an array
      if (!Array.isArray(optimizedData.skills)) {
        optimizedData.skills = []
      }
      
      // Ensure experience is an array
      if (!Array.isArray(optimizedData.experience)) {
        optimizedData.experience = []
      }
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('AI Response:', generatedText)
      return {
        success: false,
        error: 'Failed to parse AI optimization results. The AI might have returned invalid data. Please try again.'
      }
    }

    return {
      success: true,
      data: optimizedData
    }

  } catch (error) {
    console.error('Resume tailoring error:', error)
    
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
      error: 'An error occurred while optimizing your resume. Please try again.'
    }
  }
})