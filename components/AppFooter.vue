<template>
  <footer class="app-footer" role="contentinfo" :style="{ paddingLeft: footerPaddingLeft }">
    <div class="footer-content">
      <!-- Privacy Controls Section -->
      <div class="privacy-controls" role="region" aria-label="Privacy and data controls">
        <div class="control-group">
          <div class="consent-status" role="status" aria-live="polite">
            <Icon icon="material-symbols:shield-lock-outline" class="shield-icon" aria-hidden="true" />
            <span class="status-text">AI Processing: </span>
            <span :class="['status-badge', consentStatus.class]">
              {{ consentStatus.text }}
            </span>
          </div>
          
          <label class="switch-container">
            <span class="switch-label">Enable AI Features</span>
            <div class="switch">
              <input 
                type="checkbox" 
                v-model="aiConsentEnabled" 
                @change="handleConsentChange"
                class="switch-input"
                role="switch"
                :aria-checked="aiConsentEnabled ? 'true' : 'false'"
                aria-label="Toggle AI processing features"
              />
              <span class="switch-slider" aria-hidden="true"></span>
            </div>
          </label>
        </div>
        
        <div class="footer-actions">
          <button 
            @click="handleDeleteData" 
            class="footer-btn delete-btn"
            aria-label="Delete all resume data and reset application"
          >
            <Icon icon="material-symbols:delete-outline" style="font-size: 16px;" aria-hidden="true" />
            <span>Delete All Data</span>
          </button>
        </div>
      </div>
      
      <!-- Divider -->
      <div class="footer-divider"></div>
      
      <!-- Legal Links & Info -->
      <nav class="footer-info" aria-label="Legal links and contact information">
        <div class="footer-links">
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" class="footer-link">Privacy Policy</a>
          <span class="separator" aria-hidden="true">•</span>
          <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" class="footer-link">Terms of Service</a>
        </div>
        <p class="copyright">© {{ currentYear }} Resumix. All rights reserved.</p>
        <p class="contact">Privacy inquiries: <a href="mailto:privacy@resumix.app" aria-label="Contact us via email at privacy@resumix.app">privacy@resumix.app</a></p>
      </nav>
    </div>
    
    <!-- Confirmation Dialog -->
    <div 
      v-if="showDeleteConfirm" 
      class="confirm-overlay" 
      @click.self="showDeleteConfirm = false"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div class="confirm-dialog">
        <h3 id="delete-dialog-title">Delete All Data?</h3>
        <div id="delete-dialog-description">
          <p>This will permanently delete:</p>
          <ul>
            <li>All resume content and sections</li>
            <li>Your preferences and settings</li>
            <li>AI consent and privacy choices</li>
            <li>All locally stored data</li>
          </ul>
          <p class="warning-text">
            <strong>This action cannot be undone.</strong> The page will reload with default data.
          </p>
        </div>
        <div class="confirm-actions">
          <button 
            @click="showDeleteConfirm = false" 
            class="btn-cancel"
            aria-label="Cancel deletion and close dialog"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete" 
            class="btn-confirm-delete"
            aria-label="Confirm and delete all data"
          >
            Yes, Delete Everything
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useConsent } from '~/composables/useConsent'
import { useDataDeletion } from '~/composables/useDataDeletion'
import { useToast } from '~/composables/useToast'
import { useFocusTrap } from '~/composables/useFocusTrap'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const currentYear = computed(() => new Date().getFullYear())

const footerPaddingLeft = computed(() => {
  return props.sidebarCollapsed ? '70px' : '300px'
})
const showDeleteConfirm = ref(false)
const deleteDialogRef = ref(null)

const { aiConsentEnabled, updateAIConsent, initializeConsent } = useConsent()
const { trapFocus, releaseFocus } = useFocusTrap()
const { lockScroll, unlockScroll } = useBodyScrollLock()
const { deleteAndReset } = useDataDeletion()
const { showToast } = useToast()

