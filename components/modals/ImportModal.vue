<template>
  <v-dialog
    :model-value="show"
    max-width="560"
    scrollable
    @update:model-value="val => !val && handleClose()"
  >
    <v-card rounded="lg">
      <v-toolbar color="surface-variant" density="comfortable" flat>
        <v-icon class="ml-3 mr-1" color="primary">mdi-code-json</v-icon>
        <v-toolbar-title class="text-subtitle-1 font-weight-semibold" id="import-modal-title">
          Import Resume Data
        </v-toolbar-title>
        <template #append>
          <v-btn icon variant="text" aria-label="Close import dialog" @click="handleClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-divider />

      <v-card-text class="pa-6">
        <v-textarea
          v-model="importJsonText"
          label="Paste JSON data"
          placeholder="Paste your resume data in JSON format here..."
          rows="12"
          variant="outlined"
          density="comfortable"
          font-family="monospace"
          aria-describedby="import-help-text"
        />
        <span id="import-help-text" class="sr-only">
          Paste your resume data in JSON format to import it into the application
        </span>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 justify-end gap-2">
        <v-btn variant="text" aria-label="Cancel import" @click="handleClose">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!importJsonText.trim()"
          aria-label="Import resume data"
          @click="handleImport"
        >
          Import Data
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useResumeImport } from '~/composables/useResumeImport'

const props = defineProps({
  show: { type: Boolean, required: true },
  resumeData: { type: Object, required: true },
})
const emit = defineEmits(['close', 'import-success'])

const { importData } = useResumeImport()
const importJsonText = ref('')

const handleImport = async () => {
  const mergedData = await importData(importJsonText.value, props.resumeData)
  if (mergedData) {
    emit('import-success', mergedData)
    importJsonText.value = ''
  }
}

const handleClose = () => {
  importJsonText.value = ''
  emit('close')
}
</script>
