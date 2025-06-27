<script setup>
import { ref, computed } from 'vue'
import LineChart from './components/LineChart.vue'

const plantName = ref('Aloe Vera')

const labels = Array.from({ length: 24 }, (_, i) => i)
const moistureData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 30)
const temperatureData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 20)
const lightData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))

const latestMoisture = computed(() => moistureData[moistureData.length - 1])
const latestTemperature = computed(() => temperatureData[temperatureData.length - 1])
const latestLight = computed(() => lightData[lightData.length - 1])

const selectedMetric = ref('overall')

const metricHeader = computed(() => {
  switch (selectedMetric.value) {
    case 'moisture':
      return 'Soil Moisture %'
    case 'temperature':
      return 'Temperature °C'
    case 'light':
      return 'Light clux'
    default:
      return 'Overall Health'
  }
})

const metricData = computed(() => {
  switch (selectedMetric.value) {
    case 'moisture':
      return moistureData
    case 'temperature':
      return temperatureData
    case 'light':
      return lightData
    default:
      return []
  }
})

const metricColor = computed(() => {
  switch (selectedMetric.value) {
    case 'moisture':
      return '#87CEEB'
    case 'temperature':
      return '#FF6347'
    case 'light':
      return '#FFD700'
    default:
      return '#34D399'
  }
})

const metricMin = computed(() => {
  switch (selectedMetric.value) {
    case 'moisture':
      return 0
    case 'temperature':
      return 0
    case 'light':
      return 0
    default:
      return 0
  }
})

const metricMax = computed(() => {
  switch (selectedMetric.value) {
    case 'moisture':
      return 100
    case 'temperature':
      return 40
    case 'light':
      return 100
    default:
      return 100
  }
})

function showMetric(metric) {
  selectedMetric.value = metric
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold text-center mb-6">{{ plantName }}</h1>
    <div class="flex flex-nowrap gap-4 mb-6">
      <div
        @click="showMetric('overall')"
        class="cursor-pointer bg-white rounded shadow flex flex-col items-center justify-center p-4 flex-1 aspect-square"
      >
        <span class="text-3xl">🌱</span>
        <span class="mt-2 font-semibold text-center">Overall Health</span>
      </div>
      <div
        @click="showMetric('moisture')"
        class="cursor-pointer bg-white rounded shadow flex flex-col items-center justify-center p-4 flex-1 aspect-square"
      >
        <span class="text-xl font-bold">{{ latestMoisture }}%</span>
        <span class="text-sm text-center">Soil Moisture</span>
      </div>
      <div
        @click="showMetric('temperature')"
        class="cursor-pointer bg-white rounded shadow flex flex-col items-center justify-center p-4 flex-1 aspect-square"
      >
        <span class="text-xl font-bold">{{ latestTemperature }}°C</span>
        <span class="text-sm text-center">Temperature</span>
      </div>
      <div
        @click="showMetric('light')"
        class="cursor-pointer bg-white rounded shadow flex flex-col items-center justify-center p-4 flex-1 aspect-square"
    >
        <span class="text-xl font-bold">{{ latestLight }}</span>
        <span class="text-sm text-center">Light clux</span>
      </div>
    </div>
    <div class="bg-white rounded shadow p-4 flex flex-col items-center" style="height: 20rem;">
      <h2 class="font-semibold mb-2 text-2xl self-start ml-4">{{ metricHeader }}</h2>
      <div v-if="selectedMetric === 'overall'" class="flex items-center justify-center flex-1 text-xl">
        Your plant is healthy
      </div>
      <div v-else class="w-full h-full">
        <LineChart :labels="labels" :values="metricData" :color="metricColor" :min="metricMin" :max="metricMax" />
      </div>
    </div>
  </div>
</template>

