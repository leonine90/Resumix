<template>
  <div 
    v-if="show" 
    class="fullscreen-modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="tailor-modal-title"
    aria-describedby="tailor-modal-description"
  >
    <div class="fullscreen-modal-content" @click.stop ref="modalRef">
      <div class="fullscreen-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:psychology" style="font-size: 24px; margin-right: 12px;" aria-hidden="true" />
            <h1 id="tailor-modal-title">AI Resume Optimizer</h1>
          </div>
          <button 
            class="close-btn" 
            @click="handleClose"
            aria-label="Close AI resume optimizer dialog"
          >
            <Icon icon="material-symbols:close" style="font-size: 24px;" aria-hidden="true" />
          </button>
        </div>
      </div>
      
      <!-- Privacy Warning Banner -->
      <div class="privacy-warning-banner" role="alert" id="tailor-modal-description">
        <Icon icon="material-symbols:info-outline" style="font-size: 20px; margin-right: 8px; flex-shrink: 0;" aria-hidden="true" />
        <p>
          <strong>Privacy Notice:</strong> This feature sends your resume data to Google AI for processing. 
          Your data may be temporarily processed according to 
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" aria-label="Read Google's privacy policy (opens in new tab)">Google's privacy policy</a>.
          See our <a href="/privacy-policy" target="_blank" aria-label="Read our Privacy Policy (opens in new tab)">Privacy Policy</a> for details.
        </p>
      </div>
      
      <div class="fullscreen-body">
        <!-- Input Section -->
        <div v-if="!showAnalysis && !showResults" class="input-section fullscreen-input">
          <div class="input-grid">
            <div class="input-group">
              <label for="tailor-resume-text" class="input-label">
                <Icon icon="material-symbols:description" style="font-size: 18px; margin-right: 8px;" aria-hidden="true" />
                Your Resume Text
              </label>
              <textarea 
                id="tailor-resume-text"
                v-model="resumeTextInput"
                class="fullscreen-textarea"
                :readonly="useCurrentResume"
                placeholder="Paste your resume text here (from Word, PDF, or any format)..."
                aria-describedby="resume-text-help"
              ></textarea>
              <span id="resume-text-help" class="sr-only">
                Enter your resume text for AI optimization, or use checkbox to load current resume
              </span>
              <div class="checkbox-container">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="useCurrentResume"
                    @change="handleUseCurrentResumeChange"
                    class="checkbox-input"
                    id="use-current-resume-checkbox"
                    aria-describedby="use-current-help"
                  />
                  <span class="checkbox-text">
                    Use current resume data
                  </span>
                </label>
                <span id="use-current-help" class="sr-only">
                  Check to automatically load your current resume data
                </span>
              </div>
            </div>
            
            <div class="input-group">
              <label for="tailor-job-post" class="input-label">
                <Icon icon="material-symbols:work" style="font-size: 18px; margin-right: 8px;" aria-hidden="true" />
                Job Posting
              </label>
              <textarea 
                id="tailor-job-post"
                v-model="jobPostText"
                class="fullscreen-textarea"
                placeholder="Paste the job posting here..."
                aria-describedby="job-post-help"
              ></textarea>
              <span id="job-post-help" class="sr-only">
                Enter the job posting or description you want to tailor your resume for
              </span>
            </div>
          </div>

          <div class="ai-status" v-if="isAnalyzing" role="status" aria-live="polite">
            <Icon icon="material-symbols:analytics" style="font-size: 16px; margin-right: 8px;" aria-hidden="true" />
            Analyzing resume-job compatibility...
          </div>

          <div class="fullscreen-actions">
            <div class="action-buttons">
              <button 
                @click="handleClose" 
                class="action-btn cancel-action" 
                :disabled="isAnalyzing"
                aria-label="Cancel and close optimizer"
              >
                <Icon icon="material-symbols:close" style="font-size: 16px; margin-right: 8px;" aria-hidden="true" />
                Cancel
              </button>
              <button 
                @click="handleAnalyze" 
                :disabled="!jobPostText.trim() || !resumeTextInput.trim() || isAnalyzing" 
                class="action-btn analyze-action"
                :aria-busy="isAnalyzing ? 'true' : 'false'"
                aria-label="Analyze resume compatibility with job posting"
              >
                <Icon icon="material-symbols:analytics" style="font-size: 16px; margin-right: 8px;" aria-hidden="true" />
                Analyze Compatibility
              </button>
            </div>
          </div>
        </div>

        <!-- Analysis Section -->
        <div v-if="showAnalysis" class="analysis-section fullscreen-analysis">
          <ResumeMatchAnalysis 
            :analysis-data="analysisData"
            @proceed="handleProceedToOptimization"
            @cancel="handleCancelAnalysis"
            @revise="handleReviseResume"
            :is-optimizing="isTailoring"
          />
          <div class="ai-status" v-if="isTailoring" role="status" aria-live="polite">
            <Icon icon="material-symbols:hourglass-top" style="font-size: 16px; margin-right: 8px;" aria-hidden="true" />
            Optimizing your resume with AI...
          </div>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import ResumeMatchAnalysis from '../ResumeMatchAnalysis.vue'
