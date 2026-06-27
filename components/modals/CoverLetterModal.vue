<template>
  <v-dialog
    :model-value="show"
    fullscreen
    @update:model-value="val => !val && !isGenerating && handleClose()"
  >
    <v-card rounded="0">
      <v-toolbar color="secondary" density="comfortable" flat>
        <v-icon class="ml-3 mr-1 text-white">mdi-file-document-edit</v-icon>
        <v-toolbar-title class="text-subtitle-1 font-weight-semibold text-white" id="cover-letter-modal-title">
          AI Cover Letter
        </v-toolbar-title>
        <template #append>
          <v-btn
            icon
            variant="text"
            :disabled="isGenerating"
            aria-label="Close AI cover letter generator dialog"
            @click="handleClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>

      <v-card-text class="fullscreen-body pa-6">
        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
          icon="mdi-information"
          class="mb-6"
          role="note"
          id="cover-letter-modal-description"
        >
          <strong>Privacy Notice:</strong> This feature sends your resume data to Google AI for processing.
          Your data may be temporarily processed according to
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's privacy policy</a>.
        </v-alert>
        <!-- Input section -->
        <div v-if="!showResults" class="input-section">
          <div class="input-grid">
            <div class="input-group">
              <v-textarea
                v-model="coverLetterResumeText"
                label="Your Resume Text"
                :readonly="useCurrentResume"
                placeholder="Paste your resume text here..."
                rows="12"
                variant="outlined"
                density="comfortable"
                no-resize
                aria-describedby="cover-letter-resume-help"
              />
              <span id="cover-letter-resume-help" class="sr-only">Enter your resume text for AI cover letter generation</span>
              <v-checkbox
                v-model="useCurrentResume"
                label="Use current resume data"
                density="compact"
                hide-details
                color="secondary"
                class="mt-1"
                id="use-current-resume-cover-letter"
                @update:model-value="handleUseCurrentResumeChange"
              />
            </div>

            <div class="input-group">
              <v-textarea
                v-model="coverLetterJobDescription"
                label="Job Description"
                placeholder="Paste the job description here..."
                rows="12"
                variant="outlined"
                density="comfortable"
                no-resize
                aria-describedby="job-desc-help"
              />
              <span id="job-desc-help" class="sr-only">Enter the job description to generate a tailored cover letter</span>
            </div>
          </div>

          <v-alert
            v-if="isGenerating"
            type="info"
            variant="tonal"
            density="compact"
            icon="mdi-loading"
            class="mb-4"
            role="status"
            aria-live="polite"
          >
            Generating your cover letter with AI…
          </v-alert>

          <div class="d-flex justify-end gap-2 mt-4">
            <v-btn
              variant="text"
              :disabled="isGenerating"
              aria-label="Cancel"
              @click="handleClose"
            >
              Cancel
            </v-btn>
            <v-btn
              color="secondary"
              variant="elevated"
              prepend-icon="mdi-file-document-edit"
              :loading="isGenerating"
              :disabled="!coverLetterJobDescription.trim() || !coverLetterResumeText.trim() || isGenerating"
              aria-label="Generate cover letter with AI"
              @click="handleGenerate"
            >
              Generate Cover Letter
            </v-btn>
          </div>
        </div>

        <!-- Results section -->
        <div v-if="showResults" class="results-section">
          <h2 class="text-h6 font-weight-bold mb-4 d-flex align-center">
            <v-icon class="mr-2" color="secondary">mdi-file-document-check</v-icon>
            Generated Cover Letter
          </h2>

          <v-textarea
            v-model="generatedCoverLetter"
            label="Generated cover letter (editable)"
            rows="20"
            variant="outlined"
            no-resize
            class="cover-letter-field"
            aria-labelledby="cover-letter-results-title"
            id="generated-cover-letter"
          />

          <div class="d-flex justify-end gap-2 mt-4">
            <v-btn
              variant="outlined"
              prepend-icon="mdi-refresh"
              aria-label="Start over and create new cover letter"
              @click="handleReset"
            >
              Start Over
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              prepend-icon="mdi-download"
              aria-label="Download cover letter as PDF"
              @click="handleDownload"
            >
              Download as PDF
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useCoverLetter } from '~/composables/useCoverLetter'
import { useResumeImport } from '~/composables/useResumeImport'

const props = defineProps({
  show: { type: Boolean, required: true },
  resumeData: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const { generateCoverLetter, downloadCoverLetterPDF } = useCoverLetter()
const { generateCurrentResumeText } = useResumeImport()

const coverLetterResumeText = ref('')
const coverLetterJobDescription = ref('')
const useCurrentResume = ref(true)
const isGenerating = ref(false)
const showResults = ref(false)
const generatedCoverLetter = ref('')

const handleUseCurrentResumeChange = () => {
  if (useCurrentResume.value) coverLetterResumeText.value = generateCurrentResumeText(props.resumeData)
}

const handleGenerate = async () => {
  isGenerating.value = true
  const result = await generateCoverLetter(coverLetterResumeText.value, coverLetterJobDescription.value)
  isGenerating.value = false
  if (result) { generatedCoverLetter.value = result; showResults.value = true }
}

const handleDownload = () => downloadCoverLetterPDF(generatedCoverLetter.value)

const handleReset = () => {
  showResults.value = false
  coverLetterJobDescription.value = ''
  coverLetterResumeText.value = ''
  useCurrentResume.value = true
  generatedCoverLetter.value = ''
}

const handleClose = () => {
  if (!isGenerating.value) { handleReset(); emit('close') }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (useCurrentResume.value) coverLetterResumeText.value = generateCurrentResumeText(props.resumeData)
    })
  }
})
</script>

<style scoped>
.fullscreen-body { flex: 1; overflow-y: auto; }

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.input-group { display: flex; flex-direction: column; }

.cover-letter-field :deep(textarea) {
  font-family: 'Times New Roman', serif;
  font-size: 14px;
  line-height: 1.8;
}

@media (max-width: 960px) {
  .input-grid { grid-template-columns: 1fr; }
}
</style>
