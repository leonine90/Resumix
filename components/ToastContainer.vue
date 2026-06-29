<template>
  <div
    class="toast-container"
    role="region"
    aria-label="Notifications"
    aria-live="polite"
    aria-atomic="false"
  >
    <TransitionGroup name="toast" tag="div">
      <v-card
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-card mb-3"
        :color="cardColor(toast.type)"
        rounded="lg"
        elevation="0"
        role="alert"
        :aria-live="toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'"
        aria-atomic="true"
      >
        <div class="toast-inner">
          <v-icon size="18" class="toast-icon" aria-hidden="true">{{ getIcon(toast.type) }}</v-icon>
          <span class="toast-message text-body-2">{{ toast.message }}</span>
          <v-btn
            v-if="toast.autoClose === 0"
            icon
            size="x-small"
            variant="text"
            aria-label="Close notification"
            class="ml-1"
            @click="removeToast(toast.id)"
          >
            <v-icon size="14">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const cardColor = (type) => ({
  success: 'secondary',
  error: 'error',
  warning: '#E65100',
  info: 'primary',
}[type] || 'primary')

const getIcon = (type) => ({
  success: 'mdi-check-circle',
  error: 'mdi-alert-circle',
  warning: 'mdi-alert',
  info: 'mdi-information',
}[type] || 'mdi-information')
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

.toast-card {
  pointer-events: auto;
}

.toast-inner {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  gap: 10px;
  color: #fff;
}

.toast-icon { flex-shrink: 0; }

.toast-message {
  flex: 1;
  word-wrap: break-word;
  color: #fff;
}

/* Transition */
.toast-enter-active { transition: all 0.25s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(60px); }
.toast-leave-to   { opacity: 0; transform: translateX(60px); }
.toast-move       { transition: transform 0.25s ease; }

@media (max-width: 480px) {
  .toast-container { left: 16px; right: 16px; max-width: none; }
}

@media print {
  .toast-container { display: none; }
}
</style>
