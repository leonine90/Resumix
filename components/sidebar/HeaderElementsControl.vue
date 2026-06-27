<template>
  <div>
    <fieldset class="elements-fieldset">
      <legend class="sr-only">Toggle header elements visibility</legend>
      <div
        v-for="(visible, element) in headerElements"
        :key="element"
        class="toggle-row"
        @click="$emit('toggle-element', element, !visible)"
      >
        <span class="toggle-label">{{ formatElementName(element) }}</span>
        <v-switch
          :model-value="visible"
          :aria-label="formatElementName(element)"
          density="compact"
          hide-details
          color="primary"
          inset
          class="toggle-switch"
          @click.stop
          @update:model-value="$emit('toggle-element', element, $event)"
        />
      </div>
    </fieldset>

    <div class="always-visible-item" role="status">
      <v-icon size="14" class="mr-1 lock-icon">mdi-lock-outline</v-icon>
      <span>Name &amp; Title always visible</span>
    </div>

    <v-text-field
      v-if="headerElements.headshot"
      :model-value="personal?.headshot || ''"
      label="Headshot URL"
      type="url"
      placeholder="https://example.com/image.jpg"
      density="compact"
      variant="outlined"
      hint="Paste an image URL for your headshot"
      persistent-hint
      class="mt-3"
      @update:model-value="$emit('update-headshot', $event)"
    />
  </div>
</template>

<script setup>
defineProps({
  headerElements: { type: Object, required: true },
  personal: { type: Object, required: true },
})

defineEmits(['toggle-element', 'update-headshot'])

const formatElementName = (element) =>
  element.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
</script>

<style scoped>
.elements-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 8px 2px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
  user-select: none;
}

.toggle-row:hover {
  background: rgba(21, 101, 192, 0.06);
}

.toggle-label {
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface));
  flex: 1;
}

.toggle-switch {
  flex-shrink: 0;
}

:deep(.toggle-switch .v-switch__track) {
  opacity: 1;
}

.always-visible-item {
  display: flex;
  align-items: center;
  padding: 6px 10px 2px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.38;
  font-size: 12px;
}

.lock-icon {
  opacity: 0.7;
}
</style>
