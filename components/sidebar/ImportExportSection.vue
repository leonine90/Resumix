<template>
  <div class="control-section">
    <div class="section-header" @click="$emit('toggle-section')">
      <Icon class="section-icon" icon="material-symbols:upload-file" style="font-size: 16px;" />
      <span class="section-title">Import & Export</span>
      <Icon class="toggle-icon" :icon="isOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" style="font-size: 12px;" />
    </div>
    <div v-if="isOpen" class="section-content">
      <div class="section-header-with-info">
        <span class="section-subtitle">Export & Import</span>
        <button class="info-btn" @click="$emit('show-info')" title="Learn about using AI to generate resumes">
          <Icon icon="material-symbols:info-outline" style="font-size: 16px;" />
        </button>
      </div>
      <button class="export-btn" @click="$emit('export')">
        <Icon icon="material-symbols:file-download" style="font-size: 14px;" />
        Export as JSON
      </button>
      <button class="import-btn hidden-feature" @click="$emit('show-import')">
        <Icon icon="material-symbols:file-upload" style="font-size: 14px;" />
        Import from JSON
      </button>
      <button class="ai-import-btn" @click="$emit('show-ai-import')">
        <Icon icon="material-symbols:file-upload" style="font-size: 14px;" />
        Import Resume
      </button>
      <small class="export-help">Export current data or import resume from text</small>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['export', 'show-import', 'show-ai-import', 'show-info', 'toggle-section'])
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
  background: #10b981;
  color: white;
}

.export-btn:hover {
  background: #059669;
}

.import-btn {
  background: #6366f1;
  color: white;
}

.import-btn:hover {
  background: #4f46e5;
}

.ai-import-btn {
  background: #8b5cf6;
  color: white;
}

.ai-import-btn:hover {
  background: #7c3aed;
}

.hidden-feature {
  display: none;
}

.export-help {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
  line-height: 1.4;
}
</style>

