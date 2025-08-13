import { ref } from 'vue'

const lockCount = ref(0)
const originalOverflow = ref('')

export function useBodyScrollLock() {
  const lockScroll = () => {
    if (lockCount.value === 0) {
      // Store the original overflow value
      originalOverflow.value = document.body.style.overflow
      // Lock the scroll
      document.body.style.overflow = 'hidden'
      // Add scroll-locked class to prevent page shift
      document.body.classList.add('scroll-locked')
    }
    lockCount.value++
  }

  const unlockScroll = () => {
    lockCount.value--
    if (lockCount.value === 0) {
      // Restore the original overflow value
      document.body.style.overflow = originalOverflow.value
      // Remove scroll-locked class
      document.body.classList.remove('scroll-locked')
    }
  }

  const isLocked = () => {
    return lockCount.value > 0
  }

  return {
    lockScroll,
    unlockScroll,
    isLocked
  }
}
