<template>
  <div>
    <div class="resume-sidebar" :class="{ collapsed: isCollapsed }">
      <SidebarHeader 
        :is-collapsed="isCollapsed" 
        @toggle-sidebar="toggleSidebar" 
      />
      
      <div v-if="!isCollapsed" class="sidebar-content">
        <!-- Header Elements Control -->
        <HeaderElementsControl
          :header-elements="headerElements"
          :personal="personal"
          :is-open="headerSectionOpen"
          @toggle-element="toggleHeaderElement"
          @update-headshot="updateHeadshotUrl"
          @toggle-section="toggleHeaderSection"
        />

        <!-- Resume Sections Control -->
        <ResumeSectionsControl
          :sections="sections"
          :section-order="sectionOrder"
          :is-open="sectionsSectionOpen"
          @toggle-section="toggleSection"
          @update-order="updateSectionOrder"
          @toggle-section-panel="toggleSectionsSection"
        />

        <!-- Import & Export Section -->
        <ImportExportSection
          :is-open="importExportSectionOpen"
          @export="handleExport"
          @show-import="showImportModal = true"
          @show-ai-import="showAiImportModal = true"
          @show-info="showInfoModal = true"
          @toggle-section="toggleImportExportSection"
        />

        <!-- Job Optimizer Section -->
        <JobOptimizerSection
          :is-open="jobOptimizerSectionOpen"
          @show-tailor-modal="showTailorModal = true"
          @show-optimizer-info="showOptimizerInfoModal = true"
          @toggle-section="toggleJobOptimizerSection"
        />

        <!-- Cover Letter Section -->
        <CoverLetterSection
          :is-open="coverLetterSectionOpen"
          @show-cover-letter-modal="showCoverLetterModal = true"
          @show-cover-letter-info="showCoverLetterInfoModal = true"
          @toggle-section="toggleCoverLetterSection"
        />
      </div>
    </div>

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
import { ref, watch, onUnmounted } from 'vue'
import SidebarHeader from './sidebar/SidebarHeader.vue'
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
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'
import { useResumeImport } from '~/composables/useResumeImport'

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

const emit = defineEmits([
  'update:headerElements', 
  'update:sections', 
  'update:collapsed', 
  'update:personal', 
  'update:sectionOrder', 
  'update:resumeData'
])

// Body scroll lock for modals
const { lockScroll, unlockScroll } = useBodyScrollLock()

// Import/export composable
const { exportData } = useResumeImport()

// Sidebar state
const isCollapsed = ref(false)

// Section open/close state
const headerSectionOpen = ref(false)
const sectionsSectionOpen = ref(false)
const importExportSectionOpen = ref(true)
const jobOptimizerSectionOpen = ref(false)
const coverLetterSectionOpen = ref(false)

// Modal visibility state
const showImportModal = ref(false)
const showAiImportModal = ref(false)
const showInfoModal = ref(false)
const showTailorModal = ref(false)
const showOptimizerInfoModal = ref(false)
const showCoverLetterModal = ref(false)
const showCoverLetterInfoModal = ref(false)

// Sidebar toggle
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('update:collapsed', isCollapsed.value)
}

// Section toggle functions
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

// Header elements handlers
const toggleHeaderElement = (element, visible) => {
  const updatedHeaderElements = { ...props.headerElements, [element]: visible }
  emit('update:headerElements', updatedHeaderElements)
}

const updateHeadshotUrl = (event) => {
  const newPersonal = { ...props.personal, headshot: event.target.value }
  emit('update:personal', newPersonal)
}

// Section handlers
const toggleSection = (section, visible) => {
  const updatedSections = { ...props.sections, [section]: visible }
  emit('update:sections', updatedSections)
}

const updateSectionOrder = (newOrder) => {
  emit('update:sectionOrder', newOrder)
}

// Import/Export handlers
const handleExport = () => {
  exportData(
    props.resumeData,
    props.headerElements,
    props.sections,
    props.sectionOrder,
    props.personal
  )
}

const handleImportSuccess = (mergedData) => {
  emit('update:resumeData', mergedData)
  showImportModal.value = false
  showAiImportModal.value = false
}

const handleApplyOptimizations = (updatedData) => {
  emit('update:resumeData', updatedData)
}

// Watch for modal states to lock/unlock scroll
watch(showImportModal, (newValue) => {
  if (newValue) lockScroll()
  else unlockScroll()
})

watch(showAiImportModal, (newValue) => {
  if (newValue) lockScroll()
  else unlockScroll()
})

watch(showInfoModal, (newValue) => {
  if (newValue) lockScroll()
  else unlockScroll()
})

watch(showTailorModal, (newValue) => {
  if (newValue) lockScroll()
  else unlockScroll()
})

watch(showOptimizerInfoModal, (newValue) => {
  if (newValue) lockScroll()
  else unlockScroll()
})

watch(showCoverLetterModal, (newValue) => {
  if (newValue) lockScroll()
  else unlockScroll()
})

watch(showCoverLetterInfoModal, (newValue) => {
  if (newValue) lockScroll()
  else unlockScroll()
})

// Clean up scroll lock when component unmounts
onUnmounted(() => {
  unlockScroll()
})
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
