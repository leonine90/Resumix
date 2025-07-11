<template>
  <section class="resume-section" :contenteditable="editable">
    <h2>Volunteering & Community Involvement</h2>
    <div v-for="(volunteer, index) in volunteeringData" :key="index">
      <div class="title-row">
        <div>
          <div>
            <span class="bold" 
              :class="{ editable }"
              @blur="updateVolunteer(index, 'organization', $event.target.textContent)"
            >{{ volunteer.organization }}</span>, 
            <span 
              :class="{ editable }"
              @blur="updateVolunteer(index, 'location', $event.target.textContent)"
            >{{ volunteer.location }}</span>
          </div>
          <div 
            :class="{ editable }"
            @blur="updateVolunteer(index, 'role', $event.target.textContent)"
          >{{ volunteer.role }}</div>
        </div>
        <div class="bold" 
          :class="{ editable }"
          @blur="updateVolunteer(index, 'period', $event.target.textContent)"
        >{{ volunteer.period }}</div>
      </div>
      <ul>
        <li>
          <span 
            :class="{ editable }"
            @blur="updateVolunteer(index, 'description', $event.target.textContent)"
          >{{ volunteer.description }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  volunteeringData: {
    type: Array,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:volunteeringData'])

const updateVolunteer = (index, field, value) => {
  if (props.editable) {
    const updatedVolunteering = [...props.volunteeringData]
    updatedVolunteering[index][field] = value
    emit('update:volunteeringData', updatedVolunteering)
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