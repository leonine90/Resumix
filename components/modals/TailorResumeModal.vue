<template>
  <v-dialog
    :model-value="show"
    fullscreen
    @update:model-value="val => !val && handleClose()"
  >
    <v-card rounded="0">
      <!-- Header -->
      <v-toolbar color="secondary" density="comfortable" flat>
        <v-icon class="ml-3 mr-1 text-white">mdi-brain</v-icon>
        <v-toolbar-title class="text-subtitle-1 font-weight-semibold text-white" id="tailor-modal-title">
          AI Resume Optimizer
        </v-toolbar-title>
        <template #append>
          <v-btn
            icon
            variant="text"
            :disabled="isAnalyzing || isTailoring || isApplying"
            aria-label="Close AI resume optimizer dialog"
            @click="handleClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>

      <!-- Scrollable body -->
      <v-card-text class="fullscreen-body pa-6">
        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
          icon="mdi-information"
          class="mb-6"
          role="note"
          id="tailor-modal-description"
        >
          <strong>Privacy Notice:</strong> This feature sends your resume data to Google AI for processing.
          Your data may be temporarily processed according to
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's privacy policy</a>.
        </v-alert>
        <!-- Input Section -->
        <div v-if="!showAnalysis && !showResults" class="input-section">
          <div class="input-grid">
            <!-- Resume text -->
            <div class="input-group">
              <v-textarea
                v-model="resumeTextInput"
                label="Your Resume Text"
                :readonly="useCurrentResume"
                placeholder="Paste your resume text here (from Word, PDF, or any format)..."
                rows="12"
                variant="outlined"
                density="comfortable"
                no-resize
                aria-describedby="resume-text-help"
              />
              <span id="resume-text-help" class="sr-only">Enter your resume text for AI optimization, or use checkbox to load current resume</span>
              <v-checkbox
                v-model="useCurrentResume"
                label="Use current resume data"
                density="compact"
                hide-details
                color="secondary"
                class="mt-1"
                id="use-current-resume-checkbox"
                @update:model-value="handleUseCurrentResumeChange"
              />
            </div>

            <!-- Job posting -->
            <div class="input-group">
              <v-textarea
                v-model="jobPostText"
                label="Job Posting"
                placeholder="Paste the job posting here..."
                rows="12"
                variant="outlined"
                density="comfortable"
                no-resize
                aria-describedby="job-post-help"
              />
              <span id="job-post-help" class="sr-only">Enter the job posting you want to tailor your resume for</span>
            </div>
          </div>

          <v-alert
            v-if="isAnalyzing"
            type="info"
            variant="tonal"
            density="compact"
            icon="mdi-chart-line"
            class="mb-4"
            role="status"
            aria-live="polite"
          >
            Analyzing resume-job compatibility…
          </v-alert>

          <div class="d-flex justify-end gap-2 mt-4">
            <v-btn
              variant="text"
              :disabled="isAnalyzing"
              aria-label="Cancel and close optimizer"
              @click="handleClose"
            >
              Cancel
            </v-btn>
            <v-btn
              color="secondary"
              variant="tonal"
              prepend-icon="mdi-chart-line"
              :loading="isAnalyzing"
              :disabled="!jobPostText.trim() || !resumeTextInput.trim() || isAnalyzing"
              :aria-busy="isAnalyzing ? 'true' : 'false'"
              aria-label="Analyze resume compatibility with job posting"
              @click="handleAnalyze"
            >
              Analyze Compatibility
            </v-btn>
          </div>
        </div>

        <!-- Analysis Section -->
        <div v-if="showAnalysis">
          <ResumeMatchAnalysis
            :analysis-data="analysisData"
            :is-optimizing="isTailoring"
            @proceed="handleProceedToOptimization"
            @cancel="handleCancelAnalysis"
            @revise="handleReviseResume"
          />
          <v-alert
            v-if="isTailoring"
            type="info"
            variant="tonal"
            density="compact"
            icon="mdi-loading"
            class="mt-4"
            role="status"
            aria-live="polite"
          >
            Optimizing your resume with AI…
          </v-alert>
        </div>

        <!-- Results Section -->
        <TailorResumeResults
          v-if="showResults"
          :analysis-data="analysisData"
          :show-analysis-in-results="showAnalysisInResults"
          :original-content="originalContent"
          :optimized-content="optimizedContent"
          :editable-optimized-content="editableOptimizedContent"
          :has-user-edits="hasUserEdits"
          :is-applying="isApplying"
          :job-post-text="jobPostText"
          @toggle-analysis="showAnalysisInResults = !showAnalysisInResults"
          @mark-edited="hasUserEdits = true"
          @update-skills="updateSkillsFromText"
          @reset="handleReset"
          @apply="handleApply"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import ResumeMatchAnalysis from '../ResumeMatchAnalysis.vue'
