import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  try {
    console.log('Resume analysis API called')
    
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      console.error('No API key found')
      return {
        success: false,
        error: 'AI service is not configured. Please check the server configuration.'
      }
    }

    const { currentResume, jobPost, resumeData } = await readBody(event)
    console.log('Request data received:', { 
      hasResume: !!currentResume, 
      hasJobPost: !!jobPost, 
      resumeLength: currentResume?.length || 0,
      jobPostLength: jobPost?.length || 0
    })

    if (!currentResume || !jobPost) {
      console.error('Missing required data:', { currentResume: !!currentResume, jobPost: !!jobPost })
      return {
        success: false,
        error: 'Missing required data for resume analysis.'
      }
    }

    console.log('Initializing Google AI...')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Rigorous analysis prompt for accurate scoring
    const prompt = `You are a strict resume analyzer. Analyze this resume against the job posting with RIGOROUS standards. Be harsh but fair.

RESUME:
${currentResume.substring(0, 2500)}...

JOB POSTING:
${jobPost.substring(0, 2000)}...

SCORING CRITERIA (BALANCED ASSESSMENT):
- 90-100: Perfect match, candidate exceeds requirements
- 80-89: Strong match, minor gaps only (most optimized resumes should reach here)
- 70-79: Good match, some gaps but clearly relevant experience
- 60-69: Moderate match, meaningful overlap but missing key areas
- 50-59: Weak match, some relevance but major gaps
- 0-49: Poor match, wrong field/level

ANALYSIS RULES (RECOGNIZE OPTIMIZATION):
1. Skills Match: Count skill matches AND related/transferable skills. Credit partial matches and learning ability.
2. Experience Relevance: Consider transferable experience and how well achievements are described for target role.
3. Keyword Alignment: Credit both exact matches AND contextually relevant terminology.
4. Overall: Weight heavily on how well the resume demonstrates fit for THIS specific role.
5. IMPORTANT: If resume shows clear optimization for this job, score generously (aim for 75-90% range).

Return exactly this JSON:
{
  "metrics": {
    "skillsMatch": {
      "score": [realistic_score_0_100],
      "explanation": "Specific skill comparison with counts",
      "recommendations": ["Specific actionable advice"],
      "missingSkills": ["Exact missing requirements"],
      "strengths": ["Exact matching skills"]
    },
    "experienceRelevance": {
      "score": [realistic_score_0_100],
      "explanation": "Industry/role/level relevance analysis",
      "recommendations": ["Experience-related advice"],
      "missingSkills": ["Missing experience types"],
      "strengths": ["Relevant experience elements"]
    },
    "keywordAlignment": {
      "score": [realistic_score_0_100],
      "explanation": "Terminology and language match",
      "recommendations": ["Keyword optimization advice"],
      "missingSkills": ["Missing key terms"],
      "strengths": ["Matching terminology"]
    },
    "overallCompatibility": {
      "score": [realistic_score_0_100],
      "explanation": "Holistic assessment with major factors",
      "recommendations": ["Overall improvement strategy"],
      "missingSkills": ["Critical gaps"],
      "strengths": ["Key advantages"]
    }
  },
  "summary": {
    "compatibilityLevel": "[Poor/Weak/Moderate/Good/Strong/Excellent]",
    "recommendation": "Honest assessment of candidacy",
    "keyStrengths": ["Top 3 actual strengths"],
    "keyGaps": ["Top 3 critical gaps"]
  }
}`

    console.log('Sending request to AI model...')
    const result = await model.generateContent(prompt)
    console.log('AI response received')
    
    const response = await result.response
    const generatedText = response.text()
    console.log('Generated text length:', generatedText?.length || 0)

    let analysisData
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }

      analysisData = JSON.parse(jsonMatch[0])

      if (!analysisData.metrics || !analysisData.summary) {
        throw new Error('Invalid analysis data structure')
      }

      const requiredMetrics = ['skillsMatch', 'experienceRelevance', 'keywordAlignment', 'overallCompatibility']
      for (const metric of requiredMetrics) {
        if (!analysisData.metrics[metric]) {
          throw new Error(`Missing required metric: ${metric}`)
        }
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('AI Response:', generatedText)
      return {
        success: false,
        error: 'Failed to parse AI analysis results. Please try again.'
      }
    }

    console.log('Analysis successful, returning data')
    return {
      success: true,
      data: analysisData
    }
  } catch (error) {
    console.error('Resume analysis error:', error)
    console.error('Error stack:', error.stack)

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

    // Provide more specific error information
    if (error.message?.includes('PERMISSION_DENIED')) {
      return {
        success: false,
        error: 'AI API access denied. Please check your API key permissions.'
      }
    }

    if (error.message?.includes('INVALID_ARGUMENT')) {
      return {
        success: false,
        error: 'Invalid request format. Please try again with different input.'
      }
    }

    return {
      success: false,
      error: `Analysis failed: ${error.message || 'Unknown error'}. Please try again.`
    }
  }
})


