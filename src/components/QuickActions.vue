<template>
  <div class="quick-actions">
    <button v-for="action in actions" :key="action.label" class="quick-action" @click="action.onClick">
      <component :is="action.icon" class="w-5 h-5 mr-1" />
      {{ action.label }}
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  actions: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-action {
  @apply px-3 py-1.5 rounded-lg text-sm flex items-center transition-colors border;
  background-color: var(--bg-accent);
  color: var(--text-primary);
  border-color: var(--border-primary);
}
.quick-action:hover {
  background-color: var(--brand-emerald);
  border-color: var(--brand-emerald);
  color: var(--text-on-accent-bg);
}
</style>
