<template>
  <div>
    <v-btn
      icon
      size="40"
      elevation="3"
      color="surface"
      class="shortcuts-fab"
      aria-label="View keyboard shortcuts"
      title="Keyboard shortcuts (?)"
      @click="showModal = true"
    >
      <v-icon color="on-surface-variant">mdi-keyboard-outline</v-icon>
    </v-btn>

    <v-dialog
      v-model="showModal"
      max-width="700"
      scrollable
    >
      <v-card rounded="lg">
        <v-toolbar color="surface-variant" density="comfortable" flat>
          <v-icon class="ml-3 mr-1" color="primary">mdi-keyboard-outline</v-icon>
          <v-toolbar-title class="text-subtitle-1 font-weight-semibold" id="shortcuts-modal-title">
            Keyboard Shortcuts
          </v-toolbar-title>
          <template #append>
            <v-btn icon variant="text" aria-label="Close keyboard shortcuts dialog" @click="showModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-toolbar>

        <v-card-text class="pa-0">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-body-2 font-weight-bold">Shortcut</th>
                <th class="text-body-2 font-weight-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in shortcuts" :key="row.action">
                <td>
                  <span v-for="(part, i) in row.keys" :key="i">
                    <kbd v-if="part !== '+'" class="shortcut-key">{{ part }}</kbd>
                    <span v-else class="text-medium-emphasis mx-1">{{ part }}</span>
                  </span>
                </td>
                <td class="text-body-2">{{ row.action }}</td>
              </tr>
            </tbody>
          </v-table>

          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            icon="mdi-information-outline"
            class="mx-4 mb-4 mt-2"
          >
            <strong>Tip:</strong> Most screen readers have many more keyboard shortcuts.
            Refer to your screen reader's documentation for a complete list.
          </v-alert>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4 justify-end">
          <v-btn color="primary" variant="elevated" @click="showModal = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showModal = ref(false)

const shortcuts = [
  { keys: ['Ctrl', '+', 'B'], action: 'Bold text' },
  { keys: ['Ctrl', '+', 'I'], action: 'Italic text' },
  { keys: ['Tab'], action: 'Move to next interactive element' },
  { keys: ['Shift', '+', 'Tab'], action: 'Move to previous interactive element' },
  { keys: ['Escape'], action: 'Close modal dialogs / cancel editing' },
  { keys: ['?'], action: 'Show this keyboard shortcuts dialog' },
  { keys: ['Enter'], action: 'Edit selected contenteditable field' },
  { keys: ['H'], action: 'NVDA/JAWS: Navigate by headings' },
  { keys: ['D'], action: 'NVDA/JAWS: Navigate by landmarks' },
  { keys: ['B'], action: 'NVDA/JAWS: Navigate by buttons' },
  { keys: ['Ctrl', '+', 'Option', '+', 'U'], action: 'VoiceOver: Open rotor for navigation' },
]

const handleKeyDown = (e) => {
  if (e.key === '?' && !showModal.value) {
    const t = e.target
    if (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA' && !t.isContentEditable) {
      e.preventDefault()
      showModal.value = true
    }
  }
}

onMounted(() => document.addEventListener('keydown', handleKeyDown))
onUnmounted(() => document.removeEventListener('keydown', handleKeyDown))
</script>

<style scoped>
.shortcuts-fab {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1001;
}

.shortcut-key {
  display: inline-block;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline));
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

@media print {
  .shortcuts-fab { display: none !important; }
}
</style>
