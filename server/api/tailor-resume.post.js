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
    const prompt = `You are an expert resume optimization AI. Your task is to completely rewrite and optimize specific sections of a resume to better match a job posting while preserving structural information.

CRITICAL INSTRUCTIONS:
1. REWRITE AND OPTIMIZE these 3 sections: Summary, Experience achievements, and Skills
2. PRESERVE all existing company names, positions, dates, and personal information
3. COMPLETELY REWRITE achievement descriptions to incorporate job-relevant keywords, skills, and language
4. Focus on demonstrating how the candidate's experience aligns with the job requirements
5. Keep all factual information accurate - don't add fake experiences but enhance how they're described
6. Return ONLY the optimized sections in valid JSON format
7. Maintain the exact same experience structure but REWRITE achievement descriptions from scratch
8. Use HTML <strong></strong> tags to highlight ONLY technical keywords in the rewritten content

CURRENT RESUME:
${currentResume}

JOB POSTING:
${jobPost}

CURRENT RESUME DATA (for reference):
${JSON.stringify(resumeData, null, 2)}

OUTPUT FORMAT (JSON only, no explanations):
{
  "summary": "Completely rewritten professional summary that demonstrates strong alignment with job requirements, incorporating relevant keywords and showcasing how candidate's background matches the role. Highlight technical skills like <strong>React</strong> and <strong>TypeScript</strong> when relevant to the job posting.",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title", 
      "period": "Start Date - End Date",
      "location": "City, Country",
      "achievements": [
        "Completely rewritten achievement that demonstrates specific job-relevant skills and technologies like <strong>React</strong> and <strong>Node.js</strong>, with quantifiable impact",
        "Rewritten achievement showcasing relevant methodologies and tools such as <strong>Docker</strong> and CI/CD practices, emphasizing results that align with job requirements",
        "Rewritten achievement highlighting domain expertise and technical competencies like <strong>Python</strong> and <strong>Machine Learning</strong> that match the job posting"
      ]
    }
  ],
  "skills": [
    "JavaScript",
    "TypeScript", 
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "Git",
    "Agile Methodologies",
    "Individual skill items - NOT grouped categories"
  ]
}

OPTIMIZATION GUIDELINES:
- COMPLETELY REWRITE: summary text, experience achievements, and skills list to match job requirements
- PRESERVE exactly: company names, job titles, dates, locations, personal info
- REWRITE summary from scratch to incorporate job keywords and demonstrate alignment with role requirements
- COMPLETELY REWRITE experience achievements to showcase relevant skills, technologies, and impact mentioned in job posting
- Reorder and update skills to prioritize those mentioned in the job posting
- DO NOT change the number of experience entries
- DO NOT modify any structural information (company, position, period, location)
- Use action verbs and quantifiable results that resonate with the job requirements
- Ensure all company names and dates remain exactly the same
- CONTENT FOCUS: Prioritize rewriting content to match job requirements over formatting
- TECHNICAL KEYWORD BOLDING: After rewriting, use HTML <strong></strong> tags around technical keywords only
- ONLY bold technical keywords in: Summary text and Experience achievements (NOT in Skills section)
- Skills section: Keep as plain text - no bold formatting needed, output as individual skill items (NOT grouped categories)
- ONLY bold these types of keywords: programming languages, frameworks, technologies, tools, certifications
- Examples of what TO bold: React, Python, AWS, Kubernetes, Machine Learning, JavaScript, TypeScript, Node.js, Docker
- Do NOT bold: action verbs, soft skills, company names, dates, common words
- CRITICAL: Focus on content alignment first, then apply selective technical keyword bolding (3-5 terms per paragraph max)
- SKILLS FORMAT: Output skills as individual items like ["React", "TypeScript", "Node.js"], NOT grouped like ["Frontend: React, TypeScript, Node.js"]

IMPORTANT: COMPLETELY REWRITE the summary and experience achievements to align with the job posting. Use the existing resume as inspiration for the candidate's background, but rewrite everything to demonstrate how their experience specifically matches the job requirements. Preserve company names, positions, and dates exactly, but transform the content to showcase relevant skills, technologies, and achievements that the job posting is looking for.

REWRITING STRATEGY:
1. Analyze job posting for key requirements, technologies, and responsibilities
2. Rewrite summary to position candidate as ideal fit for these specific requirements
3. Transform each experience achievement to highlight relevant skills and impact
4. Prioritize skills that match job posting requirements
5. After rewriting, apply selective technical keyword bolding using <strong></strong> tags

EXAMPLE TRANSFORMATION:
- BEFORE: "Developed web applications for internal teams"  
- AFTER: "Architected and delivered enterprise-scale web applications using <strong>React</strong> and <strong>TypeScript</strong>, serving 10,000+ users and reducing operational overhead by 40%"

CRITICAL: This is content optimization, not just keyword bolding. Completely rewrite to match job requirements while maintaining factual accuracy.

SKILLS SECTION RULES:
- Output skills as individual items in an array: ["Skill1", "Skill2", "Skill3"]
- DO NOT group skills with categories: ["Category: Skill1, Skill2"]  
- Each skill should be a separate string in the array
- Keep skills concise and specific
- Prioritize job-relevant skills at the beginning of the array
- Examples: ["React", "TypeScript", "Node.js", "AWS", "Docker", "Git"]

Generate the completely rewritten and optimized content for these 3 sections:`

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
      
      // Convert any markdown bold formatting to HTML (in case AI uses markdown)
      const convertMarkdownToHtml = (text) => {
        if (typeof text === 'string') {
          return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        }
        return text
      }
      
      // Apply conversion to summary
      if (optimizedData.summary) {
        optimizedData.summary = convertMarkdownToHtml(optimizedData.summary)
      }
      
      // Apply conversion to experience achievements
      if (optimizedData.experience && Array.isArray(optimizedData.experience)) {
        optimizedData.experience.forEach(exp => {
          if (exp.achievements && Array.isArray(exp.achievements)) {
            exp.achievements = exp.achievements.map(achievement => convertMarkdownToHtml(achievement))
          }
        })
      }
      
      // Note: Skills should remain as plain text, no HTML conversion needed
      
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