<template>
  <div>
    <!-- Skip Navigation Links -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#sidebar-nav" class="skip-link">Skip to navigation</a>
    
    <div class="resume-wrapper" :style="{ marginLeft: wrapperMargin }">
      <ResumeSidebar 
      :header-elements="reactiveResumeData.headerElements"
      :sections="reactiveResumeData.sections"
      :personal="reactiveResumeData.personal"
      :section-order="reactiveResumeData.sectionOrder"
      :resume-data="reactiveResumeData"
      @update:header-elements="updateHeaderElements"
      @update:sections="updateSections"
      @update:collapsed="updateSidebarCollapsed"
      @update:personal="updatePersonal"
      @update:section-order="updateSectionOrder"
      @update:resume-data="updateResumeData"
    />
    
    <PDFDownloader />
    
    <main id="main-content" role="main" aria-label="Resume content">
      <ResumeHeader 
      :personal="reactiveResumeData.personal" 
      :editable="reactiveResumeData.editable"
      :header-elements="reactiveResumeData.headerElements"
      @update:personal="updatePersonal"
    />
    
    <template v-for="section in reactiveResumeData.sectionOrder">
      <!-- Summary Section -->
      <Summary 
        v-if="section === 'summary' && reactiveResumeData.sections.summary"
        :key="`summary-${section}`"
        :summary-data="reactiveResumeData.summary" 

        :editable="reactiveResumeData.editable"
        @update:summary-data="updateSummary"
      />
      
      <!-- Research Interests Section -->
      <ResearchInterests 
        v-if="section === 'researchInterests' && reactiveResumeData.sections.researchInterests"
        :key="`researchInterests-${section}`"
        :research-interests="reactiveResumeData.researchInterests" 
        :editable="reactiveResumeData.editable"
        @update:research-interests="updateResearchInterests"
      />
      
      <!-- Education Section -->
      <Education 
        v-if="section === 'education' && reactiveResumeData.sections.education"
        :key="`education-${section}`"
        :education-data="reactiveResumeData.education" 
        :editable="reactiveResumeData.editable"
        @update:education-data="updateEducation"
      />
      
      <!-- Experience Section -->
      <Experience 
        v-if="section === 'experience' && reactiveResumeData.sections.experience"
        :key="`experience-${section}`"
        :experience-data="reactiveResumeData.experience" 
        :editable="reactiveResumeData.editable"
        @update:experience-data="updateExperience"
      />
      
      <!-- Publications Section -->
      <Publications 
        v-if="section === 'publications' && reactiveResumeData.sections.publications"
        :key="`publications-${section}`"
        :publications-data="reactiveResumeData.publications" 
        :editable="reactiveResumeData.editable"
        @update:publications-data="updatePublications"
      />
      
      <!-- Skills Section -->
      <Skills 
        v-if="section === 'skills' && reactiveResumeData.sections.skills"
        :key="`skills-${section}`"
        :skills-data="reactiveResumeData.skills" 
        :editable="reactiveResumeData.editable"
        @update:skills-data="updateSkills"
      />
      
      <!-- Languages Section -->
      <Languages 
        v-if="section === 'languages' && reactiveResumeData.sections.languages"
        :key="`languages-${section}`"
        :languages-data="reactiveResumeData.languages" 
        :editable="reactiveResumeData.editable"
        @update:languages-data="updateLanguages"
      />
      
      <!-- Volunteering Section -->
      <Volunteering 
        v-if="section === 'volunteering' && reactiveResumeData.sections.volunteering"
        :key="`volunteering-${section}`"
        :volunteering-data="reactiveResumeData.volunteering" 
        :editable="reactiveResumeData.editable"
        @update:volunteering-data="updateVolunteering"
      />
      
      <!-- Signature Section -->
      <Signature 
        v-if="section === 'signature' && reactiveResumeData.sections.signature"
        :key="`signature-${section}`"
        :signature-data="reactiveResumeData.signature" 
        :personal="reactiveResumeData.personal"
        :editable="reactiveResumeData.editable"
        @update:signature-data="updateSignature"
      />
      
    </template>
    
    <!-- Floating Toolbar -->
    <FloatingToolbar :editable="reactiveResumeData.editable" />
    
    <!-- Toast Notifications -->
    <ToastContainer />
    
    <!-- Consent Modal -->
    <ConsentModal />
    
    <!-- Keyboard Shortcuts -->
    <KeyboardShortcuts />
    </main>
  </div>
  
  <!-- App Footer (outside resume wrapper) -->
  <AppFooter :sidebar-collapsed="sidebarCollapsed" />
  </div>
