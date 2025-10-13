import { useToast } from '~/composables/useToast'
import { useAIConsent } from '~/composables/useAIConsent'

export function useCoverLetter() {
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const { requireAIConsent } = useAIConsent()

  const generateCoverLetter = async (coverLetterResumeText, coverLetterJobDescription) => {
    if (!coverLetterJobDescription.trim() || !coverLetterResumeText.trim()) {
      showWarning('Please enter both your resume text and a job description to generate a cover letter.')
      return null
    }
    
    // Check for AI consent before processing
    try {
      await requireAIConsent()
    } catch (error) {
      showWarning('AI consent required. Please enable AI features in Privacy & Data settings.')
      return null
    }
    
    try {
      console.log('Sending cover letter request with data:', {
        resumeText: coverLetterResumeText.substring(0, 100) + '...',
        jobDescription: coverLetterJobDescription.substring(0, 100) + '...'
      })

      const response = await $fetch('/api/generate-cover-letter', {
        method: 'POST',
        body: {
          resumeText: coverLetterResumeText,
          jobDescription: coverLetterJobDescription,
          hasConsent: true
        }
      })

      console.log('Cover letter response:', response)

      if (response.success && response.data) {
        showSuccess('Cover letter generated successfully!')
        return response.data.coverLetter
      } else {
        showError(response.error || 'Failed to generate cover letter. Please try again.')
        return null
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
      return null
    }
  }

  const downloadCoverLetterPDF = (generatedCoverLetter) => {
    if (!generatedCoverLetter) {
      showWarning('No cover letter to download.')
      return
    }

    // Create a simple PDF download using browser print functionality
    const printWindow = window.open('', '_blank')
    
    // Create the HTML content with proper escaping
    const coverLetterContent = generatedCoverLetter.replace(/\n/g, '<br>')
    
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

  return {
    generateCoverLetter,
    downloadCoverLetterPDF
  }
}

