# Product Audit — Resumix

## Stack
- **Framework:** Nuxt 3 (Vue 3, SSR)
- **UI Library:** Vuetify 3 (partially adopted — registered globally, but most UI is hand-rolled CSS)
- **Icons:** @iconify/vue + @mdi/font
- **AI:** Google Generative AI (Gemini)
- **PDF:** Puppeteer (server-side)
- **Styling:** Scoped `<style>` per component + global CSS in `pages/index.vue`
- **Pages:** `/` (main builder), `/privacy-policy`, `/terms-of-service`

---

## Features / Pages

| # | Feature | Location |
|---|---------|----------|
| 1 | Resume live preview (editable contenteditable) | `pages/index.vue` + resume section components |
| 2 | Sidebar navigation (collapsible, accordion panels) | `components/ResumeSidebar.vue` + `sidebar/*` |
| 3 | Header / contact info control | `components/sidebar/HeaderElementsControl.vue` |
| 4 | Section visibility & order (drag-and-drop) | `components/sidebar/ResumeSectionsControl.vue` |
| 5 | Import (JSON / DOCX / PDF file) | `components/modals/ImportModal.vue` |
| 6 | AI import (paste text → AI parses) | `components/modals/AiImportModal.vue` |
| 7 | Export JSON | `components/sidebar/ImportExportSection.vue` |
| 8 | PDF download (server-side Puppeteer) | `components/PDFDownloader.vue` |
| 9 | Job optimizer / tailor resume (AI) | `components/modals/TailorResumeModal.vue` + `TailorResumeResults.vue` |
| 10 | Resume match analysis (AI scoring) | `components/ResumeMatchAnalysis.vue` |
| 11 | Cover letter generator (AI) | `components/modals/CoverLetterModal.vue` |
| 12 | Floating text-formatting toolbar | `components/FloatingToolbar.vue` |
| 13 | Toast notifications | `components/ToastContainer.vue` + `composables/useToast.js` |
| 14 | Consent modal (GDPR) | `components/modals/ConsentModal.vue` |
| 15 | Keyboard shortcuts overlay | `components/KeyboardShortcuts.vue` |
| 16 | App footer (privacy controls, data deletion) | `components/AppFooter.vue` |
| 17 | Privacy Policy page | `pages/privacy-policy.vue` |
| 18 | Terms of Service page | `pages/terms-of-service.vue` |

---

## UX Problems Per Feature

| Feature | UX Problems |
|---------|------------|
| Resume live preview | Resume fixed at 794px — doesn't respond to window width; A4 layout and screen layout share the same CSS which causes print/screen conflicts; no visual affordance that text is editable (until you hover); `<hr>` separators look flat/unstyled |
| Sidebar | Width hard-coded at 280px with no theming; accordion sections have inconsistent open/close states across sessions; collapsed state shows only a chevron with no logo/icon; no visual hierarchy between section groups; custom CSS duplicates Vuetify patterns |
| Header control | Headshot URL is a plain `<input>` — no upload UI or preview; no validation feedback |
| Section visibility/order | Drag-and-drop exists but styling is unclear — no drag handle icon shown visually |
| Import modal | Multi-tab (JSON/file) pattern built from scratch; tabs not styled with Vuetify; file input unstyled |
| AI import modal | Plain textarea; no character count; no progress indicator; raw spinner |
| Export JSON | Just a button — no format options, no feedback after export |
| PDF download | Fixed position card in top-right floats awkwardly; red button (`#b71c1c`) clashes with brand; `alert()` used for errors |
| Job optimizer | Multi-step flow with raw HTML; no step indicator; AI score displayed as raw numbers/circles with hand-rolled CSS |
| Resume match analysis | Score circles rendered with custom `<svg>` or raw CSS — no Vuetify progress components |
| Cover letter generator | Long modal, scrollable text area; no word count; copy button exists but no visual confirmation |
| Floating toolbar | Small 32×32 buttons below WCAG touch target; shows/hides correctly but fades into page without drop shadow contrast |
| Toast notifications | Custom implementation; positioning and stacking not standardised with the rest of the UI |
| Consent modal | Appears once but has no progress/step indicator; wall of text |
| Keyboard shortcuts | Rendered as a modal with raw `<table>` |
| App footer | Dark footer (`#1e293b`) with wide padding — shifts layout based on sidebar state; mixed two concerns (privacy controls + legal links) |
| Privacy/ToS pages | No shared layout/nav; no "back" button |

---

## General Visual Problems

| Category | Problems |
|----------|---------|
| **Typography** | Two different base font-sizes in play (`12px` on `.resume-wrapper`, `16px` on `html`); `font-family: Helvetica, Aril` (typo: "Arial"); no type scale / design tokens |
| **Color** | Primary is Bootstrap-blue `#007bff` — not MD3; secondary is Bootstrap-green `#28a745`; PDF download button is dark red `#b71c1c`; sidebar uses Slate palette; no unified color system |
| **Spacing** | No spacing scale — values like `5px`, `8px`, `12px`, `15px`, `16px`, `20px`, `24px` used ad-hoc |
| **Border-radius** | Mix of `4px`, `6px`, `8px`, `12px` — no token |
| **Elevation/Shadow** | Inconsistent: `box-shadow: 0 4px 12px` on PDF card, `0 4px 20px` on toolbar, `0 10px 40px` on dialogs |
| **Consistency** | Vuetify is installed but almost never used in templates — all UI is raw HTML + scoped CSS, making it diverge from the library |
| **Responsiveness** | `@media (max-width: 768px)` exists in several places but resume wrapper reverts to full-width without A4 formatting; sidebar collapses to top bar on mobile |
| **Accessibility** | Good aria attributes and skip links are present; focus styles exist; but touch targets on FloatingToolbar (32×32) are below 44×44 WCAG minimum |
