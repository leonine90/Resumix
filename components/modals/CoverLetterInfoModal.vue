<template>
  <v-dialog
    :model-value="show"
    max-width="560"
    scrollable
    @update:model-value="val => !val && $emit('close')"
  >
    <v-card rounded="lg">
      <v-toolbar color="surface-variant" density="comfortable" flat>
        <v-icon class="ml-3 mr-1" color="primary">mdi-file-document-edit</v-icon>
        <v-toolbar-title class="text-subtitle-1 font-weight-semibold" id="cover-letter-info-modal-title">
          AI Cover Letter Generation
        </v-toolbar-title>
        <template #append>
          <v-btn icon variant="text" aria-label="Close cover letter information dialog" @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-divider />
      <v-card-text class="pa-6" id="cover-letter-info-modal-description">
        <p class="text-body-2 text-medium-emphasis mb-5 mt-0">
          The Cover Letter Generator uses AI to create professional, tailored cover letters that highlight
          your relevant experience and demonstrate your fit for specific job positions.
        </p>
        <div v-for="(step, i) in steps" :key="i" class="d-flex align-start mb-4">
          <v-avatar size="24" color="primary" class="flex-shrink-0 mr-3 mt-1" aria-hidden="true">
            <span class="text-caption font-weight-bold text-white">{{ i + 1 }}</span>
          </v-avatar>
          <div class="text-body-2 text-medium-emphasis">
            <strong class="text-on-surface">{{ step.title }}:</strong> {{ step.text }}
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({ show: { type: Boolean, required: true } })
defineEmits(['close'])

const steps = [
  { title: 'Provide Resume', text: 'Paste your resume text or use your current resume data to give the AI context about your background.' },
  { title: 'Add Job Description', text: 'Paste the job posting to help the AI understand the specific requirements and company needs.' },
  { title: 'Generate Cover Letter', text: 'Our AI creates a professional cover letter that connects your experience to the job requirements.' },
  { title: 'Download & Use', text: 'Download your cover letter as a PDF and use it for your job application.' },
]
</script>
