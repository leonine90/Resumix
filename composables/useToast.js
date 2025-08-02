import { ref, readonly } from 'vue'

const toasts = ref([])
let toastId = 0

export const useToast = () => {
  const addToast = (message, type = 'info', duration = null) => {
    const id = ++toastId
    
    // Determine if toast should auto-close based on message length
    const autoClose = duration !== null ? duration : (message.length > 60 ? 0 : 4000)
    
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      autoClose,
      createdAt: Date.now()
    }
    
    toasts.value.push(toast)
    
    // Auto-remove toast if duration is set
    if (autoClose > 0) {
      setTimeout(() => {
        removeToast(id)
      }, autoClose)
    }
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const clearAllToasts = () => {
    toasts.value = []
  }
  
  // Convenience methods
  const showSuccess = (message, duration) => addToast(message, 'success', duration)
  const showError = (message, duration) => addToast(message, 'error', duration)
  const showWarning = (message, duration) => addToast(message, 'warning', duration)
  const showInfo = (message, duration) => addToast(message, 'info', duration)
  
  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}