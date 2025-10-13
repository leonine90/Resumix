import { useConsent } from './useConsent'

// Global state for consent modal
let consentModalResolver = null
let showConsentModalCallback = null

export const useAIConsent = () => {
  const { hasAIConsent } = useConsent()

  // Register the modal show callback (called by ConsentModal component)
  const registerConsentModal = (showModalFn) => {
    showConsentModalCallback = showModalFn
  }

  // Require AI consent - shows modal if needed
  const requireAIConsent = async () => {
    return new Promise((resolve, reject) => {
      // Check if consent already granted
      if (hasAIConsent()) {
        resolve(true)
        return
      }

      // Check if modal callback is registered
      if (!showConsentModalCallback) {
        console.error('Consent modal not registered')
        reject(new Error('Consent system not initialized'))
        return
      }

      // Store resolver for when user makes choice
      consentModalResolver = { resolve, reject }

      // Show the modal
      showConsentModalCallback()
    })
  }

  // Called when user grants consent in modal
  const handleConsentGranted = () => {
    if (consentModalResolver) {
      consentModalResolver.resolve(true)
      consentModalResolver = null
    }
  }

  // Called when user denies consent in modal
  const handleConsentDenied = () => {
    if (consentModalResolver) {
      consentModalResolver.reject(new Error('AI consent denied by user'))
      consentModalResolver = null
    }
  }

  return {
    requireAIConsent,
    registerConsentModal,
    handleConsentGranted,
    handleConsentDenied
  }
}

