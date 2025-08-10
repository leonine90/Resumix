export default defineEventHandler(async (event) => {
  // Simple test endpoint to verify API setup
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    
    return {
      success: true,
      message: 'Analysis API is working',
      hasApiKey: !!apiKey,
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
