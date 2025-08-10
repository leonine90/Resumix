<template>
  <div>
    <div class="resume-sidebar" :class="{ collapsed: isCollapsed }">
    <SidebarHeader 
      :is-collapsed="isCollapsed" 
      @toggle-sidebar="toggleSidebar" 
    />
    
    <div v-if="!isCollapsed" class="sidebar-content">
      <!-- Header Elements Control -->
      <div class="control-section">
        <div class="section-header" @click="toggleHeaderSection">
          <Icon class="section-icon" icon="material-symbols:person" style="font-size: 16px;" />
          <span class="section-title">Header Elements</span>
          <Icon class="toggle-icon" :icon="headerSectionOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" style="font-size: 12px;" />
        </div>
        <div v-if="headerSectionOpen" class="section-content">
          <label v-for="(visible, element) in headerElements" :key="element" class="control-item">
            <input 
              type="checkbox" 
              :checked="visible" 
              @change="toggleHeaderElement(element, $event.target.checked)"
              class="checkbox-input"
            >
            <span class="element-name">{{ formatElementName(element) }}</span>
          </label>
          <div class="control-item disabled">
            <span class="element-name">Name (Always Visible)</span>
          </div>
          <div class="control-item disabled">
            <span class="element-name">Title (Always Visible)</span>
          </div>
          
                <!-- Headshot URL Input -->
      <div v-if="headerElements.headshot" class="headshot-input">
        <label class="input-label">Headshot URL:</label>
        <input 
          type="url" 
          :value="personal?.headshot || ''" 
          @input="updateHeadshotUrl"
          placeholder="https://example.com/image.jpg"
          class="url-input"
        >
        <small class="input-help">Paste an image URL to display your headshot</small>
      </div>
    </div>
  </div>

      <!-- Resume Sections Control -->
      <div class="control-section">
        <div class="section-header" @click="toggleSectionsSection">
          <Icon class="section-icon" icon="material-symbols:description" style="font-size: 16px;" />
          <span class="section-title">Resume Sections</span>
          <Icon class="toggle-icon" :icon="sectionsSectionOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" style="font-size: 12px;" />
        </div>
        <div v-if="sectionsSectionOpen" class="section-content">
          <div 
            v-for="section in sectionOrder" 
            :key="section" 
            class="control-item draggable-section"
            :draggable="section !== 'summary' && section !== 'signature'"
            @dragstart="handleDragStart($event, section)"
            @dragover="handleDragOver($event)"
            @drop="handleDrop($event, section)"
            @dragenter="handleDragEnter($event, section)"
            @dragleave="handleDragLeave($event)"
            :class="{ 'drag-over': dragOverSection === section }"
          >
            <div class="drag-handle" :class="{ 'disabled': section === 'summary' || section === 'signature' }">
              <Icon icon="material-symbols:drag-handle" style="font-size: 16px; color: #64748b;" />
            </div>
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                :checked="sections[section]" 
                @change="toggleSection(section, $event.target.checked)"
                class="checkbox-input"
              >
              <span class="section-name">{{ formatSectionName(section) }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Import & Export Section -->
      <div class="control-section">
        <div class="section-header" @click="toggleImportExportSection">
          <Icon class="section-icon" icon="material-symbols:upload-file" style="font-size: 16px;" />
          <span class="section-title">Import & Export</span>
          <Icon class="toggle-icon" :icon="importExportSectionOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" style="font-size: 12px;" />
        </div>
        <div v-if="importExportSectionOpen" class="section-content">
          <div class="section-header-with-info">
            <span class="section-subtitle">Export & Import</span>
            <button class="info-btn" @click="showInfoModal = true" title="Learn about using AI to generate resumes">
              <Icon icon="material-symbols:info-outline" style="font-size: 16px;" />
            </button>
          </div>
          <button class="export-btn" @click="exportData">
            <Icon icon="material-symbols:file-download" style="font-size: 14px;" />
            Export as JSON
          </button>
          <button class="import-btn hidden-feature" @click="showImportModal = true">
            <Icon icon="material-symbols:file-upload" style="font-size: 14px;" />
            Import from JSON
          </button>
          <button class="ai-import-btn" @click="showAiImportModal = true">
            <Icon icon="material-symbols:file-upload" style="font-size: 14px;" />
            Import Resume
          </button>
          <small class="export-help">Export current data or import resume from text</small>
        </div>
      </div>

      <!-- Job Optimizer Section -->
      <div class="control-section">
        <div class="section-header" @click="toggleJobOptimizerSection">
          <Icon class="section-icon" icon="material-symbols:work" style="font-size: 16px;" />
          <span class="section-title">Job Optimizer</span>
          <Icon class="toggle-icon" :icon="jobOptimizerSectionOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" style="font-size: 12px;" />
        </div>
        <div v-if="jobOptimizerSectionOpen" class="section-content">
          <div class="section-header-with-info">
            <span class="section-subtitle">AI Resume Tailoring</span>
            <button class="info-btn" @click="showOptimizerInfoModal = true" title="Learn about AI resume optimization">
              <Icon icon="material-symbols:info-outline" style="font-size: 16px;" />
            </button>
          </div>
          <button class="tailor-btn" @click="showTailorModal = true">
            <Icon icon="material-symbols:psychology" style="font-size: 14px;" />
            Tailor for Job Post
          </button>
          <small class="tailor-help">Optimize your resume content to match specific job requirements using AI</small>
        </div>
      </div>

      <!-- Cover Letter Generator Section -->
      <div class="control-section">
        <div class="section-header" @click="toggleCoverLetterSection">
          <Icon class="section-icon" icon="material-symbols:description" style="font-size: 16px;" />
          <span class="section-title">Cover Letter</span>
          <Icon class="toggle-icon" :icon="coverLetterSectionOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" style="font-size: 12px;" />
        </div>
        <div v-if="coverLetterSectionOpen" class="section-content">
          <div class="section-header-with-info">
            <span class="section-subtitle">AI Cover Letter Creation</span>
            <button class="info-btn" @click="showCoverLetterInfoModal = true" title="Learn about AI cover letter generation">
              <Icon icon="material-symbols:info-outline" style="font-size: 16px;" />
            </button>
          </div>
          <button class="cover-letter-btn" @click="showCoverLetterModal = true">
            <Icon icon="material-symbols:description" style="font-size: 14px;" />
            Generate Cover Letter
          </button>
          <small class="cover-letter-help">Create professional cover letters tailored to specific job postings using AI</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Import Modal -->
  <div v-if="showAiImportModal" class="fullscreen-modal-overlay">
    <div class="fullscreen-modal-content" @click.stop>
      <div class="fullscreen-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:upload-file" style="font-size: 24px; margin-right: 12px;" />
            <h1>Import Resume</h1>
          </div>
          <button class="close-btn" @click="showAiImportModal = false">
            <Icon icon="material-symbols:close" style="font-size: 24px;" />
          </button>
        </div>
      </div>
      <div class="fullscreen-body">
        <!-- Horizontal Layout Container -->
        <div class="import-layout">
          <!-- File Upload Section -->
          <div class="upload-section">
            <label class="modal-label">Upload Resume File:</label>
            <div 
              class="file-upload-area"
              :class="{ 'drag-over': isDragOver, 'has-file': uploadedFile }"
              @drop="handleFileDrop"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @click="triggerFileInput"
            >
              <input 
                ref="fileInput"
                type="file" 
                accept=".txt,.rtf,.doc,.docx,.pdf"
                @change="handleFileSelect"
                style="display: none;"
              />
              <div class="upload-content">
                <Icon icon="material-symbols:cloud-upload" style="font-size: 48px; color: #666; margin-bottom: 16px;" />
                <p class="upload-text">
                  <span v-if="!uploadedFile">Drag and drop your resume file here, or click to browse</span>
                  <span v-else class="file-name">{{ uploadedFile.name }}</span>
                </p>
                <p class="upload-hint">Supported formats: .txt, .rtf, .doc, .docx, .pdf</p>
                <button v-if="uploadedFile" class="remove-file-btn" @click.stop="removeFile">
                  <Icon icon="material-symbols:delete" style="font-size: 16px;" />
                  Remove File
                </button>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="modal-divider">
            <span>or</span>
          </div>

          <!-- Text Input Section -->
          <div class="text-section">
            <label class="modal-label">Paste your resume text or JSON:</label>
            <textarea 
              v-model="resumeText"
              class="modal-textarea"
              placeholder="Paste your resume text (from Word, PDF, etc.) or valid JSON resume data here..."
              rows="8"
            ></textarea>
          </div>
        </div>

        <div class="ai-status" v-if="isProcessing">
          <Icon icon="material-symbols:hourglass-top" style="font-size: 16px; margin-right: 8px;" />
          Processing...
        </div>
        
        <div class="fullscreen-actions">
          <div class="action-buttons">
            <button @click="showAiImportModal = false" class="action-btn cancel-action" :disabled="isProcessing">
              <Icon icon="material-symbols:close" style="font-size: 16px; margin-right: 8px;" />
              Cancel
            </button>
            <button @click="processWithAI" :disabled="(!resumeText.trim() && !uploadedFile) || isProcessing" class="action-btn optimize-action">
              <Icon icon="material-symbols:upload" style="font-size: 16px; margin-right: 8px;" />
              Import Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Import Modal -->
  <div v-if="showImportModal" class="modal-overlay" @click="showImportModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:code" style="font-size: 20px; margin-right: 8px;" />
            <h3>Import Resume Data</h3>
          </div>
          <button class="modal-close" @click="showImportModal = false">
            <Icon icon="material-symbols:close" style="font-size: 20px;" />
          </button>
        </div>
      </div>
      <div class="modal-body">
        <label class="modal-label">Paste JSON data:</label>
        <textarea 
          v-model="importJsonText"
          class="modal-textarea"
          placeholder="Paste your JSON data here..."
          rows="15"
        ></textarea>
        <div class="modal-actions">
          <button @click="showImportModal = false" class="cancel-btn">Cancel</button>
          <button @click="importData" :disabled="!importJsonText.trim()" class="submit-btn">Import Data</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Info Modal -->
  <div v-if="showInfoModal" class="modal-overlay" @click="showInfoModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:info" style="font-size: 20px; margin-right: 8px;" />
            <h3>Using AI to Generate a Resume</h3>
          </div>
          <button class="modal-close" @click="showInfoModal = false">
            <Icon icon="material-symbols:close" style="font-size: 20px;" />
          </button>
        </div>
      </div>
      <div class="modal-body">
        <div class="info-content">
          <p>This application now includes a smart import feature that can handle file uploads, resume text, and JSON data. For more advanced customization, you can also use external AI tools.</p>
          
          <div class="step-list">
            <div class="step-item">
              <span class="step-number">1</span>
              <div class="step-content">
                <strong>File Upload:</strong> Drag and drop or browse to upload resume files (.txt, .rtf, .doc, .docx, .pdf). The system will extract text and process it automatically.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">2</span>
              <div class="step-content">
                <strong>Text Import:</strong> Use the "Import Resume" button to paste any resume text directly. The system will automatically convert it to the correct format.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">3</span>
              <div class="step-content">
                <strong>JSON Import:</strong> If you have valid JSON resume data (exported from this app or generated by AI), paste it directly in the Import Resume field. It will be detected and imported instantly.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">4</span>
              <div class="step-content">
                <strong>External AI (Advanced):</strong> Export your current resume as JSON, provide it to ChatGPT/Claude/Gemini along with your content, ask for a new JSON structure, then import the result.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tailor Resume Modal -->
  <div v-if="showTailorModal" class="fullscreen-modal-overlay">
    <div class="fullscreen-modal-content" @click.stop>
      <div class="fullscreen-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:psychology" style="font-size: 24px; margin-right: 12px;" />
            <h1>AI Resume Optimizer</h1>
          </div>
          <button class="close-btn" @click="showTailorModal = false">
            <Icon icon="material-symbols:close" style="font-size: 24px;" />
          </button>
        </div>
      </div>
      <div class="fullscreen-body">
        <!-- Input Section -->
        <div v-if="!showAnalysis && !showResults" class="input-section fullscreen-input">
          <div class="input-grid">
            <div class="input-group">
              <label class="input-label">
                <Icon icon="material-symbols:description" style="font-size: 18px; margin-right: 8px;" />
                Your Resume Text
              </label>
              <textarea 
                v-model="resumeTextInput"
                class="fullscreen-textarea"
                :readonly="useCurrentResume"
                placeholder="Paste your resume text here (from Word, PDF, or any format)..."
              ></textarea>
              <div class="checkbox-container">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="useCurrentResume"
                    @change="handleUseCurrentResumeChange"
                    class="checkbox-input"
                  />
                  <span class="checkbox-text">
                    Use current resume data
                  </span>
                </label>
              </div>
            </div>
            
            <div class="input-group">
              <label class="input-label">
                <Icon icon="material-symbols:work" style="font-size: 18px; margin-right: 8px;" />
                Job Posting
              </label>
              <textarea 
                v-model="jobPostText"
                class="fullscreen-textarea"
                placeholder="Paste the job posting here..."
              ></textarea>
            </div>
          </div>

          <div class="ai-status" v-if="isAnalyzing">
            <Icon icon="material-symbols:analytics" style="font-size: 16px; margin-right: 8px;" />
            Analyzing resume-job compatibility...
          </div>

          <div class="fullscreen-actions">
            <div class="action-buttons">
              <button @click="showTailorModal = false" class="action-btn cancel-action" :disabled="isAnalyzing">
                <Icon icon="material-symbols:close" style="font-size: 16px; margin-right: 8px;" />
                Cancel
              </button>
              <button @click="analyzeResumeMatch" :disabled="!jobPostText.trim() || !resumeTextInput.trim() || isAnalyzing" class="action-btn analyze-action">
                <Icon icon="material-symbols:analytics" style="font-size: 16px; margin-right: 8px;" />
                Analyze Compatibility
              </button>
            </div>
          </div>
        </div>

        <!-- Analysis Section -->
        <div v-if="showAnalysis" class="analysis-section fullscreen-analysis">
          <ResumeMatchAnalysis 
            :analysis-data="analysisData"
            @proceed="proceedToOptimization"
            @cancel="cancelAnalysis"
            @revise="reviseResume"
            :is-optimizing="isTailoring"
          />
          <div class="ai-status" v-if="isTailoring">
            <Icon icon="material-symbols:hourglass-top" style="font-size: 16px; margin-right: 8px;" />
            Optimizing your resume with AI...
          </div>
        </div>

        <div v-if="showResults" class="results-section fullscreen-results">
          <h2 class="results-title">
            <Icon icon="material-symbols:compare-arrows" style="font-size: 24px; margin-right: 12px;" />
            Resume Optimization Results
          </h2>
          
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
                    @input="markAsEdited; autoResizeTextarea($event)"
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
                          <textarea 
                            v-model="editableOptimizedContent.experience[index].achievements[achievementIndex]"
                            @input="markAsEdited; autoResizeTextarea($event)"
                            :class="['achievement-textarea', { 'edited': hasUserEdits }]"
                            placeholder="Edit achievement..."
                            rows="2"
                          ></textarea>
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
                      @input="updateSkillsFromText; autoResizeTextarea($event)"
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
              <button @click="resetTailorModal" class="action-btn cancel-action">
                <Icon icon="material-symbols:refresh" style="font-size: 16px; margin-right: 8px;" />
                Start Over
              </button>
              <button @click="applyOptimizations" class="action-btn apply-action" :disabled="isApplying">
                <Icon icon="material-symbols:check" style="font-size: 16px; margin-right: 8px;" />
                {{ isApplying ? 'Converting to Resume...' : (hasUserEdits ? 'Apply Your Edits & Convert to Resume' : 'Apply & Convert to Resume') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Optimizer Info Modal -->
  <div v-if="showOptimizerInfoModal" class="modal-overlay" @click="showOptimizerInfoModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:psychology" style="font-size: 20px; margin-right: 8px;" />
            <h3>AI Resume Optimization</h3>
          </div>
          <button class="modal-close" @click="showOptimizerInfoModal = false">
            <Icon icon="material-symbols:close" style="font-size: 20px;" />
          </button>
        </div>
      </div>
      <div class="modal-body">
        <div class="info-content">
          <p>The Job Optimizer uses AI to tailor your resume for specific job postings, making it more likely to pass ATS filters and impress hiring managers.</p>
          
          <div class="step-list">
            <div class="step-item">
              <span class="step-number">1</span>
              <div class="step-content">
                <strong>Paste Job Posting:</strong> Copy the job description you're applying for and paste it in the job post field.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">2</span>
              <div class="step-content">
                <strong>AI Analysis:</strong> Our AI analyzes the job requirements and optimizes your summary, experience descriptions, and skills.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">3</span>
              <div class="step-content">
                <strong>Review Changes:</strong> See before/after comparisons and decide which optimizations to apply to your resume.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">4</span>
              <div class="step-content">
                <strong>Apply & Download:</strong> Apply the changes and export your optimized resume, perfectly tailored for the job.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Cover Letter Modal -->
  <div v-if="showCoverLetterModal" class="fullscreen-modal-overlay">
    <div class="fullscreen-modal-content" @click.stop>
      <div class="fullscreen-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:description" style="font-size: 24px; margin-right: 12px;" />
            <h1>AI Cover Letter</h1>
          </div>
          <button class="close-btn" @click="showCoverLetterModal = false">
            <Icon icon="material-symbols:close" style="font-size: 24px;" />
          </button>
        </div>
      </div>
      <div class="fullscreen-body">
        <div v-if="!showCoverLetterResults" class="input-section fullscreen-input">
          <div class="input-grid">
            <div class="input-group">
              <label class="input-label">
                <Icon icon="material-symbols:description" style="font-size: 18px; margin-right: 8px;" />
                Your Resume Text
              </label>
              <textarea 
                v-model="coverLetterResumeText"
                class="fullscreen-textarea"
                :readonly="useCurrentResumeForCoverLetter"
                placeholder="Paste your resume text here (from Word, PDF, or any format)..."
              ></textarea>
              <div class="checkbox-container">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="useCurrentResumeForCoverLetter"
                    @change="handleUseCurrentResumeForCoverLetterChange"
                    class="checkbox-input"
                  />
                  <span class="checkbox-text">
                    Use current resume data
                  </span>
                </label>
              </div>
            </div>
            
            <div class="input-group">
              <label class="input-label">
                <Icon icon="material-symbols:work" style="font-size: 18px; margin-right: 8px;" />
                Job Description
              </label>
              <textarea 
                v-model="coverLetterJobDescription"
                class="fullscreen-textarea"
                placeholder="Paste the job description here..."
              ></textarea>
            </div>
          </div>

          <div class="ai-status" v-if="isGeneratingCoverLetter">
            <Icon icon="material-symbols:hourglass-top" style="font-size: 16px; margin-right: 8px;" />
            Generating your cover letter with AI...
          </div>

          <div class="fullscreen-actions">
            <div class="action-buttons">
              <button @click="showCoverLetterModal = false" class="action-btn cancel-action" :disabled="isGeneratingCoverLetter">
                <Icon icon="material-symbols:close" style="font-size: 16px; margin-right: 8px;" />
                Cancel
              </button>
              <button @click="generateCoverLetter" :disabled="!coverLetterJobDescription.trim() || !coverLetterResumeText.trim() || isGeneratingCoverLetter" class="action-btn optimize-action">
                <Icon icon="material-symbols:description" style="font-size: 16px; margin-right: 8px;" />
                Generate Cover Letter
              </button>
            </div>
          </div>
        </div>

        <div v-if="showCoverLetterResults" class="results-section fullscreen-results cover-letter-results">
          <h2 class="results-title">
            <Icon icon="material-symbols:description" style="font-size: 24px; margin-right: 12px;" />
            Generated Cover Letter
          </h2>
          
          <div class="cover-letter-display">
            <div class="cover-letter-content">
              <textarea 
                v-model="generatedCoverLetter"
                class="cover-letter-textarea"
                placeholder="Your generated cover letter will appear here..."
              ></textarea>
            </div>
          </div>

          <div class="fullscreen-actions">
            <div class="action-buttons">
              <button @click="resetCoverLetterModal" class="action-btn cancel-action">
                <Icon icon="material-symbols:refresh" style="font-size: 16px; margin-right: 8px;" />
                Start Over
              </button>
              <button @click="downloadCoverLetterPDF" class="action-btn apply-action">
                <Icon icon="material-symbols:file-download" style="font-size: 16px; margin-right: 8px;" />
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Cover Letter Info Modal -->
  <div v-if="showCoverLetterInfoModal" class="modal-overlay" @click="showCoverLetterInfoModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="header-left">
            <Icon icon="material-symbols:description" style="font-size: 20px; margin-right: 8px;" />
            <h3>AI Cover Letter Generation</h3>
          </div>
          <button class="modal-close" @click="showCoverLetterInfoModal = false">
            <Icon icon="material-symbols:close" style="font-size: 20px;" />
          </button>
        </div>
      </div>
      <div class="modal-body">
        <div class="info-content">
          <p>The Cover Letter Generator uses AI to create professional, tailored cover letters that highlight your relevant experience and demonstrate your fit for specific job positions.</p>
          
          <div class="step-list">
            <div class="step-item">
              <span class="step-number">1</span>
              <div class="step-content">
                <strong>Provide Resume:</strong> Paste your resume text or use your current resume data to give the AI context about your background.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">2</span>
              <div class="step-content">
                <strong>Add Job Description:</strong> Paste the job posting to help the AI understand the specific requirements and company needs.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">3</span>
              <div class="step-content">
                <strong>Generate Cover Letter:</strong> Our AI creates a professional cover letter that connects your experience to the job requirements.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">4</span>
              <div class="step-content">
                <strong>Download & Use:</strong> Download your cover letter as a PDF and use it for your job application.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { watch } from 'vue'
import SidebarHeader from './sidebar/SidebarHeader.vue'
import ResumeMatchAnalysis from './ResumeMatchAnalysis.vue'

const props = defineProps({
  headerElements: {
    type: Object,
    required: true
  },
  sections: {
    type: Object,
    required: true
  },
  personal: {
    type: Object,
    required: true
  },
  sectionOrder: {
    type: Array,
    required: true
  },
  resumeData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:headerElements', 'update:sections', 'update:collapsed', 'update:personal', 'update:sectionOrder', 'update:resumeData'])

// Toast notifications
const { showSuccess, showError, showWarning, showInfo } = useToast()

const isCollapsed = ref(false)
const showImportModal = ref(false)
const showAiImportModal = ref(false)
const showInfoModal = ref(false)
const showTailorModal = ref(false)
const showOptimizerInfoModal = ref(false)
const showCoverLetterModal = ref(false)
const showCoverLetterInfoModal = ref(false)
const importJsonText = ref('')
const resumeText = ref('')
const isProcessing = ref(false)
const uploadedFile = ref(null)
const isDragOver = ref(false)
const fileInput = ref(null)
const headerSectionOpen = ref(false)
const sectionsSectionOpen = ref(false)
const importExportSectionOpen = ref(true)
const jobOptimizerSectionOpen = ref(false)
const coverLetterSectionOpen = ref(false)

// Drag and drop variables
const draggedSection = ref(null)
const dragOverSection = ref(null)

// Job Optimizer variables
const resumeTextInput = ref('')
const jobPostText = ref('')
const useCurrentResume = ref(true) // Default to checked
const isTailoring = ref(false)
const isApplying = ref(false)
const showResults = ref(false)
  const showAnalysis = ref(false)
  const isAnalyzing = ref(false)
  const analysisData = ref(null)
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
const optimizedResumeText = ref('')

// Editable versions of optimized content for user editing
const editableOptimizedContent = ref({
  summary: '',
  experience: [],
  skills: []
})

// Track if user has made edits to the optimized content
const hasUserEdits = ref(false)

// Cover Letter variables
const coverLetterResumeText = ref('')
const coverLetterJobDescription = ref('')
const useCurrentResumeForCoverLetter = ref(true)
const isGeneratingCoverLetter = ref(false)
const showCoverLetterResults = ref(false)
const generatedCoverLetter = ref('')

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('update:collapsed', isCollapsed.value)
}

const toggleHeaderSection = () => {
  headerSectionOpen.value = !headerSectionOpen.value
}

const toggleSectionsSection = () => {
  sectionsSectionOpen.value = !sectionsSectionOpen.value
}

const toggleImportExportSection = () => {
  importExportSectionOpen.value = !importExportSectionOpen.value
}

const toggleJobOptimizerSection = () => {
  jobOptimizerSectionOpen.value = !jobOptimizerSectionOpen.value
}

const toggleCoverLetterSection = () => {
  coverLetterSectionOpen.value = !coverLetterSectionOpen.value
}

const toggleHeaderElement = (element, visible) => {
  const updatedHeaderElements = { ...props.headerElements, [element]: visible }
  emit('update:headerElements', updatedHeaderElements)
}

const toggleSection = (section, visible) => {
  const updatedSections = { ...props.sections, [section]: visible }
  emit('update:sections', updatedSections)
}

  // Analyze resume vs job description compatibility
  const analyzeResumeMatch = async () => {
    if (!jobPostText.value.trim() || !resumeTextInput.value.trim()) {
      showWarning('Please enter both your resume text and a job posting to analyze.')
      return
    }

    isAnalyzing.value = true
    showAnalysis.value = false

    try {
      const response = await $fetch('/api/analyze-resume-match', {
        method: 'POST',
        body: {
          currentResume: resumeTextInput.value,
          jobPost: jobPostText.value,
          resumeData: props.resumeData
        }
      })

      if (response.success && response.data) {
        analysisData.value = response.data
        showAnalysis.value = true
      } else {
        showError(response.error || 'Failed to analyze resume. Please try again.')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      showError('Error analyzing resume. Please check your internet connection and try again.')
    } finally {
      isAnalyzing.value = false
    }
  }

  const proceedToOptimization = () => {
    // Keep analysis visible during optimization
    tailorResume()
  }

  const cancelAnalysis = () => {
    showAnalysis.value = false
    analysisData.value = null
  }

  const reviseResume = () => {
    // Go back to input section to revise resume
    showAnalysis.value = false
    analysisData.value = null
    showInfo('Please update your resume to better match the job requirements, then analyze again.')
  }

const updateHeadshotUrl = (event) => {
  const newPersonal = { ...props.personal, headshot: event.target.value }
  emit('update:personal', newPersonal)
}

const moveSectionUp = (section) => {
  const currentIndex = props.sectionOrder.indexOf(section)
  if (currentIndex > 1) { // Don't move above summary (index 0) or the section right after summary (index 1)
    const newOrder = [...props.sectionOrder]
    const temp = newOrder[currentIndex]
    newOrder[currentIndex] = newOrder[currentIndex - 1]
    newOrder[currentIndex - 1] = temp
    emit('update:sectionOrder', newOrder)
  }
}

const moveSectionDown = (section) => {
  const currentIndex = props.sectionOrder.indexOf(section)
  if (currentIndex < props.sectionOrder.length - 1) {
    const newOrder = [...props.sectionOrder]
    const temp = newOrder[currentIndex]
    newOrder[currentIndex] = newOrder[currentIndex + 1]
    newOrder[currentIndex + 1] = temp
    emit('update:sectionOrder', newOrder)
  }
}

const canMoveUp = (section) => {
  const currentIndex = props.sectionOrder.indexOf(section)
  return currentIndex > 1 // Can't move above the section right after summary
}

const canMoveDown = (section) => {
  const currentIndex = props.sectionOrder.indexOf(section)
  return currentIndex < props.sectionOrder.length - 1
}

// Drag and drop methods
const handleDragStart = (event, section) => {
  if (section === 'summary' || section === 'signature') return
  draggedSection.value = section
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', section)
}

const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const handleDrop = (event, targetSection) => {
  event.preventDefault()
  
  if (!draggedSection.value || draggedSection.value === targetSection || targetSection === 'summary' || targetSection === 'signature') {
    return
  }
  
  const currentOrder = [...props.sectionOrder]
  const draggedIndex = currentOrder.indexOf(draggedSection.value)
  const targetIndex = currentOrder.indexOf(targetSection)
  
  if (draggedIndex === -1 || targetIndex === -1) {
    return
  }
  
  // Remove the dragged section from its current position
  currentOrder.splice(draggedIndex, 1)
  
  // Insert it at the target position
  currentOrder.splice(targetIndex, 0, draggedSection.value)
  
  // Update the section order
  emit('update:sectionOrder', currentOrder)
  
  // Reset drag state
  draggedSection.value = null
  dragOverSection.value = null
}

const handleDragEnter = (event, section) => {
  if (section !== 'summary' && section !== 'signature' && draggedSection.value !== section) {
    dragOverSection.value = section
  }
}

const handleDragLeave = (event) => {
  // Only clear if we're actually leaving the element (not entering a child)
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragOverSection.value = null
  }
}

const exportData = () => {
  // Create the export data object
  const exportData = {
    editable: props.resumeData.editable,
    enableVersions: props.resumeData.enableVersions,
    headerElements: props.headerElements,
    sections: props.sections,
    sectionOrder: props.sectionOrder,
    personal: props.personal,
    researchInterests: props.resumeData.researchInterests,
    education: props.resumeData.education,
    summary: props.resumeData.summary,
    experience: props.resumeData.experience,
    publications: props.resumeData.publications,
    skills: props.resumeData.skills,
    languages: props.resumeData.languages,
    volunteering: props.resumeData.volunteering,
    signature: props.resumeData.signature
  }

  // Convert to JSON string with proper formatting
  const jsonString = JSON.stringify(exportData, null, 2)
  
  // Create and download the file
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'resume-data.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const importData = () => {
  try {
    const importedData = JSON.parse(importJsonText.value)
    
    // Validate that it's a valid resume data object
    if (!importedData || typeof importedData !== 'object') {
      showError('Invalid JSON data. Please check your input.')
      return
    }

    // Get the current resume data to preserve structure
    const currentData = props.resumeData
    
    // Merge the imported data with the current structure
    const mergedData = {
      // Preserve current structure and merge with imported data
      editable: importedData.editable !== undefined ? importedData.editable : currentData.editable,
      enableVersions: importedData.enableVersions !== undefined ? importedData.enableVersions : currentData.enableVersions,
      
      // Merge header elements - preserve all available elements, set missing ones to false
      headerElements: {
        ...currentData.headerElements,
        ...importedData.headerElements
      },
      
      // Merge sections - preserve all available sections, set missing ones to false
      // Auto-hide sections that are empty in imported data
      sections: (() => {
        const mergedSections = {
          ...currentData.sections,
          ...importedData.sections
        }
        
        // Auto-hide sections that have no content in imported data
        if (importedData) {
          // Check and auto-hide empty sections
          if (!importedData.researchInterests || 
              (typeof importedData.researchInterests === 'object' && 
               Object.keys(importedData.researchInterests).length === 0) ||
              (typeof importedData.researchInterests === 'string' && 
               !importedData.researchInterests.trim())) {
            mergedSections.researchInterests = false
          }
          
          if (!importedData.publications || 
              (Array.isArray(importedData.publications) && importedData.publications.length === 0)) {
            mergedSections.publications = false
          }
          
          if (!importedData.languages || 
              (Array.isArray(importedData.languages) && importedData.languages.length === 0)) {
            mergedSections.languages = false
          }
          
          if (!importedData.volunteering || 
              (Array.isArray(importedData.volunteering) && importedData.volunteering.length === 0)) {
            mergedSections.volunteering = false
          }
          
          if (!importedData.signature || 
              (typeof importedData.signature === 'object' && 
               !importedData.signature.name && !importedData.signature.date)) {
            mergedSections.signature = false
          }
          
          // Always show core sections even if empty (user can fill them)
          mergedSections.summary = true
          mergedSections.education = true
          mergedSections.experience = true
          mergedSections.skills = true
        }
        
        return mergedSections
      })(),
      
      // Merge section order - preserve all sections from current data, add any new ones from imported data
      sectionOrder: (() => {
        const currentOrder = currentData.sectionOrder || []
        const importedOrder = importedData.sectionOrder || []
        
        // Start with current order to preserve all available sections
        const mergedOrder = [...currentOrder]
        
        // Add any sections from imported order that aren't in current order
        importedOrder.forEach(section => {
          if (!mergedOrder.includes(section)) {
            mergedOrder.push(section)
          }
        })
        
        return mergedOrder
      })(),
      
      // Merge personal data
      personal: {
        ...currentData.personal,
        ...importedData.personal
      },
      
      // Merge all section data, preserving structure
      researchInterests: importedData.researchInterests || currentData.researchInterests,
      education: importedData.education || currentData.education,
      summary: importedData.summary || currentData.summary,
      experience: importedData.experience || currentData.experience,
      publications: importedData.publications || currentData.publications,
      skills: importedData.skills || currentData.skills,
      languages: importedData.languages || currentData.languages,
      volunteering: importedData.volunteering || currentData.volunteering,
      signature: importedData.signature || currentData.signature
    }

    // Emit the merged data to update the resume
    emit('update:resumeData', mergedData)
    
    // Close modal and clear text
    showImportModal.value = false
    importJsonText.value = ''
    
    showSuccess('Data imported successfully! All sections are now available in the sidebar.')
  } catch (error) {
    showError('Error parsing JSON data. Please check your input.')
    console.error('Import error:', error)
  }
}

const processWithAI = async () => {
  if (!resumeText.value.trim() && !uploadedFile.value) {
    showWarning('Please enter some resume text or upload a file to process.')
    return
  }

  isProcessing.value = true
  
  try {
    let importedData = null
    
    // Handle file upload if present
    if (uploadedFile.value) {
      const formData = new FormData()
      formData.append('file', uploadedFile.value)
      
      const response = await $fetch('/api/import-resume-file', {
        method: 'POST',
        body: formData
      })
      
      if (response.success && response.data) {
        importedData = response.data
      } else {
        showError(response.error || 'Failed to process file. Please try again.')
        return
      }
    } else if (resumeText.value.trim()) {
      // Handle text input
      // First, check if the input is valid JSON
      try {
        const trimmedText = resumeText.value.trim()
        if (trimmedText.startsWith('{') && trimmedText.endsWith('}')) {
          const parsedJson = JSON.parse(trimmedText)
          
          // Basic validation to check if it looks like resume data
          if (parsedJson && typeof parsedJson === 'object') {
            importedData = parsedJson
            console.log('Detected valid JSON, using directly without AI processing')
          }
        }
      } catch (jsonError) {
        // Not valid JSON, will use AI processing
        console.log('Not valid JSON, will use AI processing')
      }
      
      // If not valid JSON, use AI processing
      if (!importedData) {
        const response = await $fetch('/api/import-resume', {
          method: 'POST',
          body: {
            resumeText: resumeText.value
          }
        })
        
        if (response.success && response.data) {
          importedData = response.data
        } else {
          showError(response.error || 'Failed to process resume. Please try again.')
          return
        }
      }
    }

    if (importedData) {
      // Use the imported data (either from JSON parsing or AI processing)
      
      // Get the current resume data to preserve structure
      const currentData = props.resumeData
      
      // Merge the imported data with the current structure
      const mergedData = {
        // Preserve current structure and merge with imported data
        editable: importedData.editable !== undefined ? importedData.editable : currentData.editable,
        enableVersions: importedData.enableVersions !== undefined ? importedData.enableVersions : currentData.enableVersions,
        
        // Merge header elements - preserve all available elements, set missing ones to false
        headerElements: {
          ...currentData.headerElements,
          ...importedData.headerElements
        },
        
        // Merge sections - preserve all available sections, set missing ones to false
        // Auto-hide sections that are empty in imported data
        sections: (() => {
          const mergedSections = {
            ...currentData.sections,
            ...importedData.sections
          }
          
          // Auto-hide sections that have no content in imported data
          if (importedData) {
            // Check and auto-hide empty sections
            if (!importedData.researchInterests || 
                (typeof importedData.researchInterests === 'object' && 
                 Object.keys(importedData.researchInterests).length === 0) ||
                (typeof importedData.researchInterests === 'string' && 
                 !importedData.researchInterests.trim())) {
              mergedSections.researchInterests = false
            }
            
            if (!importedData.publications || 
                (Array.isArray(importedData.publications) && importedData.publications.length === 0)) {
              mergedSections.publications = false
            }
            
            if (!importedData.languages || 
                (Array.isArray(importedData.languages) && importedData.languages.length === 0)) {
              mergedSections.languages = false
            }
            
            if (!importedData.volunteering || 
                (Array.isArray(importedData.volunteering) && importedData.volunteering.length === 0)) {
              mergedSections.volunteering = false
            }
            
            if (!importedData.signature || 
                (typeof importedData.signature === 'object' && 
                 !importedData.signature.name && !importedData.signature.date)) {
              mergedSections.signature = false
            }
            
            // Always show core sections even if empty (user can fill them)
            mergedSections.summary = true
            mergedSections.education = true
            mergedSections.experience = true
            mergedSections.skills = true
          }
          
          return mergedSections
        })(),
        
        // Merge section order - preserve all sections from current data, add any new ones from imported data
        sectionOrder: (() => {
          const currentOrder = currentData.sectionOrder || []
          const importedOrder = importedData.sectionOrder || []
          
          // Start with current order to preserve all available sections
          const mergedOrder = [...currentOrder]
          
          // Add any sections from imported order that aren't in current order
          importedOrder.forEach(section => {
            if (!mergedOrder.includes(section)) {
              mergedOrder.push(section)
            }
          })
          
          return mergedOrder
        })(),
        
        // Merge personal data
        personal: {
          ...currentData.personal,
          ...importedData.personal
        },
        
        // Merge all section data, preserving structure
        // Use imported data if available, otherwise use empty defaults instead of mock data
        researchInterests: importedData.researchInterests || [],
        education: importedData.education || [],
        summary: importedData.summary || "",
        experience: importedData.experience || [],
        publications: importedData.publications || [],
        skills: importedData.skills || [],
        languages: importedData.languages || [],
        volunteering: importedData.volunteering || [],
        signature: importedData.signature || { name: "", date: "" }
      }

      // Emit the merged data to update the resume
      emit('update:resumeData', mergedData)
      
      // Close modal and clear text and file
      showAiImportModal.value = false
      resumeText.value = ''
      uploadedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      
      showSuccess('Resume imported successfully! All sections have been updated.')
    }
  } catch (error) {
    console.error('Resume processing error:', error)
    showError('Error processing resume. Please check your internet connection and try again.')
  } finally {
    isProcessing.value = false
  }
}

// File upload functions
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadedFile.value = file
  }
}

const handleFileDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    uploadedFile.value = file
  }
}

