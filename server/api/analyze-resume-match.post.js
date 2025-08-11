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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1, // Low temperature for more consistent results
        topP: 0.8,
        topK: 40
      }
    })

    // Rigorous analysis prompt for accurate scoring
    const prompt = `You are a precise resume analyzer. Analyze this resume against the job posting using SPECIFIC, QUANTIFIABLE criteria. You must provide consistent scores for the same resume-job combination.

RESUME:
${currentResume.substring(0, 2500)}...

JOB POSTING:
${jobPost.substring(0, 2000)}...

SCORING METHODOLOGY (QUANTIFIABLE CRITERIA):

SKILLS MATCH SCORING (0-100):
- Count exact skill matches from job posting found in resume
- Count related/transferable skills that could apply
- Formula: (Exact matches × 3) + (Related skills × 1) = Raw score
- Normalize to 0-100 scale: (Raw score / Total job skills × 3) × 100
- Cap at 100 if exceeds
- Examples: 5 exact + 3 related = 18 raw → 90% if job has 6 skills

EXPERIENCE RELEVANCE SCORING (0-100):
- Industry match: 0-30 points (same industry = 30, related = 20, different = 0-10)
- Role level match: 0-30 points (exact level = 30, adjacent = 20, different = 0-15)
- Achievement quality: 0-40 points (quantified results = 40, descriptive = 25, basic = 10)
- Total = sum of all three categories

KEYWORD ALIGNMENT SCORING (0-100):
- Extract key terms from job posting (technologies, methodologies, certifications)
- Count exact matches in resume
- Count contextual/synonym matches
- Formula: (Exact matches × 2) + (Contextual matches × 1) = Raw score
- Normalize: (Raw score / Total job keywords × 2) × 100
- Cap at 100

OVERALL COMPATIBILITY SCORING (0-100):
- Weighted average: Skills (35%) + Experience (40%) + Keywords (25%)
- Formula: (Skills × 0.35) + (Experience × 0.40) + (Keywords × 0.25)
- Round to nearest whole number

COMPATIBILITY LEVELS:
- 90-100: Excellent (Perfect alignment)
- 80-89: Strong (Minor gaps only)
- 70-79: Good (Some gaps but relevant)
- 60-69: Moderate (Meaningful overlap)
- 50-59: Weak (Some relevance)
- 0-49: Poor (Wrong field/level)

ANALYSIS REQUIREMENTS:
1. Extract ALL skills from job posting and count matches in resume
2. Identify industry, role level, and achievement patterns
3. List specific keywords from job posting and find matches
4. Provide exact counts and calculations for transparency
5. Be consistent - same resume + job should always get same score

Return exactly this JSON with SPECIFIC calculations:
{
  "metrics": {
    "skillsMatch": {
      "score": [calculated_score_0_100],
      "explanation": "Found X exact skill matches and Y related skills out of Z job requirements. Calculation: (X×3 + Y×1) / (Z×3) × 100 = [score]%",
      "recommendations": ["Specific actionable advice based on missing skills"],
      "missingSkills": ["Exact missing requirements from job posting"],
      "strengths": ["Exact matching skills found in resume"]
    },
    "experienceRelevance": {
      "score": [calculated_score_0_100],
      "explanation": "Industry: X/30, Role Level: Y/30, Achievements: Z/40. Total: [score]%",
      "recommendations": ["Experience-related advice with specific improvements"],
      "missingSkills": ["Missing experience types or levels"],
      "strengths": ["Relevant experience elements that match job"]
    },
    "keywordAlignment": {
      "score": [calculated_score_0_100],
      "explanation": "Found X exact keyword matches and Y contextual matches out of Z job keywords. Calculation: (X×2 + Y×1) / (Z×2) × 100 = [score]%",
      "recommendations": ["Keyword optimization advice with specific terms"],
      "missingSkills": ["Missing key terms from job posting"],
      "strengths": ["Matching terminology and language"]
    },
    "overallCompatibility": {
      "score": [weighted_average_score_0_100],
      "explanation": "Weighted calculation: Skills([skills_score]×0.35) + Experience([exp_score]×0.40) + Keywords([keyword_score]×0.25) = [score]%",
      "recommendations": ["Overall improvement strategy based on lowest scoring areas"],
      "missingSkills": ["Critical gaps affecting overall score"],
      "strengths": ["Key advantages that boost overall score"]
    }
  },
  "summary": {
    "compatibilityLevel": "[Poor/Weak/Moderate/Good/Strong/Excellent] based on overall score",
    "recommendation": "Specific assessment with actionable next steps",
    "keyStrengths": ["Top 3 specific strengths with evidence"],
    "keyGaps": ["Top 3 specific gaps with impact on score"]
  }
}

CRITICAL: Use the exact calculation formulas provided. Be consistent and quantifiable. Same resume + job posting must always produce the same scores.`

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
        
        // Validate score ranges
        const score = analysisData.metrics[metric].score
        if (typeof score !== 'number' || score < 0 || score > 100) {
          throw new Error(`Invalid score for ${metric}: ${score}. Must be a number between 0-100.`)
        }
        
        // Validate explanation contains calculation details
        const explanation = analysisData.metrics[metric].explanation
        if (!explanation || explanation.length < 20) {
          throw new Error(`Insufficient explanation for ${metric}. Must include calculation details.`)
        }
      }
      
      // Validate overall compatibility score is reasonable
      const skillsScore = analysisData.metrics.skillsMatch.score
      const expScore = analysisData.metrics.experienceRelevance.score
      const keywordScore = analysisData.metrics.keywordAlignment.score
      const overallScore = analysisData.metrics.overallCompatibility.score
      
      // Calculate expected weighted average
      const expectedOverall = Math.round((skillsScore * 0.35) + (expScore * 0.40) + (keywordScore * 0.25))
      
      // Allow small tolerance for rounding differences
      if (Math.abs(overallScore - expectedOverall) > 2) {
        console.warn(`Overall score (${overallScore}) differs significantly from calculated weighted average (${expectedOverall})`)
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


