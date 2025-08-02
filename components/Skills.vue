<template>
  <section class="resume-section skills" :contenteditable="editable">
    <h2>Skills</h2>
    <div>
      <span 
        v-for="(skill, index) in skillsData" 
        :key="index"
        :class="{ editable }"
        @blur="updateSkill(index, $event.target.textContent)"
      >{{ skill }}</span>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  skillsData: {
    type: Array,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:skillsData'])

const updateSkill = (index, value) => {
  if (props.editable) {
    const updatedSkills = [...props.skillsData]
    updatedSkills[index] = value
    emit('update:skillsData', updatedSkills)
  }
}
</script>

<style scoped>
.skills div {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.skills div span {
  /* Grid items automatically fill the columns */
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