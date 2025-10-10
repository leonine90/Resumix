import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    
    if (!apiKey) {
      return {
        success: false,
        error: 'AI service is not configured. Please check the server configuration.'
      }
    }

    const { achievement, userPrompt, jobPost, experienceContext } = await readBody(event)
    
    if (!achievement || !userPrompt) {
      return {
        success: false,
        error: 'Missing required data for achievement refinement.'
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are an expert resume writer. Refine the following resume achievement based on the user's specific request.

CURRENT ACHIEVEMENT:
${achievement}

USER'S REFINEMENT REQUEST:
${userPrompt}

${jobPost ? `JOB POSTING CONTEXT:\n${jobPost}\n` : ''}

${experienceContext ? `EXPERIENCE CONTEXT:\nPosition: ${experienceContext.position}\nCompany: ${experienceContext.company}\n` : ''}

INSTRUCTIONS:
1. Modify the achievement based ONLY on the user's specific request
2. Keep the core facts and accomplishments intact
3. If the user asks for metrics, add realistic quantifiable results (if applicable)
4. If the user asks for technical keywords, incorporate relevant ones from job posting
5. Maintain professional resume language
6. Keep it concise (1-2 lines maximum)
7. Use HTML <strong></strong> tags ONLY around technical keywords (programming languages, frameworks, tools)
8. Return ONLY the refined achievement text, nothing else
9. Do NOT add explanations, do NOT add quotes around the text

Examples of user requests and how to handle them:
- "add metrics" → Include percentages, numbers, scale
- "more technical" → Add technical terms and technologies
- "focus on leadership" → Emphasize team management and decision-making
- "shorter" → Condense while keeping key points
- "add Python" → Naturally incorporate Python if contextually relevant

CRITICAL: Return ONLY the refined achievement text. No explanations, no markdown code blocks, no quotes.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let refinedAchievement = response.text().trim()
    
    // Clean up any markdown formatting
    refinedAchievement = refinedAchievement
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert markdown bold to HTML
      .replace(/^```.*\n|\n```$/g, '') // Remove code blocks
      .trim()

    return {
      success: true,
      data: {
        refinedAchievement
      }
    }

  } catch (error) {
    console.error('Achievement refinement error:', error)
    
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
      error: 'Failed to refine achievement. Please try again.'
    }
  }
})

