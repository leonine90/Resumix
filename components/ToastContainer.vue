<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <Icon 
              :icon="getIcon(toast.type)" 
              style="font-size: 16px;" 
            />
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button
            v-if="toast.autoClose === 0"
            class="toast-close"
            @click="removeToast(toast.id)"
            aria-label="Close notification"
          >
            <Icon icon="material-symbols:close" style="font-size: 14px;" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '~/composables/useToast'
import { Icon } from '@iconify/vue'

const { toasts, removeToast } = useToast()

const getIcon = (type) => {
  const icons = {
    success: 'material-symbols:check-circle',
    error: 'material-symbols:error',
    warning: 'material-symbols:warning',
    info: 'material-symbols:info'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
  max-width: 400px;
}

.toast {
  pointer-events: auto;
  margin-bottom: 12px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 100%;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  gap: 12px;
}

.toast-icon {
  color: #9ca3af;
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-message {
  color: #f9fafb;
  font-size: 14px;
  line-height: 1.4;
  flex: 1;
  word-wrap: break-word;
}

.toast-close {
  background: none;
  border: none;
  color: #d1d5db;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: #374151;
  color: #ffffff;
}

.toast-close:focus {
  outline: 2px solid #60a5fa;
  outline-offset: 1px;
}

/* Toast animations */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive design */
@media (max-width: 480px) {
  .toast-container {
    left: 20px;
    right: 20px;
    bottom: 20px;
    max-width: none;
  }
  
  .toast {
    margin-bottom: 8px;
  }
  
  .toast-content {
    padding: 10px 12px;
    gap: 10px;
  }
  
  .toast-message {
    font-size: 13px;
  }
}

/* Print styles */
@media print {
  .toast-container {
    display: none;
  }
}
</style>