const removeFile = () => {
  uploadedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}



// Job Optimizer functions - No longer need to populate, user provides their own text

const tailorResume = async () => {
  if (!jobPostText.value.trim() || !resumeTextInput.value.trim()) {
    showWarning('Please enter both your resume text and a job posting to optimize.')
    return
  }

  isTailoring.value = true
    showResults.value = false
    
  try {
    const response = await $fetch('/api/tailor-resume', {
      method: 'POST',
      body: {
        currentResume: resumeTextInput.value,
        jobPost: jobPostText.value,
        resumeData: props.resumeData // Provide existing resume data for context
      }
    })

    if (response.success && response.data) {
      // Store original content for comparison (from existing resume data)
      originalContent.value = {
        summary: typeof props.resumeData.summary === 'string' ? props.resumeData.summary : props.resumeData.summary?.default || 'No summary available',
        experience: props.resumeData.experience || [],
        skills: props.resumeData.skills || []
      }
      
      // Store optimized content
      optimizedContent.value = response.data
      
      // Initialize editable content with the optimized content
      editableOptimizedContent.value = {
        summary: response.data.summary || '',
        experience: response.data.experience ? response.data.experience.map(exp => ({
          ...exp,
          achievements: [...(exp.achievements || [])]
        })) : [],
        skills: [...(response.data.skills || [])]
      }
      
      // Create optimized resume text from the structured data
      optimizedResumeText.value = createOptimizedResumeText(response.data)
      
      // Reset edit tracking for new optimization
      hasUserEdits.value = false
      
      // Hide analysis and show results section
      showAnalysis.value = false
      showResults.value = true
      
      // Initialize textarea heights after showing results
      initializeTextareaHeights()
    } else {
      showError(response.error || 'Failed to optimize resume. Please try again.')
    }
  } catch (error) {
    console.error('Tailoring error:', error)
    showError('Error optimizing resume. Please check your internet connection and try again.')
  } finally {
    isTailoring.value = false
  }
}

