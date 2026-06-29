<template>
  <div class="pdf-downloader" role="region" aria-label="PDF download">
    <v-btn
      color="primary"
      variant="tonal"
      :loading="isGenerating"
      :disabled="isGenerating"
      aria-label="Download resume as PDF"
      prepend-icon="mdi-file-pdf-box"
      @click="downloadPDF"
    >
      {{ isGenerating ? 'Generating…' : 'Download PDF' }}
    </v-btn>

    <div
      v-if="statusMessage"
      role="status"
      aria-live="polite"
      class="sr-only"
    >
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isGenerating = ref(false)
const statusMessage = ref('')

const extractCSS = () => {
  let css = ''
  for (const stylesheet of Array.from(document.styleSheets)) {
    try {
      const rules = Array.from(stylesheet.cssRules || stylesheet.rules || [])
      for (const rule of rules) css += rule.cssText + '\n'
    } catch {
      // skip cross-origin
    }
  }
  document.querySelectorAll('style').forEach(s => { css += s.textContent + '\n' })
  return css
}

const downloadPDF = async () => {
  if (isGenerating.value) return
  isGenerating.value = true
  statusMessage.value = 'Generating PDF, please wait…'

  try {
    const resumeWrapper = document.querySelector('.resume-wrapper')
    if (!resumeWrapper) throw new Error('Resume content not found')

    const clone = resumeWrapper.cloneNode(true)
    clone.querySelectorAll('.pdf-downloader, .resume-sidebar, .floating-toolbar, .app-footer')
        .forEach(el => el.remove())

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: clone.outerHTML, css: extractCSS() }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Failed to generate PDF')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = Object.assign(document.createElement('a'), { href: url, download: 'resume.pdf' })
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    statusMessage.value = 'PDF downloaded successfully'
    setTimeout(() => { statusMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Error generating PDF:', error)
    statusMessage.value = 'Failed to generate PDF. Please try again.'
    setTimeout(() => { statusMessage.value = '' }, 5000)
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
  z-index: 1000;
}

@media print {
  .pdf-downloader { display: none !important; }
}
</style>
