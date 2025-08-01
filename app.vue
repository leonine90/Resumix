<template>
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
    
    <VersionSelector 
      v-model="activeVersion" 
      :show-versions="reactiveResumeData.enableVersions"
    />
    
    <ResumeHeader 
      :personal="reactiveResumeData.personal" 
      :editable="reactiveResumeData.editable"
      :header-elements="reactiveResumeData.headerElements"
      @update:personal="updatePersonal"
    />
    
    <hr/>
    
    <template v-for="section in reactiveResumeData.sectionOrder">
      <!-- Summary Section -->
      <Summary 
        v-if="section === 'summary' && reactiveResumeData.sections.summary"
        :key="`summary-${section}`"
        :summary-data="reactiveResumeData.summary" 
        :active-version="activeVersion"
        :editable="reactiveResumeData.editable"
        @update:summary-data="updateSummary"
      />
      
      <!-- Research Interests Section -->
      <ResearchInterests 
        v-if="section === 'researchInterests' && reactiveResumeData.sections.researchInterests"
        :key="`researchInterests-${section}`"
        :research-interests="reactiveResumeData.researchInterests" 
        :active-version="currentResearchVersion"
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
      
      <!-- HR separator -->
      <hr v-if="reactiveResumeData.sections[section] && hasNextSection(section)" :key="`hr-${section}`"/>
    </template>
    
    <!-- Floating Toolbar -->
    <FloatingToolbar :editable="reactiveResumeData.editable" />
  </div>
</template>

<script setup>
import { resumeData } from './data/resume.js'

const activeVersion = ref('web-version')
const sidebarCollapsed = ref(false)

// Initialize text selection tracking for floating toolbar
const { initializeSelectionTracking, destroySelectionTracking } = useTextSelection()

// Make the data reactive
const reactiveResumeData = ref({ ...resumeData })

// Use the current version for research interests when versions are disabled
const currentResearchVersion = computed(() => {
  return reactiveResumeData.value.enableVersions ? activeVersion.value : 'web-version'
})

// Compute wrapper margin based on sidebar state
const wrapperMargin = computed(() => {
  return sidebarCollapsed.value ? '50px' : '280px'
})

// Check if there's a next section after the current one
const hasNextSection = (currentSection) => {
  const sections = reactiveResumeData.value.sections
  const sectionOrder = reactiveResumeData.value.sectionOrder
  
  const currentIndex = sectionOrder.indexOf(currentSection)
  if (currentIndex === -1) return false
  
  // Check if any section after the current one is enabled
  for (let i = currentIndex + 1; i < sectionOrder.length; i++) {
    if (sections[sectionOrder[i]]) {
      return true
    }
  }
  return false
}

// Update functions for each section
const updatePersonal = (newPersonal) => {
  reactiveResumeData.value.personal = newPersonal
}

const updateHeaderElements = (newHeaderElements) => {
  reactiveResumeData.value.headerElements = newHeaderElements
}

const updateResearchInterests = (newResearchInterests) => {
  reactiveResumeData.value.researchInterests = newResearchInterests
}

const updateEducation = (newEducation) => {
  reactiveResumeData.value.education = newEducation
}

const updateSummary = (newSummary) => {
  reactiveResumeData.value.summary = newSummary
}

const updateExperience = (newExperience) => {
  reactiveResumeData.value.experience = newExperience
}

const updatePublications = (newPublications) => {
  reactiveResumeData.value.publications = newPublications
}

const updateSkills = (newSkills) => {
  reactiveResumeData.value.skills = newSkills
}

const updateLanguages = (newLanguages) => {
  reactiveResumeData.value.languages = newLanguages
}

const updateSignature = (newSignature) => {
  reactiveResumeData.value.signature = newSignature
}

const updateVolunteering = (newVolunteering) => {
  reactiveResumeData.value.volunteering = newVolunteering
}

const updateSections = (newSections) => {
  reactiveResumeData.value.sections = newSections
}

const updateSectionOrder = (newSectionOrder) => {
  reactiveResumeData.value.sectionOrder = newSectionOrder
}

const updateResumeData = (newResumeData) => {
  reactiveResumeData.value = { ...newResumeData }
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
  title: 'Navid Shiry',
  meta: [
    { name: 'description', content: 'Navid Shiry' }
  ]
})
</script>

<style>
  @page {
    size: A4;
    margin: 0;
    padding: 15mm 10mm;
  }
  @page :first {
    padding-top: 10mm;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Helvetica, Aril, sans-serif;
    font-size: 12px;
    line-height: 1.5;
  }

  body {
    display: flex;
    justify-content: center;
    width: 100vw;
  }

  /* Material Design Theme Colors */
  :root {
    --md-sys-color-primary: #007bff;
    --md-sys-color-on-primary: #ffffff;
    --md-sys-color-primary-container: #e3f2fd;
    --md-sys-color-on-primary-container: #001d36;
    --md-sys-color-secondary: #28a745;
    --md-sys-color-on-secondary: #ffffff;
    --md-sys-color-secondary-container: #e8f5e8;
    --md-sys-color-on-secondary-container: #002105;
    --md-sys-color-error: #dc3545;
    --md-sys-color-on-error: #ffffff;
    --md-sys-color-surface: #ffffff;
    --md-sys-color-on-surface: #1c1b1f;
    --md-sys-color-surface-variant: #f8f9fa;
    --md-sys-color-on-surface-variant: #49454f;
  }

  .resume-wrapper {
    width: 794px;
    height: auto;
    padding: 75.6px;
    background: white;
    box-sizing: border-box;
    transition: margin-left 0.3s ease;
  }

  @media print {
    .resume-wrapper {
      border: none;
      width: 210mm;
      height: auto;
      box-shadow: none;
      page-break-inside: avoid;
    }
  }

  .resume-section {
    margin-bottom: 20px;
  }

  .resume-section h2 {
    margin: 0 0 15px 0;
    font-size: 18px;
    font-weight: bold;
  }

  .resume-section ul {
    margin: 0;
    padding-left: 20px;
  }

  .resume-section li {
    margin-bottom: 8px;
  }

  .resume-section p {
    margin: 5px 0;
  }

  .hide {
    display: none;
  }

  /* Editable styles */
  .editable {
    position: relative;
  }

  .editable:hover {
    background-color: rgba(0, 123, 255, 0.05);
    border-radius: 2px;
  }

  .editable:focus {
    outline: 2px solid #007bff;
    border-radius: 2px;
    background-color: rgba(0, 123, 255, 0.1);
  }

  @media print {
    .editable:hover,
    .editable:focus {
      background-color: transparent;
      outline: none;
    }
  }

  @media (max-width: 768px) {
    .resume-wrapper {
      margin-left: 0 !important;
      width: 100%;
      padding: 20px;
    }
  }
</style>