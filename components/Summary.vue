<template>
  <section class="resume-section" :class="{ hide: !show }" :contenteditable="editable">
    <h2>Summary</h2>
    <p 
      v-if="!editable"
      v-html="displaySummary"
    ></p>
    <p 
      v-else
      :class="{ editable }"
      :contenteditable="editable"
      @blur="updateSummary"
      v-html="displaySummary"
    ></p>
  </section>
</template>

<script setup>
const props = defineProps({
  summaryData: {
    type: [String, Object],
    required: true
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

// Compute the display summary text
const displaySummary = computed(() => {
  if (typeof props.summaryData === 'string') {
    return props.summaryData
  } else if (props.summaryData && typeof props.summaryData === 'object') {
    // Handle object format like { default: "text" }
    return props.summaryData.default || props.summaryData.text || ''
  }
  return ''
})

const updateSummary = (event) => {
  if (props.editable) {
    emit('update:summaryData', event.target.innerHTML)
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

/* Style for bold keywords from AI optimization */
:deep(strong) {
  font-weight: bold;
}
</style> 