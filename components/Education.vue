<template>
  <section class="resume-section" :contenteditable="editable">
    <h2>Education</h2>
    <div v-for="(education, index) in educationData" :key="index">
      <div class="title-row">
        <div>
          <div>
            <span class="bold" 
              :class="{ editable }"
              @blur="updateEducation(index, 'institution', $event.target.textContent)"
            >{{ education.institution }}</span>, 
            <span 
              :class="{ editable }"
              @blur="updateEducation(index, 'location', $event.target.textContent)"
            >{{ education.location }}</span>
          </div>          
          <div 
            :class="{ editable }"
            @blur="updateEducation(index, 'degree', $event.target.textContent)"
          >{{ education.degree }}</div>
        </div>
        <div class="bold" 
          :class="{ editable }"
          @blur="updateEducation(index, 'period', $event.target.textContent)"
        >{{ education.period }}</div>
      </div>
      <ul>
        <li v-if="education.coursework">
          <strong>Key Coursework</strong>
          <ul>
            <li v-for="(course, courseIndex) in education.coursework" :key="courseIndex">
              <span 
                :class="{ editable }"
                @blur="updateCoursework(index, courseIndex, $event.target.textContent)"
              >{{ course }}</span>
            </li>
          </ul>
        </li>
        <br v-if="education.coursework"/>
        <li v-if="education.finalProject">
          <strong>Final Year Project: 
            <span 
              :class="{ editable }"
              @blur="updateFinalProject(index, 'title', $event.target.textContent)"
            >{{ education.finalProject.title }}</span>
          </strong>
          <ul>
            <li><strong>Objective:</strong> 
              <span 
                :class="{ editable }"
                @blur="updateFinalProject(index, 'objective', $event.target.textContent)"
              >{{ education.finalProject.objective }}</span>
            </li>
            <li><strong>Key Topics:</strong> 
              <span 
                :class="{ editable }"
                @blur="updateFinalProject(index, 'keyTopics', $event.target.textContent)"
              >{{ education.finalProject.keyTopics }}</span>
            </li>
            <li><strong>Outcome: 
              <span 
                :class="{ editable }"
                @blur="updateFinalProject(index, 'outcome', $event.target.textContent)"
              >{{ education.finalProject.outcome }}</span>
            </strong></li>
          </ul>
        </li>
        <li v-if="education.gpa">
          <strong>Overall GPA:</strong> 
          <span 
            :class="{ editable }"
            @blur="updateEducation(index, 'gpa', $event.target.textContent)"
          >{{ education.gpa }}</span>
        </li>
        <li v-if="education.description">
          <span 
            :class="{ editable }"
            @blur="updateEducation(index, 'description', $event.target.textContent)"
          >{{ education.description }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  educationData: {
    type: Array,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:educationData'])

const updateEducation = (index, field, value) => {
  if (props.editable) {
    const updatedEducation = [...props.educationData]
    updatedEducation[index][field] = value
    emit('update:educationData', updatedEducation)
  }
}

const updateCoursework = (educationIndex, courseIndex, value) => {
  if (props.editable) {
    const updatedEducation = [...props.educationData]
    updatedEducation[educationIndex].coursework[courseIndex] = value
    emit('update:educationData', updatedEducation)
  }
}

const updateFinalProject = (educationIndex, field, value) => {
  if (props.editable) {
    const updatedEducation = [...props.educationData]
    updatedEducation[educationIndex].finalProject[field] = value
    emit('update:educationData', updatedEducation)
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