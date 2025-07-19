<template>
  <div>
    <div class="resume-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <button class="toggle-btn" @click="toggleSidebar">
        <Icon v-if="!isCollapsed" icon="material-symbols:chevron-left" style="font-size: 16px;" />
        <Icon v-else icon="material-symbols:chevron-right" style="font-size: 16px;" />
      </button>
      <h3 v-if="!isCollapsed">Resume Controls</h3>
    </div>
    
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
          <div v-for="section in sectionOrder" :key="section" class="control-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                :checked="sections[section]" 
                @change="toggleSection(section, $event.target.checked)"
                class="checkbox-input"
              >
              <span class="section-name">{{ formatSectionName(section) }}</span>
            </label>
            <div v-if="section !== 'summary'" class="section-controls">
              <button 
                class="move-btn" 
                @click="moveSectionUp(section)"
                :disabled="!canMoveUp(section)"
                title="Move up"
              >
                <Icon icon="material-symbols:keyboard-arrow-up" style="font-size: 12px;" />
              </button>
              <button 
                class="move-btn" 
                @click="moveSectionDown(section)"
                :disabled="!canMoveDown(section)"
                title="Move down"
              >
                <Icon icon="material-symbols:keyboard-arrow-down" style="font-size: 12px;" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Management Section -->
      <div class="control-section">
        <div class="section-header" @click="toggleDataManagementSection">
          <Icon class="section-icon" icon="material-symbols:storage" style="font-size: 16px;" />
          <span class="section-title">Data Management</span>
          <Icon class="toggle-icon" :icon="dataManagementSectionOpen ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'" style="font-size: 12px;" />
        </div>
        <div v-if="dataManagementSectionOpen" class="section-content">
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
          <button class="import-btn" @click="showImportModal = true">
            <Icon icon="material-symbols:file-upload" style="font-size: 14px;" />
            Import from JSON
          </button>
          <small class="export-help">Export current data or import from JSON file</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Import Modal -->
  <div v-if="showImportModal" class="modal-overlay" @click="showImportModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Import Resume Data</h3>
        <button class="modal-close" @click="showImportModal = false">
          <Icon icon="material-symbols:close" style="font-size: 20px;" />
        </button>
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
        <h3>Using an AI to Generate a Resume</h3>
        <button class="modal-close" @click="showInfoModal = false">
          <Icon icon="material-symbols:close" style="font-size: 20px;" />
        </button>
      </div>
      <div class="modal-body">
        <div class="info-content">
          <p>For a more flexible way to create or edit your resume, you can use a large language model (LLM) like Gemini, ChatGPT, or Claude.</p>
          
          <div class="step-list">
            <div class="step-item">
              <span class="step-number">1.</span>
              <div class="step-content">
                <strong>Export a sample:</strong> Start by exporting the default resume on this page using the Export as JSON button. This will give you a perfect template of the JSON structure.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">2.</span>
              <div class="step-content">
                <strong>Give the AI the JSON:</strong> Copy the exported JSON data and paste it into your AI of choice, telling it that this is the structure you need.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">3.</span>
              <div class="step-content">
                <strong>Provide your content:</strong> In the same prompt, provide your resume text (either a new resume or changes to an existing one) and ask the AI to generate a new JSON file using your content while following the structure of the sample you provided.
              </div>
            </div>
            
            <div class="step-item">
              <span class="step-number">4.</span>
              <div class="step-content">
                <strong>Import the new JSON:</strong> Copy the JSON generated by the AI and use the Import from JSON option in the Data Management section to update your resume.
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

const isCollapsed = ref(false)
const showImportModal = ref(false)
const showInfoModal = ref(false)
const importJsonText = ref('')
const headerSectionOpen = ref(false)
const sectionsSectionOpen = ref(false)
const dataManagementSectionOpen = ref(true)

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

const toggleDataManagementSection = () => {
  dataManagementSectionOpen.value = !dataManagementSectionOpen.value
}

const toggleHeaderElement = (element, visible) => {
  const updatedHeaderElements = { ...props.headerElements, [element]: visible }
  emit('update:headerElements', updatedHeaderElements)
}

const toggleSection = (section, visible) => {
  const updatedSections = { ...props.sections, [section]: visible }
  emit('update:sections', updatedSections)
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
      alert('Invalid JSON data. Please check your input.')
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
      sections: {
        ...currentData.sections,
        ...importedData.sections
      },
      
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
    
    alert('Data imported successfully! All sections are now available in the sidebar.')
  } catch (error) {
    alert('Error parsing JSON data. Please check your input.')
    console.error('Import error:', error)
  }
}

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

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #ffffff;
}

.toggle-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.sidebar-header h3 {
  margin: 0 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
  transition: color 0.2s ease;
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
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
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
}

.cancel-btn:hover {
  background: #475569;
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
  resize: vertical;
  box-sizing: border-box;
  transition: all 0.2s ease;
  background: #ffffff;
}

.modal-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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