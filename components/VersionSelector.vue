<template>
  <div class="version-selector">
    <div class="selector-group" v-if="showVersions">
      <label for="version-select">Resume Version:</label>
      <select id="version-select" v-model="selectedVersion" @change="$emit('update:modelValue', selectedVersion)" class="version-select">
        <option value="web-version">Web Development</option>
        <option value="data-version">Data Science</option>
        <option value="v-3">Research & Academia</option>
        <option value="ai-version">AI & Business</option>
      </select>
    </div>
    <button class="download-btn" @click="downloadPDF">
      <Icon icon="material-symbols:picture-as-pdf" style="font-size: 16px;" />
      Download PDF
    </button>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'web-version'
  },
  showVersions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedVersion = ref(props.modelValue)

const downloadPDF = () => {
  // Hide the version selector before printing
  const versionSelector = document.querySelector('.version-selector')
  if (versionSelector) {
    versionSelector.style.display = 'none'
  }
  
  // Trigger print
  window.print()
  
  // Show the version selector again after a short delay
  setTimeout(() => {
    if (versionSelector) {
      versionSelector.style.display = 'flex'
    }
  }, 1000)
}
</script>

<style scoped>
.version-selector {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.version-selector label {
  font-weight: bold;
  font-size: 12px;
  color: #333;
}

.version-selector .version-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  cursor: pointer;
}

.download-btn {
  padding: 8px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.download-btn:hover {
  background: #c82333;
}

@media print {
  .version-selector {
    display: none !important;
  }
}
</style> 