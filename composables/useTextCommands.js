export function useTextCommands() {
  
  const applyCommand = (command, value = null) => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return false
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return false

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    const editableElement = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container

    const closestEditable = editableElement.closest('.editable')
    if (!closestEditable) return false

    // Focus the editable element to ensure command works
    closestEditable.focus()

    try {
      // Execute the command
      const success = document.execCommand(command, false, value)
      
      // Trigger blur event to save changes
      if (success) {
        setTimeout(() => {
          closestEditable.blur()
          closestEditable.focus()
        }, 10)
      }
      
      return success
    } catch (error) {
      console.warn('Command execution failed:', error)
      return false
    }
  }

  const toggleBold = () => {
    return applyCommand('bold')
  }

  const toggleItalic = () => {
    return applyCommand('italic')
  }

  const insertUnorderedList = () => {
    return applyCommand('insertUnorderedList')
  }

  const insertOrderedList = () => {
    return applyCommand('insertOrderedList')
  }

  const insertLink = () => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return false
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return false

    const selectedText = selection.toString()
    const url = prompt('Enter URL:', 'https://')
    
    if (!url) return false

    if (selectedText) {
      // If text is selected, make it a link
      return applyCommand('createLink', url)
    } else {
      // If no text selected, insert link with URL as text
      return applyCommand('insertHTML', `<a href="${url}" target="_blank">${url}</a>`)
    }
  }

  const removeFormat = () => {
    return applyCommand('removeFormat')
  }

  // Check if a format is currently active
  const isFormatActive = (command) => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return false
    
    try {
      return document.queryCommandState(command)
    } catch (error) {
      return false
    }
  }

  const isBoldActive = () => isFormatActive('bold')
  const isItalicActive = () => isFormatActive('italic')

  // Custom list handling for better control
  const handleListToggle = (listType) => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return false
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return false

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    const editableElement = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container

    const closestEditable = editableElement.closest('.editable')
    if (!closestEditable) return false

    // Check if we're already in a list
    const listElement = editableElement.closest('ul, ol')
    
    if (listElement) {
      // If we're in a list, remove the list formatting
      const listItems = listElement.querySelectorAll('li')
      const textContent = Array.from(listItems).map(li => li.textContent).join('\n')
      listElement.parentNode.replaceChild(document.createTextNode(textContent), listElement)
    } else {
      // Create a new list
      const command = listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'
      applyCommand(command)
    }

    return true
  }

  return {
    toggleBold,
    toggleItalic,
    insertUnorderedList,
    insertOrderedList,
    insertLink,
    removeFormat,
    handleListToggle,
    isBoldActive,
    isItalicActive,
    isFormatActive
  }
}