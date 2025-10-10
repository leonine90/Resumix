<template>
  <div class="control-section">
    <div class="section-header" @click="$emit('toggle-section')">
      <Icon class="section-icon" icon="material-symbols:person" style="font-size: 16px;" />
      <span class="section-title">Header Elements</span>
      <Icon class="toggle-icon" :icon="isOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" style="font-size: 12px;" />
    </div>
    <div v-if="isOpen" class="section-content">
      <label v-for="(visible, element) in headerElements" :key="element" class="control-item">
        <input 
          type="checkbox" 
          :checked="visible" 
          @change="$emit('toggle-element', element, $event.target.checked)"
          class="checkbox-input"
        >
        <span class="element-name">{{ formatElementName(element) }}</span>
      </label>
      <div class="control-item disabled">
        <span class="element-name">Name (Always Visible)</span>
      </div>
      <div class="control-item disabled">
        <span class="element-name">Title (Always Visible)</span>
      </div>
      
      <!-- Headshot URL Input -->
      <div v-if="headerElements.headshot" class="headshot-input">
        <label class="input-label">Headshot URL:</label>
        <input 
          type="url" 
          :value="personal?.headshot || ''" 
          @input="$emit('update-headshot', $event)"
          placeholder="https://example.com/image.jpg"
          class="url-input"
        >
        <small class="input-help">Paste an image URL to display your headshot</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  headerElements: {
    type: Object,
    required: true
  },
  personal: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['toggle-element', 'update-headshot', 'toggle-section'])

const formatElementName = (element) => {
  return element
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}
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

.control-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-item:hover:not(.disabled) {
  background: rgba(59, 130, 246, 0.05);
  margin: 0 -8px;
  padding: 8px;
  border-radius: 6px;
}

.control-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  font-style: italic;
}

.checkbox-input {
  margin-right: 8px;
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.element-name {
  font-size: 13px;
  color: #334155;
}

.headshot-input {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.input-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.url-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.url-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-help {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
}
</style>

