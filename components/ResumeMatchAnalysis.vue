<template>
  <div>
    <div class="text-center mb-6">
      <div class="text-h6 font-weight-bold d-flex align-center justify-center mb-1">
        <v-icon class="mr-2" color="secondary">mdi-chart-line</v-icon>
        Resume-Job Compatibility Analysis
      </div>
      <p class="text-body-2 text-medium-emphasis font-italic">
        {{ analysisData.summary.compatibilityLevel }} compatibility level — {{ analysisData.summary.recommendation }}
      </p>
    </div>

    <!-- Overall card -->
    <v-card variant="outlined" class="mb-4" border="s-lg" color="secondary">
      <v-card-text>
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <div class="text-subtitle-1 font-weight-bold mb-1">Overall Compatibility</div>
            <div class="text-body-2 text-medium-emphasis">
              Overall assessment of how well your resume matches the job requirements based on skills, experience, and keyword alignment.
            </div>
          </div>
          <v-progress-circular
            :model-value="analysisData.metrics.overallCompatibility.score"
            :size="80"
            :width="8"
            :color="scoreColor(analysisData.metrics.overallCompatibility.score)"
            class="ml-4 flex-shrink-0"
          >
            <span class="text-caption font-weight-bold">{{ analysisData.metrics.overallCompatibility.score }}%</span>
          </v-progress-circular>
        </div>
        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="text-caption font-weight-semibold text-success mb-1">Key Strengths</div>
            <ul class="pl-4">
              <li v-for="s in analysisData.summary.keyStrengths" :key="s" class="text-body-2 text-success">{{ s }}</li>
            </ul>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="text-caption font-weight-semibold text-error mb-1">Key Gaps</div>
            <ul class="pl-4">
              <li v-for="g in analysisData.summary.keyGaps" :key="g" class="text-body-2 text-error">{{ g }}</li>
            </ul>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Collapsible metric panels -->
    <v-expansion-panels v-model="openPanels" multiple variant="accordion" class="mb-4">
      <v-expansion-panel
        v-for="metric in metricPanels"
        :key="metric.key"
        :value="metric.key"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center justify-space-between w-100 pr-2">
            <span class="text-subtitle-2 font-weight-bold">{{ metric.label }}</span>
            <v-progress-circular
              :model-value="analysisData.metrics[metric.key].score"
              :size="48"
              :width="5"
              :color="scoreColor(analysisData.metrics[metric.key].score)"
            >
              <span class="text-caption font-weight-bold">{{ analysisData.metrics[metric.key].score }}%</span>
            </v-progress-circular>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="text-body-2 text-medium-emphasis mb-3">{{ metric.explanation }}</p>
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-semibold text-success mb-1">Strengths</div>
              <ul class="pl-4">
                <li v-for="s in analysisData.metrics[metric.key].strengths" :key="s" class="text-body-2 text-success">{{ s }}</li>
              </ul>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-caption font-weight-semibold text-error mb-1">{{ metric.gapLabel }}</div>
              <ul class="pl-4">
                <li v-for="g in analysisData.metrics[metric.key].missingSkills" :key="g" class="text-body-2 text-error">{{ g }}</li>
              </ul>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Low compatibility warning -->
    <v-alert
      v-if="analysisData.metrics.overallCompatibility.score < 65"
      type="warning"
      variant="tonal"
      density="comfortable"
      icon="mdi-alert"
      class="mb-4"
    >
      <div class="text-subtitle-2 font-weight-bold mb-1">Low Compatibility Detected</div>
      <div class="text-body-2">
        Your resume has a {{ analysisData.metrics.overallCompatibility.score }}% compatibility with this job.
        Optimization may not be effective with such low alignment. Consider revising your resume to better match
        the job requirements before optimizing.
      </div>
    </v-alert>

    <div class="d-flex justify-center gap-3">
      <v-btn
        variant="text"
        :disabled="isOptimizing"
        prepend-icon="mdi-close"
        @click="$emit('cancel')"
      >
        Cancel
      </v-btn>
      <v-btn
        v-if="analysisData.metrics.overallCompatibility.score >= 65"
        color="secondary"
        variant="elevated"
        :loading="isOptimizing"
        :disabled="isOptimizing"
        prepend-icon="mdi-brain"
        @click="$emit('proceed')"
      >
        {{ isOptimizing ? 'Optimizing…' : 'Proceed with Optimization' }}
      </v-btn>
      <v-btn
        v-else
        color="error"
        variant="elevated"
        prepend-icon="mdi-file-edit"
        @click="$emit('revise')"
      >
        Revise Resume &amp; Try Again
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  analysisData: { type: Object, required: true },
  isOptimizing: { type: Boolean, default: false },
})

defineEmits(['proceed', 'cancel', 'revise'])

const openPanels = ref([])

const metricPanels = [
  {
    key: 'skillsMatch',
    label: 'Skills Match',
    explanation: 'How well your technical and soft skills align with what the job requires.',
    gapLabel: 'Missing Skills',
  },
  {
    key: 'experienceRelevance',
    label: 'Experience Relevance',
    explanation: 'How relevant your work experience is to the job requirements and industry.',
    gapLabel: 'Areas to Improve',
  },
  {
    key: 'keywordAlignment',
    label: 'Keyword Alignment',
    explanation: 'How well your resume uses the same terminology and keywords as the job posting.',
    gapLabel: 'Missing Keywords',
  },
]

const scoreColor = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'error'
}
</script>
