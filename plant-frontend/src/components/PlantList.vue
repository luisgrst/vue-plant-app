<template>
  <div class="p-4 space-y-4 bg-slate-200 h-[100vh]">
    <h1 class="text-2xl font-bold">Your Plants</h1>
    <ul>
      <li
        v-for="plant in plants"
        :key="plant.id"
        class="flex items-center justify-between bg-gray-800 text-white rounded-xl p-4 mb-2"
        @click="$emit('selectPlant', plant)">
        <span class="font-bold">{{ plant.name }}</span>
        <span class="ml-2 text-xl">&#8594;</span>
      </li>
      <!-- Add Plant entry -->
      <li
        key="add"
        class="flex items-center justify-center rounded-xl p-4 mb-2 border-2 border-gray-800"
        @click="$emit('addPlant')">
        <span class="font-bold">Add Plant +</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({ plants: Array })
defineEmits(['selectPlant', 'addPlant'])
</script>

<style scoped>
li:hover {
  background-color: #27272a; /* slate-800 for existing items */
}
li[key="add"]:hover {
  background-color: #e2e8f0; /* slate-100 for add entry */
}
</style>