const consentStatus = computed(() => {
  if (aiConsentEnabled.value) {
    return { text: 'Enabled', class: 'status-enabled' }
  }
  return { text: 'Disabled', class: 'status-disabled' }
})

onMounted(() => {
  initializeConsent()
})

const handleConsentChange = () => {
  try {
    updateAIConsent(aiConsentEnabled.value)
    showToast(
      aiConsentEnabled.value 
        ? 'AI features enabled. Your data may be sent to Google AI for processing.' 
        : 'AI features disabled. All AI-powered features have been turned off.',
      'success'
    )
    // No need to reload - the reactive state will update all components
  } catch (error) {
    console.error('Failed to update consent:', error)
    showToast('Failed to update consent settings', 'error')
  }
}

const handleDeleteData = () => {
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  showDeleteConfirm.value = false
  await deleteAndReset()
}

// Focus trap and keyboard handling for delete confirmation dialog
watch(showDeleteConfirm, (isOpen) => {
  if (isOpen) {
    lockScroll()
    nextTick(() => {
      const dialog = document.querySelector('.confirm-dialog')
      if (dialog) {
        trapFocus(dialog)
      }
    })
  } else {
    unlockScroll()
    releaseFocus()
  }
})

// Escape key to close dialog
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && showDeleteConfirm.value) {
      showDeleteConfirm.value = false
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    unlockScroll()
    releaseFocus()
  })
})
</script>

<style scoped>
.app-footer {
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
  background: #1e293b;
  color: #e2e8f0;
  padding: 32px 20px 24px;
  margin-top: 60px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: padding-left 0.3s ease;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Privacy Controls */
.privacy-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 24px;
}

.consent-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.shield-icon {
  font-size: 20px;
  color: #94a3b8;
}

.status-text {
  color: #cbd5e1;
  font-weight: 500;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-enabled {
  background: #10b981;
  color: white;
}

.status-disabled {
  background: #ef4444;
  color: white;
}

/* Toggle Switch */
.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.switch-label {
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.switch-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #475569;
  transition: 0.3s;
  border-radius: 26px;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.switch-input:checked + .switch-slider {
  background-color: #10b981;
}

.switch-input:checked + .switch-slider:before {
  transform: translateX(22px);
}

.switch-input:focus + .switch-slider {
  box-shadow: 0 0 1px #10b981;
}

/* Footer Actions */
.footer-actions {
  display: flex;
  gap: 12px;
}

.footer-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

/* Divider */
.footer-divider {
  height: 1px;
  background: #475569;
}

/* Footer Info */
.footer-info {
  text-align: center;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.footer-link {
  color: #60a5fa;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.separator {
  color: #64748b;
  font-size: 13px;
}

.copyright,
.contact {
  font-size: 12px;
  color: #94a3b8;
  margin: 4px 0;
}

.contact a {
  color: #60a5fa;
  text-decoration: none;
}

.contact a:hover {
  text-decoration: underline;
}

/* Confirmation Dialog */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.confirm-dialog {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.confirm-dialog h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #ef4444;
  font-weight: 600;
}

.confirm-dialog p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.6;
}

.confirm-dialog ul {
  margin: 12px 0;
  padding-left: 20px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.8;
}

.warning-text {
  margin-top: 16px !important;
  padding: 12px;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
  color: #856404 !important;
  font-size: 13px !important;
}

.warning-text strong {
  color: #ef4444;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel,
.btn-confirm-delete {
  flex: 1;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-confirm-delete {
  background: #ef4444;
  color: white;
}

.btn-confirm-delete:hover {
  background: #dc2626;
}

@media print {
  .app-footer {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .app-footer {
    padding: 24px 16px 20px 16px;
  }

  .privacy-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .control-group {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .consent-status {
    justify-content: center;
  }

  .switch-container {
    justify-content: space-between;
  }

  .footer-actions {
    width: 100%;
  }

  .footer-btn {
    width: 100%;
    justify-content: center;
  }

  .footer-links {
    flex-direction: column;
    gap: 8px;
  }

  .separator {
    display: none;
  }
}
</style>
