<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-black border-t-2 p-2 flex justify-around">
    <button
      class="flex-1 text-center py-2"
      :class="{ 'font-bold': selected === 'home' }"
      @click="$emit('navigate', 'home')">
      Home
    </button>
    <button
      class="flex-1 text-center py-2"
      :class="{ 'font-bold': selected === 'dashboard' }"
      @click="$emit('navigate', 'dashboard')">
      Dashboard
    </button>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({ selected: String })
defineEmits(['navigate'])
</script>

<style scoped>
button {
  color: #333;
}
button.font-bold {
  color: #34D399; /* green highlight */
}
</style>