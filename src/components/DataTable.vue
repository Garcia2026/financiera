<template>
  <div class="overflow-hidden rounded-xl border border-gray-700/50 shadow-inner" :class="outerClass">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-700/50">
        <thead class="bg-gray-800/60">
          <tr>
            <th v-for="(h, i) in headers" :key="i" class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-gray-800/30 divide-y divide-gray-700/30">
          <tr v-if="items.length === 0 && !isLoading">
            <td :colspan="headers.length" class="px-4 py-8 text-center text-gray-400">
              <slot name="empty"></slot>
            </td>
          </tr>
          <template v-else>
            <slot name="rows" :items="items" />
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  headers: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  outerClass: { type: String, default: '' }
})
</script>
