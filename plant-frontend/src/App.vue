<script setup>
import { ref, computed } from 'vue'
import LineChart from './components/LineChart.vue'

const plants = ref([
  { id: 1, name: 'Aloe Vera' },
  { id: 2, name: 'Basil' },
  { id: 3, name: 'Cactus' }
])

const selectedPlant = ref(plants.value[0])
const sidebarOpen = ref(false)
const lastUpdate = ref(new Date().toLocaleTimeString())

const labels = Array.from({ length: 24 }, (_, i) => i)
const moistureData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 30)
const temperatureData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 20)
const lightData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))

const latestMoisture = computed(() => moistureData[moistureData.length - 1])
const latestTemperature = computed(() => temperatureData[temperatureData.length - 1])
const latestLight = computed(() => lightData[lightData.length - 1])

function selectPlant(plant) {
  selectedPlant.value = plant
  sidebarOpen.value = false
  lastUpdate.value = new Date().toLocaleTimeString()
}
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- Sidebar -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
    ></div>
    <aside
      :class="[
        'bg-green-100 w-64 p-4 z-20 transition-transform md:translate-x-0 fixed md:static h-full overflow-y-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <h2 class="text-xl font-bold mb-4">Plants</h2>
  <ul class="divide-y divide-gray-300">
        <li
          v-for="plant in plants"
          :key="plant.id"
          class="py-2"
        >
          <button
            class="w-full text-left px-2 py-1 rounded hover:bg-green-200"
            @click="selectPlant(plant)"
          >
            {{ plant.name }}
          </button>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 p-4 md:ml-64">
      <header class="flex items-center justify-between mb-4 md:hidden">
        <button
          class="p-2 text-gray-700"
          @click="sidebarOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="text-right">
          <h1 class="text-xl font-bold">{{ selectedPlant.name }}</h1>
          <p class="text-xs text-gray-500">Last Update: {{ lastUpdate }}</p>
        </div>
      </header>
      <div class="hidden md:flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">{{ selectedPlant.name }}</h1>
        <span class="text-sm text-gray-500">Last Update: {{ lastUpdate }}</span>
      </div>
      <!-- Dashboard Charts -->
      <div class="space-y-4">
        <details class="bg-white rounded shadow p-4">
          <summary class="cursor-pointer text-lg mb-2">
            <span class="font-bold">Moisture:</span>
            <span class="font-bold text-sky-600"> {{ latestMoisture }}%</span>
          </summary>
          <div class="h-48">
            <LineChart :labels="labels" :values="moistureData" y-label="Moisture (%)" color="#87CEEB" />
          </div>
        </details>
        <details class="bg-white rounded shadow p-4">
          <summary class="cursor-pointer text-lg mb-2">
            <span class="font-bold">Temperature:</span>
            <span class="font-bold text-red-600"> {{ latestTemperature }}°C</span>
          </summary>
          <div class="h-48">
            <LineChart :labels="labels" :values="temperatureData" y-label="Temperature (°C)" color="#FF6347" />
          </div>
        </details>
        <details class="bg-white rounded shadow p-4">
          <summary class="cursor-pointer text-lg mb-2">
            <span class="font-bold">Light:</span>
            <span class="font-bold text-yellow-600"> {{ latestLight }}</span>
          </summary>
          <div class="h-48">
            <LineChart :labels="labels" :values="lightData" y-label="Light" color="#FFD700" />
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<style>
body {
  @apply bg-green-50;
}
</style>
