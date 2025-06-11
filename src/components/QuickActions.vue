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
  @apply bg-gray-700/60 text-gray-200 px-3 py-1.5 rounded-lg text-sm flex items-center transition-colors border border-gray-600/50;
}
.quick-action:hover {
  @apply bg-emerald-600/30 border-emerald-500 text-emerald-300;
}
</style>
