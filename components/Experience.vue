<template>
  <section class="resume-section" aria-labelledby="experience-heading">
    <h2 id="experience-heading">Experience</h2>
    <div v-for="(job, index) in experienceData" :key="index">
      <div class="title-row">
        <div>
          <div>
            <span class="bold" 
              :class="{ editable }"
              :contenteditable="editable"
              role="textbox"
              :aria-label="`Edit company name for position ${index + 1}`"
              :aria-readonly="!editable"
              @blur="updateExperience(index, 'company', $event.target.textContent)"
            >{{ job.company }}</span>
            <span v-if="job.location && job.location.trim()"
              :class="{ editable }"
              :contenteditable="editable"
              role="textbox"
              :aria-label="`Edit location for position ${index + 1}`"
              :aria-readonly="!editable"
              @blur="updateExperience(index, 'location', $event.target.textContent)"
            >, {{ job.location }}</span>
          </div>
          <div 
            :class="{ editable }"
            :contenteditable="editable"
            role="textbox"
            :aria-label="`Edit position title for entry ${index + 1}`"
            :aria-readonly="!editable"
            @blur="updateExperience(index, 'position', $event.target.textContent)"
          >{{ job.position }}</div>
        </div>
        <div class="bold" 
          :class="{ editable }"
          :contenteditable="editable"
          role="textbox"
          :aria-label="`Edit period for position ${index + 1}`"
          :aria-readonly="!editable"
          @blur="updateExperience(index, 'period', $event.target.textContent)"
        >{{ job.period }}</div>
      </div>
      <ul role="list" v-if="!editable">
        <li 
          v-for="(achievement, achievementIndex) in job.achievements" 
          :key="achievementIndex"
          v-html="achievement"
        ></li>
      </ul>
      <ul role="list" v-else>
        <li 
          v-for="(achievement, achievementIndex) in job.achievements" 
          :key="achievementIndex"
          :class="{ editable }"
          :contenteditable="editable"
          role="textbox"
          aria-multiline="true"
          :aria-label="`Edit achievement ${achievementIndex + 1} for ${job.company}`"
          :aria-readonly="!editable"
          @blur="updateAchievement(index, achievementIndex, $event.target.innerHTML)"
          v-html="achievement"
        ></li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  experienceData: {
    type: Array,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:experienceData'])

const updateExperience = (index, field, value) => {
  if (props.editable) {
    const updatedExperience = [...props.experienceData]
    updatedExperience[index][field] = value
    emit('update:experienceData', updatedExperience)
  }
}

const updateAchievement = (jobIndex, achievementIndex, value) => {
  if (props.editable) {
    const updatedExperience = [...props.experienceData]
    updatedExperience[jobIndex].achievements[achievementIndex] = value
    emit('update:experienceData', updatedExperience)
  }
}
</script>

<style scoped>
.title-row {
  display: flex;
  justify-content: space-between;
}

.bold {
  font-weight: bold;
}

/* Editable styles */
.editable {
  position: relative;
  min-width: 1em;
  display: inline-block;
}

/* Specific styles for editable li elements */
li.editable {
  display: list-item;
  list-style-position: outside;
  list-style-type: disc;
  margin-left: 0;
  padding-left: 0;
  line-height: 1.5;
}

/* Ensure all li elements have proper bullet positioning */
ul li {
  list-style-position: outside;
  list-style-type: disc;
  margin-left: 20px;
  padding-left: 0;
  line-height: 1.5;
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