<template>
  <div class="sidebar-header">
    <button class="toggle-btn" @click="toggleSidebar">
      <Icon v-if="!isCollapsed" icon="material-symbols:chevron-left" style="font-size: 16px;" />
      <Icon v-else icon="material-symbols:chevron-right" style="font-size: 16px;" />
    </button>
    <h3 v-if="!isCollapsed">Resumix</h3>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

// Props
const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['toggle-sidebar'])

// Methods
const toggleSidebar = () => {
  emit('toggle-sidebar')
}
</script>

<style scoped>
.sidebar-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #ffffff;
}

.toggle-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.sidebar-header h3 {
  margin: 0 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}
</style>