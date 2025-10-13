# Accessibility Implementation Guide

This guide provides templates and patterns for implementing accessibility features in the remaining components.

## Completed Components

✅ Core Infrastructure
- useFocusTrap.js
- useKeyboardNav.js
- useAriaAnnounce.js
- Global accessibility styles (index.vue)

✅ Main Components
- ToastContainer.vue
- FloatingToolbar.vue  
- ResumeHeader.vue
- PDFDownloader.vue
- AppFooter.vue (with delete dialog)
- ResumeSidebar.vue
- SidebarHeader.vue
- KeyboardShortcuts.vue

✅ Documentation
- ACCESSIBILITY.md (testing guide)
- README.md (accessibility features section)

✅ Modals
- ConsentModal.vue

## Remaining Work

### 1. Modal Components (7 remaining)

The following modals need accessibility enhancements:

1. `components/modals/AiImportModal.vue`
2. `components/modals/ImportModal.vue`
3. `components/modals/InfoModal.vue`
4. `components/modals/TailorResumeModal.vue`
5. `components/modals/OptimizerInfoModal.vue`
6. `components/modals/CoverLetterModal.vue`
7. `components/modals/CoverLetterInfoModal.vue`

**Template for Modal Accessibility:**

```vue
<template>
  <div 
    v-if="show" 
    class="modal-overlay" 
    @click.self="handleClose"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title-id"
    :aria-describedby="hasDescription ? 'modal-description-id' : undefined"
  >
    <div class="modal-content" ref="modalRef">
      <div class="modal-header">
        <h2 id="modal-title-id">Modal Title</h2>
        <button 
          @click="handleClose" 
          class="close-btn"
          aria-label="Close dialog"
        >
          <Icon icon="close-icon" aria-hidden="true" />
        </button>
      </div>
      
      <div class="modal-body" :id="hasDescription ? 'modal-description-id' : undefined">
        <!-- Modal content -->
      </div>
      
      <div class="modal-footer">
        <button @click="handleClose" aria-label="Cancel and close">Cancel</button>
        <button @click="handleSubmit" aria-label="Submit form">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useFocusTrap } from '~/composables/useFocusTrap'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const modalRef = ref(null)
const { trapFocus, releaseFocus } = useFocusTrap()
const { lockScroll, unlockScroll } = useBodyScrollLock()

const handleClose = () => {
  emit('close')
}

// Focus trap and scroll lock
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    lockScroll()
    nextTick(() => {
      if (modalRef.value) {
        trapFocus(modalRef.value)
      }
    })
  } else {
    unlockScroll()
    releaseFocus()
  }
})

// Escape key handler
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.show) {
      handleClose()
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    unlockScroll()
    releaseFocus()
  })
})
</script>
```

**Key Checklist for Each Modal:**
- [ ] Add `role="dialog"` and `aria-modal="true"`
- [ ] Add `aria-labelledby` pointing to modal title
- [ ] Add `ref="modalRef"` to modal content div
- [ ] Import and use `useFocusTrap` and `useBodyScrollLock`
- [ ] Watch `show` prop to trap focus and lock scroll
- [ ] Add Escape key handler
- [ ] Add close button with `aria-label="Close dialog"`
- [ ] Add `aria-hidden="true"` to decorative icons
- [ ] Add descriptive `aria-label` to all buttons
- [ ] Associate form labels with inputs
- [ ] Add `aria-describedby` for help text

### 2. Sidebar Child Components (4 remaining)

Components to enhance:

1. `components/sidebar/HeaderElementsControl.vue`
2. `components/sidebar/ResumeSectionsControl.vue`
3. `components/sidebar/ImportExportSection.vue`
4. `components/sidebar/JobOptimizerSection.vue`
5. `components/sidebar/CoverLetterSection.vue`

**Template for Sidebar Sections:**

