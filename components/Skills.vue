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
  display: flex;
  flex-wrap: wrap;
}

.skills div span {
  flex: 1 0 calc(calc(100% - 3*8px)/3);
  margin-bottom: 8px;
  margin-right: 8px;
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