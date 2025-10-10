<template>
  <div v-if="show" class="fullscreen-modal-overlay">
    <div class="fullscreen-modal-content" @click.stop>
      <div class="fullscreen-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:upload-file" style="font-size: 24px; margin-right: 12px;" />
            <h1>Import Resume</h1>
          </div>
          <button class="close-btn" @click="handleClose">
            <Icon icon="material-symbols:close" style="font-size: 24px;" />
          </button>
        </div>
      </div>
      <div class="fullscreen-body">
        <!-- Horizontal Layout Container -->
        <div class="import-layout">
          <!-- File Upload Section -->
          <div class="upload-section">
            <label class="modal-label">Upload Resume File:</label>
            <div 
              class="file-upload-area"
              :class="{ 'drag-over': isDragOver, 'has-file': uploadedFile }"
              @drop="handleFileDrop"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @click="triggerFileInput"
            >
              <input 
                ref="fileInput"
                type="file" 
                accept=".txt,.rtf,.doc,.docx,.pdf"
                @change="handleFileSelect"
                style="display: none;"
              />
              <div class="upload-content">
                <Icon icon="material-symbols:cloud-upload" style="font-size: 48px; color: #666; margin-bottom: 16px;" />
                <p class="upload-text">
                  <span v-if="!uploadedFile">Drag and drop your resume file here, or click to browse</span>
                  <span v-else class="file-name">{{ uploadedFile.name }}</span>
                </p>
                <p class="upload-hint">Supported formats: .txt, .rtf, .doc, .docx, .pdf</p>
                <button v-if="uploadedFile" class="remove-file-btn" @click.stop="removeFile">
                  <Icon icon="material-symbols:delete" style="font-size: 16px;" />
                  Remove File
                </button>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="modal-divider">
            <span>or</span>
          </div>

          <!-- Text Input Section -->
          <div class="text-section">
            <label class="modal-label">Paste your resume text or JSON:</label>
            <textarea 
              v-model="resumeText"
              class="modal-textarea"
              placeholder="Paste your resume text (from Word, PDF, etc.) or valid JSON resume data here..."
              rows="8"
            ></textarea>
          </div>
        </div>

        <div class="ai-status" v-if="isProcessing">
          <Icon icon="material-symbols:hourglass-top" style="font-size: 16px; margin-right: 8px;" />
          Processing...
        </div>
        
        <div class="fullscreen-actions">
          <div class="action-buttons">
            <button @click="handleClose" class="action-btn cancel-action" :disabled="isProcessing">
              <Icon icon="material-symbols:close" style="font-size: 16px; margin-right: 8px;" />
              Cancel
            </button>
            <button @click="handleProcess" :disabled="(!resumeText.trim() && !uploadedFile) || isProcessing" class="action-btn optimize-action">
              <Icon icon="material-symbols:upload" style="font-size: 16px; margin-right: 8px;" />
              Import Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
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

const emit = defineEmits(['close', 'import-success'])

const { processWithAI } = useResumeImport()

const resumeText = ref('')
const isProcessing = ref(false)
const uploadedFile = ref(null)
const isDragOver = ref(false)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadedFile.value = file
  }
}

const handleFileDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    uploadedFile.value = file
  }
}

const removeFile = () => {
  uploadedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
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
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleClose = () => {
  if (!isProcessing.value) {
    resetForm()
    emit('close')
  }
}
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

.import-layout {
  display: flex;
  align-items: stretch;
  gap: 0;
  margin-bottom: 24px;
  height: calc(100vh - 300px);
  min-height: 400px;
}

.upload-section {
  flex: 1;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

.text-section {
  flex: 1;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

.modal-divider {
  display: flex;
  align-items: center;
  margin: 0 16px;
  color: #64748b;
  font-size: 13px;
  flex-shrink: 0;
}

.modal-divider::before,
.modal-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.modal-divider span {
  padding: 0 16px;
  background: #ffffff;
}

.modal-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}

.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-upload-area:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.file-upload-area.drag-over {
  border-color: #3b82f6;
  background: #f0f9ff;
  transform: scale(1.02);
}

.file-upload-area.has-file {
  border-color: #10b981;
  background: #f0fdf4;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-text {
  margin: 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
}

.file-name {
  color: #059669;
  font-weight: 600;
}

.upload-hint {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.4;
}

.remove-file-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-file-btn:hover {
  background: #dc2626;
}

.modal-textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 14px;
  font-family: monospace;
  font-size: 13px;
  resize: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
  background: #ffffff;
  flex: 1;
}

.modal-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

.action-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

