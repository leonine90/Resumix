<template>
  <div class="control-section">
    <button 
      class="section-header" 
      @click="$emit('toggle-section-panel')"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-controls="resume-sections-content"
      aria-label="Toggle resume sections"
    >
      <Icon class="section-icon" icon="material-symbols:description" style="font-size: 16px;" aria-hidden="true" />
      <span class="section-title">Resume Sections</span>
      <Icon 
        class="toggle-icon" 
        :icon="isOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" 
        style="font-size: 12px;" 
        aria-hidden="true"
      />
    </button>
    <div 
      v-if="isOpen" 
      id="resume-sections-content"
      class="section-content"
      role="region"
      aria-label="Resume sections controls"
    >
      <fieldset class="sections-fieldset">
        <legend class="sr-only">Toggle and reorder resume sections</legend>
        <div 
          v-for="section in sectionOrder" 
          :key="section" 
          class="control-item draggable-section"
          :draggable="section !== 'summary' && section !== 'signature'"
          @dragstart="handleDragStart($event, section)"
          @dragover="handleDragOver($event)"
          @drop="handleDrop($event, section)"
          @dragenter="handleDragEnter($event, section)"
          @dragleave="handleDragLeave($event)"
          :class="{ 'drag-over': dragOverSection === section }"
          :aria-grabbed="draggedSection === section ? 'true' : 'false'"
        >
          <div 
            class="drag-handle" 
            :class="{ 'disabled': section === 'summary' || section === 'signature' }"
            :aria-label="section !== 'summary' && section !== 'signature' ? `Drag to reorder ${formatSectionName(section)} section` : undefined"
            :aria-hidden="section === 'summary' || section === 'signature' ? 'true' : 'false'"
            role="button"
            :tabindex="section !== 'summary' && section !== 'signature' ? '0' : '-1'"
          >
            <Icon icon="material-symbols:drag-handle" style="font-size: 16px; color: #64748b;" aria-hidden="true" />
          </div>
          <label class="checkbox-label" :for="`section-${section}`">
            <input 
              type="checkbox" 
              :id="`section-${section}`"
              :checked="sections[section]" 
              @change="$emit('toggle-section', section, $event.target.checked)"
              class="checkbox-input"
              :aria-label="`Toggle ${formatSectionName(section)} section visibility`"
            >
            <span class="section-name">{{ formatSectionName(section) }}</span>
          </label>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  sections: {
    type: Object,
    required: true
  },
  sectionOrder: {
    type: Array,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle-section', 'update-order', 'toggle-section-panel'])

const draggedSection = ref(null)
const dragOverSection = ref(null)

const formatSectionName = (section) => {
  return section
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace('Research Interests', 'Research Interests')
}

const handleDragStart = (event, section) => {
  if (section === 'summary' || section === 'signature') return
  draggedSection.value = section
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', section)
}

const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const handleDrop = (event, targetSection) => {
  event.preventDefault()
  
  if (!draggedSection.value || draggedSection.value === targetSection || targetSection === 'summary' || targetSection === 'signature') {
    draggedSection.value = null
    dragOverSection.value = null
    return
  }
  
  const currentOrder = [...props.sectionOrder]
  const draggedIndex = currentOrder.indexOf(draggedSection.value)
  const targetIndex = currentOrder.indexOf(targetSection)
  
  if (draggedIndex === -1 || targetIndex === -1) {
    draggedSection.value = null
    dragOverSection.value = null
    return
  }
  
  // Remove the dragged section from its current position
  currentOrder.splice(draggedIndex, 1)
  
  // Insert it at the target position
  currentOrder.splice(targetIndex, 0, draggedSection.value)
  
  // Emit the new order
  emit('update-order', currentOrder)
  
  // Reset drag state
  draggedSection.value = null
  dragOverSection.value = null
}

const handleDragEnter = (event, section) => {
  if (section !== 'summary' && section !== 'signature' && draggedSection.value !== section) {
    dragOverSection.value = section
  }
}

const handleDragLeave = (event) => {
  // Only clear if we're actually leaving the element (not entering a child)
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragOverSection.value = null
  }
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
  width: 100%;
  text-align: left;
}

.sections-fieldset {
  border: none;
  padding: 0;
  margin: 0;
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

.control-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  transition: all 0.2s ease;
}

.draggable-section {
  display: flex;
  align-items: center;
  padding: 8px;
  margin: 2px 0;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: #ffffff;
}

.draggable-section:hover {
  background: rgba(59, 130, 246, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.draggable-section.drag-over {
  background: rgba(59, 130, 246, 0.15);
  border: 2px dashed #3b82f6;
  padding: 6px;
}

.drag-handle {
  cursor: grab;
  display: flex;
  align-items: center;
  margin-right: 8px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.drag-handle:hover:not(.disabled) {
  background: rgba(59, 130, 246, 0.1);
}

.drag-handle:active:not(.disabled) {
  cursor: grabbing;
}

.drag-handle.disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.checkbox-label {
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
}

.checkbox-input {
  margin-right: 8px;
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.section-name {
  font-size: 13px;
  color: #334155;
}
</style>

