# Accessibility Testing Guide

This document provides comprehensive testing checklists and procedures for verifying WCAG 2.1 Level AAA compliance in Resumix.

## Table of Contents

1. [Automated Testing](#automated-testing)
2. [Keyboard Navigation Testing](#keyboard-navigation-testing)
3. [Screen Reader Testing](#screen-reader-testing)
4. [Visual Accessibility Testing](#visual-accessibility-testing)
5. [Form and Input Testing](#form-and-input-testing)
6. [Mobile Accessibility Testing](#mobile-accessibility-testing)
7. [Testing Tools](#testing-tools)

## Automated Testing

### Using axe DevTools

1. Install [axe DevTools browser extension](https://www.deque.com/axe/devtools/)
2. Open the application in your browser
3. Open DevTools → axe DevTools tab
4. Click "Scan ALL of my page"
5. Review and address all Critical and Serious issues
6. Aim for 0 violations

### Using Lighthouse

1. Open Chrome DevTools → Lighthouse tab
2. Select "Accessibility" category
3. Run audit
4. Target score: 100/100
5. Address all flagged issues

### Using WAVE

1. Install [WAVE browser extension](https://wave.webaim.org/extension/)
2. Navigate to the application
3. Click WAVE icon
4. Review errors, alerts, and contrast issues
5. Fix all errors and high-priority alerts

## Keyboard Navigation Testing

### Essential Keyboard Tests

- [ ] **Tab Navigation**
  - Press `Tab` to navigate forward through all interactive elements
  - All interactive elements receive visible focus indicator
  - Tab order is logical (left-to-right, top-to-bottom)
  - No keyboard traps (can tab out of all elements)

- [ ] **Shift + Tab Navigation**
  - Press `Shift + Tab` to navigate backward
  - Reverse tab order works correctly

- [ ] **Skip Links**
  - Press `Tab` on page load
  - "Skip to main content" link appears
  - Pressing `Enter` jumps to main content
  - "Skip to navigation" link works correctly

- [ ] **Modal Dialogs**
  - Focus moves to modal when opened
  - `Tab` cycles through modal elements only (focus trap)
  - `Escape` closes modal
  - Focus returns to trigger element when closed

- [ ] **Forms and Inputs**
  - All form fields accessible via keyboard
  - `Enter` submits forms
  - Radio buttons: Arrow keys to select
  - Checkboxes: `Space` to toggle
  - Dropdowns: Arrow keys to navigate options

- [ ] **Buttons**
  - All buttons accessible via `Tab`
  - `Enter` or `Space` activates buttons
  - Button states announced (pressed, expanded, etc.)

- [ ] **Text Editing**
  - `Ctrl/Cmd + B` for bold works
  - `Ctrl/Cmd + I` for italic works
  - Floating toolbar accessible via keyboard
  - Contenteditable fields reachable and editable

- [ ] **Keyboard Shortcuts**
  - `?` opens keyboard shortcuts dialog
  - All documented shortcuts work as expected

## Screen Reader Testing

### NVDA (Windows)

1. **Download**: [NVDA](https://www.nvaccess.org/download/)
2. **Basic Navigation**:
   - [ ] `H` navigates by headings
   - [ ] `D` navigates by landmarks
   - [ ] `B` navigates by buttons
   - [ ] `F` navigates by form fields
   - [ ] `Insert + F7` opens elements list

3. **Test Checklist**:
   - [ ] Page title announced on load
   - [ ] Headings hierarchy is logical (H1 → H2 → H3)
   - [ ] Landmarks properly identified (navigation, main, complementary, contentinfo)
   - [ ] Images have descriptive alt text
   - [ ] Links have descriptive text (not "click here")
   - [ ] Form labels announced correctly
   - [ ] Error messages announced
   - [ ] Dynamic content changes announced (toasts, status updates)
   - [ ] Button states announced (pressed, expanded, disabled)

### JAWS (Windows)

1. **Download**: [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Trial available)
2. **Test same checklist as NVDA above**
3. **Additional Tests**:
   - [ ] Tables announced with row/column headers
   - [ ] Lists announced with item count

### VoiceOver (macOS)

1. **Enable**: System Preferences → Accessibility → VoiceOver → Enable
2. **Basic Commands**:
   - `Cmd + F5`: Toggle VoiceOver
   - `Ctrl + Option + U`: Open rotor
   - `Ctrl + Option + →`: Navigate forward
   - `Ctrl + Option + ←`: Navigate backward

3. **Test Checklist**: Same as NVDA checklist above

### Testing Priority Content

- [ ] **Resume Header**: Name, title, and contact info announced
- [ ] **Resume Sections**: Each section title announced
- [ ] **Editable Content**: Role "textbox" announced for contenteditable
- [ ] **Sidebar Controls**: All checkboxes and buttons labeled
- [ ] **Modals**: Modal purpose and controls announced
- [ ] **Toasts**: Status updates announced immediately (assertive) or politely

## Visual Accessibility Testing

### Color Contrast

1. **Tools**: Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. **WCAG AAA Requirements**: 7:1 ratio for normal text, 4.5:1 for large text

**Test Checklist**:
- [ ] Body text on white background: 7:1 minimum
- [ ] Headings: 7:1 minimum
- [ ] Links (not in underline): 7:1 minimum
- [ ] Button text: 7:1 minimum
- [ ] Error messages: 7:1 minimum
- [ ] Success messages: 7:1 minimum
- [ ] Focus indicators: 3:1 contrast with background
- [ ] Disabled elements: Visually distinguishable

### Reduced Motion

1. **Enable**: System Preferences → Accessibility → Display → Reduce Motion
2. **Test Checklist**:
   - [ ] Animations minimal or disabled
   - [ ] Transitions instant or very brief
   - [ ] Page scrolling not affected
   - [ ] No vestibular motion (parallax, zoom effects)
   - [ ] Modal entrances/exits simplified

### Text Resizing and Zoom

1. **Browser Zoom (200%)**:
   - [ ] Press `Ctrl/Cmd + Plus` to zoom to 200%
   - [ ] All text remains readable
   - [ ] No horizontal scrolling required
   - [ ] Interactive elements remain clickable
   - [ ] Layout doesn't break

2. **Text-Only Zoom**:
   - [ ] Firefox: View → Zoom → Zoom Text Only → 200%
   - [ ] All text scales appropriately
   - [ ] Layout accommodates larger text
   - [ ] No overlapping content

3. **Minimum Font Sizes**:
   - [ ] Base font: 16px minimum
   - [ ] Small text: 14px minimum
   - [ ] Button text: 14px minimum

### Focus Indicators

**Test Checklist**:
- [ ] All interactive elements show focus indicator
- [ ] Focus indicator has 2px minimum thickness
- [ ] Focus indicator has 3:1 contrast ratio with background
- [ ] Focus indicator different from hover state
- [ ] Focus visible for: buttons, links, inputs, contenteditable areas

### Touch Target Size

**WCAG AAA Requirement**: 44×44px minimum

**Test Checklist**:
- [ ] All buttons: 44×44px or larger
- [ ] Checkboxes: 44×44px clickable area
- [ ] Radio buttons: 44×44px clickable area
- [ ] Toggle switches: 44×44px total area
- [ ] Close buttons: 44×44px or larger
- [ ] Exception: Inline text links can be smaller

## Form and Input Testing

### Form Labels and Instructions

- [ ] All inputs have associated labels
- [ ] Labels use `<label>` with `for` attribute
- [ ] Required fields indicated (not just by color)
- [ ] Optional fields indicated
- [ ] Help text associated via `aria-describedby`

### Form Validation

- [ ] Error messages appear near relevant field
- [ ] Error messages associated via `aria-describedby`
- [ ] Fields with errors marked with `aria-invalid="true"`
- [ ] Error icon alone not relied upon (text required)
- [ ] Errors announced to screen readers
- [ ] Success states clearly indicated

### Contenteditable Accessibility

- [ ] `role="textbox"` present on contenteditable elements
- [ ] `aria-multiline="true"` for multi-line fields
- [ ] `aria-label` describes what field is for
- [ ] Focus indicator visible when editing
- [ ] Changes announced to screen readers

## Mobile Accessibility Testing

### iOS VoiceOver Testing

1. **Enable**: Settings → Accessibility → VoiceOver
2. **Gestures**:
   - Swipe right/left: Navigate
   - Double-tap: Activate
   - Three-finger swipe up: Read from top

**Test Checklist**:
- [ ] All elements reachable via swipe
- [ ] Element roles announced correctly
- [ ] Touch targets 44pt minimum
- [ ] Pinch to zoom works (not disabled)

### Android TalkBack Testing

1. **Enable**: Settings → Accessibility → TalkBack
2. **Gestures**: Similar to VoiceOver

**Test Checklist**:
- [ ] Same as iOS VoiceOver checklist

## Testing Tools

### Browser Extensions

- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/extension/
- **Accessibility Insights**: https://accessibilityinsights.io/
- **HeadingsMap**: Shows heading hierarchy

### Color Tools

- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser**: https://www.tpgi.com/color-contrast-checker/
- **Contrast**: macOS app for checking colors

### Screen Readers

- **NVDA (Windows)**: https://www.nvaccess.org/
- **JAWS (Windows)**: https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver (macOS/iOS)**: Built-in
- **TalkBack (Android)**: Built-in
- **Narrator (Windows)**: Built-in

### Validators

- **W3C Validator**: https://validator.w3.org/
- **Nu Html Checker**: https://validator.w3.org/nu/
- **AChecker**: https://achecker.achecks.ca/checker/index.php

## Testing Workflow

### Recommended Testing Order

1. **Automated Scan** (5 minutes)
   - Run axe DevTools
   - Fix all Critical/Serious issues

2. **Keyboard Testing** (15 minutes)
   - Complete keyboard navigation checklist
   - Test all modals and forms

3. **Screen Reader Testing** (30 minutes)
   - Test with NVDA or VoiceOver
   - Verify all interactive elements
   - Check dynamic content announcements

4. **Visual Testing** (15 minutes)
   - Check color contrast
   - Test at 200% zoom
   - Enable reduced motion preference

5. **Mobile Testing** (15 minutes)
   - Test with VoiceOver or TalkBack
   - Verify touch targets
   - Check responsive behavior

### Before Each Release

- [ ] Run automated tools (axe, Lighthouse, WAVE)
- [ ] Complete keyboard navigation checklist
- [ ] Test with at least one screen reader
- [ ] Verify color contrast
- [ ] Test at 200% zoom
- [ ] Test with reduced motion enabled
- [ ] Mobile device testing

## Known Limitations

*(Document any known accessibility limitations here)*

- PDF generation may not preserve all ARIA attributes
- Some third-party icons may not have perfect contrast
- Print view may have different accessibility characteristics

## Resources

- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Articles**: https://webaim.org/articles/
- **A11y Project Checklist**: https://www.a11yproject.com/checklist/
- **Deque University**: https://dequeuniversity.com/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility

## Support

For accessibility issues or questions:
- Create an issue on GitHub
- Email: accessibility@resumix.app
- Include browser, assistive technology, and steps to reproduce

