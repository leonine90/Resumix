import puppeteer from 'puppeteer'

export default defineEventHandler(async (event) => {
  let browser = null
  
  try {
    // Parse the request body to get HTML and CSS
    const { html, css } = await readBody(event)
    
    if (!html) {
      throw createError({
        statusCode: 400,
        message: 'HTML content is required'
      })
    }

    // Launch headless browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    })

    const page = await browser.newPage()

    // Build complete HTML document with styles
    const completeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            ${css || ''}
            
            /* Print-specific styles */
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
              font-family: Helvetica, Arial, sans-serif;
              font-size: 12px;
              line-height: 1.5;
            }
            
            body {
              background: white;
            }
            
            /* Ensure resume wrapper is properly sized */
            .resume-wrapper {
              width: 794px;
              padding: 75.6px;
              background: white;
              box-sizing: border-box;
            }
            
            /* Hide elements that shouldn't be in PDF */
            .pdf-downloader,
            .resume-sidebar,
            .floating-toolbar,
            .app-footer {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `

    // Set content and wait for it to load
    await page.setContent(completeHtml, {
      waitUntil: 'networkidle0'
    })

    // Generate PDF with options matching the print styles
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '15mm',
        left: '10mm'
      },
      preferCSSPageSize: true
    })

    // Close browser
    await browser.close()

    // Set response headers for PDF download
    setResponseHeaders(event, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
      'Content-Length': pdfBuffer.length
    })

    // Return the PDF buffer
    return pdfBuffer

  } catch (error) {
    console.error('Error generating PDF:', error)
    
    // Make sure to close browser on error
    if (browser) {
      await browser.close().catch(console.error)
    }
    
    throw createError({
      statusCode: 500,
      message: 'Failed to generate PDF: ' + error.message
    })
  }
})

