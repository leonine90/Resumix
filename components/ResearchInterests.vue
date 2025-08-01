<template>
  <section class="resume-section" :contenteditable="editable" >
    <h2>Research/Academic Interests</h2>
    <div v-for="(interests, version) in researchInterests" :key="version" :class="[version, { hide: activeVersion !== version && activeVersion !== 'all' }]">
      <ul>
        <li v-for="(interest, index) in interests" :key="index">
          <strong 
            :class="{ editable }"
            @blur="updateInterest(version, index, 'title', $event.target.textContent)"
          >{{ interest.title }}</strong>
          <p 
            :class="{ editable }"
            @blur="updateInterest(version, index, 'description', $event.target.textContent)"
          >{{ interest.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  researchInterests: {
    type: Object,
    required: true
  },
  activeVersion: {
    type: String,
    default: 'web-version'
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:researchInterests'])

const updateInterest = (version, index, field, value) => {
  if (props.editable) {
    const updatedInterests = { ...props.researchInterests }
    updatedInterests[version][index][field] = value
    emit('update:researchInterests', updatedInterests)
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