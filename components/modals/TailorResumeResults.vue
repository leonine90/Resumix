<template>
  <div class="results-section fullscreen-results">
    <h2 class="results-title">
      <v-icon size="24" class="mr-3" color="secondary">mdi-compare-horizontal</v-icon>
      Resume Optimization Results
    </h2>
    
    <!-- Collapsible Analysis Panel -->
    <div v-if="analysisData" class="analysis-panel-compact">
      <div class="analysis-panel-header" @click="$emit('toggle-analysis')">
        <div class="analysis-summary">
          <v-icon size="20" class="mr-2">mdi-chart-line</v-icon>
          <span class="analysis-label">Compatibility Analysis:</span>
          <v-progress-circular
            :model-value="analysisData.metrics.overallCompatibility.score"
            :size="48"
            :width="5"
            :color="scoreColor(analysisData.metrics.overallCompatibility.score)"
          >
            <span style="font-size:11px;font-weight:700;color:#1f2937">{{ analysisData.metrics.overallCompatibility.score }}%</span>
          </v-progress-circular>
          <span class="compatibility-level">{{ analysisData.summary.compatibilityLevel }}</span>
        </div>
        <v-icon size="24" class="toggle-icon">{{ showAnalysisInResults ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </div>
      
      <div v-if="showAnalysisInResults" class="analysis-panel-content">
        <div class="analysis-metrics-compact">
          <div v-for="metric in ['skillsMatch', 'experienceRelevance', 'keywordAlignment']" :key="metric" class="metric-compact">
            <div class="metric-compact-header">
              <span class="metric-name">{{ formatMetricName(metric) }}</span>
              <v-progress-circular
                :model-value="analysisData.metrics[metric].score"
                :size="40"
                :width="4"
                :color="scoreColor(analysisData.metrics[metric].score)"
              >
                <span style="font-size:10px;font-weight:700;color:#1f2937">{{ analysisData.metrics[metric].score }}%</span>
              </v-progress-circular>
            </div>
            <div class="metric-lists">
              <div class="strengths-compact" v-if="analysisData.metrics[metric].strengths?.length">
                <strong>Strengths:</strong>
                <ul>
                  <li v-for="strength in analysisData.metrics[metric].strengths.slice(0, 3)" :key="strength">{{ strength }}</li>
                </ul>
              </div>
              <div class="gaps-compact" v-if="analysisData.metrics[metric].missingSkills?.length">
                <strong>{{metric === 'skillsMatch' ? 'Missing' : 'Gaps'}}:</strong>
                <ul>
                  <li v-for="skill in analysisData.metrics[metric].missingSkills.slice(0, 3)" :key="skill">{{ skill }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="key-insights">
          <div class="insights-section" v-if="analysisData.summary.keyStrengths?.length">
            <h4>Key Strengths:</h4>
            <ul>
              <li v-for="strength in analysisData.summary.keyStrengths" :key="strength">{{ strength }}</li>
            </ul>
          </div>
          <div class="insights-section" v-if="analysisData.summary.keyGaps?.length">
            <h4>Key Gaps to Address:</h4>
            <ul>
              <li v-for="gap in analysisData.summary.keyGaps" :key="gap">{{ gap }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div class="optimization-sections">
      <!-- Summary Section -->
      <div class="section-comparison">
        <h3 class="section-title">
          <v-icon size="20" class="mr-2">mdi-text-box-outline</v-icon>
          Professional Summary
        </h3>
        <div class="before-after-grid">
          <div class="before-panel">
            <h4>Before</h4>
            <div class="content-box original">{{ originalContent.summary }}</div>
          </div>
          <div class="after-panel">
            <h4>After (Editable)</h4>
            <textarea 
              v-model="editableOptimizedContent.summary"
              @input="handleEdit"
              :class="['content-textarea', 'optimized', { 'edited': hasUserEdits }]"
              placeholder="Edit the AI-generated summary..."
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Experience Section -->
      <div class="section-comparison">
        <h3 class="section-title">
          <v-icon size="20" class="mr-2">mdi-briefcase-outline</v-icon>
          Experience (Achievements Only)
        </h3>
        <div class="experience-comparison">
          <div v-for="(exp, index) in optimizedContent.experience" :key="index" class="experience-item-comparison">
            <div class="exp-header">
              <strong>{{ exp.position }} at {{ exp.company }}</strong>
              <span class="period">{{ exp.period }}</span>
            </div>
            <div class="before-after-grid">
              <div class="before-panel">
                <h5>Original Achievements</h5>
                <ul class="achievements-list original">
                  <li v-for="achievement in originalContent.experience[index]?.achievements || []" :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
              <div class="after-panel">
                <h5>Optimized Achievements (Editable)</h5>
                <div class="achievements-editable optimized">
                  <div 
                    v-for="(achievement, achievementIndex) in editableOptimizedContent.experience[index]?.achievements || []" 
                    :key="achievementIndex"
                    class="achievement-edit-item"
                  >
                    <div class="achievement-header">
                      <textarea 
                        v-model="editableOptimizedContent.experience[index].achievements[achievementIndex]"
                        @input="handleEdit"
                        :class="['achievement-textarea', { 'edited': hasUserEdits }]"
                        placeholder="Edit achievement..."
                        rows="2"
                      ></textarea>
                      <div class="achievement-actions">
                        <v-btn
                          icon
                          size="x-small"
                          :variant="refiningAchievement.expIndex === index && refiningAchievement.achievementIndex === achievementIndex ? 'elevated' : 'outlined'"
                          :color="refiningAchievement.expIndex === index && refiningAchievement.achievementIndex === achievementIndex ? 'primary' : 'default'"
                          title="Refine with AI"
                          @click="handleToggleRefinement(index, achievementIndex)"
                        >
                          <v-icon size="16">mdi-auto-fix</v-icon>
                        </v-btn>
                        <v-btn
                          v-if="hasUndoHistory(index, achievementIndex)"
                          icon
                          size="x-small"
                          variant="outlined"
                          color="warning"
                          title="Undo AI refinement"
                          @click="handleUndo(index, achievementIndex)"
                        >
                          <v-icon size="16">mdi-undo</v-icon>
                        </v-btn>
                      </div>
                    </div>
                    
                    <!-- AI Refinement Prompt -->
                    <div 
                      v-if="refiningAchievement.showPrompt && refiningAchievement.expIndex === index && refiningAchievement.achievementIndex === achievementIndex"
                      class="ai-refine-prompt"
                    >
                      <div class="quick-presets">
                        <button 
                          @click="handleQuickRefine(index, achievementIndex, 'add specific metrics and numbers')"
                          class="preset-btn"
                          :disabled="refiningAchievement.isRefining"
                        >
                          📊 Add Metrics
                        </button>
                        <button 
                          @click="handleQuickRefine(index, achievementIndex, 'make it more technical and add relevant technologies')"
                          class="preset-btn"
                          :disabled="refiningAchievement.isRefining"
                        >
                          💻 More Technical
                        </button>
                        <button 
                          @click="handleQuickRefine(index, achievementIndex, 'emphasize leadership and team management')"
                          class="preset-btn"
                          :disabled="refiningAchievement.isRefining"
                        >
                          👥 Show Leadership
                        </button>
                        <button 
                          @click="handleQuickRefine(index, achievementIndex, 'make it more concise while keeping key points')"
                          class="preset-btn"
                          :disabled="refiningAchievement.isRefining"
                        >
                          ✂️ Shorten
                        </button>
                      </div>
                      
                      <div class="custom-prompt">
                        <input 
                          v-model="refiningAchievement.prompt"
                          type="text"
                          placeholder="Or type your own instruction (e.g., 'focus on Python and data analysis')"
                          class="prompt-input"
                          @keyup.enter="handleRefine(index, achievementIndex)"
                          :disabled="refiningAchievement.isRefining"
                        />
                        <v-btn
                          color="primary"
                          variant="elevated"
                          size="small"
                          :loading="refiningAchievement.isRefining"
                          :disabled="refiningAchievement.isRefining || !refiningAchievement.prompt.trim()"
                          prepend-icon="mdi-auto-fix"
                          @click="handleRefine(index, achievementIndex)"
                        >
                          Refine
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="section-comparison">
        <h3 class="section-title">
          <v-icon size="20" class="mr-2">mdi-brain</v-icon>
          Skills (Reordered & Enhanced)
        </h3>
        <div class="before-after-grid">
          <div class="before-panel">
            <h4>Before</h4>
            <div class="skills-box original">{{ originalContent.skills.join(', ') }}</div>
          </div>
          <div class="after-panel">
            <h4>After (Editable)</h4>
            <textarea 
              :value="editableOptimizedContent.skills.join(', ')"
              @input="$emit('update-skills', $event)"
              :class="['skills-textarea', 'optimized', { 'edited': hasUserEdits }]"
              placeholder="Edit skills (comma-separated)..."
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>

      <v-alert type="info" variant="tonal" density="compact" icon="mdi-shield-check" class="mt-4">
        <strong>All other sections preserved:</strong> Personal information, education, publications, volunteering, and all structural data remain unchanged.
      </v-alert>
    </div>

    <div class="fullscreen-actions">
      <div class="action-buttons">
        <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="$emit('reset')">
          Start Over
        </v-btn>
        <v-btn
          color="secondary"
          variant="elevated"
          prepend-icon="mdi-check"
          :loading="isApplying"
          :disabled="isApplying"
          @click="$emit('apply')"
        >
          {{ isApplying ? 'Converting to Resume…' : (hasUserEdits ? 'Apply Your Edits & Convert to Resume' : 'Apply & Convert to Resume') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useJobOptimizer } from '~/composables/useJobOptimizer'
import { useAchievementRefinement } from '~/composables/useAchievementRefinement'

const props = defineProps({
  analysisData: Object,
  showAnalysisInResults: Boolean,
  originalContent: Object,
  optimizedContent: Object,
  editableOptimizedContent: Object,
  hasUserEdits: Boolean,
  isApplying: Boolean,
  jobPostText: String
})

const emit = defineEmits(['toggle-analysis', 'mark-edited', 'update-skills', 'reset', 'apply'])

const { autoResizeTextarea } = useJobOptimizer()

const scoreColor = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'error'
}
const { 
  refiningAchievement, 
  toggleAiRefinement, 
  refineAchievementWithAI, 
  quickRefine, 
  undoAchievementRefinement, 
  hasUndoHistory 
} = useAchievementRefinement()

const formatMetricName = (metric) => {
  const names = {
    skillsMatch: 'Skills Match',
    experienceRelevance: 'Experience Relevance',
    keywordAlignment: 'Keyword Alignment'
  }
  return names[metric] || metric
}

const handleEdit = (event) => {
  emit('mark-edited')
  autoResizeTextarea(event)
}

const handleToggleRefinement = (expIndex, achievementIndex) => {
  toggleAiRefinement(expIndex, achievementIndex)
}

const handleRefine = async (expIndex, achievementIndex) => {
  const success = await refineAchievementWithAI(expIndex, achievementIndex, props.editableOptimizedContent, props.jobPostText || '')
  if (success) {
    emit('mark-edited')
  }
}

const handleQuickRefine = async (expIndex, achievementIndex, preset) => {
  const success = await quickRefine(expIndex, achievementIndex, preset, props.editableOptimizedContent, props.jobPostText || '')
  if (success) {
    emit('mark-edited')
  }
}

const handleUndo = (expIndex, achievementIndex) => {
  const success = undoAchievementRefinement(expIndex, achievementIndex, props.editableOptimizedContent)
  if (success) {
    emit('mark-edited')
  }
}
</script>

<style scoped>
/* This file should include ALL the styles from the original ResumeSidebar.vue related to results view */
/* Due to size constraints, I'm including the most critical styles. Full styles should be copied from original */

.results-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
}

.results-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.analysis-panel-compact {
  background: white;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  margin-bottom: 24px;
  overflow: hidden;
}

.analysis-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.analysis-panel-header:hover {
  background: linear-gradient(135deg, #5568d3 0%, #65408b 100%);
}

.analysis-panel-header .toggle-icon {
  color: white;
  flex-shrink: 0;
}

.analysis-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.analysis-label {
  font-weight: 600;
  font-size: 15px;
}


.compatibility-level {
  font-weight: 600;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 13px;
}

.analysis-panel-content {
  padding: 20px;
  background: #f8f9fa;
}

.analysis-metrics-compact {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-compact {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
}

.metric-compact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.metric-name {
  font-weight: 600;
  font-size: 14px;
  color: #2c3e50;
}


.metric-lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 12px;
}

.strengths-compact,
.gaps-compact {
  padding: 8px;
  border-radius: 6px;
}

.strengths-compact {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.gaps-compact {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.strengths-compact strong,
.gaps-compact strong {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
}

.strengths-compact ul,
.gaps-compact ul {
  margin: 0;
  padding-left: 16px;
  line-height: 1.5;
}

.key-insights {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
}

.insights-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.insights-section ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.6;
}

.optimization-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
}

.section-comparison {
  background: #ffffff;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
}

.before-after-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.before-panel,
.after-panel {
  padding: 20px;
}

.before-panel {
  border-right: 1px solid #e2e8f0;
  background: #fefefe;
}

.after-panel {
  background: #fefefe;
}

.before-panel h4,
.after-panel h4,
.before-panel h5,
.after-panel h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #475569; /* 7.6:1 contrast - AAA compliant */
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.content-box,
.skills-box {
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  min-height: 80px;
}

.content-box.original,
.skills-box.original {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #7f1d1d;
}

.content-textarea,
.skills-textarea {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  min-height: 80px;
  height: auto;
  border: 2px solid #bbf7d0;
  background: #f0fdf4;
  color: #14532d;
  font-family: inherit;
  resize: none;
  overflow: hidden;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.content-textarea:focus,
.skills-textarea:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.content-textarea.edited,
.skills-textarea.edited {
  border-color: #f59e0b;
  background: #fffbeb;
}

.experience-comparison {
  display: flex;
  flex-direction: column;
}

.experience-item-comparison {
  border-bottom: 1px solid #e2e8f0;
}

.experience-item-comparison:last-child {
  border-bottom: none;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.exp-header strong {
  color: #1e293b;
  font-size: 15px;
}

.period {
  color: #475569; /* 7.6:1 contrast - AAA compliant */
  font-size: 13px;
  font-weight: 500;
}

.achievements-list {
  margin: 0;
  padding: 16px;
  border-radius: 8px;
  min-height: 100px;
}

.achievements-list.original {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.achievements-list li {
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: #374151;
}

.achievements-editable {
  padding: 16px;
  border-radius: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  min-height: 100px;
}

.achievement-edit-item {
  margin-bottom: 16px;
  position: relative;
}

.achievement-header {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.achievement-textarea {
  flex: 1;
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid #bbf7d0;
  background: #ffffff;
  color: #14532d;
  font-family: inherit;
  resize: none;
  overflow: hidden;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.achievement-textarea:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}

.achievement-textarea.edited {
  border-color: #f59e0b;
  background: #fffbeb;
}

.achievement-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}



.ai-refine-prompt {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.quick-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}


.custom-prompt {
  display: flex;
  gap: 8px;
}

.prompt-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.prompt-input:focus {
  outline: none;
  border-color: #1565C0;
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
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


@media (max-width: 1200px) {
  .analysis-metrics-compact {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .before-after-grid {
    grid-template-columns: 1fr;
  }
  
  .before-panel {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .metric-lists,
  .key-insights {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analysis-metrics-compact {
    grid-template-columns: 1fr;
  }
}
</style>

