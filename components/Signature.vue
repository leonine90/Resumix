<template>
  <div class="signature" :class="{ hide: !show }">
    <div>
      <div 
        :contenteditable="editable" 
        :class="{ editable }"
        @blur="updateSignature('name', $event.target.textContent)"
      >{{ displayName }}</div>
      <div 
        :contenteditable="editable" 
        :class="{ editable }"
        @blur="updateSignature('date', $event.target.textContent)"
      >{{ displayDate }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  signatureData: {
    type: Object,
    required: true
  },
  personal: {
    type: Object,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:signatureData'])

// Track if signature name has been manually edited
const isNameManuallyEdited = ref(false)

// Get current month and year
const getCurrentDate = () => {
  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const year = now.getFullYear()
  return `${month} ${year}`
}

// Computed properties for default values
const defaultName = computed(() => props.personal?.name || '')
const defaultDate = computed(() => getCurrentDate())

// Use default values if signature data is empty
const displayName = computed(() => {
  return props.signatureData.name || defaultName.value
})

const displayDate = computed(() => {
  return props.signatureData.date || defaultDate.value
})

// Watch for changes in personal name and update signature if it hasn't been manually edited
watch(() => props.personal?.name, (newName) => {
  if (newName && !isNameManuallyEdited.value) {
    // Update signature name if it hasn't been manually edited
    emit('update:signatureData', { ...props.signatureData, name: newName })
  }
})

const updateSignature = (field, value) => {
  if (props.editable) {
    if (field === 'name') {
      // If user clears the name or sets it to the personal name, allow syncing again
      if (!value || value === props.personal?.name) {
        isNameManuallyEdited.value = false
      } else {
        // Mark as manually edited if user sets a different custom name
        isNameManuallyEdited.value = true
      }
    }
    emit('update:signatureData', { ...props.signatureData, [field]: value })
  }
}
</script>

<style scoped>
.signature {
  display: flex;
  justify-content: flex-end;
  padding: 0 32px;
  margin-top: 20px;
}

.signature > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 32px;
}

.hide {
  display: none;
}

/* Editable styles */
.editable {
  position: relative;
  min-width: 1em;
  display: inline-block;
}

.editable:hover {
  background-color: rgba(0, 123, 255, 0.05);
  border-radius: 2px;
}

.editable:focus {
  outline: 2px solid #007bff;
  border-radius: 2px;
  background-color: rgba(0, 123, 255, 0.1);
}

@media print {
  .editable:hover,
  .editable:focus {
    background-color: transparent;
    outline: none;
  }
}
</style> 