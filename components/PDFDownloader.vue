<template>
  <div class="pdf-downloader">
    <button class="download-btn" @click="downloadPDF" :disabled="isGenerating">
      <Icon icon="material-symbols:picture-as-pdf" style="font-size: 16px;" />
      {{ isGenerating ? 'Generating PDF...' : 'Download PDF' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const isGenerating = ref(false)

// Function to extract all CSS from the page
const extractCSS = () => {
  let css = ''
  
  // Get all stylesheets
  const stylesheets = Array.from(document.styleSheets)
  
  for (const stylesheet of stylesheets) {
    try {
      // Try to access CSS rules (might fail for cross-origin stylesheets)
      const rules = Array.from(stylesheet.cssRules || stylesheet.rules || [])
      
      for (const rule of rules) {
        css += rule.cssText + '\n'
      }
    } catch (e) {
      // Skip stylesheets we can't access (CORS)
      console.warn('Could not access stylesheet:', e)
    }
  }
  
  // Also get inline styles
  const styleElements = document.querySelectorAll('style')
  styleElements.forEach(style => {
    css += style.textContent + '\n'
  })
  
  return css
}

const downloadPDF = async () => {
  if (isGenerating.value) return
  
  isGenerating.value = true
  
  try {
    // Get the resume wrapper content
    const resumeWrapper = document.querySelector('.resume-wrapper')
    if (!resumeWrapper) {
      throw new Error('Resume content not found')
    }
    
    // Clone the resume wrapper to extract HTML
    const clone = resumeWrapper.cloneNode(true)
    
    // Remove elements that shouldn't be in the PDF
    const elementsToRemove = clone.querySelectorAll(
      '.pdf-downloader, .resume-sidebar, .floating-toolbar, .app-footer'
    )
    elementsToRemove.forEach(el => el.remove())
    
    // Get the HTML content
    const html = clone.outerHTML
    
    // Extract all CSS from the page
    const css = extractCSS()
    
    // Send request to server to generate PDF
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html, css })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to generate PDF')
    }
    
    // Get the PDF blob
    const blob = await response.blob()
    
    // Create a download link and trigger download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resume.pdf'
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.pdf-downloader {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

.download-btn {
  padding: 8px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.download-btn:hover:not(:disabled) {
  background: #c82333;
}

.download-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.8;
}

@media print {
  .pdf-downloader {
    display: none !important;
  }
}
</style>
