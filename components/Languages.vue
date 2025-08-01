<template>
  <section class="resume-section languages" :class="{ hide: !show }" :contenteditable="editable">
    <h2>Languages</h2>
    <ul>
      <li v-for="(language, index) in languagesData" :key="index">
        <b 
          :class="{ editable }"
          @blur="updateLanguage(index, $event.target.textContent)"
        >{{ language }}</b>
      </li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({
  languagesData: {
    type: Array,
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

const emit = defineEmits(['update:languagesData'])

const updateLanguage = (index, value) => {
  if (props.editable) {
    const updatedLanguages = [...props.languagesData]
    updatedLanguages[index] = value
    emit('update:languagesData', updatedLanguages)
  }
}
</script>

<style scoped>
.hide {
  display: none;
}

/* Ensure all li elements have proper bullet positioning */
ul li {
  list-style-position: outside;
  list-style-type: disc;
  margin-left: 20px;
  padding-left: 0;
  line-height: 1.5;
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