import TailorResumeResults from './TailorResumeResults.vue'
import { useJobOptimizer } from '~/composables/useJobOptimizer'
import { useResumeImport } from '~/composables/useResumeImport'
import { useToast } from '~/composables/useToast'

const props = defineProps({
  show: { type: Boolean, required: true },
  resumeData: { type: Object, required: true },
})
const emit = defineEmits(['close', 'apply-optimizations'])

const { analyzeResumeMatch, tailorResume, applyOptimizations, initializeTextareaHeights } = useJobOptimizer()
const { generateCurrentResumeText } = useResumeImport()
const { showInfo } = useToast()

const resumeTextInput = ref('')
const jobPostText = ref('')
const useCurrentResume = ref(true)
const isAnalyzing = ref(false)
const isTailoring = ref(false)
const isApplying = ref(false)
const showAnalysis = ref(false)
const showResults = ref(false)
const analysisData = ref(null)
const showAnalysisInResults = ref(false)

const originalContent = ref({ summary: '', experience: [], skills: [] })
const optimizedContent = ref({ summary: '', experience: [], skills: [] })
const editableOptimizedContent = ref({ summary: '', experience: [], skills: [] })
const hasUserEdits = ref(false)

const handleUseCurrentResumeChange = () => {
  if (useCurrentResume.value) resumeTextInput.value = generateCurrentResumeText(props.resumeData)
}

const handleAnalyze = async () => {
  isAnalyzing.value = true
  showAnalysis.value = false
  const result = await analyzeResumeMatch(resumeTextInput.value, jobPostText.value, props.resumeData)
  isAnalyzing.value = false
  if (result) { analysisData.value = result; showAnalysis.value = true }
}

const handleProceedToOptimization = async () => {
  isTailoring.value = true
  showResults.value = false
  const result = await tailorResume(resumeTextInput.value, jobPostText.value, props.resumeData)
  isTailoring.value = false
  if (result) {
    originalContent.value = {
      summary: typeof props.resumeData.summary === 'string' ? props.resumeData.summary : props.resumeData.summary?.default || 'No summary available',
      experience: props.resumeData.experience || [],
      skills: props.resumeData.skills || [],
    }
    optimizedContent.value = result
    editableOptimizedContent.value = {
      summary: result.summary || '',
      experience: result.experience ? result.experience.map(exp => ({ ...exp, achievements: [...(exp.achievements || [])] })) : [],
      skills: [...(result.skills || [])],
    }
    hasUserEdits.value = false
    showAnalysis.value = false
    showResults.value = true
    nextTick(() => initializeTextareaHeights())
  }
}

const handleCancelAnalysis = () => { showAnalysis.value = false; analysisData.value = null }
const handleReviseResume = () => {
  showAnalysis.value = false; analysisData.value = null
  showInfo('Please update your resume to better match the job requirements, then analyze again.')
}

const updateSkillsFromText = (event) => {
  editableOptimizedContent.value.skills = event.target.value.split(',').map(s => s.trim()).filter(Boolean)
  hasUserEdits.value = true
}

const handleApply = async () => {
  isApplying.value = true
  const updatedData = await applyOptimizations(editableOptimizedContent.value, resumeTextInput.value, props.resumeData)
  isApplying.value = false
  if (updatedData) { emit('apply-optimizations', updatedData); handleReset(); emit('close') }
}

const handleReset = () => {
  showResults.value = false; showAnalysis.value = false
  jobPostText.value = ''; resumeTextInput.value = ''; useCurrentResume.value = true
  isTailoring.value = false; isApplying.value = false; isAnalyzing.value = false
  analysisData.value = null
  originalContent.value = { summary: '', experience: [], skills: [] }
  optimizedContent.value = { summary: '', experience: [], skills: [] }
  editableOptimizedContent.value = { summary: '', experience: [], skills: [] }
  hasUserEdits.value = false; showAnalysisInResults.value = false
}

const handleClose = () => {
  if (!isAnalyzing.value && !isTailoring.value && !isApplying.value) {
    handleReset(); emit('close')
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    handleReset()
    nextTick(() => {
      if (useCurrentResume.value) resumeTextInput.value = generateCurrentResumeText(props.resumeData)
    })
  }
})
</script>

<style scoped>
.fullscreen-body {
  flex: 1;
  overflow-y: auto;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.input-group { display: flex; flex-direction: column; }

@media (max-width: 960px) {
  .input-grid { grid-template-columns: 1fr; }
}
</style>
