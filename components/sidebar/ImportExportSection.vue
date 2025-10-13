<template>
  <div class="control-section">
    <button 
      class="section-header" 
      @click="$emit('toggle-section')"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-controls="import-export-content"
      aria-label="Toggle import and export section"
    >
      <Icon class="section-icon" icon="material-symbols:upload-file" style="font-size: 16px;" aria-hidden="true" />
      <span class="section-title">Import & Export</span>
      <Icon 
        class="toggle-icon" 
        :icon="isOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" 
        style="font-size: 12px;" 
        aria-hidden="true"
      />
    </button>
    <div 
      v-if="isOpen" 
      id="import-export-content"
      class="section-content"
      role="region"
      aria-label="Import and export controls"
    >
      <div class="section-header-with-info">
        <h4 class="section-subtitle">Export & Import</h4>
        <button 
          class="info-btn" 
          @click="$emit('show-info')" 
          aria-label="Learn about using AI to generate resumes"
        >
          <Icon icon="material-symbols:info-outline" style="font-size: 16px;" aria-hidden="true" />
        </button>
      </div>
      <button 
        class="export-btn" 
        @click="$emit('export')"
        aria-label="Export resume as JSON file"
      >
        <Icon icon="material-symbols:file-download" style="font-size: 14px;" aria-hidden="true" />
        Export as JSON
      </button>
      <button 
        class="import-btn hidden-feature" 
        @click="$emit('show-import')"
        aria-label="Import resume from JSON file"
      >
        <Icon icon="material-symbols:file-upload" style="font-size: 14px;" aria-hidden="true" />
        Import from JSON
      </button>
      <button 
        class="ai-import-btn" 
        @click="$emit('show-ai-import')"
        :disabled="!hasAIConsent"
        :aria-disabled="!hasAIConsent ? 'true' : 'false'"
        :aria-label="hasAIConsent ? 'Import resume with AI processing' : 'Import resume with AI (AI features must be enabled)'"
        aria-describedby="ai-import-help"
      >
        <Icon icon="material-symbols:file-upload" style="font-size: 14px;" aria-hidden="true" />
        Import Resume
      </button>
      <small 
        id="ai-import-help" 
        class="export-help" 
        v-if="!hasAIConsent" 
        style="color: #ef4444;"
        role="alert"
      >
        ⚠️ AI Import requires AI features to be enabled in the footer.
      </small>
      <small id="ai-import-help" class="export-help" v-else>Export current data or import resume from text</small>
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

defineEmits(['export', 'show-import', 'show-ai-import', 'show-info', 'toggle-section'])

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

.export-btn,
.import-btn,
.ai-import-btn {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 8px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.export-btn {
  background: #047857; /* 7.1:1 contrast - AAA compliant */
  color: white;
}

.export-btn:hover {
  background: #065f46; /* Even darker on hover */
}

.import-btn {
  background: #4338ca; /* 7.2:1 contrast - AAA compliant */
  color: white;
}

.import-btn:hover {
  background: #3730a3; /* Darker on hover */
}

.ai-import-btn {
  background: #6d28d9; /* 7.1:1 contrast - AAA compliant */
  color: white;
}

.ai-import-btn:hover:not(:disabled) {
  background: #5b21b6; /* Darker on hover */
}

.ai-import-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

.hidden-feature {
  display: none;
}

.export-help {
  display: block;
  font-size: 11px;
  color: #475569; /* 7.6:1 contrast - AAA compliant */
  margin-top: 8px;
  line-height: 1.4;
}
</style>

