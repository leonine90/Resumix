<template>
  <div>
    <fieldset class="sections-fieldset">
      <legend class="sr-only">Toggle and reorder resume sections</legend>
      <div
        v-for="section in sectionOrder"
        :key="section"
        class="toggle-row"
        :draggable="section !== 'summary' && section !== 'signature'"
        :class="{ 'drag-over': dragOverSection === section }"
        @click="$emit('toggle-section', section, !sections[section])"
        @dragstart="handleDragStart($event, section)"
        @dragover="handleDragOver($event)"
        @drop="handleDrop($event, section)"
        @dragenter="handleDragEnter(section)"
        @dragleave="handleDragLeave($event)"
      >
        <v-icon
          size="16"
          class="drag-handle-icon"
          :class="{ 'drag-handle-disabled': section === 'summary' || section === 'signature' }"
          :aria-label="section !== 'summary' && section !== 'signature' ? `Drag to reorder ${formatSectionName(section)}` : undefined"
          :aria-hidden="(section === 'summary' || section === 'signature') ? 'true' : 'false'"
          @click.stop
        >mdi-drag</v-icon>
        <span class="toggle-label">{{ formatSectionName(section) }}</span>
        <v-switch
          :model-value="sections[section]"
          :aria-label="formatSectionName(section)"
          density="compact"
          hide-details
          color="primary"
          inset
          class="toggle-switch"
          @click.stop
          @update:model-value="$emit('toggle-section', section, $event)"
        />
      </div>
    </fieldset>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  sections: { type: Object, required: true },
  sectionOrder: { type: Array, required: true },
})

const emit = defineEmits(['toggle-section', 'update-order'])

const draggedSection = ref(null)
const dragOverSection = ref(null)

const formatSectionName = (section) =>
  section.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())

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
  const order = [...props.sectionOrder]
  const fromIdx = order.indexOf(draggedSection.value)
  const toIdx = order.indexOf(targetSection)
  if (fromIdx === -1 || toIdx === -1) { draggedSection.value = null; dragOverSection.value = null; return }
  order.splice(fromIdx, 1)
  order.splice(toIdx, 0, draggedSection.value)
  emit('update-order', order)
  draggedSection.value = null
  dragOverSection.value = null
}

const handleDragEnter = (section) => {
  if (section !== 'summary' && section !== 'signature' && draggedSection.value !== section) {
    dragOverSection.value = section
  }
}

const handleDragLeave = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) dragOverSection.value = null
}
</script>

<style scoped>
.sections-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.toggle-row {
  display: flex;
  align-items: center;
  padding: 2px 8px 2px 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
  user-select: none;
}

.toggle-row:hover {
  background: rgba(21, 101, 192, 0.06);
}

.toggle-row.drag-over {
  background: rgba(21, 101, 192, 0.14);
  outline: 2px dashed #1565C0;
}

.drag-handle-icon {
  cursor: grab;
  color: #CAC4D0;
  flex-shrink: 0;
  margin-right: 4px;
}

.drag-handle-icon:hover { color: #1565C0; }

.drag-handle-disabled {
  cursor: not-allowed;
  opacity: 0.25;
}

.toggle-label {
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface));
  flex: 1;
}

.toggle-switch {
  flex-shrink: 0;
}

:deep(.toggle-switch .v-switch__track) {
  opacity: 1;
}
</style>
