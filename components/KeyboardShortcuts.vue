<template>
  <div>
    <!-- Keyboard Shortcuts Button -->
    <button
      class="shortcuts-btn"
      @click="showModal = true"
      aria-label="View keyboard shortcuts"
      title="Keyboard shortcuts (?)"
    >
      <Icon icon="material-symbols:keyboard-outline" style="font-size: 20px;" aria-hidden="true" />
      <span class="sr-only">Keyboard Shortcuts</span>
    </button>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal-overlay"
      @click.self="closeModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div class="modal-content" ref="modalRef">
        <div class="modal-header">
          <h2 id="shortcuts-modal-title">Keyboard Shortcuts</h2>
          <button
            class="close-btn"
            @click="closeModal"
            aria-label="Close keyboard shortcuts dialog"
          >
            <Icon icon="material-symbols:close" style="font-size: 20px;" aria-hidden="true" />
          </button>
        </div>

        <div class="modal-body">
          <div class="shortcuts-section">
            <h3>Text Formatting</h3>
            <dl class="shortcuts-list">
              <div class="shortcut-item">
                <dt><kbd>Ctrl</kbd> + <kbd>B</kbd> (or <kbd>Cmd</kbd> + <kbd>B</kbd>)</dt>
                <dd>Bold text</dd>
              </div>
              <div class="shortcut-item">
                <dt><kbd>Ctrl</kbd> + <kbd>I</kbd> (or <kbd>Cmd</kbd> + <kbd>I</kbd>)</dt>
                <dd>Italic text</dd>
              </div>
            </dl>
          </div>

          <div class="shortcuts-section">
            <h3>Navigation</h3>
            <dl class="shortcuts-list">
              <div class="shortcut-item">
                <dt><kbd>Tab</kbd></dt>
                <dd>Move to next interactive element</dd>
              </div>
              <div class="shortcut-item">
                <dt><kbd>Shift</kbd> + <kbd>Tab</kbd></dt>
                <dd>Move to previous interactive element</dd>
              </div>
              <div class="shortcut-item">
                <dt><kbd>Escape</kbd></dt>
                <dd>Close modal dialogs</dd>
              </div>
              <div class="shortcut-item">
                <dt><kbd>?</kbd></dt>
                <dd>Show this keyboard shortcuts dialog</dd>
              </div>
            </dl>
          </div>

          <div class="shortcuts-section">
            <h3>Editing</h3>
            <dl class="shortcuts-list">
              <div class="shortcut-item">
                <dt><kbd>Enter</kbd></dt>
                <dd>Edit selected contenteditable field</dd>
              </div>
              <div class="shortcut-item">
                <dt><kbd>Escape</kbd></dt>
                <dd>Cancel editing (when in contenteditable field)</dd>
              </div>
            </dl>
          </div>

          <div class="shortcuts-section">
            <h3>Skip Links</h3>
            <dl class="shortcuts-list">
              <div class="shortcut-item">
                <dt>Focus on page, then press <kbd>Tab</kbd></dt>
                <dd>Access skip navigation links</dd>
              </div>
            </dl>
          </div>

          <div class="shortcuts-section">
            <h3>Screen Reader Shortcuts</h3>
            <dl class="shortcuts-list">
              <div class="shortcut-item">
                <dt>NVDA/JAWS: <kbd>H</kbd></dt>
                <dd>Navigate by headings</dd>
              </div>
              <div class="shortcut-item">
                <dt>NVDA/JAWS: <kbd>D</kbd></dt>
                <dd>Navigate by landmarks</dd>
              </div>
              <div class="shortcut-item">
                <dt>NVDA/JAWS: <kbd>B</kbd></dt>
                <dd>Navigate by buttons</dd>
              </div>
              <div class="shortcut-item">
                <dt>VoiceOver: <kbd>Ctrl</kbd> + <kbd>Option</kbd> + <kbd>U</kbd></dt>
                <dd>Open rotor for navigation</dd>
              </div>
            </dl>
          </div>

          <div class="shortcuts-tip">
            <Icon icon="material-symbols:info-outline" style="font-size: 18px;" aria-hidden="true" />
            <p>
              <strong>Tip:</strong> Most screen readers have many more keyboard shortcuts. 
              Refer to your screen reader's documentation for a complete list.
            </p>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useFocusTrap } from '~/composables/useFocusTrap'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

const showModal = ref(false)
const modalRef = ref(null)

const { trapFocus, releaseFocus } = useFocusTrap()
const { lockScroll, unlockScroll } = useBodyScrollLock()

const closeModal = () => {
  showModal.value = false
}

// Focus trap and scroll lock
watch(showModal, (isOpen) => {
  if (isOpen) {
    lockScroll()
    nextTick(() => {
      if (modalRef.value) {
        trapFocus(modalRef.value)
      }
    })
  } else {
    unlockScroll()
    releaseFocus()
  }
})

// Global keyboard shortcuts
onMounted(() => {
  const handleKeyPress = (e) => {
    // Open shortcuts dialog with "?"
    if (e.key === '?' && !showModal.value) {
      // Only if not in an input or contenteditable
      const target = e.target
      if (target.tagName !== 'INPUT' && 
          target.tagName !== 'TEXTAREA' && 
          !target.isContentEditable) {
        e.preventDefault()
        showModal.value = true
      }
    }
    
    // Close with Escape
    if (e.key === 'Escape' && showModal.value) {
      closeModal()
    }
  }

  document.addEventListener('keydown', handleKeyPress)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress)
    unlockScroll()
    releaseFocus()
  })
})
</script>

<style scoped>
.shortcuts-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  z-index: 1001; /* Above sidebar (sidebar is z-index: 1000) */
  color: #475569;
}

.shortcuts-btn:hover {
  background: #f1f5f9;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.shortcuts-btn:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.close-btn:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.shortcuts-section {
  margin-bottom: 24px;
}

.shortcuts-section:last-of-type {
  margin-bottom: 16px;
}

.shortcuts-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.shortcuts-list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  gap: 16px;
}

.shortcut-item dt {
  font-weight: 500;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.shortcut-item dd {
  margin: 0;
  color: #64748b;
  text-align: right;
}

kbd {
  display: inline-block;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #1e293b;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.shortcuts-tip {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  margin-top: 16px;
}

.shortcuts-tip p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #1e40af;
}

.shortcuts-tip strong {
  font-weight: 600;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #1565c0; /* 7.5:1 contrast - AAA compliant */
  color: white;
}

.btn-primary:hover {
  background: #0d47a1; /* Darker on hover */
}

.btn-primary:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

@media print {
  .shortcuts-btn,
  .modal-overlay {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .shortcut-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .shortcut-item dd {
    text-align: left;
  }
}
</style>

