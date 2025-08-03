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
    const { resumeText, jobDescription } = await readBody(event)
    
    if (!resumeText || !jobDescription) {
      return {
        success: false,
        error: 'Both resume text and job description are required.'
      }
    }

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Comprehensive cover letter prompt with best practices
    const prompt = `You are an expert resume and cover letter writer. Generate a customized cover letter based on the job posting provided.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
Read and understand the posting to identify key responsibilities, skills, and company values.

Do NOT copy phrases, slogans, or sentences directly from the posting or company website.

Use relevant keywords naturally to help with ATS scanning, but keep the wording original and human-like.

Write in a professional, engaging tone that feels tailored specifically for this role and company.

CRITICAL: Use the ACTUAL information from the resume text provided. Do NOT use placeholder text like [Your Name], [Your Address], etc. Extract and use the real personal information, experience, and achievements from the resume.

IMPORTANT: The cover letter MUST fit on ONE standard printing page (8.5" x 11" or A4). Keep it concise and focused.

Create a compelling cover letter that follows these best practices:

1. STRUCTURE (3 paragraphs maximum, 200-250 words total):
   - Opening paragraph: Express genuine interest in the specific position and company (50-60 words)
   - Body paragraph: Connect relevant experience to job requirements with specific examples (100-120 words)
   - Closing paragraph: Reiterate interest and include a clear call-to-action (50-70 words)
   - MUST fit on one standard page (8.5" x 11" or A4) with 1-inch margins
   - Keep paragraphs short and focused

2. CONTENT REQUIREMENTS:
   - Address the hiring manager or use "Dear Hiring Manager" if name unknown
   - Mention the specific job title and company name
   - Highlight 1-2 most relevant achievements or experiences from the resume
   - Use specific examples that demonstrate skills mentioned in the job description
   - Show enthusiasm for the role and company
   - Include quantifiable achievements when possible
   - Demonstrate understanding of the company's needs
   - Use ACTUAL personal information from the resume (name, contact details, experience)
   - Reference specific companies, projects, and achievements from the resume
   - Be extremely concise - every sentence must serve a purpose

3. TONE AND STYLE:
   - Professional but enthusiastic
   - Confident but not arrogant
   - Specific and detailed, not generic
   - Active voice and strong action verbs
   - Clear and concise writing
   - Original and human-like language
   - Extremely concise - no unnecessary words
   - Direct and impactful statements

4. FORMATTING:
   - Business letter format with proper spacing
   - Include date at the top
   - Professional closing (Sincerely, Best regards, etc.)
   - Include candidate's name at the end

5. AVOID:
   - Generic statements that could apply to any job
   - Overused phrases like "I am writing to apply"
   - Focusing too much on what the company can do for you
   - Being too casual or informal
   - Exaggerating or making claims you can't support
   - Copying exact phrases or sentences from the job posting
   - Using corporate jargon or buzzwords from the posting
   - Overly long paragraphs or verbose language
   - Content that would exceed one page
   - Placeholder text like [Your Name], [Your Address], [Your Phone], etc.
   - Generic template language
   - Redundant or repetitive statements
   - Unnecessary adjectives or adverbs
   - Long, complex sentences

6. ORIGINALITY REQUIREMENTS:
   - Write in your own words, not the company's words
   - Paraphrase requirements and responsibilities naturally
   - Use synonyms and alternative phrasing for key terms
   - Maintain the meaning while changing the expression
   - Create authentic, personalized content that feels genuine
   - Use the actual candidate's name, experience, and achievements from the resume
   - Make the cover letter feel personal and specific to the candidate

IMPORTANT: If the provided resume text or job description is too generic or lacks specific details, create a professional cover letter template with clear instructions for the user to fill in their specific information. Do not generate placeholder text with brackets - instead, provide a complete, professional cover letter that demonstrates the proper structure and format.

CRITICAL INSTRUCTION: Extract and use the ACTUAL personal information from the resume text. If the resume contains real names, contact information, company names, and achievements, use them directly. Do NOT create placeholder text - use the real data provided.

PAGE LENGTH REQUIREMENT: The cover letter MUST be concise enough to fit on ONE standard printing page (8.5" x 11" or A4) with 1-inch margins. This means 200-250 words maximum. Be extremely concise and focused. Prioritize quality over quantity - make every word count.

Generate a cover letter that would make the hiring manager excited to interview this candidate. Focus on the most relevant experience and skills that directly address the job requirements, but express everything in original, human-like language. Keep it concise and impactful. Use the candidate's real name, experience, and achievements from the resume.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const coverLetter = response.text()

    if (!coverLetter) {
      return {
        success: false,
        error: 'Failed to generate cover letter. Please try again.'
      }
    }

    return {
      success: true,
      data: {
        coverLetter: coverLetter.trim()
      }
    }

  } catch (error) {
    console.error('Cover letter generation error:', error)
    
    // Provide more specific error messages
    if (error.message?.includes('API_KEY')) {
      return {
        success: false,
        error: 'AI service is not configured. Please check the server configuration.'
      }
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return {
        success: false,
        error: 'AI service quota exceeded. Please try again later.'
      }
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return {
        success: false,
        error: 'Network error. Please check your internet connection and try again.'
      }
    } else {
      return {
        success: false,
        error: `Error generating cover letter: ${error.message || 'Unknown error'}. Please try again.`
      }
    }
  }
}) 