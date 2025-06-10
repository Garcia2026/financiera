<template>
  <div class="summary-card" :class="borderClass" :style="delayStyle">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-sm font-medium text-gray-400 mb-1">{{ title }}</h3>
        <p v-if="value !== undefined" class="text-3xl font-bold" :class="valueClass">{{ value }}</p>
        <slot></slot>
      </div>
      <div class="p-3 rounded-lg shadow-inner flex items-center justify-center" :class="iconBgClass">
        <slot name="icon" />
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: String,
  value: [String, Number],
  valueClass: { type: String, default: '' },
  borderClass: { type: String, default: '' },
  iconBgClass: { type: String, default: '' },
  delay: { type: Number, default: 0 }
})
const delayStyle = computed(() => ({ animationDelay: `${props.delay}s` }))
</script>