const createOptimizedResumeText = (data) => {
  let text = `SUMMARY:\n${data.summary}\n\n`
  
  text += `EXPERIENCE:\n`
  if (data.experience && data.experience.length > 0) {
    data.experience.forEach(exp => {
      text += `${exp.position} at ${exp.company} (${exp.period})\n`
      if (exp.achievements) {
        exp.achievements.forEach(achievement => {
          text += `• ${achievement}\n`
        })
      }
      text += '\n'
    })
  }
  
  text += `SKILLS:\n`
  if (data.skills && data.skills.length > 0) {
    text += data.skills.join(', ')
  }
  
  return text
}

const generateCurrentResumeText = () => {
  const data = props.resumeData
  let text = ''
  
  // Add personal information
  if (data.personal) {
    text += `${data.personal.name || 'No Name'}\n`
    if (data.personal.title) text += `${data.personal.title}\n`
    if (data.personal.email) text += `Email: ${data.personal.email}\n`
    if (data.personal.phone) text += `Phone: ${data.personal.phone}\n`
    if (data.personal.address) text += `Address: ${data.personal.address}\n`
    if (data.personal.linkedin) text += `LinkedIn: ${data.personal.linkedin}\n`
    if (data.personal.website) text += `Website: ${data.personal.website}\n`
    text += '\n'
  }
  
  // Add summary
  if (data.summary) {
    const summaryText = typeof data.summary === 'string' ? data.summary : data.summary.default || ''
    if (summaryText) {
      text += `SUMMARY:\n${summaryText}\n\n`
    }
  }
  
  // Add research interests
  if (data.researchInterests) {
    let interests = []
    if (Array.isArray(data.researchInterests)) {
      interests = data.researchInterests
    } else if (typeof data.researchInterests === 'object') {
      // Handle object format like { default: "text" } or versioned structure
      const defaultText = data.researchInterests.default || data.researchInterests.text || ''
      if (defaultText.trim()) {
        interests = [{
          title: 'Research Interests',
          description: defaultText
        }]
      }
    }
    
    if (interests.length > 0) {
      text += `RESEARCH INTERESTS:\n`
      interests.forEach(interest => {
        text += `${interest.title || 'Untitled Interest'}\n`
        if (interest.description) {
          text += `${interest.description}\n`
        }
        text += '\n'
      })
    }
  }
  
  // Add education
  if (data.education && data.education.length > 0) {
    text += `EDUCATION:\n`
    data.education.forEach(edu => {
      text += `${edu.degree || 'Degree'} - ${edu.institution || 'Institution'}`
      if (edu.graduationDate) text += ` (${edu.graduationDate})`
      text += '\n'
      if (edu.details && edu.details.length > 0) {
        edu.details.forEach(detail => {
          text += `• ${detail}\n`
        })
      }
      text += '\n'
    })
  }
  
  // Add experience
  if (data.experience && data.experience.length > 0) {
    text += `EXPERIENCE:\n`
    data.experience.forEach(exp => {
      text += `${exp.position || 'Position'} at ${exp.company || 'Company'}`
      if (exp.location) text += `, ${exp.location}`
      if (exp.period) text += ` (${exp.period})`
      text += '\n'
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          text += `• ${achievement}\n`
        })
      }
      text += '\n'
    })
  }
  
  // Add publications
  if (data.publications && data.publications.length > 0) {
    text += `PUBLICATIONS:\n`
    data.publications.forEach(pub => {
      text += `${pub.title || 'Untitled'}`
      if (pub.venue) text += ` - ${pub.venue}`
      if (pub.year) text += ` (${pub.year})`
      text += '\n'
      if (pub.authors) text += `Authors: ${pub.authors}\n`
      if (pub.description) text += `${pub.description}\n`
      text += '\n'
    })
  }
  
  // Add skills
  if (data.skills && data.skills.length > 0) {
    text += `SKILLS:\n${data.skills.join(', ')}\n\n`
  }
  
  // Add languages
  if (data.languages && data.languages.length > 0) {
    text += `LANGUAGES:\n${data.languages.join(', ')}\n\n`
  }
  
  // Add volunteering
  if (data.volunteering && data.volunteering.length > 0) {
    text += `VOLUNTEERING:\n`
    data.volunteering.forEach(vol => {
      text += `${vol.role || 'Role'} at ${vol.organization || 'Organization'}`
      if (vol.location) text += `, ${vol.location}`
      if (vol.period) text += ` (${vol.period})`
      text += '\n'
      if (vol.description) {
        text += `${vol.description}\n`
      }
      text += '\n'
    })
  }
  
  return text.trim()
}

