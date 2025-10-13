import { useConsent } from './useConsent'
import { useToast } from './useToast'

export const useDataDeletion = () => {
  const { revokeConsent } = useConsent()
  const { showToast } = useToast()

  // Delete all user data
  const deleteAllUserData = () => {
    return new Promise((resolve, reject) => {
      try {
        if (!process.client) {
          reject(new Error('Can only delete data on client side'))
          return
        }

        // Clear all localStorage
        localStorage.clear()
        
        // Clear all sessionStorage
        sessionStorage.clear()
        
        // Revoke consent
        revokeConsent()
        
        showToast('All data has been deleted successfully', 'success')
        
        resolve(true)
      } catch (error) {
        console.error('Error deleting user data:', error)
        showToast('Failed to delete all data. Please try again.', 'error')
        reject(error)
      }
    })
  }

  // Reset to default resume (after deletion)
  const resetToDefault = () => {
    if (process.client) {
      // Reload the page to get fresh default data
      window.location.reload()
    }
  }

  // Delete and reset
  const deleteAndReset = async () => {
    try {
      await deleteAllUserData()
      // Wait a moment for user to see success message
      setTimeout(() => {
        resetToDefault()
      }, 1500)
    } catch (error) {
      console.error('Error in delete and reset:', error)
    }
  }

  return {
    deleteAllUserData,
    resetToDefault,
    deleteAndReset
  }
}

