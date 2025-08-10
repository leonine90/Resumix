<template>
  <div class="match-analysis">
    <div class="analysis-header">
      <h3 class="analysis-title">
        <Icon icon="material-symbols:analytics" style="font-size: 20px; margin-right: 8px;" />
        Resume-Job Compatibility Analysis
      </h3>
      <p class="analysis-subtitle">
        {{ analysisData.summary.compatibilityLevel }} compatibility level - {{ analysisData.summary.recommendation }}
      </p>
    </div>

    <div class="metrics-grid">
      <!-- Overall section moved to top -->
      <div class="metric-card overall">
        <div class="metric-header">
          <h4>Overall Compatibility</h4>
          <div class="score-circle overall-score" :style="getCircleStyle(analysisData.metrics.overallCompatibility.score)">
            <span class="score-text">{{ analysisData.metrics.overallCompatibility.score }}%</span>
          </div>
        </div>
        <p class="metric-explanation">{{ analysisData.metrics.overallCompatibility.explanation }}</p>
        <div class="metric-details">
          <div class="strengths">
            <h5>Key Strengths:</h5>
            <ul>
              <li v-for="strength in analysisData.summary.keyStrengths" :key="strength">{{ strength }}</li>
            </ul>
          </div>
          <div class="gaps">
            <h5>Key Gaps:</h5>
            <ul>
              <li v-for="gap in analysisData.summary.keyGaps" :key="gap">{{ gap }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Collapsible: Skills Match -->
      <div class="metric-card collapsible">
        <div class="metric-header clickable" @click="toggleMetric('skillsMatch')">
          <div class="metric-title">
            <Icon :icon="expanded.skillsMatch ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" class="toggle-icon" />
            <h4>Skills Match</h4>
          </div>
          <div class="score-circle" :style="getCircleStyle(analysisData.metrics.skillsMatch.score)">
            <span class="score-text">{{ analysisData.metrics.skillsMatch.score }}%</span>
          </div>
        </div>
        <div v-if="expanded.skillsMatch" class="collapsible-content">
          <p class="metric-explanation">{{ analysisData.metrics.skillsMatch.explanation }}</p>
          <div class="metric-details">
            <div class="strengths">
              <h5>Strengths:</h5>
              <ul>
                <li v-for="strength in analysisData.metrics.skillsMatch.strengths" :key="strength">{{ strength }}</li>
              </ul>
            </div>
            <div class="gaps">
              <h5>Missing Skills:</h5>
              <ul>
                <li v-for="skill in analysisData.metrics.skillsMatch.missingSkills" :key="skill">{{ skill }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Collapsible: Experience Relevance -->
      <div class="metric-card collapsible">
        <div class="metric-header clickable" @click="toggleMetric('experienceRelevance')">
          <div class="metric-title">
            <Icon :icon="expanded.experienceRelevance ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" class="toggle-icon" />
            <h4>Experience Relevance</h4>
          </div>
          <div class="score-circle" :style="getCircleStyle(analysisData.metrics.experienceRelevance.score)">
            <span class="score-text">{{ analysisData.metrics.experienceRelevance.score }}%</span>
          </div>
        </div>
        <div v-if="expanded.experienceRelevance" class="collapsible-content">
          <p class="metric-explanation">{{ analysisData.metrics.experienceRelevance.explanation }}</p>
          <div class="metric-details">
            <div class="strengths">
              <h5>Strengths:</h5>
              <ul>
                <li v-for="strength in analysisData.metrics.experienceRelevance.strengths" :key="strength">{{ strength }}</li>
              </ul>
            </div>
            <div class="gaps">
              <h5>Areas to Improve:</h5>
              <ul>
                <li v-for="skill in analysisData.metrics.experienceRelevance.missingSkills" :key="skill">{{ skill }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Collapsible: Keyword Alignment -->
      <div class="metric-card collapsible">
        <div class="metric-header clickable" @click="toggleMetric('keywordAlignment')">
          <div class="metric-title">
            <Icon :icon="expanded.keywordAlignment ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" class="toggle-icon" />
            <h4>Keyword Alignment</h4>
          </div>
          <div class="score-circle" :style="getCircleStyle(analysisData.metrics.keywordAlignment.score)">
            <span class="score-text">{{ analysisData.metrics.keywordAlignment.score }}%</span>
          </div>
        </div>
        <div v-if="expanded.keywordAlignment" class="collapsible-content">
          <p class="metric-explanation">{{ analysisData.metrics.keywordAlignment.explanation }}</p>
          <div class="metric-details">
            <div class="strengths">
              <h5>Strengths:</h5>
              <ul>
                <li v-for="strength in analysisData.metrics.keywordAlignment.strengths" :key="strength">{{ strength }}</li>
              </ul>
            </div>
            <div class="gaps">
              <h5>Missing Keywords:</h5>
              <ul>
                <li v-for="skill in analysisData.metrics.keywordAlignment.missingSkills" :key="skill">{{ skill }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Low compatibility warning -->
    <div v-if="analysisData.metrics.overallCompatibility.score < 65" class="low-compatibility-warning">
      <Icon icon="material-symbols:warning" style="font-size: 20px; margin-right: 8px;" />
      <div class="warning-content">
        <h4>Low Compatibility Detected</h4>
        <p>Your resume has a {{ analysisData.metrics.overallCompatibility.score }}% compatibility with this job. 
           Optimization may not be effective with such low alignment. Consider revising your resume to better match 
           the job requirements before optimizing.</p>
      </div>
    </div>

    <div class="analysis-actions">
      <button 
        @click="$emit('cancel')" 
        :disabled="isOptimizing"
        class="cancel-btn"
      >
        <Icon icon="material-symbols:close" style="font-size: 16px; margin-right: 8px;" />
        Cancel
      </button>
      
      <!-- Show different button based on compatibility score -->
      <button 
        v-if="analysisData.metrics.overallCompatibility.score >= 65"
        @click="$emit('proceed')" 
        :disabled="isOptimizing"
        class="proceed-btn"
        :class="{ 'optimizing': isOptimizing }"
      >
        <Icon 
          :icon="isOptimizing ? 'material-symbols:hourglass-top' : 'material-symbols:psychology'" 
          style="font-size: 16px; margin-right: 8px;" 
        />
        {{ isOptimizing ? 'Optimizing...' : 'Proceed with Optimization' }}
      </button>
      
      <button 
        v-else
        @click="$emit('revise')" 
        class="revise-btn"
      >
        <Icon icon="material-symbols:edit-document" style="font-size: 16px; margin-right: 8px;" />
        Revise Resume & Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const props = defineProps({
  analysisData: {
    type: Object,
    required: true
  },
  isOptimizing: {
    type: Boolean,
    default: false
  }
})

defineEmits(['proceed', 'cancel', 'revise'])

// Collapsible state
const expanded = ref({
  skillsMatch: false,
  experienceRelevance: false,
  keywordAlignment: false
})

const toggleMetric = (metric) => {
  const areAllExpanded = Object.values(expanded.value).every(isExpanded => isExpanded)
  const areAllCollapsed = Object.values(expanded.value).every(isExpanded => !isExpanded)
  
  if (areAllCollapsed) {
    // If all are collapsed, expand all
    Object.keys(expanded.value).forEach(key => {
      expanded.value[key] = true
    })
  } else {
    // If any are expanded (or all are expanded), collapse all
    Object.keys(expanded.value).forEach(key => {
      expanded.value[key] = false
    })
  }
}

const getCircleStyle = (score) => {
  const percentage = Math.max(0, Math.min(100, Number(score) || 0)) / 100
  let color
  if (percentage >= 0.8) color = '#16a34a' // green-600
  else if (percentage >= 0.6) color = '#f59e0b' // amber-500
  else color = '#dc2626' // red-600

  const deg = `${percentage * 360}deg`
  return {
    '--deg': deg,
    background: `conic-gradient(${color} ${deg}, #e9ecef 0deg)`
  }
}
</script>

<style scoped>
.match-analysis {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 24px;
}

.analysis-header {
  text-align: center;
  margin-bottom: 32px;
}

.analysis-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-subtitle {
  font-size: 16px;
  color: #6c757d;
  margin: 0;
  font-style: italic;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.metric-card.overall {
  grid-column: 1 / -1;
  background: #ffffff;
  border-left: 4px solid #764ba2;
}

.metric-card.collapsible .metric-header {
  margin-bottom: 0;
}

.metric-card.collapsible .collapsible-content {
  margin-top: 16px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-header.clickable {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  padding: 8px;
  margin: -8px;
}

.metric-header.clickable:hover {
  background-color: #f8f9fa;
}

.metric-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-icon {
  font-size: 20px;
  color: #6c757d;
  transition: transform 0.2s ease;
}

.metric-header h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.score-circle {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-circle::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
}

.score-text {
  position: relative;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  z-index: 1;
}

.metric-explanation {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 16px;
  line-height: 1.5;
}

.metric-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.strengths h5,
.gaps h5 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.strengths h5 { color: #28a745; }
.gaps h5 { color: #dc3545; }

.strengths ul,
.gaps ul {
  margin: 0;
  padding-left: 16px;
  font-size: 13px;
  line-height: 1.4;
}

.strengths li { color: #28a745; }
.gaps li { color: #dc3545; }

.analysis-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.proceed-btn,
.cancel-btn,
.revise-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.proceed-btn { background: #28a745; color: white; }
.proceed-btn:hover:not(:disabled) { background: #218838; transform: translateY(-1px); }
.proceed-btn.optimizing { background: #f59e0b; }
.proceed-btn:disabled { background: #cbd5e1; color: #9ca3af; cursor: not-allowed; }

.cancel-btn { background: #6c757d; color: white; }
.cancel-btn:hover:not(:disabled) { background: #5a6268; transform: translateY(-1px); }
.cancel-btn:disabled { background: #cbd5e1; color: #9ca3af; cursor: not-allowed; }

.revise-btn { background: #dc3545; color: white; }
.revise-btn:hover { background: #c82333; transform: translateY(-1px); }

.low-compatibility-warning {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-left: 4px solid #f39c12;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  color: #856404;
}

.warning-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #856404;
}

.warning-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #856404;
}

@media (max-width: 768px) {
  .metrics-grid { grid-template-columns: 1fr; }
  .metric-details { grid-template-columns: 1fr; }
  .analysis-actions { flex-direction: column; }
}
</style>