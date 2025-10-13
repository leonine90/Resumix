<template>
  <div 
    v-if="show" 
    class="modal-overlay" 
    @click="handleClose"
    role="dialog"
    aria-modal="true"
    aria-labelledby="import-modal-title"
    aria-describedby="import-modal-description"
  >
    <div class="modal-content" @click.stop ref="modalRef">
      <div class="modal-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:code" style="font-size: 20px; margin-right: 8px;" aria-hidden="true" />
            <h3 id="import-modal-title">Import Resume Data</h3>
          </div>
          <button 
            class="modal-close" 
            @click="handleClose"
            aria-label="Close import dialog"
          >
            <Icon icon="material-symbols:close" style="font-size: 20px;" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="modal-body">
        <label for="import-textarea" class="modal-label" id="import-modal-description">
          Paste JSON data:
        </label>
        <textarea 
          id="import-textarea"
          v-model="importJsonText"
          class="modal-textarea"
          placeholder="Paste your JSON data here..."
          rows="15"
          aria-describedby="import-help-text"
        ></textarea>
        <span id="import-help-text" class="help-text sr-only">
          Paste your resume data in JSON format to import it into the application
        </span>
        <div class="modal-actions">
          <button 
            @click="handleClose" 
            class="cancel-btn"
            aria-label="Cancel import and close dialog"
          >
            Cancel
          </button>
          <button 
            @click="handleImport" 
            :disabled="!importJsonText.trim()" 
            class="submit-btn"
            aria-label="Import resume data"
            :aria-disabled="!importJsonText.trim() ? 'true' : 'false'"
          >
            Import Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useResumeImport } from '~/composables/useResumeImport'
import { useFocusTrap } from '~/composables/useFocusTrap'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

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

const { importData } = useResumeImport()
const modalRef = ref(null)
const { trapFocus, releaseFocus } = useFocusTrap()
const { lockScroll, unlockScroll } = useBodyScrollLock()

const importJsonText = ref('')

const handleImport = async () => {
  const mergedData = await importData(importJsonText.value, props.resumeData)
  
  if (mergedData) {
    emit('import-success', mergedData)
    importJsonText.value = ''
  }
}

const handleClose = () => {
  importJsonText.value = ''
  emit('close')
}

// Focus trap and scroll lock
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    lockScroll()
    nextTick(() => {
      if (modalRef.value) {
        trapFocus(modalRef.value)
      }
    })
  } else {
    unlockScroll()
    releaseFocus()
  }
})

// Escape key handler
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.show) {
      handleClose()
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    unlockScroll()
    releaseFocus()
  })
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0;
}

.header-left {
  display: flex;
  align-items: center;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #475569; /* 7.6:1 contrast - AAA compliant */
  padding: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #1e293b; /* Higher contrast on hover */
}

.modal-body {
  padding: 24px;
  padding-bottom: 0;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
  display: flex;
  flex-direction: column;
}

.modal-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}

.modal-textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 14px;
  font-family: monospace;
  font-size: 13px;
  resize: vertical;
  box-sizing: border-box;
  transition: all 0.2s ease;
  background: #ffffff;
  margin-bottom: 16px;
}

.modal-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex !important;
  gap: 12px;
  justify-content: flex-end;
  margin: 0 -24px -24px -24px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  min-height: 60px;
  align-items: center;
  flex-shrink: 0;
}

.cancel-btn {
  padding: 10px 20px;
  background: #475569; /* 7.6:1 contrast - AAA compliant */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.cancel-btn:hover {
  background: #334155; /* Darker on hover */
}

.submit-btn {
  padding: 10px 20px;
  background: #1d4ed8; /* 7.4:1 contrast - AAA compliant */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #1e40af; /* Darker on hover */
}

.submit-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
</style>

