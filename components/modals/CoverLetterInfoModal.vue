<template>
  <div 
    v-if="show" 
    class="modal-overlay" 
    @click="$emit('close')"
    role="dialog"
    aria-modal="true"
    aria-labelledby="cover-letter-info-modal-title"
    aria-describedby="cover-letter-info-modal-description"
  >
    <div class="modal-content" @click.stop ref="modalRef">
      <div class="modal-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:description" style="font-size: 20px; margin-right: 8px;" aria-hidden="true" />
            <h3 id="cover-letter-info-modal-title">AI Cover Letter Generation</h3>
          </div>
          <button 
            class="modal-close" 
            @click="$emit('close')"
            aria-label="Close cover letter information dialog"
          >
            <Icon icon="material-symbols:close" style="font-size: 20px;" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="modal-body">
        <div class="info-content" id="cover-letter-info-modal-description">
          <p>The Cover Letter Generator uses AI to create professional, tailored cover letters that highlight your relevant experience and demonstrate your fit for specific job positions.</p>
          
          <ol class="step-list" role="list">
            <li class="step-item">
              <span class="step-number" aria-hidden="true">1</span>
              <div class="step-content">
                <strong>Provide Resume:</strong> Paste your resume text or use your current resume data to give the AI context about your background.
              </div>
            </li>
            
            <li class="step-item">
              <span class="step-number" aria-hidden="true">2</span>
              <div class="step-content">
                <strong>Add Job Description:</strong> Paste the job posting to help the AI understand the specific requirements and company needs.
              </div>
            </li>
            
            <li class="step-item">
              <span class="step-number" aria-hidden="true">3</span>
              <div class="step-content">
                <strong>Generate Cover Letter:</strong> Our AI creates a professional cover letter that connects your experience to the job requirements.
              </div>
            </li>
            
            <li class="step-item">
              <span class="step-number" aria-hidden="true">4</span>
              <div class="step-content">
                <strong>Download & Use:</strong> Download your cover letter as a PDF and use it for your job application.
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useFocusTrap } from '~/composables/useFocusTrap'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const modalRef = ref(null)
const { trapFocus, releaseFocus } = useFocusTrap()
const { lockScroll, unlockScroll } = useBodyScrollLock()

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
      emit('close')
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
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

.info-content {
  line-height: 1.6;
}

.info-content p {
  margin: 0 0 20px 0;
  color: #475569;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  color: #475569;
  line-height: 1.5;
}

.step-content strong {
  color: #1e293b;
}
</style>

