<template>
  <div v-if="showModal" class="modal-overlay" @click.self="handleEssentialOnly">
    <div class="modal-content consent-modal">
      <div class="modal-header">
        <h2>Privacy & Cookie Consent</h2>
      </div>
      
      <div class="modal-body">
        <p class="intro">
          We care about your privacy. This application stores your resume data locally in your browser 
          and uses AI features to enhance your experience.
        </p>

        <div class="consent-section">
          <div class="consent-item essential">
            <div class="consent-header">
              <input type="checkbox" checked disabled class="consent-checkbox" />
              <label class="consent-label">
                <strong>Essential</strong>
                <span class="required-badge">Required</span>
              </label>
            </div>
            <p class="consent-description">
              Essential features including local data storage in your browser. This is required 
              for the application to function.
            </p>
          </div>

          <div class="consent-item">
            <div class="consent-header">
              <input 
                type="checkbox" 
                v-model="aiProcessingConsent" 
                class="consent-checkbox"
                id="ai-consent"
              />
              <label for="ai-consent" class="consent-label">
                <strong>AI Processing</strong>
                <span class="optional-badge">Optional</span>
              </label>
            </div>
            <p class="consent-description">
              Enable AI-powered features (resume optimization, cover letter generation, resume analysis). 
              <strong>Your resume data will be sent to Google AI APIs for processing.</strong>
              Google may temporarily process your data according to their 
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
            </p>
          </div>
        </div>

        <div class="privacy-links">
          <p class="small-text">
            By using this application, you agree to our 
            <a href="/privacy-policy" target="_blank">Privacy Policy</a> and 
            <a href="/terms-of-service" target="_blank">Terms of Service</a>.
          </p>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="handleEssentialOnly" class="btn btn-secondary">
          Essential Only
        </button>
        <button @click="handleAcceptAll" class="btn btn-primary">
          Accept All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConsent } from '~/composables/useConsent'
import { useAIConsent } from '~/composables/useAIConsent'

const showModal = ref(false)
const aiProcessingConsent = ref(false)

const { checkConsent, grantConsent } = useConsent()
const { registerConsentModal, handleConsentGranted, handleConsentDenied } = useAIConsent()

onMounted(() => {
  // Register this modal with the AI consent system
  registerConsentModal(() => {
    showModal.value = true
    aiProcessingConsent.value = true // Default to checked when prompted
  })

  // Check if consent already given
  if (!checkConsent()) {
    // First time user - show modal
    showModal.value = true
  }
})

const handleAcceptAll = () => {
  grantConsent(true) // Grant AI consent
  showModal.value = false
  handleConsentGranted()
}

const handleEssentialOnly = () => {
  grantConsent(false) // No AI consent
  showModal.value = false
  handleConsentDenied()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.consent-modal {
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px;
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-body {
  padding: 24px;
}

.intro {
  margin: 0 0 24px 0;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
}

.consent-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.consent-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.consent-item.essential {
  background: #f0f7ff;
  border-color: #b3d9ff;
}

.consent-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.consent-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #2196F3;
}

.consent-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.consent-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: 0;
}

.required-badge,
.optional-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.required-badge {
  background: #e3f2fd;
  color: #1976d2;
}

.optional-badge {
  background: #f5f5f5;
  color: #666;
}

.consent-description {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  padding-left: 32px;
}

.consent-description a {
  color: #2196F3;
  text-decoration: none;
}

.consent-description a:hover {
  text-decoration: underline;
}

.consent-description strong {
  color: #d32f2f;
}

.privacy-links {
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.small-text {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.small-text a {
  color: #2196F3;
  text-decoration: none;
}

.small-text a:hover {
  text-decoration: underline;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #2196F3;
  color: white;
}

.btn-primary:hover {
  background: #1976D2;
}

.btn-secondary {
  background: white;
  color: #333;
  border: 1px solid #ccc;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

@media print {
  .modal-overlay {
    display: none !important;
  }
}
</style>

