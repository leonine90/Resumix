/**
 * Focus trap composable for accessible modal dialogs
 * Traps keyboard focus within a container element
 */
export function useFocusTrap() {
  let previouslyFocusedElement = null
  let focusableElements = []
  let firstFocusableElement = null
  let lastFocusableElement = null
  let cleanupFn = null

  const FOCUSABLE_SELECTORS = 
    'a[href]:not([disabled]), ' +
    'button:not([disabled]), ' +
    'textarea:not([disabled]), ' +
    'input:not([disabled]), ' +
    'select:not([disabled]), ' +
    '[tabindex]:not([tabindex="-1"]):not([disabled]), ' +
    '[contenteditable="true"]'

  const trapFocus = (element) => {
    if (!element) return null

    // Save currently focused element
    previouslyFocusedElement = document.activeElement

    // Get all focusable elements
    focusableElements = Array.from(element.querySelectorAll(FOCUSABLE_SELECTORS))
    firstFocusableElement = focusableElements[0]
    lastFocusableElement = focusableElements[focusableElements.length - 1]

    // Focus first element after a brief delay to ensure modal is rendered
    setTimeout(() => {
      if (firstFocusableElement) {
        firstFocusableElement.focus()
      }
    }, 100)

    // Handle tab key to cycle focus
    const handleKeyDown = (e) => {
      // Only trap Tab key
      if (e.key !== 'Tab') return

      // Refresh focusable elements in case DOM changed
      focusableElements = Array.from(element.querySelectorAll(FOCUSABLE_SELECTORS))
      firstFocusableElement = focusableElements[0]
      lastFocusableElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement?.focus()
          e.preventDefault()
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement?.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    
    // Return cleanup function
    cleanupFn = () => {
      element.removeEventListener('keydown', handleKeyDown)
    }

    return cleanupFn
  }

  const releaseFocus = () => {
    // Clean up event listener
    if (cleanupFn) {
      cleanupFn()
      cleanupFn = null
    }

    // Restore focus to previously focused element
    if (previouslyFocusedElement && previouslyFocusedElement.focus) {
      setTimeout(() => {
        previouslyFocusedElement.focus()
        previouslyFocusedElement = null
      }, 0)
    }
  }

  return {
    trapFocus,
    releaseFocus
  }
}

