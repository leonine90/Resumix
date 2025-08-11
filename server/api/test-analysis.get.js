import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  // Test endpoint to verify scoring consistency
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    
    if (!apiKey) {
      return {
        success: false,
        error: 'No API key found',
        timestamp: new Date().toISOString()
      }
    }

    // Test data for consistency check
    const testResume = `John Doe
Software Engineer
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

SUMMARY
Experienced software engineer with 3+ years developing web applications using React, Node.js, and TypeScript. Proven track record of delivering scalable solutions and collaborating with cross-functional teams.

EXPERIENCE
Software Engineer | TechCorp | 2021-Present
• Developed and maintained React-based web applications serving 10,000+ users
• Implemented RESTful APIs using Node.js and Express
• Collaborated with UX designers to improve user experience
• Used Git for version control and participated in code reviews

Junior Developer | StartupXYZ | 2020-2021
• Built responsive web interfaces using HTML, CSS, and JavaScript
• Worked with MySQL databases and basic SQL queries
• Participated in agile development processes

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2016-2020

SKILLS
JavaScript, TypeScript, React, Node.js, Express, HTML, CSS, Git, MySQL, REST APIs`

    const testJobPost = `Senior Frontend Developer

We are seeking a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications.

Requirements:
• 3+ years of experience with React and TypeScript
• Strong proficiency in JavaScript and modern web technologies
• Experience with Node.js and RESTful APIs
• Knowledge of Git and version control
• Experience with responsive design and CSS
• Understanding of web performance optimization
• Experience with testing frameworks (Jest, React Testing Library)
• Knowledge of build tools (Webpack, Babel)

Nice to have:
• Experience with Next.js or similar frameworks
• Knowledge of GraphQL
• Experience with cloud platforms (AWS, Azure)
• Understanding of CI/CD pipelines

Responsibilities:
• Develop and maintain React-based web applications
• Collaborate with backend developers and designers
• Write clean, maintainable, and well-tested code
• Participate in code reviews and technical discussions
• Optimize applications for performance and scalability`

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1, // Low temperature for more consistent results
        topP: 0.8,
        topK: 40
      }
    })

    // Run multiple tests to check consistency
    const testResults = []
    const numTests = 3

    for (let i = 0; i < numTests; i++) {
      const prompt = `You are a precise resume analyzer. Analyze this resume against the job posting using SPECIFIC, QUANTIFIABLE criteria. You must provide consistent scores for the same resume-job combination.

RESUME:
${testResume}

JOB POSTING:
${testJobPost}

SCORING METHODOLOGY (QUANTIFIABLE CRITERIA):

SKILLS MATCH SCORING (0-100):
- Count exact skill matches from job posting found in resume
- Count related/transferable skills that could apply
- Formula: (Exact matches × 3) + (Related skills × 1) = Raw score
- Normalize to 0-100 scale: (Raw score / Total job skills × 3) × 100
- Cap at 100 if exceeds

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

Return exactly this JSON with SPECIFIC calculations:
{
  "metrics": {
    "skillsMatch": {
      "score": [calculated_score_0_100],
      "explanation": "Found X exact skill matches and Y related skills out of Z job requirements. Calculation: (X×3 + Y×1) / (Z×3) × 100 = [score]%"
    },
    "experienceRelevance": {
      "score": [calculated_score_0_100],
      "explanation": "Industry: X/30, Role Level: Y/30, Achievements: Z/40. Total: [score]%"
    },
    "keywordAlignment": {
      "score": [calculated_score_0_100],
      "explanation": "Found X exact keyword matches and Y contextual matches out of Z job keywords. Calculation: (X×2 + Y×1) / (Z×2) × 100 = [score]%"
    },
    "overallCompatibility": {
      "score": [weighted_average_score_0_100],
      "explanation": "Weighted calculation: Skills([skills_score]×0.35) + Experience([exp_score]×0.40) + Keywords([keyword_score]×0.25) = [score]%"
    }
  }
}

CRITICAL: Use the exact calculation formulas provided. Be consistent and quantifiable. Same resume + job posting must always produce the same scores.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const generatedText = response.text()

      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0])
        testResults.push({
          testNumber: i + 1,
          scores: {
            skills: analysisData.metrics.skillsMatch.score,
            experience: analysisData.metrics.experienceRelevance.score,
            keywords: analysisData.metrics.keywordAlignment.score,
            overall: analysisData.metrics.overallCompatibility.score
          },
          explanations: {
            skills: analysisData.metrics.skillsMatch.explanation,
            experience: analysisData.metrics.experienceRelevance.explanation,
            keywords: analysisData.metrics.keywordAlignment.explanation,
            overall: analysisData.metrics.overallCompatibility.explanation
          }
        })
      }
    }

    // Check consistency
    const overallScores = testResults.map(r => r.scores.overall)
    const skillsScores = testResults.map(r => r.scores.skills)
    const experienceScores = testResults.map(r => r.scores.experience)
    const keywordScores = testResults.map(r => r.scores.keywords)

    const isConsistent = (scores) => {
      const maxDiff = Math.max(...scores) - Math.min(...scores)
      return maxDiff <= 5 // Allow 5 point tolerance
    }

    const consistencyCheck = {
      overall: isConsistent(overallScores),
      skills: isConsistent(skillsScores),
      experience: isConsistent(experienceScores),
      keywords: isConsistent(keywordScores)
    }

    return {
      success: true,
      message: 'Analysis API consistency test completed',
      hasApiKey: !!apiKey,
      consistencyCheck,
      testResults,
      summary: {
        overallScores,
        skillsScores,
        experienceScores,
        keywordScores,
        averageOverall: Math.round(overallScores.reduce((a, b) => a + b, 0) / overallScores.length)
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
})
