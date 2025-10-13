<template>
  <div v-if="show" class="fullscreen-modal-overlay">
    <div class="fullscreen-modal-content" @click.stop>
      <div class="fullscreen-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:description" style="font-size: 24px; margin-right: 12px;" />
            <h1>AI Cover Letter</h1>
          </div>
          <button class="close-btn" @click="handleClose">
            <Icon icon="material-symbols:close" style="font-size: 24px;" />
          </button>
        </div>
      </div>
      
      <!-- Privacy Warning Banner -->
      <div class="privacy-warning-banner">
        <Icon icon="material-symbols:info-outline" style="font-size: 20px; margin-right: 8px; flex-shrink: 0;" />
        <p>
          <strong>Privacy Notice:</strong> This feature sends your resume data to Google AI for processing. 
          Your data may be temporarily processed according to 
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's privacy policy</a>.
          See our <a href="/privacy-policy" target="_blank">Privacy Policy</a> for details.
        </p>
      </div>
      
      <div class="fullscreen-body">
        <div v-if="!showResults" class="input-section fullscreen-input">
          <div class="input-grid">
            <div class="input-group">
              <label class="input-label">
                <Icon icon="material-symbols:description" style="font-size: 18px; margin-right: 8px;" />
                Your Resume Text
              </label>
              <textarea 
                v-model="coverLetterResumeText"
                class="fullscreen-textarea"
                :readonly="useCurrentResume"
                placeholder="Paste your resume text here (from Word, PDF, or any format)..."
              ></textarea>
              <div class="checkbox-container">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="useCurrentResume"
                    @change="handleUseCurrentResumeChange"
                    class="checkbox-input"
                  />
                  <span class="checkbox-text">
                    Use current resume data
                  </span>
                </label>
              </div>
            </div>
            
            <div class="input-group">
              <label class="input-label">
                <Icon icon="material-symbols:work" style="font-size: 18px; margin-right: 8px;" />
                Job Description
              </label>
              <textarea 
                v-model="coverLetterJobDescription"
                class="fullscreen-textarea"
                placeholder="Paste the job description here..."
              ></textarea>
            </div>
          </div>

          <div class="ai-status" v-if="isGenerating">
            <Icon icon="material-symbols:hourglass-top" style="font-size: 16px; margin-right: 8px;" />
            Generating your cover letter with AI...
          </div>

          <div class="fullscreen-actions">
            <div class="action-buttons">
              <button @click="handleClose" class="action-btn cancel-action" :disabled="isGenerating">
                <Icon icon="material-symbols:close" style="font-size: 16px; margin-right: 8px;" />
                Cancel
              </button>
              <button @click="handleGenerate" :disabled="!coverLetterJobDescription.trim() || !coverLetterResumeText.trim() || isGenerating" class="action-btn optimize-action">
                <Icon icon="material-symbols:description" style="font-size: 16px; margin-right: 8px;" />
                Generate Cover Letter
              </button>
            </div>
          </div>
        </div>

        <div v-if="showResults" class="results-section fullscreen-results cover-letter-results">
          <h2 class="results-title">
            <Icon icon="material-symbols:description" style="font-size: 24px; margin-right: 12px;" />
            Generated Cover Letter
          </h2>
          
          <div class="cover-letter-display">
            <div class="cover-letter-content">
              <textarea 
                v-model="generatedCoverLetter"
                class="cover-letter-textarea"
                placeholder="Your generated cover letter will appear here..."
              ></textarea>
            </div>
          </div>

          <div class="fullscreen-actions">
            <div class="action-buttons">
              <button @click="handleReset" class="action-btn cancel-action">
                <Icon icon="material-symbols:refresh" style="font-size: 16px; margin-right: 8px;" />
                Start Over
              </button>
              <button @click="handleDownload" class="action-btn apply-action">
                <Icon icon="material-symbols:file-download" style="font-size: 16px; margin-right: 8px;" />
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useCoverLetter } from '~/composables/useCoverLetter'
import { useResumeImport } from '~/composables/useResumeImport'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  resumeData: {
    type: Object,
    required: true
  }
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
  if (useCurrentResume.value) {
    coverLetterResumeText.value = generateCurrentResumeText(props.resumeData)
  }
}

const handleGenerate = async () => {
  isGenerating.value = true
  
  const result = await generateCoverLetter(coverLetterResumeText.value, coverLetterJobDescription.value)
  
  isGenerating.value = false
  
  if (result) {
    generatedCoverLetter.value = result
    showResults.value = true
  }
}

const handleDownload = () => {
  downloadCoverLetterPDF(generatedCoverLetter.value)
}

const handleReset = () => {
  showResults.value = false
  coverLetterJobDescription.value = ''
  coverLetterResumeText.value = ''
  useCurrentResume.value = true
  generatedCoverLetter.value = ''
}

const handleClose = () => {
  if (!isGenerating.value) {
    handleReset()
    emit('close')
  }
}

// Watch for modal opening to populate resume text
watch(() => props.show, (newValue) => {
  if (newValue && useCurrentResume.value) {
    coverLetterResumeText.value = generateCurrentResumeText(props.resumeData)
  }
})
</script>

<style scoped>
/* Fullscreen Modal Styles */
.fullscreen-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 0;
}

.fullscreen-modal-content {
  background: white;
  border-radius: 0;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.fullscreen-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.privacy-warning-banner {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 16px 32px;
  display: flex;
  align-items: flex-start;
  color: #856404;
  font-size: 14px;
  line-height: 1.6;
}

.privacy-warning-banner p {
  margin: 0;
}

.privacy-warning-banner strong {
  color: #d32f2f;
}

.privacy-warning-banner a {
  color: #2196F3;
  text-decoration: none;
}

.privacy-warning-banner a:hover {
  text-decoration: underline;
}

.fullscreen-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 8px;
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.fullscreen-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}

.fullscreen-input {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  flex: 1;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  color: #1e293b;
  margin-bottom: 12px;
}

.fullscreen-textarea {
  flex: 1;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  font-family: inherit;
  transition: all 0.2s ease;
}

.fullscreen-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.fullscreen-textarea[readonly] {
  background: #f8fafc;
  color: #64748b;
}

.checkbox-container {
  margin-top: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  color: #475569;
}

.ai-status {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: #1e40af;
  font-weight: 500;
  margin-bottom: 24px;
}

.fullscreen-actions {
  padding: 24px 32px;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
  background: white;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cancel-action {
  background: #64748b;
  color: white;
}

.cancel-action:hover:not(:disabled) {
  background: #475569;
}

.optimize-action {
  background: #3b82f6;
  color: white;
}

.optimize-action:hover:not(:disabled) {
  background: #2563eb;
}

.apply-action {
  background: #10b981;
  color: white;
}

.apply-action:hover:not(:disabled) {
  background: #059669;
}

.action-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Results Section */
.results-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.results-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.cover-letter-results {
  padding-bottom: 0;
}

.cover-letter-display {
  flex: 1;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.cover-letter-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.cover-letter-textarea {
  flex: 1;
  min-height: 0;
  resize: none;
  width: 100%;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: 'Times New Roman', serif;
  font-size: 14px;
  line-height: 1.6;
  background: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cover-letter-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.cover-letter-textarea::placeholder {
  color: #94a3b8;
}

@media (max-width: 1024px) {
  .input-grid {
    grid-template-columns: 1fr;
  }
}
</style>

