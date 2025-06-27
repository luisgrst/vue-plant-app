<script setup>
import { ref, computed } from 'vue'
import LineChart from './components/LineChart.vue'

const plantName = ref('Aloe Vera')

const labels = Array.from({ length: 24 }, (_, i) => i)
const moistureData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 30)
const temperatureData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 20)
const lightData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))

const latestMoisture = computed(() => moistureData.at(-1))
const latestTemperature = computed(() => temperatureData.at(-1))
const latestLight = computed(() => lightData.at(-1))

const selectedMetric = ref('overall')

const metricHeader = computed(() => {
  switch (selectedMetric.value) {
    case 'moisture': return 'Soil Moisture %'
    case 'temperature': return 'Temperature °C'
    case 'light': return 'Light klux'
    default: return 'Overall Health'
  }
})

const metricData = computed(() => {
  switch (selectedMetric.value) {
    case 'moisture': return moistureData
    case 'temperature': return temperatureData
    case 'light': return lightData
    default: return []
  }
})

const metricColor = computed(() => {
  switch (selectedMetric.value) {
    case 'moisture': return '#34D399'
    case 'temperature': return '#FF6347'
    case 'light': return '#FFD700'
    default: return '#34D399'
  }
})

const metricMin = computed(() => 0)
const metricMax = computed(() => {
  switch (selectedMetric.value) {
    case 'temperature': return 40
    default: return 100
  }
})

function showMetric(metric) {
  selectedMetric.value = metric
}
</script>

<template>
  <!-- Wrapper without padding to prevent overflow -->
  <div class="flex flex-col min-h-screen bg-gray-50 w-full box-border">
    <!-- Header -->
    <header class="bg-green-800 text-white py-4 px-4 text-center text-lg font-semibold">
      {{ plantName }}
    </header>

    <!-- KPI Cards: horizontal scroll, inner padding but no outer padding -->
    <div class="overflow-x-auto">
      <div class="rounded-t-md flex space-x-3 px-4 py-4 w-max">
        <button @click="showMetric('overall')" class="w-24 h-24 bg-white rounded-xl shadow flex flex-col items-center justify-center">
          <span class="text-2xl">🌱</span>
          <span class="mt-1 text-xs font-medium text-gray-700 text-center">Overall</span>
        </button>
        <button @click="showMetric('moisture')" class="w-24 h-24 bg-white rounded-xl shadow flex flex-col items-center justify-center">
          <span class="text-xl font-bold text-green-600">{{ latestMoisture }}%</span>
          <span class="mt-1 text-xs text-gray-700">Moisture</span>
        </button>
        <button @click="showMetric('temperature')" class="w-24 h-24 bg-white rounded-xl shadow flex flex-col items-center justify-center">
          <span class="text-xl font-bold text-red-500">{{ latestTemperature }}°C</span>
          <span class="mt-1 text-xs text-gray-700">Temp</span>
        </button>
        <button @click="showMetric('light')" class="w-24 h-24 bg-white rounded-xl shadow flex flex-col items-center justify-center">
          <span class="text-xl font-bold text-yellow-500">{{ latestLight }}</span>
          <span class="mt-1 text-xs text-gray-700">Light</span>
        </button>
      </div>
    </div>

    <!-- Main Content with padding -->
    <div class="flex-1 px-4">
      <!-- Chart Card -->
      <section class="bg-white rounded-2xl shadow p-4 mb-4">
        <h2 class="text-base font-semibold mb-2">{{ metricHeader }}</h2>
        <div v-if="selectedMetric === 'overall'" class="h-48 flex items-center justify-center text-gray-600">
          Your plant is healthy 🌿
        </div>
        <div v-else class="h-48">
          <LineChart
            :labels="labels"
            :values="metricData"
            :color="metricColor"
            :min="metricMin"
            :max="metricMax"
          />
        </div>
      </section>

      <!-- Recent Images -->
      <section>
        <h3 class="text-sm font-medium mb-2">Recent Images</h3>
        <div class="overflow-x-auto">
          <div class="flex space-x-3 w-max">
            <img src="/images/image1.webp" alt="Plant 1" class="w-20 h-20 object-cover rounded-xl shadow" />
            <img src="/images/image2.webp" alt="Plant 2" class="w-20 h-20 object-cover rounded-xl shadow" />
            <img src="/images/image3.webp" alt="Plant 3" class="w-20 h-20 object-cover rounded-xl shadow" />
          </div>
        </div>
      </section>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bg-white border-t border-gray-200 py-2 px-6 flex justify-between">
      <button class="flex flex-col items-center text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/></svg>
        <span class="text-xs">Home</span>
      </button>
      <button class="flex flex-col items-center text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v4H3V3zM3 10h18v4H3v-4zM3 17h18v4H3v-4z"/></svg>
        <span class="text-xs font-semibold">Dashboard</span>
      </button>
      <button class="flex flex-col items-center text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-4.93"/></svg>
        <span class="text-xs">Alerts</span>
      </button>
      <button class="flex flex-col items-center text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span class="text-xs">Settings</span>
      </button>
    </nav>
  </div>
</template>