import TailorResumeResults from './TailorResumeResults.vue'
import { useJobOptimizer } from '~/composables/useJobOptimizer'
import { useResumeImport } from '~/composables/useResumeImport'
import { useToast } from '~/composables/useToast'
import { useFocusTrap } from '~/composables/useFocusTrap'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  resumeData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'apply-optimizations'])

const modalRef = ref(null)
const { trapFocus, releaseFocus } = useFocusTrap()
const { lockScroll, unlockScroll } = useBodyScrollLock()

const { analyzeResumeMatch, tailorResume, applyOptimizations, initializeTextareaHeights } = useJobOptimizer()
const { generateCurrentResumeText } = useResumeImport()
const { showInfo } = useToast()

// State
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

const originalContent = ref({
  summary: '',
  experience: [],
  skills: []
})

const optimizedContent = ref({
  summary: '',
  experience: [],
  skills: []
})

const editableOptimizedContent = ref({
  summary: '',
  experience: [],
  skills: []
})

const hasUserEdits = ref(false)

const handleUseCurrentResumeChange = () => {
  if (useCurrentResume.value) {
    resumeTextInput.value = generateCurrentResumeText(props.resumeData)
  }
}

const handleAnalyze = async () => {
  isAnalyzing.value = true
  showAnalysis.value = false

  const result = await analyzeResumeMatch(resumeTextInput.value, jobPostText.value, props.resumeData)
  
  isAnalyzing.value = false

  if (result) {
    analysisData.value = result
    showAnalysis.value = true
  }
}

const handleProceedToOptimization = async () => {
  isTailoring.value = true
  showResults.value = false

  const result = await tailorResume(resumeTextInput.value, jobPostText.value, props.resumeData)
  
  isTailoring.value = false

  if (result) {
    // Store original content
    originalContent.value = {
      summary: typeof props.resumeData.summary === 'string' ? props.resumeData.summary : props.resumeData.summary?.default || 'No summary available',
      experience: props.resumeData.experience || [],
      skills: props.resumeData.skills || []
    }
    
    // Store optimized content
    optimizedContent.value = result
    
    // Initialize editable content
    editableOptimizedContent.value = {
      summary: result.summary || '',
      experience: result.experience ? result.experience.map(exp => ({
        ...exp,
        achievements: [...(exp.achievements || [])]
      })) : [],
      skills: [...(result.skills || [])]
    }
    
    hasUserEdits.value = false
    showAnalysis.value = false
    showResults.value = true
    
    // Initialize textarea heights
    nextTick(() => {
      initializeTextareaHeights()
    })
  }
}

const handleCancelAnalysis = () => {
  showAnalysis.value = false
  analysisData.value = null
}

