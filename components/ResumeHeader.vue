<template>
  <header class="resume-section" v-if="personal && headerElements" role="banner">
    <div class="title-wrapper">
      <img 
        v-if="personal.headshot && headerElements.headshot" 
        class="headshot" 
        width="120" 
        height="120" 
        :src="personal.headshot" 
        :alt="`Professional headshot of ${personal.name}`"
        @error="handleImageError"
        role="img"
      >
      <h1>
        <span 
          :contenteditable="editable" 
          :class="{ editable }"
          @blur="updatePersonal('name', $event.target.textContent)"
          role="textbox"
          :aria-label="editable ? 'Edit your name' : undefined"
          :aria-readonly="!editable"
        >{{ personal.name }}</span>
        <div>
          <span 
            :contenteditable="editable" 
            :class="{ editable }"
            @blur="updatePersonal('title', $event.target.textContent)"
            role="textbox"
            :aria-label="editable ? 'Edit your title' : undefined"
            :aria-readonly="!editable"
          >{{ personal.title }}</span>
        </div>
      </h1>
    </div>
    <aside aria-label="Contact information">
      <div v-if="headerElements.address && personal.address && personal.address.trim()">
        <strong>Address:</strong> 
        <span 
          :contenteditable="editable" 
          :class="{ editable }"
          @blur="updatePersonal('address', $event.target.textContent)"
          role="textbox"
          :aria-label="editable ? 'Edit address' : undefined"
          :aria-readonly="!editable"
        >{{ personal.address }}</span>
      </div>
      <div v-if="headerElements.dateOfBirth">
        <strong>Date of Birth:</strong> 
        <span 
          :contenteditable="editable" 
          :class="{ editable }"
          @blur="updatePersonal('dateOfBirth', $event.target.textContent)"
          role="textbox"
          :aria-label="editable ? 'Edit date of birth' : undefined"
          :aria-readonly="!editable"
        >{{ personal.dateOfBirth }}</span>
      </div>
      <div v-if="headerElements.phone">
        <strong>Phone:</strong> 
        <a 
          :contenteditable="editable" 
          :class="{ editable }"
          :href="`tel:${personal.phone}`"
          @blur="updatePersonal('phone', $event.target.textContent)"
          :aria-label="`Phone: ${personal.phone}`"
        >{{ personal.phone }}</a>
      </div>
      <div v-if="headerElements.email">
        <strong>Email:</strong> 
        <a 
          :contenteditable="editable" 
          :class="{ editable }"
          :href="`mailto:${personal.email}`"
          @blur="updatePersonal('email', $event.target.textContent)"
          :aria-label="`Email: ${personal.email}`"
        >{{ personal.email }}</a>
      </div>
      <div v-if="headerElements.linkedin">
        <strong>LinkedIn:</strong> 
        <a 
          :contenteditable="editable" 
          :class="{ editable }"
          :href="personal.linkedin"
          @blur="updateLinkedIn($event.target.textContent)"
          :aria-label="`LinkedIn profile: ${personal.linkedinText}`"
          target="_blank"
          rel="noopener noreferrer"
        >{{ personal.linkedinText }}</a>
      </div>
    </aside>
  </header>
</template>

<script setup>
const props = defineProps({
  personal: {
    type: Object,
    required: true,
    default: () => ({})
  },
  editable: {
    type: Boolean,
    default: false
  },
  headerElements: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['update:personal'])

const updatePersonal = (field, value) => {
  if (props.editable && props.personal) {
    emit('update:personal', { ...props.personal, [field]: value })
  }
}

const updateLinkedIn = (value) => {
  if (props.editable && props.personal) {
    // Remove leading slash if present and ensure proper LinkedIn URL format
    const cleanValue = value.startsWith('/') ? value.substring(1) : value
    const linkedinUrl = `https://linkedin.com/in/${cleanValue}`
    
    emit('update:personal', { 
      ...props.personal, 
      linkedinText: value,
      linkedin: linkedinUrl
    })
  }
}

const handleImageError = (event) => {
  // Hide the image if it fails to load
  event.target.style.display = 'none'
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
}

.title-wrapper {
  display: flex;
  align-items: flex-start;
}

.headshot {
  margin-right: 16px;
  object-fit: contain;
  border-radius: 4px;
}

h1 {
  margin: 0;
  font-size: 40px;
  font-weight: bold;
}

h1 > div {
  font-size: 24px;
  font-weight: 500;
}

aside {
  padding-top: 20px;
  min-width: 200px;
}

aside > div {
  font-weight: bold;
}

aside > div span,
aside > div a {
  font-weight: normal;
}

/* Editable styles */
.editable {
  position: relative;
  min-width: 1em;
  display: inline-block;
}

.editable:hover {
  background-color: rgba(21, 101, 192, 0.06);
  border-radius: 2px;
}

.editable:focus {
  outline: 2px solid #1565C0;
  border-radius: 2px;
  background-color: rgba(21, 101, 192, 0.1);
}

@media print {
  .editable:hover,
  .editable:focus {
    background-color: transparent;
    outline: none;
  }
}
</style> 