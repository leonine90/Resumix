import { ref, computed } from 'vue'

// Consent version - increment when privacy policy changes
const CONSENT_VERSION = '1.0'
const CONSENT_STORAGE_KEY = 'resumix_user_consent'

// Global consent state - shared across all components
const consentState = ref(null)

// Global reactive AI consent state
const aiConsentEnabled = ref(false)

export const useConsent = () => {
  // Initialize consent from localStorage
  const initializeConsent = () => {
    if (process.client) {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
      if (stored) {
        try {
          consentState.value = JSON.parse(stored)
          // Check if consent version matches
          if (consentState.value.version !== CONSENT_VERSION) {
            // Version mismatch - require new consent
            consentState.value = null
            aiConsentEnabled.value = false
            localStorage.removeItem(CONSENT_STORAGE_KEY)
          } else {
            // Update global reactive state
            aiConsentEnabled.value = consentState.value.aiProcessing || false
          }
        } catch (e) {
          console.error('Failed to parse consent data:', e)
          consentState.value = null
          aiConsentEnabled.value = false
        }
      } else {
        aiConsentEnabled.value = false
      }
    }
  }

  // Check if consent exists
  const checkConsent = () => {
    if (!consentState.value) {
      initializeConsent()
    }
    return !!consentState.value
  }

  // Check if AI processing consent is granted
  const hasAIConsent = () => {
    if (!consentState.value) {
      initializeConsent()
    }
    return consentState.value?.aiProcessing === true
  }

  // Grant consent
  const grantConsent = (aiProcessing = false) => {
    const consent = {
      aiProcessing,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    }
    
    consentState.value = consent
    aiConsentEnabled.value = aiProcessing
    
    if (process.client) {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
    }
    
    return consent
  }

  // Revoke consent
  const revokeConsent = () => {
    consentState.value = null
    aiConsentEnabled.value = false
    
    if (process.client) {
      localStorage.removeItem(CONSENT_STORAGE_KEY)
    }
  }

  // Update AI consent specifically
  const updateAIConsent = (enabled) => {
    if (!consentState.value) {
      // If no consent exists, create one
      return grantConsent(enabled)
    }
    
    consentState.value.aiProcessing = enabled
    consentState.value.timestamp = new Date().toISOString()
    aiConsentEnabled.value = enabled
    
    if (process.client) {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentState.value))
    }
    
    return consentState.value
  }

  // Get consent details
  const getConsent = () => {
    if (!consentState.value) {
      initializeConsent()
    }
    return consentState.value
  }

  // Computed properties
  const isConsentGiven = computed(() => !!consentState.value)
  const isAIConsentGiven = computed(() => consentState.value?.aiProcessing === true)

  return {
    consentState,
    isConsentGiven,
    isAIConsentGiven,
    checkConsent,
    hasAIConsent,
    grantConsent,
    revokeConsent,
    updateAIConsent,
    getConsent,
    initializeConsent,
    aiConsentEnabled, // Return the reactive ref directly
    CONSENT_VERSION
  }
}

