<template>
  <Teleport to="body">
    <v-card
      v-if="isSelectionActive && editable"
      class="floating-toolbar"
      elevation="0"
      rounded="lg"
      role="toolbar"
      aria-label="Text formatting options"
      :style="toolbarPosition"
      @mousedown.prevent
    >
      <div class="toolbar-content" role="group" aria-label="Formatting controls">
        <v-btn
          icon
          size="small"
          :variant="isBoldActive() ? 'tonal' : 'text'"
          :color="isBoldActive() ? 'primary' : undefined"
          title="Bold (Ctrl+B)"
          aria-label="Bold text"
          :aria-pressed="isBoldActive() ? 'true' : 'false'"
          @click="handleCommand('bold')"
        >
          <v-icon size="18">mdi-format-bold</v-icon>
        </v-btn>

        <v-btn
          icon
          size="small"
          :variant="isItalicActive() ? 'tonal' : 'text'"
          :color="isItalicActive() ? 'primary' : undefined"
          title="Italic (Ctrl+I)"
          aria-label="Italic text"
          :aria-pressed="isItalicActive() ? 'true' : 'false'"
          @click="handleCommand('italic')"
        >
          <v-icon size="18">mdi-format-italic</v-icon>
        </v-btn>

        <v-divider vertical class="mx-1" />

        <v-btn
          icon
          size="small"
          variant="text"
          title="Bullet List"
          aria-label="Insert bullet list"
          @click="handleCommand('bulletList')"
        >
          <v-icon size="18">mdi-format-list-bulleted</v-icon>
        </v-btn>

        <v-btn
          icon
          size="small"
          variant="text"
          title="Numbered List"
          aria-label="Insert numbered list"
          @click="handleCommand('numberedList')"
        >
          <v-icon size="18">mdi-format-list-numbered</v-icon>
        </v-btn>

        <v-divider vertical class="mx-1" />

        <v-btn
          icon
          size="small"
          variant="text"
          title="Insert Link"
          aria-label="Insert hyperlink"
          @click="handleCommand('insertLink')"
        >
          <v-icon size="18">mdi-link</v-icon>
        </v-btn>

        <v-divider vertical class="mx-1" />

        <v-btn
          icon
          size="small"
          variant="text"
          title="Remove Formatting"
          aria-label="Remove text formatting"
          @click="handleCommand('removeFormat')"
        >
          <v-icon size="18">mdi-format-clear</v-icon>
        </v-btn>
      </div>
    </v-card>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  editable: { type: Boolean, default: false },
})

const { isSelectionActive, selectionRect, clearSelection } = useTextSelection()
const { toggleBold, toggleItalic, insertUnorderedList, insertOrderedList, insertLink, removeFormat, isBoldActive, isItalicActive } = useTextCommands()

const toolbarPosition = computed(() => {
  if (!selectionRect.value || typeof window === 'undefined') return { display: 'none' }
  const rect = selectionRect.value
  const toolbarHeight = 48
  const toolbarWidth = 300
  let top = rect.top - toolbarHeight - 10
  let left = rect.left + rect.width / 2 - toolbarWidth / 2
  if (top < 10) top = rect.bottom + 10
  if (left < 10) left = 10
  else if (left + toolbarWidth > window.innerWidth - 10) left = window.innerWidth - toolbarWidth - 10
  return { position: 'fixed', top: `${top}px`, left: `${left}px`, zIndex: 9999 }
})

const handleCommand = (command) => {
  const handlers = {
    bold: toggleBold,
    italic: toggleItalic,
    bulletList: insertUnorderedList,
    numberedList: insertOrderedList,
    insertLink,
    removeFormat,
  }
  const success = handlers[command]?.()
  if (success) {
    setTimeout(() => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed) clearSelection()
    }, 50)
  }
}

onMounted(() => {
  const handleKeydown = (e) => {
    if (!isSelectionActive.value || !props.editable) return
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'b') { e.preventDefault(); handleCommand('bold') }
      if (e.key.toLowerCase() === 'i') { e.preventDefault(); handleCommand('italic') }
    }
  }
  document.addEventListener('keydown', handleKeydown)
  onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
})
</script>

<style scoped>
.floating-toolbar {
  position: fixed;
  animation: fadeInUp 0.15s ease-out;
  user-select: none;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  backdrop-filter: blur(8px);
}

.toolbar-content {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  gap: 2px;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media print {
  .floating-toolbar { display: none !important; }
}

@media (max-width: 768px) {
  .floating-toolbar {
    left: 10px !important;
    right: 10px;
    width: auto;
  }
}
</style>
