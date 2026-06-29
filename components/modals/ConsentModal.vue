<template>
  <v-dialog
    :model-value="showModal"
    max-width="540"
    persistent
    no-click-animation
  >
    <v-card rounded="lg">
      <v-toolbar color="surface-variant" density="comfortable" flat>
        <v-icon class="ml-3 mr-1" color="primary">mdi-shield-lock</v-icon>
        <v-toolbar-title class="text-subtitle-1 font-weight-semibold">
          Privacy &amp; Cookie Consent
        </v-toolbar-title>
      </v-toolbar>
      <v-divider />

      <v-card-text class="pa-6">
        <p class="text-body-2 text-medium-emphasis mb-5 mt-0">
          We care about your privacy. This application stores your resume data locally in your browser
          and uses AI features to enhance your experience.
        </p>

        <!-- Essential -->
        <v-sheet
          rounded="md"
          color="primary-container"
          class="pa-4 mb-3"
          border
        >
          <div class="d-flex align-center mb-2">
            <v-checkbox
              :model-value="true"
              disabled
              density="compact"
              hide-details
              color="primary"
              label="Essential"
              class="mr-2"
              aria-label="Essential features (required)"
            />
            <v-chip size="x-small" color="primary" variant="flat">Required</v-chip>
          </div>
          <p class="text-caption text-medium-emphasis mb-0 ml-8">
            Essential features including local data storage in your browser. Required for the application to function.
          </p>
        </v-sheet>

        <!-- AI Processing -->
        <v-sheet rounded="md" class="pa-4 mb-4" border>
          <div class="d-flex align-center mb-2">
            <v-checkbox
              v-model="aiProcessingConsent"
              density="compact"
              hide-details
              color="secondary"
              label="AI Processing"
              class="mr-2"
              id="ai-consent"
              aria-describedby="ai-consent-description"
            />
            <v-chip size="x-small" color="surface-variant" variant="flat">Optional</v-chip>
          </div>
          <p class="text-caption text-medium-emphasis mb-0 ml-8" id="ai-consent-description">
            Enable AI-powered features (resume optimization, cover letter generation, resume analysis).
            <strong class="text-error">Your resume data will be sent to Google AI APIs for processing.</strong>
            Google may temporarily process your data according to their
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
          </p>
        </v-sheet>

        <p class="text-caption text-medium-emphasis mb-0">
          By using this application, you agree to our
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and
          <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
        </p>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 justify-end gap-2">
        <v-btn
          variant="outlined"
          aria-label="Accept essential cookies only"
          @click="handleEssentialOnly"
        >
          Essential Only
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          aria-label="Accept all cookies including AI processing"
          @click="handleAcceptAll"
        >
          Accept All
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  registerConsentModal(() => {
    showModal.value = true
    aiProcessingConsent.value = true
  })
  if (!checkConsent()) showModal.value = true
})

const handleAcceptAll = () => {
  grantConsent(true)
  showModal.value = false
  handleConsentGranted()
}

const handleEssentialOnly = () => {
  grantConsent(false)
  showModal.value = false
  handleConsentDenied()
}
</script>