const handleUseCurrentResumeChange = () => {
  if (useCurrentResume.value) {
    // Checkbox was checked - populate with current resume data and make readonly
    resumeTextInput.value = generateCurrentResumeText()
  }
  // If unchecked, keep the current text but make it editable (readonly will be false)
}

const handleUseCurrentResumeForCoverLetterChange = () => {
  if (useCurrentResumeForCoverLetter.value) {
    // Checkbox was checked - populate with current resume data and make readonly
    coverLetterResumeText.value = generateCurrentResumeText()
  }
  // If unchecked, keep the current text but make it editable (readonly will be false)
}

const generateCoverLetter = async () => {
  if (!coverLetterJobDescription.value.trim() || !coverLetterResumeText.value.trim()) {
    showWarning('Please enter both your resume text and a job description to generate a cover letter.')
    return
  }

  isGeneratingCoverLetter.value = true
  
  try {
    console.log('Sending cover letter request with data:', {
      resumeText: coverLetterResumeText.value.substring(0, 100) + '...',
      jobDescription: coverLetterJobDescription.value.substring(0, 100) + '...'
    })

    const response = await $fetch('/api/generate-cover-letter', {
      method: 'POST',
      body: {
        resumeText: coverLetterResumeText.value,
        jobDescription: coverLetterJobDescription.value
      }
    })

    console.log('Cover letter response:', response)

    if (response.success && response.data) {
      generatedCoverLetter.value = response.data.coverLetter
      showCoverLetterResults.value = true
      showSuccess('Cover letter generated successfully!')
    } else {
      showError(response.error || 'Failed to generate cover letter. Please try again.')
    }
  } catch (error) {
    console.error('Cover letter generation error:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      data: error.data
    })
    showError(`Error generating cover letter: ${error.message || 'Unknown error'}. Please check your internet connection and try again.`)
  } finally {
    isGeneratingCoverLetter.value = false
  }
}