const handleReviseResume = () => {
  showAnalysis.value = false
  analysisData.value = null
  showInfo('Please update your resume to better match the job requirements, then analyze again.')
}

const updateSkillsFromText = (event) => {
  const text = event.target.value
  const skills = text
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0)
  editableOptimizedContent.value.skills = skills
  hasUserEdits.value = true
}

const handleApply = async () => {
  isApplying.value = true
  
  const updatedData = await applyOptimizations(editableOptimizedContent.value, resumeTextInput.value, props.resumeData)
  
  isApplying.value = false
  
  if (updatedData) {
    emit('apply-optimizations', updatedData)
    handleReset()
    emit('close')
  }
}

const handleReset = () => {
  showResults.value = false
  showAnalysis.value = false
  jobPostText.value = ''
  resumeTextInput.value = ''
  useCurrentResume.value = true
  isTailoring.value = false
  isApplying.value = false
  isAnalyzing.value = false
  analysisData.value = null
  originalContent.value = { summary: '', experience: [], skills: [] }
  optimizedContent.value = { summary: '', experience: [], skills: [] }
  editableOptimizedContent.value = { summary: '', experience: [], skills: [] }
  hasUserEdits.value = false
  showAnalysisInResults.value = false
}

const handleClose = () => {
  if (!isAnalyzing.value && !isTailoring.value && !isApplying.value) {
    handleReset()
    emit('close')
  }
}

// Watch for modal opening
watch(() => props.show, (newValue) => {
  if (newValue) {
    handleReset()
    lockScroll()
    nextTick(() => {
      if (useCurrentResume.value) {
        resumeTextInput.value = generateCurrentResumeText(props.resumeData)
      }
      if (modalRef.value) {
        trapFocus(modalRef.value)
      }
    })
  } else {
    unlockScroll()
    releaseFocus()
  }
})

// Escape key handler
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.show && !isAnalyzing.value && !isTailoring.value && !isApplying.value) {
      handleClose()
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    unlockScroll()
    releaseFocus()
  })
})
</script>

<style scoped>
/* Fullscreen Modal Styles */
.fullscreen-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 0;
}

.fullscreen-modal-content {
  background: white;
  border-radius: 0;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.fullscreen-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.privacy-warning-banner {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 16px 32px;
  display: flex;
  align-items: flex-start;
  color: #856404;
  font-size: 14px;
  line-height: 1.6;
}

.privacy-warning-banner p {
  margin: 0;
}

.privacy-warning-banner strong {
  color: #d32f2f;
}

.privacy-warning-banner a {
  color: #2196F3;
  text-decoration: none;
}

.privacy-warning-banner a:hover {
  text-decoration: underline;
}

.fullscreen-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 8px;
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.fullscreen-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}

.fullscreen-input {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  flex: 1;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  color: #1e293b;
  margin-bottom: 12px;
}

.fullscreen-textarea {
  flex: 1;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  font-family: inherit;
  transition: all 0.2s ease;
}

.fullscreen-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.fullscreen-textarea[readonly] {
  background: #f8fafc;
  color: #475569; /* 7.6:1 contrast - AAA compliant */
}

.checkbox-container {
  margin-top: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  color: #475569;
}

.ai-status {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: #1e40af;
  font-weight: 500;
  margin-bottom: 24px;
}

.fullscreen-actions {
  padding: 24px 32px;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
  background: white;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cancel-action {
  background: #475569; /* 7.6:1 contrast - AAA compliant */
  color: white;
}

.cancel-action:hover:not(:disabled) {
  background: #334155; /* Darker on hover */
}

.analyze-action {
  background: #6d28d9; /* 7.1:1 contrast - AAA compliant */
  color: white;
}

.analyze-action:hover:not(:disabled) {
  background: #5b21b6; /* Darker on hover */
}

.action-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
}

.fullscreen-analysis {
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .input-grid {
    grid-template-columns: 1fr;
  }
}
</style>

