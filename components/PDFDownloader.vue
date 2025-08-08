<template>
  <div class="pdf-downloader">
    <button class="download-btn" @click="downloadPDF">
      <Icon icon="material-symbols:picture-as-pdf" style="font-size: 16px;" />
      Download PDF
    </button>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const downloadPDF = () => {
  // Hide the PDF downloader before printing
  const pdfDownloader = document.querySelector('.pdf-downloader')
  if (pdfDownloader) {
    pdfDownloader.style.display = 'none'
  }
  
  // Trigger print
  window.print()
  
  // Show the PDF downloader again after a short delay
  setTimeout(() => {
    if (pdfDownloader) {
      pdfDownloader.style.display = 'flex'
    }
  }, 1000)
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

.download-btn:hover {
  background: #c82333;
}

@media print {
  .pdf-downloader {
    display: none !important;
  }
}
</style>
