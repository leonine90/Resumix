<template>
  <v-dialog
    :model-value="show"
    max-width="560"
    scrollable
    @update:model-value="val => !val && $emit('close')"
  >
    <v-card rounded="lg">
      <v-toolbar color="surface-variant" density="comfortable" flat>
        <v-icon class="ml-3 mr-1" color="primary">mdi-brain</v-icon>
        <v-toolbar-title class="text-subtitle-1 font-weight-semibold" id="optimizer-info-modal-title">
          AI Resume Optimization
        </v-toolbar-title>
        <template #append>
          <v-btn icon variant="text" aria-label="Close AI optimizer information dialog" @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-divider />
      <v-card-text class="pa-6" id="optimizer-info-modal-description">
        <p class="text-body-2 text-medium-emphasis mb-5 mt-0">
          The Job Optimizer uses AI to tailor your resume for specific job postings, making it more likely to
          pass ATS filters and impress hiring managers.
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
  { title: 'Paste Job Posting', text: 'Copy the job description you\'re applying for and paste it in the job post field.' },
  { title: 'AI Analysis', text: 'Our AI analyzes the job requirements and optimizes your summary, experience descriptions, and skills.' },
  { title: 'Review Changes', text: 'See before/after comparisons and decide which optimizations to apply to your resume.' },
  { title: 'Apply & Download', text: 'Apply the changes and export your optimized resume, perfectly tailored for the job.' },
]
</script>
