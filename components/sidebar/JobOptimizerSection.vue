<template>
  <div class="control-section">
    <div class="section-header" @click="$emit('toggle-section')">
      <Icon class="section-icon" icon="material-symbols:work" style="font-size: 16px;" />
      <span class="section-title">Job Optimizer</span>
      <Icon class="toggle-icon" :icon="isOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" style="font-size: 12px;" />
    </div>
    <div v-if="isOpen" class="section-content">
      <div class="section-header-with-info">
        <span class="section-subtitle">AI Resume Tailoring</span>
        <button class="info-btn" @click="$emit('show-optimizer-info')" title="Learn about AI resume optimization">
          <Icon icon="material-symbols:info-outline" style="font-size: 16px;" />
        </button>
      </div>
      <button 
        class="tailor-btn" 
        @click="$emit('show-tailor-modal')"
        :disabled="!hasAIConsent"
        :title="hasAIConsent ? '' : 'Enable AI Features in the footer to use this feature'"
      >
        <Icon icon="material-symbols:psychology" style="font-size: 14px;" />
        Tailor for Job Post
      </button>
      <small class="tailor-help" v-if="!hasAIConsent" style="color: #ef4444;">
        ⚠️ AI features are disabled. Enable them in the footer to use this feature.
      </small>
      <small class="tailor-help" v-else>Optimize your resume content to match specific job requirements using AI</small>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useConsent } from '~/composables/useConsent'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['show-tailor-modal', 'show-optimizer-info', 'toggle-section'])

const { aiConsentEnabled: hasAIConsent, initializeConsent } = useConsent()

onMounted(() => {
  initializeConsent()
})
</script>

<style scoped>
.control-section {
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.section-header:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.section-icon {
  font-size: 18px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  color: #64748b;
}

.section-title {
  flex: 1;
  font-weight: 600;
  color: #1e293b;
  font-size: 13px;
}

.toggle-icon {
  color: #94a3b8;
  transition: transform 0.2s ease;
}

.section-content {
  padding: 12px 16px;
  background: #fafbfc;
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  margin-top: -8px;
}

.section-header-with-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.info-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.info-btn:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.tailor-btn {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 8px;
  border: none;
  border-radius: 6px;
  background: #8b5cf6;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tailor-btn:hover:not(:disabled) {
  background: #7c3aed;
}

.tailor-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

.tailor-help {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
  line-height: 1.4;
}
</style>

