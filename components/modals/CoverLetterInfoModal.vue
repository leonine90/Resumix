<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:description" style="font-size: 20px; margin-right: 8px;" />
            <h3>AI Cover Letter Generation</h3>
          </div>
          <button class="modal-close" @click="$emit('close')">
            <Icon icon="material-symbols:close" style="font-size: 20px;" />
          </button>
        </div>
      </div>
      <div class="modal-body">
        <div class="info-content">
          <p>The Cover Letter Generator uses AI to create professional, tailored cover letters that highlight your relevant experience and demonstrate your fit for specific job positions.</p>
          
          <div class="step-list">
            <div class="step-item">
              <span class="step-number">1</span>
              <div class="step-content">
                <strong>Provide Resume:</strong> Paste your resume text or use your current resume data to give the AI context about your background.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">2</span>
              <div class="step-content">
                <strong>Add Job Description:</strong> Paste the job posting to help the AI understand the specific requirements and company needs.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">3</span>
              <div class="step-content">
                <strong>Generate Cover Letter:</strong> Our AI creates a professional cover letter that connects your experience to the job requirements.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">4</span>
              <div class="step-content">
                <strong>Download & Use:</strong> Download your cover letter as a PDF and use it for your job application.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close'])
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
  color: #64748b;
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
  color: #334155;
}

.modal-body {
  padding: 24px;
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