</template>

<script setup>
import { resumeData } from '~/data/resume.js'
import AppFooter from '~/components/AppFooter.vue'
import KeyboardShortcuts from '~/components/KeyboardShortcuts.vue'
import { useSessionStorage } from '~/composables/useSessionStorage'

const ConsentModal = defineAsyncComponent(() => import('~/components/modals/ConsentModal.vue'))

const sidebarCollapsed = ref(false)

// Initialize text selection tracking for floating toolbar
const { initializeSelectionTracking, destroySelectionTracking } = useTextSelection()

// Initialize session storage
const {
  data: sessionData,
  isLoading: isSessionLoading,
  hasError: sessionHasError,
  watchForChanges,
  clearSessionStorage,
  saveImmediately
} = useSessionStorage()

// Make the data reactive - use initial data immediately so the template can render safely
const reactiveResumeData = ref({ ...resumeData })
let resumeWatcherCleanup = null

const initializeResumeData = (dataToUse) => {
  reactiveResumeData.value = dataToUse

  if (resumeWatcherCleanup) {
    resumeWatcherCleanup()
  }

  resumeWatcherCleanup = watchForChanges(reactiveResumeData.value)
}

// Initialize data on mount
onMounted(() => {
  const useSessionData = sessionData.value && !sessionHasError.value
  const initialData = useSessionData ? sessionData.value : { ...resumeData }
  initializeResumeData(initialData)

  if (!useSessionData) {
    saveImmediately(reactiveResumeData.value)
    console.log('Using initial data and saving to session storage')
  } else {
    console.log('Using session storage data')
  }

  // Cleanup on unmount
  onUnmounted(() => {
    destroySelectionTracking()
    if (resumeWatcherCleanup) {
      resumeWatcherCleanup()
    }
  })
})



// Compute wrapper margin based on sidebar state
const wrapperMargin = computed(() => {
  return sidebarCollapsed.value ? '50px' : '280px'
})

// Check if there's a next section after the current one
// Update functions for each section
const updatePersonal = (newPersonal) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.personal = newPersonal
    // Save to session storage
    saveImmediately(reactiveResumeData.value)
  }
}

const updateHeaderElements = (newHeaderElements) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.headerElements = newHeaderElements
    saveImmediately(reactiveResumeData.value)
  }
}

const updateResearchInterests = (newResearchInterests) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.researchInterests = newResearchInterests
    saveImmediately(reactiveResumeData.value)
  }
}

const updateEducation = (newEducation) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.education = newEducation
    saveImmediately(reactiveResumeData.value)
  }
}

const updateSummary = (newSummary) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.summary = newSummary
    saveImmediately(reactiveResumeData.value)
  }
}

const updateExperience = (newExperience) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.experience = newExperience
    saveImmediately(reactiveResumeData.value)
  }
}

const updatePublications = (newPublications) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.publications = newPublications
    saveImmediately(reactiveResumeData.value)
  }
}

const updateSkills = (newSkills) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.skills = newSkills
    saveImmediately(reactiveResumeData.value)
  }
}

const updateLanguages = (newLanguages) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.languages = newLanguages
    saveImmediately(reactiveResumeData.value)
  }
}

const updateSignature = (newSignature) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.signature = newSignature
    saveImmediately(reactiveResumeData.value)
  }
}

const updateVolunteering = (newVolunteering) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.volunteering = newVolunteering
    saveImmediately(reactiveResumeData.value)
  }
}

const updateSections = (newSections) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.sections = newSections
    saveImmediately(reactiveResumeData.value)
  }
}

const updateSectionOrder = (newSectionOrder) => {
  if (reactiveResumeData.value) {
    reactiveResumeData.value.sectionOrder = newSectionOrder
    saveImmediately(reactiveResumeData.value)
  }
}

const updateResumeData = (newResumeData) => {
  if (reactiveResumeData.value) {
    Object.assign(reactiveResumeData.value, newResumeData)
    saveImmediately(reactiveResumeData.value)
  }
}

