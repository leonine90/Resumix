<template>
  <div class="results-section fullscreen-results">
    <h2 class="results-title">
      <Icon icon="material-symbols:compare-arrows" style="font-size: 24px; margin-right: 12px;" />
      Resume Optimization Results
    </h2>
    
    <!-- Collapsible Analysis Panel -->
    <div v-if="analysisData" class="analysis-panel-compact">
      <div class="analysis-panel-header" @click="$emit('toggle-analysis')">
        <div class="analysis-summary">
          <Icon icon="material-symbols:analytics" style="font-size: 20px; margin-right: 8px;" />
          <span class="analysis-label">Compatibility Analysis:</span>
          <div class="score-badge" :style="getCircleStyle(analysisData.metrics.overallCompatibility.score)">
            <span class="score-badge-text">{{ analysisData.metrics.overallCompatibility.score }}%</span>
          </div>
          <span class="compatibility-level">{{ analysisData.summary.compatibilityLevel }}</span>
        </div>
        <Icon 
          :icon="showAnalysisInResults ? 'material-symbols:expand-less' : 'material-symbols:expand-more'" 
          class="toggle-icon"
          style="font-size: 24px;"
        />
      </div>
      
      <div v-if="showAnalysisInResults" class="analysis-panel-content">
        <div class="analysis-metrics-compact">
          <div v-for="metric in ['skillsMatch', 'experienceRelevance', 'keywordAlignment']" :key="metric" class="metric-compact">
            <div class="metric-compact-header">
              <span class="metric-name">{{ formatMetricName(metric) }}</span>
              <div class="score-badge-small" :style="getCircleStyle(analysisData.metrics[metric].score)">
                <span class="score-badge-text-small">{{ analysisData.metrics[metric].score }}%</span>
              </div>
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
          <Icon icon="material-symbols:summarize" style="font-size: 20px; margin-right: 8px;" />
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
          <Icon icon="material-symbols:work" style="font-size: 20px; margin-right: 8px;" />
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
                        <button 
                          @click="handleToggleRefinement(index, achievementIndex)"
                          class="ai-refine-btn"
                          :class="{ 'active': refiningAchievement.expIndex === index && refiningAchievement.achievementIndex === achievementIndex }"
                          title="Refine with AI"
                        >
                          <Icon icon="material-symbols:auto-awesome" style="font-size: 16px;" />
                        </button>
                        <button 
                          v-if="hasUndoHistory(index, achievementIndex)"
                          @click="handleUndo(index, achievementIndex)"
                          class="undo-btn"
                          title="Undo AI refinement"
                        >
                          <Icon icon="material-symbols:undo" style="font-size: 16px;" />
                        </button>
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
                        <button 
                          @click="handleRefine(index, achievementIndex)"
                          class="refine-submit-btn"
                          :disabled="refiningAchievement.isRefining || !refiningAchievement.prompt.trim()"
                        >
                          <Icon v-if="!refiningAchievement.isRefining" icon="material-symbols:auto-awesome" style="font-size: 16px; margin-right: 4px;" />
                          <Icon v-else icon="svg-spinners:ring-resize" style="font-size: 16px; margin-right: 4px;" />
                          {{ refiningAchievement.isRefining ? 'Refining...' : 'Refine' }}
                        </button>
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
          <Icon icon="material-symbols:psychology" style="font-size: 20px; margin-right: 8px;" />
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

      <div class="preservation-notice">
        <Icon icon="material-symbols:shield" style="font-size: 20px; margin-right: 8px;" />
        <strong>All other sections preserved:</strong> Personal information, education, publications, volunteering, and all structural data remain unchanged.
      </div>
    </div>

    <div class="fullscreen-actions">
      <div class="action-buttons">
        <button @click="$emit('reset')" class="action-btn cancel-action">
          <Icon icon="material-symbols:refresh" style="font-size: 16px; margin-right: 8px;" />
          Start Over
        </button>
        <button @click="$emit('apply')" class="action-btn apply-action" :disabled="isApplying">
          <Icon icon="material-symbols:check" style="font-size: 16px; margin-right: 8px;" />
          {{ isApplying ? 'Converting to Resume...' : (hasUserEdits ? 'Apply Your Edits & Convert to Resume' : 'Apply & Convert to Resume') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
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

const { getCircleStyle, autoResizeTextarea } = useJobOptimizer()
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

.score-badge {
  position: relative;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  aspect-ratio: 1/1;
}

.score-badge::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
}

.score-badge-text {
  position: relative;
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
  z-index: 1;
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

.score-badge-small {
  position: relative;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  aspect-ratio: 1/1;
}

.score-badge-small::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
}

.score-badge-text-small {
  position: relative;
  font-size: 11px;
  font-weight: 700;
  color: #1f2937;
  z-index: 1;
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
  color: #64748b;
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
  color: #64748b;
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

.ai-refine-btn,
.undo-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #666;
}

.ai-refine-btn:hover,
.undo-btn:hover {
  background: #f5f5f5;
  border-color: #007bff;
  color: #007bff;
}

.ai-refine-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.undo-btn {
  border-color: #ffc107;
}

.undo-btn:hover {
  background: #fff8e1;
  border-color: #ffa000;
  color: #f57c00;
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

.preset-btn {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover:not(:disabled) {
  background: #e7f3ff;
  border-color: #007bff;
  color: #007bff;
}

.preset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.refine-submit-btn {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: all 0.2s;
}

.refine-submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.refine-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.preservation-notice {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: #1e40af;
  font-size: 14px;
  margin-top: 24px;
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
  background: #64748b;
  color: white;
}

.cancel-action:hover:not(:disabled) {
  background: #475569;
}

.apply-action {
  background: #10b981;
  color: white;
}

.apply-action:hover:not(:disabled) {
  background: #059669;
}

.action-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
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

