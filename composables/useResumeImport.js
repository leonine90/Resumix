import { ref } from 'vue'
import { useToast } from '~/composables/useToast'

export function useResumeImport() {
  const { showSuccess, showError, showWarning } = useToast()

  const exportData = (resumeData, headerElements, sections, sectionOrder, personal) => {
    // Create the export data object
    const exportData = {
      editable: resumeData.editable,
      enableVersions: resumeData.enableVersions,
      headerElements: headerElements,
      sections: sections,
      sectionOrder: sectionOrder,
      personal: personal,
      researchInterests: resumeData.researchInterests,
      education: resumeData.education,
      summary: resumeData.summary,
      experience: resumeData.experience,
      publications: resumeData.publications,
      skills: resumeData.skills,
      languages: resumeData.languages,
      volunteering: resumeData.volunteering,
      signature: resumeData.signature
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

  const mergeImportedData = (importedData, currentData) => {
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

    return mergedData
  }

  const importData = async (importJsonText, currentData) => {
    try {
      const importedData = JSON.parse(importJsonText)
      
      // Validate that it's a valid resume data object
      if (!importedData || typeof importedData !== 'object') {
        showError('Invalid JSON data. Please check your input.')
        return null
      }

      // Merge the imported data with the current structure
      const mergedData = mergeImportedData(importedData, currentData)
      
      showSuccess('Data imported successfully! All sections are now available in the sidebar.')
      return mergedData
    } catch (error) {
      showError('Error parsing JSON data. Please check your input.')
      console.error('Import error:', error)
      return null
    }
  }

  const processWithAI = async (resumeText, uploadedFile, currentData) => {
    if (!resumeText.trim() && !uploadedFile) {
      showWarning('Please enter some resume text or upload a file to process.')
      return null
    }
    
    try {
      let importedData = null
      
      // Handle file upload if present
      if (uploadedFile) {
        const formData = new FormData()
        formData.append('file', uploadedFile)
        
        const response = await $fetch('/api/import-resume-file', {
          method: 'POST',
          body: formData
        })
        
        if (response.success && response.data) {
          importedData = response.data
        } else {
          showError(response.error || 'Failed to process file. Please try again.')
          return null
        }
      } else if (resumeText.trim()) {
        // Handle text input
        // First, check if the input is valid JSON
        try {
          const trimmedText = resumeText.trim()
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
              resumeText: resumeText
            }
          })
          
          if (response.success && response.data) {
            importedData = response.data
          } else {
            showError(response.error || 'Failed to process resume. Please try again.')
            return null
          }
        }
      }

      if (importedData) {
        // Merge the imported data with the current structure
        const mergedData = mergeImportedData(importedData, currentData)
        
        showSuccess('Resume imported successfully! All sections have been updated.')
        return mergedData
      }
      
      return null
    } catch (error) {
      console.error('Resume processing error:', error)
      showError('Error processing resume. Please check your internet connection and try again.')
      return null
    }
  }

  const generateCurrentResumeText = (resumeData) => {
    let text = ''
    
    // Add personal information
    if (resumeData.personal) {
      text += `${resumeData.personal.name || 'No Name'}\n`
      if (resumeData.personal.title) text += `${resumeData.personal.title}\n`
      if (resumeData.personal.email) text += `Email: ${resumeData.personal.email}\n`
      if (resumeData.personal.phone) text += `Phone: ${resumeData.personal.phone}\n`
      if (resumeData.personal.address) text += `Address: ${resumeData.personal.address}\n`
      if (resumeData.personal.linkedin) text += `LinkedIn: ${resumeData.personal.linkedin}\n`
      if (resumeData.personal.website) text += `Website: ${resumeData.personal.website}\n`
      text += '\n'
    }
    
    // Add summary
    if (resumeData.summary) {
      const summaryText = typeof resumeData.summary === 'string' ? resumeData.summary : resumeData.summary.default || ''
      if (summaryText) {
        text += `SUMMARY:\n${summaryText}\n\n`
      }
    }
    
    // Add research interests
    if (resumeData.researchInterests) {
      let interests = []
      if (Array.isArray(resumeData.researchInterests)) {
        interests = resumeData.researchInterests
      } else if (typeof resumeData.researchInterests === 'object') {
        // Handle object format like { default: "text" } or versioned structure
        const defaultText = resumeData.researchInterests.default || resumeData.researchInterests.text || ''
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
    if (resumeData.education && resumeData.education.length > 0) {
      text += `EDUCATION:\n`
      resumeData.education.forEach(edu => {
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
    if (resumeData.experience && resumeData.experience.length > 0) {
      text += `EXPERIENCE:\n`
      resumeData.experience.forEach(exp => {
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
    if (resumeData.publications && resumeData.publications.length > 0) {
      text += `PUBLICATIONS:\n`
      resumeData.publications.forEach(pub => {
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
    if (resumeData.skills && resumeData.skills.length > 0) {
      text += `SKILLS:\n${resumeData.skills.join(', ')}\n\n`
    }
    
    // Add languages
    if (resumeData.languages && resumeData.languages.length > 0) {
      text += `LANGUAGES:\n${resumeData.languages.join(', ')}\n\n`
    }
    
    // Add volunteering
    if (resumeData.volunteering && resumeData.volunteering.length > 0) {
      text += `VOLUNTEERING:\n`
      resumeData.volunteering.forEach(vol => {
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

  return {
    exportData,
    importData,
    processWithAI,
    generateCurrentResumeText,
    mergeImportedData
  }
}