```vue
<template>
  <div class="sidebar-section">
    <button
      @click="toggleSection"
      class="section-toggle"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="`section-${sectionId}`"
      :aria-label="`Toggle ${sectionName} section`"
    >
      <h4>{{ sectionName }}</h4>
      <Icon :icon="isOpen ? 'chevron-up' : 'chevron-down'" aria-hidden="true" />
    </button>
    
    <div 
      v-if="isOpen" 
      :id="`section-${sectionId}`"
      class="section-content"
      role="region"
      :aria-label="`${sectionName} controls`"
    >
      <!-- Section content -->
      
      <!-- For form controls -->
      <fieldset>
        <legend class="sr-only">{{ sectionName }} Options</legend>
        
        <label :for="`checkbox-${id}`">
          <input 
            type="checkbox" 
            :id="`checkbox-${id}`"
            v-model="value"
            :aria-describedby="`help-${id}`"
          />
          Checkbox Label
        </label>
        <span :id="`help-${id}`" class="help-text">Help text description</span>
      </fieldset>
      
      <!-- For buttons -->
      <button 
        @click="handleAction"
        aria-label="Descriptive action label"
      >
        <Icon icon="icon-name" aria-hidden="true" />
        <span>Button Text</span>
      </button>
    </div>
  </div>
</template>
```

**Key Checklist for Sidebar Components:**
- [ ] Add `aria-expanded` to collapsible section toggles
- [ ] Add `aria-controls` linking toggle to content
- [ ] Add unique `id` to controlled content
- [ ] Wrap checkboxes in `<fieldset>` with `<legend>`
- [ ] Connect labels to inputs using `for`/`id`
- [ ] Add `aria-describedby` for help text
- [ ] Add `aria-label` to icon-only buttons
- [ ] Add `aria-hidden="true"` to decorative icons
- [ ] Use `role="region"` for major sections

### 3. Resume Section Components (9 components)

Components to enhance:

1. `components/Summary.vue`
2. `components/Experience.vue`
3. `components/Education.vue`
4. `components/Skills.vue`
5. `components/Publications.vue`
6. `components/Languages.vue`
7. `components/Volunteering.vue`
8. `components/ResearchInterests.vue`
9. `components/Signature.vue`

**Template for Resume Sections:**

```vue
<template>
  <section 
    class="resume-section" 
    :aria-labelledby="`section-heading-${sectionId}`"
  >
    <h2 :id="`section-heading-${sectionId}`">Section Title</h2>
    
    <!-- For list content -->
    <ul role="list">
      <li v-for="(item, index) in items" :key="index">
        <span 
          v-if="editable"
          :contenteditable="editable"
          role="textbox"
          :aria-label="`Edit ${fieldName}`"
          :aria-multiline="isMultiline ? 'true' : 'false'"
          @blur="handleUpdate"
        >
          {{ item }}
        </span>
        <span v-else>{{ item }}</span>
      </li>
    </ul>
    
    <!-- For contenteditable areas -->
    <div
      :contenteditable="editable"
      role="textbox"
      aria-multiline="true"
      :aria-label="`Edit ${sectionName}`"
      :aria-readonly="!editable"
      @blur="handleUpdate"
      v-html="content"
    ></div>
  </section>
</template>
```

**Key Checklist for Resume Sections:**
- [ ] Wrap in `<section>` element
- [ ] Add unique `id` to section heading
- [ ] Add `aria-labelledby` linking to heading
- [ ] Use semantic lists (`<ul>`, `<ol>`) for list content
- [ ] Add `role="list"` to lists (ensures announcement)
- [ ] Add `role="textbox"` to contenteditable elements
- [ ] Add `aria-multiline="true"` for multi-line fields
- [ ] Add `aria-label` describing what's editable
- [ ] Add `aria-readonly` based on editable state
- [ ] Ensure proper heading hierarchy (H2 for sections, H3 for subsections)

### 4. Form Validation and Error Handling

**Template for Forms with Validation:**

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label :for="`input-${fieldId}`">
        Field Label
        <span v-if="required" aria-label="required">*</span>
      </label>
      
      <input
        :id="`input-${fieldId}`"
        v-model="value"
        :aria-invalid="hasError ? 'true' : 'false'"
        :aria-describedby="`help-${fieldId} ${hasError ? `error-${fieldId}` : ''}`"
        :required="required"
      />
      
      <span :id="`help-${fieldId}`" class="help-text">
        Help text for this field
      </span>
      
      <span 
        v-if="hasError" 
        :id="`error-${fieldId}`" 
        class="error-message"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </span>
    </div>
    
    <button type="submit" :aria-busy="isSubmitting ? 'true' : 'false'">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAriaAnnounce } from '~/composables/useAriaAnnounce'

const { announceAssertive } = useAriaAnnounce()

const hasError = ref(false)
const errorMessage = ref('')