const resetCoverLetterModal = () => {
  showCoverLetterResults.value = false
  coverLetterJobDescription.value = ''
  coverLetterResumeText.value = ''
  useCurrentResumeForCoverLetter.value = true
  isGeneratingCoverLetter.value = false
  generatedCoverLetter.value = ''
}

const downloadCoverLetterPDF = () => {
  if (!generatedCoverLetter.value) {
    showWarning('No cover letter to download.')
    return
  }

  // Create a simple PDF download using browser print functionality
  const printWindow = window.open('', '_blank')
  
  // Create the HTML content with proper escaping
  const coverLetterContent = generatedCoverLetter.value.replace(/\n/g, '<br>')
  
  // Create HTML document with minimal headers
  printWindow.document.write('<!DOCTYPE html>')
  printWindow.document.write('<html>')
  printWindow.document.write('<head>')
  printWindow.document.write('<meta name="robots" content="noindex,nofollow">')
  printWindow.document.write('<meta name="format-detection" content="telephone=no">')
  printWindow.document.write('<title></title>')
  printWindow.document.write('<style>')
  printWindow.document.write('body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.5; margin: 1in; color: #000; }')
  printWindow.document.write('.cover-letter { max-width: 8.5in; margin: 0 auto; }')
  printWindow.document.write('@media print {')
  printWindow.document.write('  body { margin: 0; }')
  printWindow.document.write('  @page { margin: 1in; size: letter; }')
  printWindow.document.write('  html, body { height: 100%; margin: 0; padding: 0; }')
  printWindow.document.write('  @page :first { margin: 1in; }')
  printWindow.document.write('  @page :left { margin: 1in; }')
  printWindow.document.write('  @page :right { margin: 1in; }')
  printWindow.document.write('}')
  printWindow.document.write('</style>')
  printWindow.document.write('</head>')
  printWindow.document.write('<body>')
  printWindow.document.write('<div class="cover-letter">')
  printWindow.document.write(coverLetterContent)
  printWindow.document.write('</div>')
  printWindow.document.write('</body>')
  printWindow.document.write('</html>')
  
  printWindow.document.close()
  printWindow.focus()
  
  // Show instructions for removing headers/footers
  showInfo('Tip: In the print dialog, go to "More settings" and set "Headers and footers" to "None" to remove the date and URL. In Chrome: More settings → Headers and footers → None. In Firefox: Page Setup → Headers/Footers → None.')
  
  // Auto-print after a short delay
  setTimeout(() => {
    // Try to set print options programmatically (may not work in all browsers)
    try {
      if (printWindow.print) {
        printWindow.print()
      }
    } catch (error) {
      console.log('Print function called')
    }
  }, 500)
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

const markAsEdited = () => {
  hasUserEdits.value = true
}

// Auto-resize textarea function
const autoResizeTextarea = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

// Initialize textarea heights when results are shown
const initializeTextareaHeights = () => {
  nextTick(() => {
    const textareas = document.querySelectorAll('.content-textarea, .skills-textarea, .achievement-textarea')
    textareas.forEach(textarea => {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    })
  })
}

// Watch for when results section is shown to initialize textarea heights
watch(showResults, (newValue) => {
  if (newValue) {
    initializeTextareaHeights()
  }
})

const resetTailorModal = () => {
  showResults.value = false
  jobPostText.value = ''
  resumeTextInput.value = ''
  useCurrentResume.value = true // Reset to default checked state
  isTailoring.value = false
  isApplying.value = false
  originalContent.value = { summary: '', experience: [], skills: [] }
  optimizedContent.value = { summary: '', experience: [], skills: [] }
  editableOptimizedContent.value = { summary: '', experience: [], skills: [] }
  optimizedResumeText.value = ''
  hasUserEdits.value = false
}

const applyOptimizations = async () => {
  if (!editableOptimizedContent.value.summary || !editableOptimizedContent.value.experience || !editableOptimizedContent.value.skills) {
    showWarning('No optimized content to apply.')
    return
  }

  isApplying.value = true
  
  try {
    // Step 1: First convert the pasted resume text to JSON to get all the updated info
    const baseResumeResponse = await $fetch('/api/import-resume', {
      method: 'POST',
      body: {
        resumeText: resumeTextInput.value
      }
    })

    if (!baseResumeResponse.success || !baseResumeResponse.data) {
      showError(baseResumeResponse.error || 'Failed to parse the pasted resume text. Please check the format and try again.')
      return
    }

    // Step 2: Merge the converted resume data with AI optimizations
    // This ensures all personal info, education, etc. comes from the pasted text
    // But summary, experience achievements, and skills are AI-optimized
    // IMPORTANT: Preserve existing sections that might be missing from the import
    const currentData = props.resumeData
    const importedData = baseResumeResponse.data
    
    const updatedResumeData = {
      // Preserve current structure and merge with imported data
      editable: importedData.editable !== undefined ? importedData.editable : currentData.editable,
      enableVersions: importedData.enableVersions !== undefined ? importedData.enableVersions : currentData.enableVersions,
      
      // Merge header elements - use imported if available, fallback to current
      headerElements: {
        ...currentData.headerElements,
        ...importedData.headerElements
      },
      
              // Merge sections - use imported if available, fallback to current
        // Auto-hide sections that are empty in imported data
        sections: (() => {
          const mergedSections = {
            ...currentData.sections,
            ...importedData.sections
          }
          
          // Auto-hide sections that have no content in imported data
          if (importedData) {
            // Check and auto-hide empty sections
            if (!importedData.researchInterests || 
                (typeof importedData.researchInterests === 'object' && 
                 Object.keys(importedData.researchInterests).length === 0) ||
                (typeof importedData.researchInterests === 'string' && 
                 !importedData.researchInterests.trim())) {
              mergedSections.researchInterests = false
            }
            
            if (!importedData.publications || 
                (Array.isArray(importedData.publications) && importedData.publications.length === 0)) {
              mergedSections.publications = false
            }
            
            if (!importedData.languages || 
                (Array.isArray(importedData.languages) && importedData.languages.length === 0)) {
              mergedSections.languages = false
            }
            
            if (!importedData.volunteering || 
                (Array.isArray(importedData.volunteering) && importedData.volunteering.length === 0)) {
              mergedSections.volunteering = false
            }
            
            if (!importedData.signature || 
                (typeof importedData.signature === 'object' && 
                 !importedData.signature.name && !importedData.signature.date)) {
              mergedSections.signature = false
            }
            
            // Always show core sections even if empty (user can fill them)
            mergedSections.summary = true
            mergedSections.education = true
            mergedSections.experience = true
            mergedSections.skills = true
          }
          
          return mergedSections
        })(),
      
      // Merge section order - preserve all sections from current data, add any new ones from imported data
      sectionOrder: (() => {
        const currentOrder = currentData.sectionOrder || []
        const importedOrder = importedData.sectionOrder || []
        
        // Start with current order to preserve all available sections
        const mergedOrder = [...currentOrder]
        
        // Add any sections from imported order that aren't in current order
        importedOrder.forEach(section => {
          if (!mergedOrder.includes(section)) {
            mergedOrder.push(section)
          }
        })
        
        return mergedOrder
      })(),
      
      // Merge personal data - use imported for specific fields, preserve original for others
      personal: {
        ...currentData.personal,
        ...(importedData.personal || {}),
        // Preserve critical fields from original if they exist and imported doesn't have them
        dateOfBirth: (importedData.personal?.dateOfBirth && importedData.personal.dateOfBirth.trim()) 
          ? importedData.personal.dateOfBirth 
          : currentData.personal?.dateOfBirth || ""
      },
      
      // Apply AI-optimized summary (from editable content)
      summary: editableOptimizedContent.value.summary, // Apply AI-optimized summary as string
      
      // Apply AI-optimized experience with proper merging (from editable content)
      experience: editableOptimizedContent.value.experience.map((optimizedExp, index) => {
        // Keep the base experience structure from pasted resume but use AI-optimized achievements
        const baseExp = (importedData.experience && importedData.experience[index]) || optimizedExp
        return {
          ...baseExp, // Company, position, period, location from pasted resume
          achievements: optimizedExp.achievements // AI-optimized achievements
        }
      }),
      
      // Apply AI-optimized skills (from editable content)
      skills: (() => {
        // Process skills from editable content (convert from string to array if needed)
        if (typeof editableOptimizedContent.value.skills === 'string') {
          // Split by comma and clean up
          return editableOptimizedContent.value.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0)
        }
        return editableOptimizedContent.value.skills || []
      })(),
      
      // Preserve all other sections - keep original structure and data unless specifically improved
      researchInterests: (() => {
        // Convert to array format if needed
        if (importedData.researchInterests) {
          if (Array.isArray(importedData.researchInterests)) {
            return importedData.researchInterests
          } else if (typeof importedData.researchInterests === 'object') {
            const defaultText = importedData.researchInterests.default || importedData.researchInterests.text || ''
            if (defaultText.trim()) {
              return [{
                title: 'Research Interests',
                description: defaultText
              }]
            }
          }
        }
        
        // Fallback to current data
        if (currentData.researchInterests) {
          if (Array.isArray(currentData.researchInterests)) {
            return currentData.researchInterests
          } else if (typeof currentData.researchInterests === 'object') {
            const defaultText = currentData.researchInterests.default || currentData.researchInterests.text || ''
            if (defaultText.trim()) {
              return [{
                title: 'Research Interests',
                description: defaultText
              }]
            }
          }
        }
        
        return []
      })(),
      
      education: (() => {
        // Merge education arrays, preserving original structure when possible
        if (currentData.education && currentData.education.length > 0) {
          // If we have original education data, preserve its detailed structure
          if (importedData.education && importedData.education.length > 0) {
            // Try to merge: use imported for basic info, preserve original details
            return currentData.education.map((originalEdu, index) => {
              const importedEdu = importedData.education[index]
              if (importedEdu) {
                return {
                  ...originalEdu, // Keep all original details (periods, coursework, finalProject, etc.)
                  // Only update basic info if imported has better data
                  institution: importedEdu.institution || originalEdu.institution,
                  degree: importedEdu.degree || originalEdu.degree,
                  location: originalEdu.location || importedEdu.location, // Prefer original location
                  period: originalEdu.period || importedEdu.period, // Prefer original period
                  gpa: originalEdu.gpa || importedEdu.gpa // Prefer original GPA
                }
              }
              return originalEdu
            })
          }
          return currentData.education
        }
        // If no original education, use imported
        return importedData.education || []
      })(),
      
      publications: (() => {
        // Preserve original publication structure with all details
        if (currentData.publications && currentData.publications.length > 0) {
          // If we have original publications with full details, preserve them
          return currentData.publications
        }
        // Otherwise use imported if available
        return (importedData.publications && importedData.publications.length > 0) 
          ? importedData.publications 
          : currentData.publications || []
      })(),
      
      languages: (() => {
        // Preserve original language format (simple strings vs objects)
        if (currentData.languages && currentData.languages.length > 0) {
          // Check original format and preserve it
          if (typeof currentData.languages[0] === 'string') {
            // Original uses simple strings, keep that format
            return currentData.languages
          }
        }
        // Use imported if available and non-empty
        return (importedData.languages && importedData.languages.length > 0) 
          ? importedData.languages 
          : currentData.languages || []
      })(),
      
      volunteering: (() => {
        // Merge volunteering, preserving original structure
        if (currentData.volunteering && currentData.volunteering.length > 0) {
          return currentData.volunteering
        }
        return (importedData.volunteering && importedData.volunteering.length > 0) 
          ? importedData.volunteering 
          : currentData.volunteering || []
      })(),
      
      signature: (() => {
        // Preserve original signature if it exists
        if (currentData.signature && (currentData.signature.name || currentData.signature.date)) {
          return currentData.signature
        }
        return (importedData.signature && (importedData.signature.name || importedData.signature.date)) 
          ? importedData.signature 
          : currentData.signature || { name: "", date: "" }
      })()
    }
    
    // Emit the fully updated data
    emit('update:resumeData', updatedResumeData)
    
    // Close modal and reset
    showTailorModal.value = false
    resetTailorModal()
    
    showSuccess('Resume fully updated and optimized! All personal info, contact details, education, and other sections from your pasted resume have been updated. Summary, Experience achievements, and Skills have been tailored for the job with AI-powered enhancements.')
    
  } catch (error) {
    console.error('Application error:', error)
    showError('Error applying optimizations. Please check your internet connection and try again.')
  } finally {
    isApplying.value = false
  }
}

