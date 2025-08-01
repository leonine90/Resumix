// Create singleton refs that are shared across all instances
const isSelectionActive = ref(false)
const selectionRect = ref(null)
const selectedElement = ref(null)

export function useTextSelection() {

  const handleClick = (event) => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    // Check if the click is within an editable element
    const editableElement = event.target.closest('.editable')
    
    if (!editableElement) {
      isSelectionActive.value = false
      selectedElement.value = null
      return
    }

    // Get the bounding rect of the clicked element
    const rect = editableElement.getBoundingClientRect()
    
    // Store click position info
    const clickRectData = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom + window.scrollY,
      right: rect.right + window.scrollX
    }
    
    isSelectionActive.value = true
    selectedElement.value = editableElement
    selectionRect.value = clickRectData
  }

  const handleClickOutside = (event) => {
    // Don't hide if clicking on the toolbar
    if (event.target.closest('.floating-toolbar')) return
    
    // Don't hide if clicking on an editable element
    if (event.target.closest('.editable')) return
    
    // Hide toolbar when clicking outside
    isSelectionActive.value = false
    selectedElement.value = null
  }

  const clearSelection = () => {
    isSelectionActive.value = false
    selectedElement.value = null
    selectionRect.value = null
  }

  const initializeSelectionTracking = () => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    document.addEventListener('click', handleClick)
    document.addEventListener('mousedown', handleClickOutside)
  }

  const destroySelectionTracking = () => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    document.removeEventListener('click', handleClick)
    document.removeEventListener('mousedown', handleClickOutside)
  }

  return {
    isSelectionActive,
    selectionRect,
    selectedElement,
    clearSelection,
    initializeSelectionTracking,
    destroySelectionTracking
  }
}