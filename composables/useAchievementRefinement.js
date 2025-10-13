import { ref, nextTick } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAIConsent } from '~/composables/useAIConsent'

export function useAchievementRefinement() {
  const { showSuccess, showError, showWarning } = useToast()
  const { requireAIConsent } = useAIConsent()
  
  const refiningAchievement = ref({
    expIndex: null,
    achievementIndex: null,
    isRefining: false,
    showPrompt: false,
    prompt: ''
  })
  
  const achievementHistory = ref({})

  // Toggle AI refinement prompt for a specific achievement
  const toggleAiRefinement = (expIndex, achievementIndex) => {
    if (refiningAchievement.value.showPrompt && 
        refiningAchievement.value.expIndex === expIndex && 
        refiningAchievement.value.achievementIndex === achievementIndex) {
      // Close if clicking same achievement
      refiningAchievement.value = {
        expIndex: null,
        achievementIndex: null,
        isRefining: false,
        showPrompt: false,
        prompt: ''
      }
    } else {
      // Open for this achievement
      refiningAchievement.value = {
        expIndex,
        achievementIndex,
        isRefining: false,
        showPrompt: true,
        prompt: ''
      }
    }
  }

  // Refine achievement with AI
  const refineAchievementWithAI = async (expIndex, achievementIndex, editableOptimizedContent, jobPostText) => {
    const prompt = refiningAchievement.value.prompt.trim()
    
    if (!prompt) {
      showWarning('Please enter a refinement instruction for the AI.')
      return false
    }
    
    const achievement = editableOptimizedContent.experience[expIndex].achievements[achievementIndex]
    
    if (!achievement) {
      showError('Achievement not found.')
      return false
    }
    
    // Check for AI consent before processing
    try {
      await requireAIConsent()
    } catch (error) {
      showWarning('AI consent required. Please enable AI features in Privacy & Data settings.')
      return false
    }
    
    refiningAchievement.value.isRefining = true
    
    try {
      const response = await $fetch('/api/refine-achievement', {
        method: 'POST',
        body: {
          achievement,
          userPrompt: prompt,
          jobPost: jobPostText,
          experienceContext: {
            position: editableOptimizedContent.experience[expIndex].position,
            company: editableOptimizedContent.experience[expIndex].company
          },
          hasConsent: true
        }
      })
      
      if (response.success && response.data?.refinedAchievement) {
        // Save current achievement to history for undo
        const historyKey = `${expIndex}-${achievementIndex}`
        achievementHistory.value[historyKey] = achievement
        
        // Update the achievement
        editableOptimizedContent.experience[expIndex].achievements[achievementIndex] = response.data.refinedAchievement
        
        // Clear the prompt but keep the panel open
        refiningAchievement.value.prompt = ''
        
        showSuccess('Achievement refined successfully! Use undo to revert if needed.')
        
        // Re-initialize textarea height
        nextTick(() => {
          const textareas = document.querySelectorAll('.achievement-textarea')
          textareas.forEach(textarea => {
            textarea.style.height = 'auto'
            textarea.style.height = textarea.scrollHeight + 'px'
          })
        })
        
        return true
      } else {
        showError(response.error || 'Failed to refine achievement.')
        return false
      }
    } catch (error) {
      console.error('AI refinement error:', error)
      showError('An error occurred while refining the achievement.')
      return false
    } finally {
      refiningAchievement.value.isRefining = false
    }
  }

  // Quick refinement presets
  const quickRefine = async (expIndex, achievementIndex, preset, editableOptimizedContent, jobPostText) => {
    refiningAchievement.value.prompt = preset
    return await refineAchievementWithAI(expIndex, achievementIndex, editableOptimizedContent, jobPostText)
  }

  // Undo AI refinement
  const undoAchievementRefinement = (expIndex, achievementIndex, editableOptimizedContent) => {
    const historyKey = `${expIndex}-${achievementIndex}`
    const previousValue = achievementHistory.value[historyKey]
    
    if (previousValue) {
      // Restore previous achievement
      editableOptimizedContent.experience[expIndex].achievements[achievementIndex] = previousValue
      
      // Remove from history
      delete achievementHistory.value[historyKey]
      
      showSuccess('Achievement restored to previous version.')
      
      // Re-initialize textarea height
      nextTick(() => {
        const textareas = document.querySelectorAll('.achievement-textarea')
        textareas.forEach(textarea => {
          textarea.style.height = 'auto'
          textarea.style.height = textarea.scrollHeight + 'px'
        })
      })
      
      return true
    } else {
      showWarning('No previous version available to undo.')
      return false
    }
  }

  // Check if undo is available for an achievement
  const hasUndoHistory = (expIndex, achievementIndex) => {
    const historyKey = `${expIndex}-${achievementIndex}`
    return !!achievementHistory.value[historyKey]
  }

  const resetRefinement = () => {
    refiningAchievement.value = {
      expIndex: null,
      achievementIndex: null,
      isRefining: false,
      showPrompt: false,
      prompt: ''
    }
    achievementHistory.value = {}
  }

  return {
    refiningAchievement,
    achievementHistory,
    toggleAiRefinement,
    refineAchievementWithAI,
    quickRefine,
    undoAchievementRefinement,
    hasUndoHistory,
    resetRefinement
  }
}

