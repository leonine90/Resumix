<template>
  <div>
    <v-navigation-drawer
      id="sidebar-nav"
      permanent
      :rail="isCollapsed"
      :rail-width="50"
      :width="280"
      color="surface-variant"
      border="end"
      role="complementary"
      aria-label="Resume controls and settings"
    >
      <!-- Header: toggle button + brand -->
      <div class="sidebar-header-bar" :class="{ 'collapsed': isCollapsed }">
        <v-btn
          icon
          size="small"
          variant="text"
          :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :aria-expanded="String(!isCollapsed)"
          @click="toggleSidebar"
        >
          <v-icon>{{ isCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
        </v-btn>
        <span v-if="!isCollapsed" class="sidebar-brand">Resumix</span>
      </div>

      <v-divider />

      <!-- Content: only shown when expanded -->
      <nav v-if="!isCollapsed" class="sidebar-content" aria-label="Resume editing options">
        <v-expansion-panels v-model="openPanels" multiple variant="accordion" class="pa-2">
          <!-- Header Elements -->
          <v-expansion-panel value="header" class="mb-1">
            <v-expansion-panel-title class="panel-title" min-height="44">
              <v-icon size="18" class="mr-2">mdi-account</v-icon>
              <span class="text-body-2 font-weight-medium">Header Elements</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <HeaderElementsControl
                :header-elements="headerElements"
                :personal="personal"
                @toggle-element="toggleHeaderElement"
                @update-headshot="updateHeadshotUrl"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Resume Sections -->
          <v-expansion-panel value="sections" class="mb-1">
            <v-expansion-panel-title class="panel-title" min-height="44">
              <v-icon size="18" class="mr-2">mdi-view-list</v-icon>
              <span class="text-body-2 font-weight-medium">Resume Sections</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <ResumeSectionsControl
                :sections="sections"
                :section-order="sectionOrder"
                @toggle-section="toggleSection"
                @update-order="updateSectionOrder"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Import & Export -->
          <v-expansion-panel value="importExport" class="mb-1">
            <v-expansion-panel-title class="panel-title" min-height="44">
              <v-icon size="18" class="mr-2">mdi-swap-horizontal</v-icon>
              <span class="text-body-2 font-weight-medium">Import &amp; Export</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <ImportExportSection
                @export="handleExport"
                @show-import="showImportModal = true"
                @show-ai-import="showAiImportModal = true"
                @show-info="showInfoModal = true"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Job Optimizer -->
          <v-expansion-panel value="optimizer" class="mb-1">
            <v-expansion-panel-title class="panel-title" min-height="44">
              <v-icon size="18" class="mr-2">mdi-briefcase-search</v-icon>
              <span class="text-body-2 font-weight-medium">Job Optimizer</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <JobOptimizerSection
                @show-tailor-modal="showTailorModal = true"
                @show-optimizer-info="showOptimizerInfoModal = true"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Cover Letter -->
          <v-expansion-panel value="coverLetter">
            <v-expansion-panel-title class="panel-title" min-height="44">
              <v-icon size="18" class="mr-2">mdi-file-document-edit</v-icon>
              <span class="text-body-2 font-weight-medium">Cover Letter</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <CoverLetterSection
                @show-cover-letter-modal="showCoverLetterModal = true"
                @show-cover-letter-info="showCoverLetterInfoModal = true"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </nav>
    </v-navigation-drawer>

    <!-- Modals -->
    <AiImportModal
      :show="showAiImportModal"
      :resume-data="resumeData"
      @close="showAiImportModal = false"
      @import-success="handleImportSuccess"
    />
    <ImportModal
      :show="showImportModal"
      :resume-data="resumeData"
      @close="showImportModal = false"
      @import-success="handleImportSuccess"
    />
    <InfoModal
      :show="showInfoModal"
      @close="showInfoModal = false"
    />
    <TailorResumeModal
      :show="showTailorModal"
      :resume-data="resumeData"
      @close="showTailorModal = false"
      @apply-optimizations="handleApplyOptimizations"
    />
    <OptimizerInfoModal
      :show="showOptimizerInfoModal"
      @close="showOptimizerInfoModal = false"
    />
    <CoverLetterModal
      :show="showCoverLetterModal"
      :resume-data="resumeData"
      @close="showCoverLetterModal = false"
    />
    <CoverLetterInfoModal
      :show="showCoverLetterInfoModal"
      @close="showCoverLetterInfoModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderElementsControl from './sidebar/HeaderElementsControl.vue'
import ResumeSectionsControl from './sidebar/ResumeSectionsControl.vue'
import ImportExportSection from './sidebar/ImportExportSection.vue'
import JobOptimizerSection from './sidebar/JobOptimizerSection.vue'
import CoverLetterSection from './sidebar/CoverLetterSection.vue'
import AiImportModal from './modals/AiImportModal.vue'
import ImportModal from './modals/ImportModal.vue'
import InfoModal from './modals/InfoModal.vue'
import TailorResumeModal from './modals/TailorResumeModal.vue'
import OptimizerInfoModal from './modals/OptimizerInfoModal.vue'
import CoverLetterModal from './modals/CoverLetterModal.vue'
import CoverLetterInfoModal from './modals/CoverLetterInfoModal.vue'
import { useResumeImport } from '~/composables/useResumeImport'

const props = defineProps({
  headerElements: { type: Object, required: true },
  sections: { type: Object, required: true },
  personal: { type: Object, required: true },
  sectionOrder: { type: Array, required: true },
  resumeData: { type: Object, required: true },
})

const emit = defineEmits([
  'update:headerElements',
  'update:sections',
  'update:collapsed',
  'update:personal',
  'update:sectionOrder',
  'update:resumeData',
])

const { exportData } = useResumeImport()

const isCollapsed = ref(false)
const openPanels = ref(['importExport'])

// Modal visibility
const showImportModal = ref(false)
const showAiImportModal = ref(false)
const showInfoModal = ref(false)
const showTailorModal = ref(false)
const showOptimizerInfoModal = ref(false)
const showCoverLetterModal = ref(false)
const showCoverLetterInfoModal = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('update:collapsed', isCollapsed.value)
}

const toggleHeaderElement = (element, visible) => {
  emit('update:headerElements', { ...props.headerElements, [element]: visible })
}

const updateHeadshotUrl = (value) => {
  emit('update:personal', { ...props.personal, headshot: value })
}

const toggleSection = (section, visible) => {
  emit('update:sections', { ...props.sections, [section]: visible })
}

const updateSectionOrder = (newOrder) => {
  emit('update:sectionOrder', newOrder)
}

const handleExport = () => {
  exportData(props.resumeData, props.headerElements, props.sections, props.sectionOrder, props.personal)
}

const handleImportSuccess = (mergedData) => {
  emit('update:resumeData', mergedData)
  showImportModal.value = false
  showAiImportModal.value = false
}

const handleApplyOptimizations = (updatedData) => {
  emit('update:resumeData', updatedData)
}

</script>

<style scoped>
.sidebar-header-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  min-height: 52px;
}

.sidebar-header-bar.collapsed {
  justify-content: center;
  padding: 8px;
}

.sidebar-brand {
  font-size: 15px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin-left: 8px;
  flex: 1;
}

.sidebar-content {
  overflow-y: auto;
  flex: 1;
}

.panel-title {
  font-size: 13px !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 12px 12px;
}

:deep(.v-expansion-panel-title) {
  padding: 0 12px;
}

:deep(.v-expansion-panel) {
  border-radius: 8px !important;
}

:deep(.v-expansion-panel--active > .v-expansion-panel-title) {
  min-height: 44px;
}

@media print {
  :deep(.v-navigation-drawer) {
    display: none !important;
  }
}

@media (max-width: 768px) {
  :deep(.v-navigation-drawer) {
    width: 100% !important;
    height: auto !important;
    position: relative !important;
    border-right: none !important;
    border-bottom: 1px solid rgb(var(--v-theme-outline)) !important;
  }
}
</style>
