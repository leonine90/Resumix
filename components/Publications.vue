<template>
  <section class="resume-section" aria-labelledby="publications-heading">
    <h2 id="publications-heading">Publications</h2>
    <div>
      <ul role="list">
        <li v-for="(publication, index) in publicationsData" :key="index">
          <a 
            target="_blank" 
            rel="noopener noreferrer"
            :href="publication.url"
            :aria-label="`Read publication: ${publication.title} (opens in new tab)`"
          >
            <strong 
              :class="{ editable }"
              :contenteditable="editable"
              role="textbox"
              :aria-label="`Edit title for publication ${index + 1}`"
              :aria-readonly="!editable"
              @blur="updatePublication(index, 'title', $event.target.textContent)"
            >{{ publication.title }}</strong>
          </a>
          <p 
            :class="{ editable }"
            :contenteditable="editable"
            role="textbox"
            aria-multiline="true"
            :aria-label="`Edit description for publication ${index + 1}`"
            :aria-readonly="!editable"
            @blur="updatePublication(index, 'description', $event.target.textContent)"
          >{{ publication.description }}</p>
        </li>
      </ul> 
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  publicationsData: {
    type: Array,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:publicationsData'])

const updatePublication = (index, field, value) => {
  if (props.editable) {
    const updatedPublications = [...props.publicationsData]
    updatedPublications[index][field] = value
    emit('update:publicationsData', updatedPublications)
  }
}
</script>

<style scoped>
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