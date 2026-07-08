import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { resumeData as initialResumeData } from '~/data/resume.js'

// Session storage key
const SESSION_STORAGE_KEY = 'resume-maker-data'

// Default data structure is the mock resume data
const defaultData = JSON.parse(JSON.stringify(initialResumeData))

export function useSessionStorage() {
  const data = ref(null)
  const isLoading = ref(true)
  const hasError = ref(false)

  const isIncompleteSessionData = (parsed) => {
    if (!parsed || typeof parsed !== 'object') return true

    const contentKeys = ['researchInterests', 'education', 'summary', 'experience', 'publications', 'skills', 'languages', 'volunteering']
    const isContentEmpty = contentKeys.every((key) => {
      const value = parsed[key]
      if (Array.isArray(value)) return value.length === 0
      if (typeof value === 'string') return value.trim().length === 0
      return value === null || value === undefined
    })

    const hasHeaderPersonal = parsed.personal && typeof parsed.personal === 'object' && parsed.personal.name && parsed.personal.title

    return hasHeaderPersonal && isContentEmpty
  }

  // Get data from sessionStorage
  const getStoredData = () => {
    if (!process.client) return null

    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (!stored) return null

      const parsed = JSON.parse(stored)

      // Ignore stale header-only session data and use defaults instead
      if (isIncompleteSessionData(parsed)) {
        console.warn('Ignoring incomplete sessionStorage resume data and using mock defaults')
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
        return null
      }

      // Validate that it has the expected structure
      if (!parsed || typeof parsed !== 'object') return null

      // Ensure required fields exist
      const validated = {
        ...defaultData,
        ...parsed,
        personal: { ...defaultData.personal, ...(parsed.personal || {}) },
        signature: { ...defaultData.signature, ...(parsed.signature || {}) }
      }

      return validated
    } catch (error) {
      console.error('Error parsing sessionStorage data:', error)
      return null
    }
  }

  // Save data to sessionStorage
  const saveToSessionStorage = (resumeData) => {
    if (!process.client) return

    try {
      // Only save essential fields to reduce storage size
      const serializableData = {
        editable: resumeData.editable,
        headerElements: resumeData.headerElements,
        sections: resumeData.sections,
        sectionOrder: resumeData.sectionOrder,
        personal: resumeData.personal,
        researchInterests: resumeData.researchInterests,
        education: resumeData.education,
        summary: resumeData.summary,
        experience: resumeData.experience,
        publications: resumeData.publications,
        skills: resumeData.skills,
        languages: resumeData.languages,
        signature: resumeData.signature,
        volunteering: resumeData.volunteering,
        // Add timestamp for data freshness
        lastUpdated: new Date().toISOString()
      }

      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(serializableData))
    } catch (error) {
      console.error('Error saving to sessionStorage:', error)
    }
  }

  // Clear sessionStorage
  const clearSessionStorage = () => {
    if (!process.client) return
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing sessionStorage:', error)
    }
  }

  // Initialize data
  const initializeData = () => {
    isLoading.value = true
    hasError.value = false

    try {
      const storedData = getStoredData()

      if (storedData) {
        // Validate stored data more thoroughly
        if (!storedData.personal || !storedData.sections) {
          console.warn('Invalid data structure in sessionStorage, using defaults')
          data.value = { ...defaultData }
          saveToSessionStorage(data.value)
        } else {
          data.value = storedData
          console.log('Restored resume data from sessionStorage')
        }
      } else {
        // Use initial data and save it
        data.value = { ...defaultData }
        saveToSessionStorage(data.value)
        console.log('Initialized new resume data and saved to sessionStorage')
      }
    } catch (error) {
      console.error('Error initializing data:', error)
      hasError.value = true
      data.value = { ...defaultData }
      saveToSessionStorage(data.value)
    } finally {
      isLoading.value = false
    }
  }

  // Watch for data changes and save to sessionStorage
  const watchForChanges = (resumeData) => {
    // Save initial data
    saveToSessionStorage(resumeData)

    // Set up watchers for key changes
    const unwatchers = []

    // Watch personal data changes
    unwatchers.push(
      watch(() => resumeData.personal, (newPersonal) => {
        if (newPersonal) saveToSessionStorage(resumeData)
      }, { deep: true })
    )

    // Watch sections visibility changes
    unwatchers.push(
      watch(() => resumeData.sections, () => {
        saveToSessionStorage(resumeData)
      }, { deep: true })
    )

    // Watch content changes for major sections
    const contentSections = ['researchInterests', 'education', 'summary', 'experience', 'publications', 'skills', 'languages', 'volunteering', 'signature']

    contentSections.forEach(section => {
      unwatchers.push(
        watch(() => resumeData[section], () => {
          saveToSessionStorage(resumeData)
        }, { deep: true })
      )
    })

    return () => {
      unwatchers.forEach(unwatch => unwatch())
    }
  }

  // Get last updated timestamp
  const getLastUpdated = () => {
    if (!process.client) return null

    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (!stored) return null

      const parsed = JSON.parse(stored)
      return parsed.lastUpdated || null
    } catch (error) {
      console.error('Error getting last updated:', error)
      return null
    }
  }

  // Force refresh data from sessionStorage
  const refreshFromSessionStorage = () => {
    const storedData = getStoredData()
    if (storedData) {
      data.value = storedData
      return true
    }
    return false
  }

  // Save data immediately
  const saveImmediately = (resumeData) => {
    saveToSessionStorage(resumeData)
  }

  onMounted(() => {
    initializeData()
  })

  return {
    data: computed(() => data.value),
    isLoading: computed(() => isLoading.value),
    hasError: computed(() => hasError.value),
    saveToSessionStorage,
    clearSessionStorage,
    initializeData,
    watchForChanges,
    getLastUpdated,
    refreshFromSessionStorage,
    saveImmediately
  }
}