const updateSidebarCollapsed = (collapsed) => {
  sidebarCollapsed.value = collapsed
}

// Initialize text selection tracking when editable mode is active (client-side only)
onMounted(() => {
  watch(() => reactiveResumeData.value.editable, (editable) => {
    if (editable) {
      nextTick(() => {
        initializeSelectionTracking()
      })
    } else {
      destroySelectionTracking()
    }
  }, { immediate: true })
})

// Cleanup on unmount
onUnmounted(() => {
  destroySelectionTracking()
})

useHead({
      title: 'Resumix',
    meta: [
      { name: 'description', content: 'Resumix' }
    ]
})
</script>

<style>
  /* ===== PRINT ===== */
  @page {
    size: A4;
    margin: 0;
    padding: 15mm 10mm;
  }
  @page :first { padding-top: 10mm; }

  /* ===== BASE ===== */
  html {
    font-size: 16px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    color: #1C1B1F;
  }

  body {
    display: flex;
    justify-content: center;
    width: 100vw;
    background: #FAFAFA;
  }

  /* Scrollbar shift prevention */
  :root { --scrollbar-width: calc(100vw - 100%); }
  body.scroll-locked {
    overflow: hidden;
    padding-right: var(--scrollbar-width, 0px);
  }

  /* ===== RESUME CANVAS ===== */
  .resume-wrapper {
    width: 794px;
    height: auto;
    padding: 75.6px;
    background: #FFFFFF;
    box-sizing: border-box;
    transition: margin-left 0.3s ease;
    font-size: 0.75rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .resume-wrapper {
      margin-left: 0 !important;
      width: 100%;
      padding: 20px;
    }
  }

  @media print {
    .resume-wrapper {
      width: 210mm;
      height: auto;
      border: none;
      box-shadow: none;
      page-break-inside: avoid;
    }
  }

  /* ===== RESUME SECTIONS ===== */
  .resume-section {
    margin-bottom: 20px;
  }

  .resume-section h2 {
    margin: 8px 0 6px;
    font-size: 1.125rem;
    font-weight: 700;
    color: #1565C0;
    border-bottom: 2px solid #1565C0;
    padding-bottom: 4px;
    letter-spacing: 0.01em;
  }

  .resume-section ul {
    margin: 0;
    padding-left: 20px;
  }

  .resume-section li {
    margin-bottom: 6px;
  }

  .resume-section p {
    margin: 4px 0;
  }

  .resume-section > div {
    margin-bottom: 16px;
  }

  .resume-section > div:last-child {
    margin-bottom: 0;
  }

  .title-row { margin-bottom: 6px; }

  .hide { display: none; }

  /* ===== EDITABLE ===== */
  .editable {
    position: relative;
    min-width: 1em;
  }

  .editable:hover {
    background-color: rgba(21, 101, 192, 0.06);
    border-radius: 4px;
  }

  .editable:focus {
    outline: 2px solid #1565C0;
    border-radius: 4px;
    background-color: rgba(21, 101, 192, 0.08);
  }

  @media print {
    .editable:hover, .editable:focus {
      background-color: transparent;
      outline: none;
    }
  }

  /* ===== ACCESSIBILITY ===== */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skip-link {
    position: fixed;
    top: -100px;
    left: 0;
    background: #000000;
    color: #ffffff;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border-radius: 0 0 4px 0;
    z-index: 100000;
    font-weight: 600;
    font-size: 0.875rem;
    opacity: 0;
    transition: top 0.3s ease, opacity 0.3s ease;
  }

  .skip-link:focus {
    top: 0;
    opacity: 1;
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  *:focus-visible {
    outline: 2px solid #1565C0;
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) { outline: none; }

  a {
    text-decoration: underline;
    text-underline-offset: 0.125rem;
  }

  a:hover { text-decoration-thickness: 2px; }

  [aria-hidden="true"] { pointer-events: none; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  @media (prefers-contrast: high) {
    * { border-color: currentColor !important; }
    button, a { outline: 2px solid currentColor; }
  }

  @media (max-width: 768px) {
    html { font-size: 14px; }
  }

  /* ===== STATE COLORS ===== */
  .error, [aria-invalid="true"] { color: #C62828; border-color: #C62828; }
  .success { color: #2E7D32; }
  .warning { color: #E65100; }
  .info { color: #01579B; }
</style>