const validateField = () => {
  if (/* validation fails */) {
    hasError.value = true
    errorMessage.value = 'Specific error message'
    announceAssertive(`Error: ${errorMessage.value}`)
    return false
  }
  return true
}
</script>
```

**Key Checklist for Forms:**
- [ ] Connect labels to inputs with `for`/`id`
- [ ] Mark required fields (visually and semantically)
- [ ] Add `aria-invalid="true"` to fields with errors
- [ ] Link error messages with `aria-describedby`
- [ ] Use `role="alert"` and `aria-live="assertive"` for errors
- [ ] Announce errors to screen readers
- [ ] Don't rely on color alone for error indication
- [ ] Add `aria-busy` to loading buttons

### 5. Color Contrast Fixes

**Areas to Audit:**

Check these elements for 7:1 contrast ratio:
- Sidebar text colors
- Button text colors  
- Link colors
- Disabled state colors
- Placeholder text
- Secondary/muted text
- Icon colors when used as information

**Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Browser DevTools color picker (shows contrast ratio)

**Common Fixes:**
```css
/* Instead of light gray (#999) */
color: #595959; /* 7:1 on white */

/* Instead of medium gray (#666) */
color: #595959; /* 7:1 on white */

/* Links should be darker */
color: #0056b3; /* 7.5:1 on white */

/* Error states */
color: #b71c1c; /* High contrast red */

/* Success states */
color: #2e7d32; /* High contrast green */
```

### 6. Text Resizing Fixes

**Convert px to rem:**

```css
/* Before */
font-size: 12px;
padding: 8px 16px;
margin: 20px;

/* After */
font-size: 0.75rem; /* 12px at base 16px */
padding: 0.5rem 1rem; /* 8px 16px */
margin: 1.25rem; /* 20px */
```

**Test at 200% zoom:**
- No horizontal scrolling
- All text remains readable
- Buttons remain clickable
- Layout doesn't break

### 7. Contenteditable Enhancements

**Template for Contenteditable Fields:**

```vue
<span
  :contenteditable="editable"
  :class="{ editable }"
  role="textbox"
  :aria-label="`Edit ${fieldDescription}`"
  :aria-multiline="multiline ? 'true' : 'false'"
  :aria-readonly="!editable"
  @blur="handleUpdate($event.target.textContent)"
  @keydown.escape="handleCancel"
>
  {{ content }}
</span>
```

**Features to Add:**
- [ ] `role="textbox"` attribute
- [ ] `aria-label` describing field
- [ ] `aria-multiline` based on field type
- [ ] `aria-readonly` based on editable state
- [ ] Escape key to cancel editing
- [ ] Focus indicator when editing
- [ ] Announce edit mode to screen readers

## Implementation Priority

### High Priority (Complete First)
1. ✅ Core composables and global styles
2. ✅ Main navigation and structure
3. ✅ Documentation
4. ⏳ Remaining modals (7 components)
5. ⏳ Sidebar controls (4 components)

### Medium Priority
6. ⏳ Resume sections (9 components)
7. ⏳ Form validation
8. ⏳ Contenteditable enhancements

### Low Priority (Polish)
9. ⏳ Color contrast audit
10. ⏳ Text resizing audit

## Testing After Implementation

For each component updated:
1. Run axe DevTools scan
2. Test keyboard navigation (Tab, Shift+Tab, Enter, Escape)
3. Test with screen reader (NVDA or VoiceOver)
4. Test at 200% browser zoom
5. Test with reduced motion enabled
6. Check color contrast with dev tools

## Quick Reference

**Essential ARIA Attributes:**
- `role="dialog"`, `role="button"`, `role="textbox"`, etc.
- `aria-label="Descriptive label"`
- `aria-labelledby="element-id"`
- `aria-describedby="help-text-id"`
- `aria-expanded="true|false"`
- `aria-controls="controlled-element-id"`
- `aria-invalid="true|false"`
- `aria-live="polite|assertive"`
- `aria-hidden="true"` (for decorative icons)
- `aria-modal="true"` (for modal dialogs)
- `aria-busy="true|false"` (for loading states)

**Focus Management:**
- Use `useFocusTrap()` for modals
- Use `useBodyScrollLock()` for modals
- Watch modal visibility to trap/release focus
- Add Escape key handler for all modals

**Keyboard Support:**
- Tab/Shift+Tab for navigation
- Enter/Space for activation
- Escape to close/cancel
- Arrow keys for lists/options

## Notes

- All icon-only buttons need `aria-label`
- All decorative icons need `aria-hidden="true"`
- All modals need focus trap and Escape key handling
- All forms need proper label associations
- All errors need `role="alert"` and screen reader announcement
- All dynamic content needs ARIA live regions