// Watch for tailor modal opening to reset state
watch(showTailorModal, (newValue) => {
  if (newValue) {
    resetTailorModal()
    // Since useCurrentResume defaults to true, populate the field
    nextTick(() => {
      if (useCurrentResume.value) {
        resumeTextInput.value = generateCurrentResumeText()
      }
    })
  }
})

// Watch for cover letter modal opening to reset state
watch(showCoverLetterModal, (newValue) => {
  if (newValue) {
    resetCoverLetterModal()
    // Since useCurrentResumeForCoverLetter defaults to true, populate the field
    nextTick(() => {
      if (useCurrentResumeForCoverLetter.value) {
        coverLetterResumeText.value = generateCurrentResumeText()
      }
    })
  }
})

const formatElementName = (element) => {
  return element
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}

const formatSectionName = (section) => {
  return section
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace('Research Interests', 'Research Interests')
}
</script>

<style scoped>
.resume-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: #fafafa;
  border-right: 1px solid #e1e5e9;
  box-shadow: none;
  z-index: 1000;
  transition: width 0.3s ease;
  width: 280px;
  overflow-y: auto;
}

.resume-sidebar.collapsed {
  width: 50px;
}



.sidebar-content {
  padding: 16px;
}

.control-section {
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.section-header:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.section-icon {
  font-size: 18px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  color: #64748b;
}

.section-title {
  flex: 1;
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.toggle-icon {
  font-size: 16px;
  color: #64748b;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.section-content {
  margin-top: 12px;
  padding: 0px 16px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #475569;
  padding: 8px 0;
}

.control-item.draggable-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
  transition: color 0.2s ease;
}

.draggable-section .checkbox-label {
  flex: 1;
  margin-left: 0;
}

.checkbox-label:hover {
  color: #3b82f6;
}

.checkbox-input {
  margin: 0;
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
}

.control-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-item.disabled:hover {
  color: #64748b;
}

.element-name,
.section-name {
  user-select: none;
  flex: 1;
}

.headshot-input {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.url-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  box-sizing: border-box;
  transition: all 0.2s ease;
  background: #ffffff;
}

.url-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-help {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-top: 6px;
  line-height: 1.4;
}

.section-controls {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.move-btn {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.move-btn:hover:not(:disabled) {
  background: #f1f5f9;
  color: #334155;
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Drag and drop styles */
.draggable-section {
  position: relative;
  transition: all 0.2s ease;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 2px 0;
}

.draggable-section:hover {
  background: #f8fafc;
}

.draggable-section.drag-over {
  background: #dbeafe;
  border: 2px dashed #3b82f6;
  transform: scale(1.02);
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  cursor: grab;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.drag-handle:hover {
  background: #f1f5f9;
  color: #334155;
}

.draggable-section:active .drag-handle {
  cursor: grabbing;
}

.draggable-section[draggable="false"] {
  cursor: default;
}

.draggable-section[draggable="false"] .drag-handle {
  cursor: default;
  opacity: 0.3;
}

.drag-handle.disabled {
  cursor: default;
  opacity: 0.3;
  pointer-events: none;
}

.export-btn {
  width: 100%;
  padding: 12px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.export-btn:hover {
  background: #2563eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.import-btn {
  width: 100%;
  padding: 12px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.import-btn:hover {
  background: #059669;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Hidden feature class - keeps functionality but hides from UI */
.hidden-feature {
  display: none !important;
}

.ai-import-btn {
  width: 100%;
  padding: 12px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ai-import-btn:hover {
  background: #059669;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ai-status {
  display: flex;
  align-items: center;
  color: #10b981;
  font-size: 13px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 6px;
  border-left: 3px solid #8b5cf6;
}

.submit-btn.ai-btn {
  background: #10b981;
  display: flex;
  align-items: center;
}

.submit-btn.ai-btn:hover:not(:disabled) {
  background: #059669;
}

.submit-btn.ai-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.tailor-btn {
  width: 100%;
  padding: 12px 16px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.tailor-btn:hover {
  background: #d97706;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tailor-help {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
  line-height: 1.4;
}

.cover-letter-btn {
  width: 100%;
  padding: 12px 16px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.cover-letter-btn:hover {
  background: #7c3aed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cover-letter-help {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
  line-height: 1.4;
}

.tailor-modal {
  max-width: 1000px;
  height: 95vh;
  max-height: 95vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .tailor-modal {
    max-width: 95vw;
    height: 90vh;
    max-height: 90vh;
  }
  
  .tailor-modal .modal-textarea {
    min-height: 100px;
    max-height: 120px;
  }
}

.tailor-modal .modal-body {
  overflow-y: auto;
  flex: 1;
  padding: 20px 24px 0 24px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tailor-modal .modal-textarea {
  min-height: 120px;
  max-height: 150px;
  resize: vertical;
}

.results-section {
  max-height: 85vh;
  overflow-y: auto;
  padding-bottom: 20px;
}

.results-title {
  margin: 0 0 20px 0;
  color: #1e293b;
  font-size: 18px;
  text-align: center;
}

.comparison-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-comparison {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

.section-comparison h5 {
  margin: 0 0 12px 0;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.before-after {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .before-after {
    grid-template-columns: 1fr;
  }
}

.before, .after {
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
}

.before {
  background: #fef2f2;
  border-left: 3px solid #f87171;
}

.after {
  background: #f0fdf4;
  border-left: 3px solid #4ade80;
}

.before strong, .after strong {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1e293b;
}

.experience-item {
  margin-bottom: 12px;
}

.experience-item:last-child {
  margin-bottom: 0;
}

.experience-item ul {
  margin: 4px 0 0 16px;
  padding: 0;
}

.experience-item li {
  margin-bottom: 4px;
  font-size: 12px;
}

.skills-list {
  font-size: 12px;
  line-height: 1.6;
}

.submit-btn.tailor-submit-btn {
  background: #f59e0b !important;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  min-width: 140px;
}

.submit-btn.tailor-submit-btn:hover:not(:disabled) {
  background: #d97706 !important;
}

.submit-btn.tailor-submit-btn:disabled {
  background: #cbd5e1 !important;
  cursor: not-allowed;
  opacity: 0.6;
}

.submit-btn.apply-btn {
  background: #10b981;
  display: flex;
  align-items: center;
}

.submit-btn.apply-btn:hover:not(:disabled) {
  background: #059669;
}

/* Fullscreen Modal Styles */
.fullscreen-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.fullscreen-modal-content {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fullscreen-header {
  background: #e2e8f0;
  color: #1e293b;
  padding: 0;
  border-bottom: 1px solid #cbd5e1;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.close-btn {
  background: #cbd5e1;
  border: none;
  color: #475569;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #94a3b8;
  color: #334155;
  transform: scale(1.05);
}

.fullscreen-body {
  flex: 1;
  overflow-y: auto;
  background: #f8fafc;
  padding: 32px;
}

.fullscreen-input {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  flex: 1;
  align-content: start;
}

@media (max-width: 1024px) {
  .input-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-label {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.fullscreen-textarea {
  width: 100%;
  min-height: 300px;
  max-height: 400px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  background: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.fullscreen-textarea:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.fullscreen-textarea::placeholder {
  color: #94a3b8;
}

.fullscreen-textarea:read-only {
  background: #f8fafc;
  color: #64748b;
  cursor: default;
}

.checkbox-container {
  margin-top: 12px;
}

.checkbox-container .checkbox-label {
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
}

.checkbox-text {
  display: flex;
  align-items: center;
  color: #475569;
}

.fullscreen-actions {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
  margin-top: auto;
  border-radius: 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  justify-content: center;
}

.cancel-action {
  background: #64748b;
  color: white;
}

.cancel-action:hover:not(:disabled) {
  background: #475569;
  transform: translateY(-1px);
}

.optimize-action {
  background: #f59e0b;
  color: white;
}

.optimize-action:hover:not(:disabled) {
  background: #d97706;
  transform: translateY(-1px);
}

.analyze-action {
  background: #3b82f6;
  color: white;
}

.analyze-action:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.fullscreen-analysis {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 24px;
}

.apply-action {
  background: #10b981;
  color: white;
}

.apply-action:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.action-btn:disabled {
  background: #cbd5e1;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* Results Section Styles */
.fullscreen-results {
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 32px;
}

.results-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
  text-align: center;
}

.text-comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 32px;
  align-items: stretch;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .text-comparison {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .comparison-arrow {
    justify-self: center;
    transform: rotate(90deg);
  }
}

.comparison-panel {
  background: #ffffff;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.panel-title {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
}

.original-title {
  background: #fef2f2;
  color: #dc2626;
  border-bottom-color: #fecaca;
}

.optimized-title {
  background: #f0fdf4;
  color: #16a34a;
  border-bottom-color: #bbf7d0;
}

.text-display {
  height: 400px;
  overflow-y: auto;
}

.text-display pre {
  margin: 0;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: transparent;
}

.original-text {
  background: #fefefe;
}

.optimized-text {
  background: #fefefe;
}

.comparison-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
}

.ai-status {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  font-size: 16px;
  font-weight: 600;
  padding: 20px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 12px;
  margin: 24px 0;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

/* Optimization Sections Styles */
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

.optimization-sections .section-title {
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

@media (max-width: 1024px) {
  .before-after-grid {
    grid-template-columns: 1fr;
  }
}

.before-panel {
  padding: 20px;
  border-right: 1px solid #e2e8f0;
  background: #fefefe;
}

.after-panel {
  padding: 20px;
  background: #fefefe;
}

@media (max-width: 1024px) {
  .before-panel {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
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

.content-box.optimized,
.skills-box.optimized {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #14532d;
}

/* Editable text areas for optimized content */
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

.content-textarea::placeholder,
.skills-textarea::placeholder {
  color: #86efac;
  opacity: 0.7;
}

.achievements-editable {
  padding: 16px;
  border-radius: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  min-height: 100px;
}

.achievement-edit-item {
  margin-bottom: 12px;
}

.achievement-edit-item:last-child {
  margin-bottom: 0;
}

.achievement-textarea {
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

.achievement-textarea::placeholder {
  color: #86efac;
  opacity: 0.7;
}

/* Visual indicator for edited content */
.content-textarea.edited,
.skills-textarea.edited,
.achievement-textarea.edited {
  border-color: #f59e0b;
  background: #fffbeb;
}

.content-textarea.edited:focus,
.skills-textarea.edited:focus,
.achievement-textarea.edited:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
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

.achievements-list.optimized {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.achievements-list li {
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: #374151;
}

.achievements-list li:last-child {
  margin-bottom: 0;
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

.cover-letter-display {
  background: #ffffff;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
}

.cover-letter-content {
  padding: 24px;
}

.cover-letter-textarea {
  width: 100%;
  min-height: 400px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: 'Times New Roman', serif;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  background: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cover-letter-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.cover-letter-textarea::placeholder {
  color: #94a3b8;
}

/* Cover Letter Results Full Height Layout */
.cover-letter-results {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
}

.cover-letter-results .results-title {
  margin-bottom: 24px;
  flex-shrink: 0;
}

.cover-letter-results .cover-letter-display {
  flex: 1;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

.cover-letter-results .cover-letter-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cover-letter-results .cover-letter-textarea {
  flex: 1;
  min-height: 0;
  resize: none;
}

.export-help {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
  line-height: 1.4;
}

.section-header-with-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.info-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.info-btn:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.info-content {
  line-height: 1.6;
}

.info-content p {
  margin: 0 0 20px 0;
  color: #475569;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  color: #475569;
  line-height: 1.5;
}

.step-content strong {
  color: #1e293b;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* Remove padding from header-content in guidance modals */
.modal-header .header-content {
  padding: 0;
}

.header-left {
  display: flex;
  align-items: center;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  padding: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #334155;
}

.modal-body {
  padding: 24px;
}

.modal-actions {
  display: flex !important;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 0;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  min-height: 60px;
  align-items: center;
  flex-shrink: 0;
}

.cancel-btn {
  padding: 10px 20px;
  background: #64748b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.cancel-btn:hover {
  background: #475569;
}

.cancel-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
}

.submit-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.modal-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}

.modal-textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 14px;
  font-family: monospace;
  font-size: 13px;
  resize: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
  background: #ffffff;
  flex: 1;
}

.modal-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Import Layout Styles */
.import-layout {
  display: flex;
  align-items: stretch;
  gap: 0;
  margin-bottom: 24px;
  height: calc(100vh - 300px);
  min-height: 400px;
}

/* File Upload Styles */
.upload-section {
  flex: 1;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

.text-section {
  flex: 1;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

.modal-divider {
  display: flex;
  align-items: center;
  margin: 0 16px;
  color: #64748b;
  font-size: 13px;
  flex-shrink: 0;
}

.modal-divider::before,
.modal-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.modal-divider span {
  padding: 0 16px;
  background: #ffffff;
}



.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-upload-area:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.file-upload-area.drag-over {
  border-color: #3b82f6;
  background: #f0f9ff;
  transform: scale(1.02);
}

.file-upload-area.has-file {
  border-color: #10b981;
  background: #f0fdf4;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-text {
  margin: 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
}

.file-name {
  color: #059669;
  font-weight: 600;
}

.upload-hint {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.4;
}

.remove-file-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-file-btn:hover {
  background: #dc2626;
}

.upload-actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

@media print {
  .resume-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .resume-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .resume-sidebar.collapsed {
    width: 100%;
  }
}
</style> 