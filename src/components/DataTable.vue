<template>
  <div class="overflow-hidden rounded-xl border shadow-inner" :class="outerClass"
       style="background-color: var(--bg-secondary); border-color: var(--border-primary)">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y" style="--tw-divide-opacity: 0.5; border-color: var(--border-primary)">
        <thead style="background-color: var(--bg-accent)">
          <tr>
            <th v-for="(h, i) in headers" :key="i" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style="color: var(--text-secondary)">
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y" style="background-color: var(--bg-accent); --tw-divide-opacity: 0.3; border-color: var(--border-secondary)">
          <tr v-if="items.length === 0 && !isLoading">
            <td :colspan="headers.length" class="px-4 py-8 text-center" style="color: var(--text-secondary)">
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
