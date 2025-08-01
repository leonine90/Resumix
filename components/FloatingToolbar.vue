<template>
  <Teleport to="body">
    <div
      v-if="isSelectionActive && editable"
      class="floating-toolbar"
      :style="toolbarPosition"
      @mousedown.prevent
    >
      <div class="toolbar-content">
        <!-- Bold -->
        <button
          class="toolbar-btn"
          :class="{ active: isBoldActive() }"
          @click="handleCommand('bold')"
          title="Bold (Ctrl+B)"
        >
          <Icon icon="mdi:format-bold" />
        </button>

        <!-- Italic -->
        <button
          class="toolbar-btn"
          :class="{ active: isItalicActive() }"
          @click="handleCommand('italic')"
          title="Italic (Ctrl+I)"
        >
          <Icon icon="mdi:format-italic" />
        </button>

        <div class="toolbar-divider"></div>

        <!-- Bullet List -->
        <button
          class="toolbar-btn"
          @click="handleCommand('bulletList')"
          title="Bullet List"
        >
          <Icon icon="mdi:format-list-bulleted" />
        </button>

        <!-- Numbered List -->
        <button
          class="toolbar-btn"
          @click="handleCommand('numberedList')"
          title="Numbered List"
        >
          <Icon icon="mdi:format-list-numbered" />
        </button>

        <div class="toolbar-divider"></div>

        <!-- Insert Link -->
        <button
          class="toolbar-btn"
          @click="handleCommand('insertLink')"
          title="Insert Link"
        >
          <Icon icon="mdi:link" />
        </button>

        <div class="toolbar-divider"></div>

        <!-- Remove Format -->
        <button
          class="toolbar-btn"
          @click="handleCommand('removeFormat')"
          title="Remove Formatting"
        >
          <Icon icon="mdi:format-clear" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  }
})

// Use our composables
const { 
  isSelectionActive, 
  selectionRect, 
  clearSelection 
} = useTextSelection()



const {
  toggleBold,
  toggleItalic,
  insertUnorderedList,
  insertOrderedList,
  insertLink,
  removeFormat,
  isBoldActive,
  isItalicActive
} = useTextCommands()

// Calculate toolbar position
const toolbarPosition = computed(() => {
  if (!selectionRect.value) return { display: 'none' }
  
  // Only calculate position on client side
  if (typeof window === 'undefined') return { display: 'none' }
  
  const rect = selectionRect.value
  const toolbarHeight = 48 // Approximate toolbar height
  const toolbarWidth = 300 // Approximate toolbar width
  
  // Position above the selection
  let top = rect.top - toolbarHeight - 10
  let left = rect.left + (rect.width / 2) - (toolbarWidth / 2)
  
  // Ensure toolbar stays within viewport
  if (top < 10) {
    top = rect.bottom + 10 // Position below if not enough space above
  }
  
  if (left < 10) {
    left = 10
  } else if (left + toolbarWidth > window.innerWidth - 10) {
    left = window.innerWidth - toolbarWidth - 10
  }
  
  return {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999
  }
})

// Handle toolbar commands
const handleCommand = (command) => {
  let success = false
  
  switch (command) {
    case 'bold':
      success = toggleBold()
      break
    case 'italic':
      success = toggleItalic()
      break
    case 'bulletList':
      success = insertUnorderedList()
      break
    case 'numberedList':
      success = insertOrderedList()
      break
    case 'insertLink':
      success = insertLink()
      break
    case 'removeFormat':
      success = removeFormat()
      break
  }
  
  // Keep selection active after command
  if (success) {
    // Small delay to allow command to complete
    setTimeout(() => {
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) {
        // Selection still exists, keep toolbar visible
        return
      }
      // Clear selection if no longer valid
      clearSelection()
    }, 50)
  }
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e) => {
    if (!isSelectionActive.value || !props.editable) return
    
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault()
          handleCommand('bold')
          break
        case 'i':
          e.preventDefault()
          handleCommand('italic')
          break
      }
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
.floating-toolbar {
  position: absolute;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  animation: fadeInUp 0.15s ease-out;
  user-select: none;
}

.toolbar-content {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #666;
  font-size: 16px;
}

.toolbar-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.toolbar-btn.active {
  background-color: var(--md-sys-color-primary, #007bff);
  color: white;
}

.toolbar-btn.active:hover {
  background-color: var(--md-sys-color-primary, #007bff);
  opacity: 0.9;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: #e0e0e0;
  margin: 0 4px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure toolbar doesn't appear in print */
@media print {
  .floating-toolbar {
    display: none !important;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .floating-toolbar {
    max-width: calc(100vw - 20px);
    left: 10px !important;
    right: 10px;
    width: auto;
  }
  
  .toolbar-content {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .toolbar-btn {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
}</style>