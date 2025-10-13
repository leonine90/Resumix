/**
 * ARIA live region announcements for screen readers
 */
export function useAriaAnnounce() {
  const announcements = ref([])
  let announcementId = 0
  let debounceTimer = null

  /**
   * Create announcement object
   * @param {String} message - Message to announce
   * @param {String} priority - 'polite' or 'assertive'
   * @returns {Object} - Announcement object
   */
  const createAnnouncement = (message, priority = 'polite') => {
    return {
      id: ++announcementId,
      message,
      priority,
      timestamp: Date.now()
    }
  }

  /**
   * Announce a message to screen readers
   * @param {String} message - Message to announce
   * @param {String} priority - 'polite' (default) or 'assertive'
   * @param {Number} debounce - Debounce time in ms (default: 100)
   */
  const announce = (message, priority = 'polite', debounce = 100) => {
    if (!message || typeof message !== 'string') return

    // Clear existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Debounce announcements to prevent spam
    debounceTimer = setTimeout(() => {
      const announcement = createAnnouncement(message, priority)
      announcements.value.push(announcement)

      // Remove announcement after it's been read (2 seconds)
      setTimeout(() => {
        announcements.value = announcements.value.filter(a => a.id !== announcement.id)
      }, 2000)
    }, debounce)
  }

  /**
   * Announce with polite priority (doesn't interrupt current speech)
   * @param {String} message - Message to announce
   */
  const announcePolite = (message, debounce = 100) => {
    announce(message, 'polite', debounce)
  }

  /**
   * Announce with assertive priority (interrupts current speech)
   * @param {String} message - Message to announce
   */
  const announceAssertive = (message, debounce = 100) => {
    announce(message, 'assertive', debounce)
  }

  /**
   * Clear all announcements
   */
  const clearAnnouncements = () => {
    announcements.value = []
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  // Clean up on unmount
  onUnmounted(() => {
    clearAnnouncements()
  })

  return {
    announcements: readonly(announcements),
    announce,
    announcePolite,
    announceAssertive,
    clearAnnouncements
  }
}

