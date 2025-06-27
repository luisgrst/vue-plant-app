<script setup>
import { ref, computed } from 'vue'
import LineChart from './LineChart.vue'
// import SVG as raw string to manipulate fill via currentColor
import leafRaw from '/src/assets/leaf-circle.svg?raw'

const plantName = ref('Aloe Vera')
// health: 0 = good, 1 = slight problem, 2 = problem
const health = ref(0)
const healthColors = ['#34D399', '#FFB547', '#FF6347']
const healthFill = computed(() => healthColors[health.value] || healthColors[0])

// prepare SVG: strip any hardcoded fills, inject fill="currentColor"
const coloredSvg = computed(() => {
  const noFills = leafRaw.replace(/fill=".*?"/g, '')
  return noFills.replace(
    /<svg([^>]*)>/,
    `<svg$1 fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\">`
  )
})

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
    case 'moisture': return '#7DD3FC'  // light blue
    case 'temperature': return '#FF6347'
    case 'light': return '#FFD700'
    default: return healthFill.value
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
  <div class="flex flex-col min-h-screen bg-slate-200 w-full box-border">
    <!-- Plant Name as Card -->
    <div class="px-4 pt-4">
      <div
        class="text-white bg-gray-800 rounded-xl p-4 font-bold text-center">
        {{ plantName }}
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="overflow-x-auto">
      <div class="flex space-x-3 px-4 py-4 w-max">
        <!-- Overall Health Tab -->
        <button
          @click="showMetric('overall')"
          :class="[
            'w-24 h-24 bg-white rounded-xl shadow flex flex-col items-center justify-center',
            selectedMetric === 'overall' ? 'ring-2 ring-green-600 ring-offset-2 ring-offset-white' : ''
          ]"
        >
          <div class="w-8 h-8" :style="{ color: healthFill }" v-html="coloredSvg"></div>
          <span class="mt-1 text-xs font-medium text-gray-700 text-center">Overall</span>
        </button>

        <!-- Moisture Tab -->
        <button
          @click="showMetric('moisture')"
          :class="[
            'w-24 h-24 bg-white rounded-xl shadow flex flex-col items-center justify-center',
            selectedMetric === 'moisture' ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''
          ]"
        >
          <span class="text-xl font-bold text-blue-400">{{ latestMoisture }}%</span>
          <span class="mt-1 text-xs text-gray-700">Moisture</span>
        </button>

        <!-- Temperature Tab -->
        <button
          @click="showMetric('temperature')"
          :class="[
            'w-24 h-24 bg-white rounded-xl shadow flex flex-col items-center justify-center',
            selectedMetric === 'temperature' ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-white' : ''
          ]"
        >
          <span class="text-xl font-bold text-red-500">{{ latestTemperature }}°C</span>
          <span class="mt-1 text-xs text-gray-700">Temp</span>
        </button>

        <!-- Light Tab -->
        <button
          @click="showMetric('light')"
          :class="[
            'w-24 h-24 bg-white rounded-xl shadow flex flex-col items-center justify-center',
            selectedMetric === 'light' ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-white' : ''
          ]"
        >
          <span class="text-xl font-bold text-yellow-500">{{ latestLight }}</span>
          <span class="mt-1 text-xs text-gray-700">Light</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-4">
      <section :key="selectedMetric" class="bg-white rounded-2xl shadow p-4 mb-4">
        <h2 class="text-base font-semibold mb-2">{{ metricHeader }}</h2>
        <div
          v-if="selectedMetric === 'overall'"
          class="h-48 flex items-center justify-center text-gray-600"
        >
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
  </div>
</template>
