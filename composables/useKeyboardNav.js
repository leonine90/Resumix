/**
 * Keyboard navigation utilities for lists and interactive elements
 */
export function useKeyboardNav() {
  /**
   * Navigate through a list of elements using arrow keys
   * @param {Array} items - Array of items/elements
   * @param {Number} currentIndex - Currently focused item index
   * @param {String} key - The key pressed (ArrowUp, ArrowDown, Home, End, etc.)
   * @returns {Number} - New index to focus
   */
  const getNextIndex = (items, currentIndex, key) => {
    const length = items.length
    if (length === 0) return -1

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        return (currentIndex + 1) % length
      
      case 'ArrowUp':
      case 'ArrowLeft':
        return (currentIndex - 1 + length) % length
      
      case 'Home':
        return 0
      
      case 'End':
        return length - 1
      
      case 'PageDown':
        // Jump 10 items down or to end
        return Math.min(currentIndex + 10, length - 1)
      
      case 'PageUp':
        // Jump 10 items up or to start
        return Math.max(currentIndex - 10, 0)
      
      default:
        return currentIndex
    }
  }

  /**
   * Handle keyboard navigation for a list
   * @param {KeyboardEvent} event - The keyboard event
   * @param {Array} items - Array of elements to navigate
   * @param {Number} currentIndex - Current focused index
   * @param {Function} onNavigate - Callback when navigation occurs
   */
  const handleListNavigation = (event, items, currentIndex, onNavigate) => {
    const navKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']
    
    if (navKeys.includes(event.key)) {
      event.preventDefault()
      const newIndex = getNextIndex(items, currentIndex, event.key)
      
      if (newIndex !== currentIndex && newIndex >= 0) {
        onNavigate(newIndex)
        
        // Focus the element if it exists
        if (items[newIndex] && items[newIndex].focus) {
          items[newIndex].focus()
        }
      }
    }
  }

  /**
   * Keyboard shortcut registry
   */
  const shortcuts = ref(new Map())

  /**
   * Register a keyboard shortcut
   * @param {String} key - Key combination (e.g., 'Ctrl+B', 'Meta+I', '?')
   * @param {Function} handler - Handler function
   * @param {String} description - Description for help documentation
   */
  const registerShortcut = (key, handler, description = '') => {
    shortcuts.value.set(key, { handler, description })
  }

  /**
   * Unregister a keyboard shortcut
   * @param {String} key - Key combination
   */
  const unregisterShortcut = (key) => {
    shortcuts.value.delete(key)
  }

  /**
   * Handle global keyboard shortcuts
   * @param {KeyboardEvent} event - The keyboard event
   * @returns {Boolean} - Whether a shortcut was handled
   */
  const handleShortcut = (event) => {
    const key = event.key
    const ctrl = event.ctrlKey
    const meta = event.metaKey
    const shift = event.shiftKey
    const alt = event.altKey

    // Build key combination string
    let combination = ''
    if (ctrl) combination += 'Ctrl+'
    if (meta) combination += 'Meta+'
    if (shift) combination += 'Shift+'
    if (alt) combination += 'Alt+'
    combination += key

    // Check for exact match
    if (shortcuts.value.has(combination)) {
      const { handler } = shortcuts.value.get(combination)
      handler(event)
      return true
    }

    // Check for single key shortcuts
    if (!ctrl && !meta && !shift && !alt && shortcuts.value.has(key)) {
      const { handler } = shortcuts.value.get(key)
      handler(event)
      return true
    }

    return false
  }

  /**
   * Get all registered shortcuts (for documentation)
   */
  const getAllShortcuts = () => {
    const result = []
    shortcuts.value.forEach((value, key) => {
      result.push({ key, description: value.description })
    })
    return result
  }

  return {
    getNextIndex,
    handleListNavigation,
    registerShortcut,
    unregisterShortcut,
    handleShortcut,
    getAllShortcuts,
    shortcuts: readonly(shortcuts)
  }
}

