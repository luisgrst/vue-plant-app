<template>
  <div class="bg-background h-[95vh] overflow-y-auto scroll-spring relative">
    <!-- Sticky Header Card -->
    <div
      class="sticky top-4 z-20 m-4 text-text font-bold text-center
             bg-surface border border-border rounded-xl shadow-soft p-4"
    >
      Your Plants
    </div>

    <!-- Scrollable List Container -->
    <ul class="flex flex-col items-center gap-4">
      <li
        v-for="(plant, index) in plants"
        :key="plant.id"
        class="sticky top-[calc(23*0.25rem)] z-10 text-text-muted bg-surface border border-border
               rounded-xl shadow-soft p-4 w-[85vw] max-w-lg font-semibold
               text-center cursor-pointer transition-colors duration-50 hover:bg-hover"
        @click="$emit('selectPlant', [plant, true])"
      >
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center">
            <span class="mr-2 text-text font-bold">{{ index + 1 }}.</span>
            <span>{{ plant.name }}</span>
            <div
              class="w-6 h-6 ml-2"
              :style="{ color: healthColors[plant.health] }"
              v-html="coloredSvg"
            />
          </div>
          <div class="flex items-center">
            <button
              @click.stop="$emit('deletePlant', plant.id)"
              class="ml-2 p-1 rounded-full hover:bg-red-50 transition"
              title="Delete Plant"
            >
              <svg class="w-5 h-5 text-red-400 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m5 4v6m4-6v6" />
              </svg>
            </button>
          </div>
        </div>
      </li>
      <li class="h-[90vh]"></li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import leafRaw from '/src/assets/leaf-circle.svg?raw'

const emit = defineEmits(['selectPlant', 'refresh', 'deletePlant'])
const props = defineProps({ plants: Array })

const healthColors = ['#34D399', '#FFB547', '#FF6347']
const coloredSvg = computed(() => {
  const noFills = leafRaw.replace(/fill=".*?"/g, '')
  return noFills.replace(
    /<svg([^>]*)>/,
    `<svg$1 fill="currentColor" xmlns="http://www.w3.org/2000/svg">`
  )
})
</script>
