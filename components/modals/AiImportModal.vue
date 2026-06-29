<template>
  <v-dialog
    :model-value="show"
    max-width="800"
    scrollable
    @update:model-value="val => !val && !isProcessing && handleClose()"
  >
    <v-card rounded="lg">
      <v-toolbar color="primary" density="comfortable" flat>
        <v-icon class="ml-3 mr-1 text-white">mdi-upload-multiple</v-icon>
        <v-toolbar-title class="text-subtitle-1 font-weight-semibold text-white" id="ai-import-modal-title">
          Import Resume
        </v-toolbar-title>
        <template #append>
          <v-btn
            icon
            variant="text"
            :disabled="isProcessing"
            aria-label="Close import resume dialog"
            @click="handleClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
          icon="mdi-information"
          class="mb-4"
          role="note"
          id="ai-import-modal-description"
        >
          <strong>Privacy Notice:</strong> This feature sends your resume data to Google AI for processing.
          Your data may be temporarily processed according to
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's privacy policy</a>.
        </v-alert>
        <div class="import-layout">
          <!-- File upload -->
          <div class="upload-col">
            <p class="text-body-2 font-weight-medium mb-2">Upload Resume File</p>
            <div
              class="file-upload-area"
              :class="{ 'drag-over': isDragOver, 'has-file': uploadedFile }"
              role="button"
              tabindex="0"
              :aria-label="uploadedFile ? `Selected: ${uploadedFile.name}. Press Enter to change` : 'Upload resume file. Drag and drop or press Enter to browse'"
              @click="triggerFileInput"
              @keydown.enter="triggerFileInput"
              @keydown.delete="uploadedFile && removeFile()"
              @drop="handleFileDrop"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
            >
              <input
                ref="fileInput"
                id="file-upload-input"
                type="file"
                accept=".txt,.rtf,.doc,.docx,.pdf"
                style="display:none"
                aria-label="Choose resume file to upload"
                @change="handleFileSelect"
              />
              <v-icon size="48" :color="uploadedFile ? 'secondary' : 'outline'" class="mb-3" aria-hidden="true">
                {{ uploadedFile ? 'mdi-file-check' : 'mdi-cloud-upload' }}
              </v-icon>
              <p class="text-body-2 text-medium-emphasis mb-1">
                <span v-if="!uploadedFile">Drag &amp; drop or click to browse</span>
                <span v-else class="text-secondary font-weight-medium">{{ uploadedFile.name }}</span>
              </p>
              <p class="text-caption text-disabled mb-2">.txt · .rtf · .doc · .docx · .pdf</p>
              <v-btn
                v-if="uploadedFile"
                size="x-small"
                color="error"
                variant="tonal"
                prepend-icon="mdi-delete"
                @click.stop="removeFile"
                aria-label="Remove uploaded file"
              >
                Remove
              </v-btn>
            </div>
          </div>

          <div class="divider-col" aria-hidden="true">
            <v-divider vertical />
            <span class="text-caption text-disabled px-2">or</span>
            <v-divider vertical />
          </div>

          <!-- Text area -->
          <div class="text-col">
            <v-textarea
              v-model="resumeText"
              label="Paste resume text or JSON"
              placeholder="Paste your resume in plain text or JSON format here..."
              rows="10"
              variant="outlined"
              density="compact"
              no-resize
              aria-describedby="resume-text-help"
            />
            <span id="resume-text-help" class="sr-only">
              Paste your resume in plain text or as JSON data for AI processing
            </span>
          </div>
        </div>

        <v-alert
          v-if="isProcessing"
          type="info"
          variant="tonal"
          density="compact"
          icon="mdi-loading"
          class="mt-2"
          role="status"
          aria-live="polite"
        >
          Processing your resume with AI…
        </v-alert>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 justify-end gap-2">
        <v-btn
          variant="text"
          :disabled="isProcessing"
          aria-label="Cancel import"
          @click="handleClose"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-upload"
          :loading="isProcessing"
          :disabled="(!resumeText.trim() && !uploadedFile) || isProcessing"
          aria-label="Import and process resume with AI"
          @click="handleProcess"
        >
          Import Resume
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useResumeImport } from '~/composables/useResumeImport'

const props = defineProps({
  show: { type: Boolean, required: true },
  resumeData: { type: Object, required: true },
})
const emit = defineEmits(['close', 'import-success'])

const { processWithAI } = useResumeImport()
const resumeText = ref('')
const isProcessing = ref(false)
const uploadedFile = ref(null)
const isDragOver = ref(false)
const fileInput = ref(null)

const triggerFileInput = () => fileInput.value?.click()

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) uploadedFile.value = file
}

const handleFileDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) uploadedFile.value = file
}

const removeFile = () => {
  uploadedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleProcess = async () => {
  isProcessing.value = true
  const mergedData = await processWithAI(resumeText.value, uploadedFile.value, props.resumeData)
  isProcessing.value = false
  if (mergedData) {
    emit('import-success', mergedData)
    resetForm()
  }
}

const resetForm = () => {
  resumeText.value = ''
  uploadedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleClose = () => {
  if (!isProcessing.value) {
    resetForm()
    emit('close')
  }
}
</script>

<style scoped>
.import-layout {
  display: flex;
  align-items: stretch;
  gap: 0;
  min-height: 320px;
}

.upload-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.divider-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

.text-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-upload-area {
  flex: 1;
  border: 2px dashed rgb(var(--v-theme-outline));
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: rgb(var(--v-theme-surface-variant));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.file-upload-area:hover,
.file-upload-area.drag-over {
  border-color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary-container));
}

.file-upload-area.has-file {
  border-color: rgb(var(--v-theme-secondary));
  background: rgb(var(--v-theme-secondary-container));
}

@media (max-width: 600px) {
  .import-layout { flex-direction: column; }
  .divider-col { flex-direction: row; padding: 8px 0; }
}
</style>
