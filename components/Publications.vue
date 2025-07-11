<template>
  <section class="resume-section" :contenteditable="editable">
    <h2>Publications</h2>
    <div>
      <ul>
        <li v-for="(publication, index) in publicationsData" :key="index">
          <a target="_blank" :href="publication.url">
            <strong 
              :class="{ editable }"
              @blur="updatePublication(index, 'title', $event.target.textContent)"
            >{{ publication.title }}</strong>
          </a>
          <p 
            :class="{ editable }"
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