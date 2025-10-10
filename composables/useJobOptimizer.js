import { ref, nextTick } from 'vue'
import { useToast } from '~/composables/useToast'
import { useResumeImport } from '~/composables/useResumeImport'

export function useJobOptimizer() {
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const { mergeImportedData } = useResumeImport()

  // Analyze resume vs job description compatibility
  const analyzeResumeMatch = async (resumeTextInput, jobPostText, resumeData) => {
    if (!jobPostText.trim() || !resumeTextInput.trim()) {
      showWarning('Please enter both your resume text and a job posting to analyze.')
      return null
    }

    try {
      const response = await $fetch('/api/analyze-resume-match', {
        method: 'POST',
        body: {
          currentResume: resumeTextInput,
          jobPost: jobPostText,
          resumeData: resumeData
        }
      })

      if (response.success && response.data) {
        return response.data
      } else {
        showError(response.error || 'Failed to analyze resume. Please try again.')
        return null
      }
    } catch (error) {
      console.error('Analysis error:', error)
      showError('Error analyzing resume. Please check your internet connection and try again.')
      return null
    }
  }

  const tailorResume = async (resumeTextInput, jobPostText, resumeData) => {
    if (!jobPostText.trim() || !resumeTextInput.trim()) {
      showWarning('Please enter both your resume text and a job posting to optimize.')
      return null
    }
    
    try {
      const response = await $fetch('/api/tailor-resume', {
        method: 'POST',
        body: {
          currentResume: resumeTextInput,
          jobPost: jobPostText,
          resumeData: resumeData // Provide existing resume data for context
        }
      })

      if (response.success && response.data) {
        return response.data
      } else {
        showError(response.error || 'Failed to optimize resume. Please try again.')
        return null
      }
    } catch (error) {
      console.error('Tailoring error:', error)
      showError('Error optimizing resume. Please check your internet connection and try again.')
      return null
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

  const applyOptimizations = async (editableOptimizedContent, resumeTextInput, currentData) => {
    if (!editableOptimizedContent.summary || !editableOptimizedContent.experience || !editableOptimizedContent.skills) {
      showWarning('No optimized content to apply.')
      return null
    }
    
    try {
      // If user provided resume text and it's reasonable size, try to import for updated info
      let importedData = null
      if (resumeTextInput.trim() && resumeTextInput.length <= 10000) {
        try {
          const baseResumeResponse = await $fetch('/api/import-resume', {
            method: 'POST',
            body: {
              resumeText: resumeTextInput
            }
          })
          
          if (baseResumeResponse.success && baseResumeResponse.data) {
            importedData = baseResumeResponse.data
          }
        } catch (error) {
          console.warn('Failed to import resume text, using existing data:', error)
          // Continue with existing data
        }
      }

      // Merge the resume data with AI optimizations
      const updatedResumeData = {
        // Preserve current structure and merge with imported data
        editable: importedData?.editable !== undefined ? importedData.editable : currentData.editable,
        enableVersions: importedData?.enableVersions !== undefined ? importedData.enableVersions : currentData.enableVersions,
        
        // Merge header elements - use imported if available, fallback to current
        headerElements: {
          ...currentData.headerElements,
          ...(importedData?.headerElements || {})
        },
        
        // Merge sections - use imported if available, fallback to current
        sections: (() => {
          const mergedSections = {
            ...currentData.sections,
            ...(importedData?.sections || {})
          }
          
          // Auto-hide sections that have no content in imported data (only if we have imported data)
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
          }
          
          // Always show core sections even if empty (user can fill them)
          mergedSections.summary = true
          mergedSections.education = true
          mergedSections.experience = true
          mergedSections.skills = true
          
          return mergedSections
        })(),
        
        // Merge section order - preserve all sections from current data, add any new ones from imported data
        sectionOrder: (() => {
          const currentOrder = currentData.sectionOrder || []
          const importedOrder = importedData?.sectionOrder || []
          
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
          ...(importedData?.personal || {}),
          // Preserve critical fields from original if they exist and imported doesn't have them
          dateOfBirth: (importedData?.personal?.dateOfBirth && importedData.personal.dateOfBirth.trim()) 
            ? importedData.personal.dateOfBirth 
            : currentData.personal?.dateOfBirth || ""
        },
        
        // Apply AI-optimized summary (from editable content)
        summary: editableOptimizedContent.summary, // Apply AI-optimized summary as string
        
        // Apply AI-optimized experience with proper merging (from editable content)
        experience: editableOptimizedContent.experience.map((optimizedExp, index) => {
          // Keep the base experience structure from imported resume (if available) but use AI-optimized achievements
          const baseExp = (importedData?.experience && importedData.experience[index]) || optimizedExp
          return {
            ...baseExp, // Company, position, period, location from imported/optimized resume
            achievements: optimizedExp.achievements // AI-optimized achievements
          }
        }),
        
        // Apply AI-optimized skills (from editable content)
        skills: (() => {
          // Process skills from editable content (convert from string to array if needed)
          if (typeof editableOptimizedContent.skills === 'string') {
            // Split by comma and clean up
            return editableOptimizedContent.skills
              .split(',')
              .map(skill => skill.trim())
              .filter(skill => skill.length > 0)
          }
          return editableOptimizedContent.skills || []
        })(),
        
        // Preserve all other sections - keep original structure and data unless specifically improved
        researchInterests: (() => {
          // Convert to array format if needed
          if (importedData?.researchInterests) {
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
            if (importedData?.education && importedData.education.length > 0) {
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
          return importedData?.education || []
        })(),
        
        publications: (() => {
          // Preserve original publication structure with all details
          if (currentData.publications && currentData.publications.length > 0) {
            // If we have original publications with full details, preserve them
            return currentData.publications
          }
          // Otherwise use imported if available
          return (importedData?.publications && importedData.publications.length > 0) 
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
          return (importedData?.languages && importedData.languages.length > 0) 
            ? importedData.languages 
            : currentData.languages || []
        })(),
        
        volunteering: (() => {
          // Merge volunteering, preserving original structure
          if (currentData.volunteering && currentData.volunteering.length > 0) {
            return currentData.volunteering
          }
          return (importedData?.volunteering && importedData.volunteering.length > 0) 
            ? importedData.volunteering 
            : currentData.volunteering || []
        })(),
        
        signature: (() => {
          // Preserve original signature if it exists
          if (currentData.signature && (currentData.signature.name || currentData.signature.date)) {
            return currentData.signature
          }
          return (importedData?.signature && (importedData.signature.name || importedData.signature.date)) 
            ? importedData.signature 
            : currentData.signature || { name: "", date: "" }
        })()
      }
      
      showSuccess('Resume fully updated and optimized! All personal info, contact details, education, and other sections from your pasted resume have been updated. Summary, Experience achievements, and Skills have been tailored for the job with AI-powered enhancements.')
      
      return updatedResumeData
    } catch (error) {
      console.error('Application error:', error)
      showError('Error applying optimizations. Please check your internet connection and try again.')
      return null
    }
  }

  // Get circle style for analysis scores
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

  return {
    analyzeResumeMatch,
    tailorResume,
    createOptimizedResumeText,
    applyOptimizations,
    getCircleStyle,
    autoResizeTextarea,
    initializeTextareaHeights
  }
}

