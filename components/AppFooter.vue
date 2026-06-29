<template>
  <v-footer
    class="app-footer"
    :style="{ paddingLeft: footerPaddingLeft }"
    color="surface-variant"
    role="contentinfo"
  >
    <v-container max-width="1200" class="py-4">
      <!-- Top row: AI toggle + Delete -->
      <div class="footer-top" role="region" aria-label="Privacy and data controls">
        <div class="ai-row" role="status" aria-live="polite">
          <v-icon size="16" class="ai-icon">mdi-shield-lock-outline</v-icon>
          <span class="text-body-2 font-weight-medium ai-label">AI Features</span>
          <v-switch
            v-model="aiConsentEnabled"
            :color="aiConsentEnabled ? 'primary' : undefined"
            density="compact"
            hide-details
            inset
            class="ai-switch"
            :aria-label="`AI features are ${aiConsentEnabled ? 'enabled' : 'disabled'}. Click to ${aiConsentEnabled ? 'disable' : 'enable'}.`"
            @update:model-value="handleConsentChange"
          />
          <span class="text-caption status-text" :class="aiConsentEnabled ? 'text-primary' : 'text-disabled'">
            {{ aiConsentEnabled ? 'On' : 'Off' }}
          </span>
        </div>

        <v-btn
          variant="text"
          size="small"
          color="error"
          density="compact"
          prepend-icon="mdi-delete-outline"
          class="delete-btn"
          aria-label="Delete all resume data and reset application"
          @click="showDeleteConfirm = true"
        >
          Delete Data
        </v-btn>
      </div>

      <!-- Bottom row: legal links -->
      <nav class="footer-legal" aria-label="Legal links and contact information">
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" class="footer-link text-caption">Privacy Policy</a>
        <span class="sep" aria-hidden="true">·</span>
        <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" class="footer-link text-caption">Terms of Service</a>
        <span class="sep" aria-hidden="true">·</span>
        <a href="mailto:privacy@resumix.app" class="footer-link text-caption" aria-label="Contact us at privacy@resumix.app">privacy@resumix.app</a>
        <span class="sep" aria-hidden="true">·</span>
        <span class="text-caption text-disabled">© {{ currentYear }} Resumix</span>
      </nav>
    </v-container>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="showDeleteConfirm" max-width="420" persistent>
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center gap-2 pt-5 px-6">
          <v-icon color="error" size="20">mdi-alert-circle-outline</v-icon>
          <span class="text-h6">Delete All Data?</span>
        </v-card-title>
        <v-card-text class="px-6 pb-2">
          <p class="text-body-2 text-medium-emphasis mb-3">
            This will permanently delete all resume content, preferences, and locally stored data.
            The page will reload with default data.
          </p>
          <v-alert type="warning" variant="tonal" density="compact" icon="mdi-alert">
            This action cannot be undone.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 gap-2 justify-end">
          <v-btn variant="text" @click="showDeleteConfirm = false">Cancel</v-btn>
          <v-btn color="error" variant="tonal" @click="confirmDelete">Delete Everything</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConsent } from '~/composables/useConsent'
import { useDataDeletion } from '~/composables/useDataDeletion'
import { useToast } from '~/composables/useToast'

const props = defineProps({
  sidebarCollapsed: { type: Boolean, default: false },
})

const currentYear = computed(() => new Date().getFullYear())
const footerPaddingLeft = computed(() => props.sidebarCollapsed ? '70px' : '300px')
const showDeleteConfirm = ref(false)

const { aiConsentEnabled, updateAIConsent, initializeConsent } = useConsent()
const { deleteAndReset } = useDataDeletion()
const { showToast } = useToast()

onMounted(() => initializeConsent())

const handleConsentChange = () => {
  try {
    updateAIConsent(aiConsentEnabled.value)
    showToast(
      aiConsentEnabled.value ? 'AI features enabled.' : 'AI features disabled.',
      'success'
    )
  } catch {
    showToast('Failed to update consent settings', 'error')
  }
}

const confirmDelete = async () => {
  showDeleteConfirm.value = false
  await deleteAndReset()
}
</script>

<style scoped>
.app-footer {
  margin-top: 60px;
  transition: padding-left 0.3s ease;
}

.footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.ai-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-icon {
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.7;
  flex-shrink: 0;
}

.ai-label {
  color: rgb(var(--v-theme-on-surface-variant));
}

.ai-switch {
  flex-shrink: 0;
}

.status-text {
  font-weight: 500;
  min-width: 20px;
}

.delete-btn {
  opacity: 0.6;
  transition: opacity 0.15s;
}

.delete-btn:hover {
  opacity: 1;
}

.footer-legal {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.sep {
  color: rgb(var(--v-theme-outline));
  font-size: 12px;
  line-height: 1;
}

.footer-link {
  color: rgb(var(--v-theme-on-surface-variant));
  text-decoration: none;
  transition: color 0.15s;
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

@media print {
  .app-footer { display: none !important; }
}

@media (max-width: 768px) {
  .app-footer { padding-left: 16px !important; }
  .footer-top { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>
