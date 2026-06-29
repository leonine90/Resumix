<template>
  <div>
    <v-navigation-drawer
      id="sidebar-nav"
      permanent
      :rail="isCollapsed"
      :rail-width="50"
      :width="280"
      color="surface-variant"
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

      <!-- Content: only shown when expanded -->
      <nav v-if="!isCollapsed" class="sidebar-content" aria-label="Resume editing options">
        <!-- Tab Switcher -->
        <div class="tab-switcher" role="tablist" aria-label="Sidebar mode">
          <button
            role="tab"
            :aria-selected="activeTab === 'resume'"
            :class="['tab-btn', { 'tab-btn--active': activeTab === 'resume' }]"
            @click="activeTab = 'resume'"
          >
            <v-icon size="15" class="tab-btn-icon">mdi-file-document-outline</v-icon>
            Resume
          </button>
          <button
            role="tab"
            :aria-selected="activeTab === 'ai'"
            :class="['tab-btn', 'tab-btn--ai', { 'tab-btn--active tab-btn--ai-active': activeTab === 'ai' }]"
            @click="activeTab = 'ai'"
          >
            <v-icon size="15" class="tab-btn-icon">mdi-auto-fix</v-icon>
            AI Tools
          </button>
        </div>

        <!-- Resume Tab -->
        <div v-show="activeTab === 'resume'" role="tabpanel" aria-label="Resume configuration">
          <v-expansion-panels v-model="openResumePanels" multiple variant="accordion" class="pa-2">
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
            <v-expansion-panel value="importExport">
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
          </v-expansion-panels>
        </div>

        <!-- AI Tools Tab -->
        <div v-show="activeTab === 'ai'" role="tabpanel" aria-label="AI generation tools">
          <div class="ai-tab-banner">
            <v-icon size="14" class="ai-tab-banner-icon">mdi-lightning-bolt</v-icon>
            <span>Powered by AI — requires AI features enabled</span>
          </div>
          <v-expansion-panels v-model="openAiPanels" multiple variant="accordion" class="pa-2 pt-1">
            <!-- Job Optimizer -->
            <v-expansion-panel value="optimizer" class="mb-1 ai-panel">
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
            <v-expansion-panel value="coverLetter" class="ai-panel">
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
        </div>
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
const activeTab = ref('resume')
const openResumePanels = ref(['importExport'])
const openAiPanels = ref([])

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
  padding: 10px 12px;
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

/* ── Tab Switcher ── */
.tab-switcher {
  display: flex;
  gap: 6px;
  padding: 6px 12px 4px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 10px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, opacity 0.15s;
  background: transparent;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.5;
  letter-spacing: 0.01em;
}

.tab-btn:hover {
  background: rgba(var(--v-theme-on-surface), 0.06);
  opacity: 0.8;
}

.tab-btn--active {
  background: rgba(21, 101, 192, 0.12);
  color: #1565C0;
  opacity: 1;
}

.tab-btn--ai.tab-btn--ai-active {
  background: rgba(103, 58, 183, 0.1);
  color: #673AB7;
  opacity: 1;
}

.tab-btn-icon {
  flex-shrink: 0;
}

/* ── AI Tab Banner ── */
.ai-tab-banner {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 4px 12px 0;
  padding: 5px 8px;
  border-radius: 6px;
  background: rgba(103, 58, 183, 0.08);
  font-size: 11px;
  color: #673AB7;
  line-height: 1.3;
}

.ai-tab-banner-icon {
  flex-shrink: 0;
}

/* Sidebar action buttons — smaller font to suit the narrow panel */
:deep(.v-btn.v-btn--density-default) {
  font-size: 13px !important;
  height: 34px !important;
}

/* ── Flat expansion panels ── */

/* Strip all card chrome from panels */
:deep(.v-expansion-panel) {
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 8px !important;
}

:deep(.v-expansion-panel::before) {
  box-shadow: none !important;
}

/* Remove the top border accordion adds between adjacent panels */
:deep(.v-expansion-panels--variant-accordion > :not(:first-child)) {
  border-top: none !important;
}

/* Flat panel title */
:deep(.v-expansion-panel-title) {
  padding: 0 12px !important;
  border-radius: 8px !important;
  transition: background-color 0.15s !important;
  font-size: 13px !important;
  min-height: 40px !important;
}

:deep(.v-expansion-panel-title:hover) {
  background: rgba(var(--v-theme-on-surface), 0.06) !important;
}

/* Active panel title — neutral grey so it doesn't clash with buttons inside */
:deep(.v-expansion-panel--active > .v-expansion-panel-title) {
  background: rgba(var(--v-theme-on-surface), 0.08) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border-radius: 8px 8px 0 0 !important;
  min-height: 44px !important;
}

/* Active AI panel title — also neutral */
:deep(.ai-panel.v-expansion-panel--active > .v-expansion-panel-title) {
  background: rgba(var(--v-theme-on-surface), 0.08) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.ai-panel .v-expansion-panel-title .v-icon) {
  color: inherit;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 12px 14px;
}

/* Panel content area — subtle neutral tint when open */
:deep(.v-expansion-panel--active .v-expansion-panel-text) {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border-radius: 0 0 8px 8px;
}

:deep(.ai-panel.v-expansion-panel--active .v-expansion-panel-text) {
  background: rgba(var(--v-theme-on-surface), 0.03);
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
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06) !important;
  }
}
</style>
