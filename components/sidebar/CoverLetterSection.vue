<template>
  <div class="control-section">
    <button 
      class="section-header" 
      @click="$emit('toggle-section')"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-controls="cover-letter-content"
      aria-label="Toggle cover letter section"
    >
      <Icon class="section-icon" icon="material-symbols:description" style="font-size: 16px;" aria-hidden="true" />
      <span class="section-title">Cover Letter</span>
      <Icon 
        class="toggle-icon" 
        :icon="isOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" 
        style="font-size: 12px;" 
        aria-hidden="true"
      />
    </button>
    <div 
      v-if="isOpen" 
      id="cover-letter-content"
      class="section-content"
      role="region"
      aria-label="Cover letter controls"
    >
      <div class="section-header-with-info">
        <h4 class="section-subtitle">AI Cover Letter Creation</h4>
        <button 
          class="info-btn" 
          @click="$emit('show-cover-letter-info')" 
          aria-label="Learn about AI cover letter generation"
        >
          <Icon icon="material-symbols:info-outline" style="font-size: 16px;" aria-hidden="true" />
        </button>
      </div>
      <button 
        class="cover-letter-btn" 
        @click="$emit('show-cover-letter-modal')"
        :disabled="!hasAIConsent"
        :aria-disabled="!hasAIConsent ? 'true' : 'false'"
        :aria-label="hasAIConsent ? 'Generate cover letter with AI' : 'Generate cover letter (AI features must be enabled)'"
        aria-describedby="cover-letter-help-text"
      >
        <Icon icon="material-symbols:description" style="font-size: 14px;" aria-hidden="true" />
        Generate Cover Letter
      </button>
      <small 
        id="cover-letter-help-text" 
        class="cover-letter-help" 
        v-if="!hasAIConsent" 
        style="color: #ef4444;"
        role="alert"
      >
        ⚠️ AI features are disabled. Enable them in the footer to use this feature.
      </small>
      <small id="cover-letter-help-text" class="cover-letter-help" v-else>Create professional cover letters tailored to specific job postings using AI</small>
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

defineEmits(['show-cover-letter-modal', 'show-cover-letter-info', 'toggle-section'])

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
  width: 100%;
  text-align: left;
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
  color: #475569; /* 7.6:1 contrast - AAA compliant */
}

.section-title {
  flex: 1;
  font-weight: 600;
  color: #1e293b;
  font-size: 13px;
}

.toggle-icon {
  color: #475569; /* 7.6:1 contrast - AAA compliant */
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
  margin: 0;
}

.info-btn {
  background: none;
  border: none;
  color: #475569; /* 7.6:1 contrast - AAA compliant */
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
  color: #1e293b; /* Higher contrast on hover */
}

.cover-letter-btn {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 8px;
  border: none;
  border-radius: 6px;
  background: #6d28d9; /* 7.1:1 contrast - AAA compliant, purple like other AI buttons */
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

.cover-letter-btn:hover:not(:disabled) {
  background: #5b21b6; /* Darker purple on hover */
}

.cover-letter-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

.cover-letter-help {
  display: block;
  font-size: 11px;
  color: #475569; /* 7.6:1 contrast - AAA compliant */
  margin-top: 8px;
  line-height: 1.4;
}
</style>

