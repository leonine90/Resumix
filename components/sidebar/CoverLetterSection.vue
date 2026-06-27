<template>
  <div class="section-body">
    <div class="action-row mb-2">
      <v-btn
        block
        color="secondary"
        variant="tonal"
        prepend-icon="mdi-file-document-edit"
        size="small"
        :disabled="!hasAIConsent"
        :aria-label="hasAIConsent ? 'Generate cover letter with AI' : 'Generate cover letter (AI features must be enabled)'"
        @click="$emit('show-cover-letter-modal')"
      >
        Generate Cover Letter
      </v-btn>
      <v-btn
        icon
        size="x-small"
        variant="text"
        class="info-btn"
        aria-label="Learn about AI cover letter generation"
        @click="$emit('show-cover-letter-info')"
      >
        <v-icon size="15">mdi-information-outline</v-icon>
      </v-btn>
    </div>

    <div v-if="!hasAIConsent" class="ai-notice" role="alert">
      <v-icon size="13">mdi-lightning-bolt-outline</v-icon>
      Enable AI features in the footer
    </div>
    <p v-else class="section-hint">Create cover letters tailored to specific job postings</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useConsent } from '~/composables/useConsent'

defineEmits(['show-cover-letter-modal', 'show-cover-letter-info'])

const { aiConsentEnabled: hasAIConsent, initializeConsent } = useConsent()
onMounted(() => initializeConsent())
</script>

<style scoped>
.section-body {
  padding-bottom: 4px;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-row .v-btn:first-child {
  flex: 1;
}

.info-btn {
  flex-shrink: 0;
  opacity: 0.5;
  transition: opacity 0.15s;
}

.info-btn:hover {
  opacity: 1;
}

.ai-notice {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 11px;
  color: rgb(var(--v-theme-on-surface-variant));
  background: rgb(var(--v-theme-outline-variant));
  opacity: 0.8;
}

.section-hint {
  margin-top: 8px;
  font-size: 11px;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.7;
  line-height: 1.4;
}
</style>
