<template>
  <section class="resume-section" :class="{ hide: !show }" :contenteditable="editable">
    <h2>Summary</h2>
    <p 
      :class="{ editable }"
      @blur="updateSummary"
    >{{ summaryText }}</p>
  </section>
</template>

<script setup>
const props = defineProps({
  summaryData: {
    type: Object,
    required: true
  },
  activeVersion: {
    type: String,
    default: 'default'
  },
  show: {
    type: Boolean,
    default: true
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:summaryData'])

const summaryText = computed(() => {
  return props.summaryData[props.activeVersion] || props.summaryData.default || ''
})

const updateSummary = (event) => {
  if (props.editable) {
    const updatedSummary = { ...props.summaryData }
    updatedSummary[props.activeVersion] = event.target.textContent
    emit('update:summaryData', updatedSummary)
  }
}
</script>

<style scoped>
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