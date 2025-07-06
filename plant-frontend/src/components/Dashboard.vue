<template>
  <div class="flex flex-col bg-background w-full h-[95vh] overflow-y-auto">
    <!-- Plant Name & Arrows -->
    <div class="px-4 pt-4 pb-4 flex-shrink-0">
      <div class="relative text-text font-bold text-center bg-surface border border-border rounded-xl shadow-soft p-4 flex items-center justify-center">
        <button @click="selectPrev" class="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {{ plant.name }}
        <button @click="selectNext" class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- AT A GLANCE -->
    <div class="px-4 pb-4">
      <ul class="flex bg-surface border border-border rounded-xl shadow-soft overflow-x-auto hide-scrollbar">
        <li class="flex-1 flex flex-col items-center justify-center py-2">
          <span v-html="coloredSvg" class="w-7 h-7 block" :style="{ color: healthFill }"/>
        </li>
        <li class="flex-1 flex flex-col items-center justify-center py-2">
          <span class="text-lg font-semibold text-blue-400">{{ displayLatest('moisture_percent') }}%</span>
        </li>
        <li class="flex-1 flex flex-col items-center justify-center py-2">
          <span class="text-lg font-semibold text-red-500">{{ displayLatest('temperature_celsius') }}°C</span>
        </li>
        <li class="flex-1 flex flex-col items-center justify-center py-2">
          <span class="text-lg font-semibold text-yellow-500">{{ displayLatest('light_raw') }}</span>
        </li>
      </ul>
    </div>

    <!-- KPI Tabs -->
    <div class="px-4">
      <ul class="flex text-sm font-medium text-center text-text-muted bg-surface border border-border rounded-t-xl shadow-soft overflow-x-auto hide-scrollbar">
        <li class="flex-1"><button @click="showMetric('info')"      :class="tabClass('info')">Info</button></li>
        <li class="flex-1"><button @click="showMetric('moisture')"  :class="tabClass('moisture')">Moisture</button></li>
        <li class="flex-1"><button @click="showMetric('temperature')" :class="tabClass('temperature')">Temp</button></li>
        <li class="flex-1"><button @click="showMetric('light')"     :class="tabClass('light')">Light</button></li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="px-4 pb-6 flex-1">
      <section :key="selectedMetric" class="bg-surface border border-border rounded-b-xl shadow-soft p-4">
        <h2 class="text-base font-semibold text-text mb-2">{{ metricHeader }}</h2>

        <!-- Info Section with Instructions and Events -->
        <div v-if="selectedMetric==='info'">
          <p
              v-for="(line, idx) in instructionLines"
              :key="idx"
              class="text-sm text-text"
            >
              {{ line }}
            </p>
        </div>

        <!-- Charts -->
        <div v-else class="h-48 relative">
          <LineChart
            v-if="!loading && metricsFromStream.timestamp.length"
            :labels="metricsFromStream.timestamp"
            :values="metricData"
            :color="metricColor"
            :ideal="metricIdeal"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center text-text-muted">
            Loading...
          </div>
        </div>
      </section>

      <section class="mt-6 pb-6">
        <div class="bg-surface border border-border rounded-b-xl shadow-soft p-4 rounded-xl">
          <h3 class="text-sm font-medium text-text mb-2 text-center">Events</h3>
          <Info :events="eventStream" />
        </div>
      </section>

      <!-- Recent Images Gallery -->
      <section class="pb-6">
        <RecentImages :plant="plant"/>
      </section>
    </div>
  </div>
</template>


<script setup>
import { computed, ref } from 'vue'
import LineChart from './LineChart.vue'
import Info from './Info.vue'
import RecentImages from './RecentImages.vue'
import leafRaw from '/src/assets/leaf-circle.svg?raw'

const props = defineProps({
  plant:        { type: Object, required: true },
  plants:       { type: Array, required: true },
  metrics:      { type: Object, required: true },
  sensorStream: { type: Array, default: () => [] },
  eventStream:  { type: Array, default: () => [] },
  loading:      { type: Boolean, default: false },
  recentImages: { type: Array, default: () => [] }
})
const emit = defineEmits(['selectPlant', 'addImage'])

// Navigation
const currentIndex = computed(() =>
  props.plants.findIndex(p => p.id === props.plant.id)
)
function selectPrev() {
  emit('selectPlant', [ props.plants[(currentIndex.value - 1 + props.plants.length) % props.plants.length], true ])
}
function selectNext() {
  emit('selectPlant', [ props.plants[(currentIndex.value + 1) % props.plants.length], true ])
}

// Health icon rendering
const healthColors = ['#34D399','#FFB547','#FF6347']
const healthFill  = computed(() => healthColors[props.plant.health] || healthColors[0])
const coloredSvg  = computed(() => {
  const noFills = leafRaw.replace(/fill=".*?"/g, '')
  return noFills.replace(/<svg([^>]*)>/, `<svg$1 fill="currentColor" xmlns="http://www.w3.org/2000/svg">`)
})

// Combine historical metrics with live sensor stream
const metricsFromStream = computed(() => {
  const hist = props.metrics || {}
  const out = {
    timestamp:          hist.timestamp          ? [...hist.timestamp]          : [],
    temperature_celsius: hist.temperature_celsius ? [...hist.temperature_celsius] : [],
    light_raw:          hist.light_raw          ? [...hist.light_raw]          : [],
    moisture_percent:   hist.moisture_percent   ? [...hist.moisture_percent]   : [],
    conductivity_uS_cm: hist.conductivity_uS_cm ? [...hist.conductivity_uS_cm] : []
  }
  props.sensorStream.forEach(e => {
    let ts = e.timestamp || ''
    ts = ts.includes('T') ? ts.split('T')[1].slice(0,5) : ts.slice(0,5)
    out.timestamp.push(ts)
    out.temperature_celsius.push(e.temperature_celsius ?? null)
    out.light_raw.push(e.light_raw ?? null)
    out.moisture_percent.push(e.moisture_percent ?? null)
    out.conductivity_uS_cm.push(e.conductivity_uS_cm ?? null)
  })
  return out
})

// Helper to get latest value
function safeLatest(arr) { return Array.isArray(arr) && arr.length ? arr.at(-1) : '—' }
function displayLatest(key) { return props.loading ? '—' : safeLatest(metricsFromStream.value[key]) }

// Tab and chart logic
const selectedMetric = ref('info')
const METRIC_MAP = computed(() => ({
  info:       { header:'Info' },
  moisture:   { header:'Soil Moisture %', data:() => metricsFromStream.value.moisture_percent, color:'#7DD3FC', ideal:() => props.plant.ideal?.moist },
  temperature:{ header:'Temperature °C', data:() => metricsFromStream.value.temperature_celsius, color:'#FF6347', ideal:() => props.plant.ideal?.temp },
  light:      { header:'Light klux', data:() => metricsFromStream.value.light_raw, color:'#FFD700', ideal:() => props.plant.ideal?.light }
}))
const metric       = computed(() => METRIC_MAP.value[selectedMetric.value])
const metricHeader = computed(() => metric.value.header)
const metricData   = computed(() => metric.value.data?.())
const metricColor  = computed(() => metric.value.color)
const metricIdeal  = computed(() => metric.value.ideal?.())
function showMetric(m) { selectedMetric.value = m }
function tabClass(key) { return ['w-full p-3 transition-colors flex flex-col items-center', selectedMetric.value===key ? 'text-primary border-b-2 border-primary' : 'hover:bg-hover'] }

// Parse instructions safely (split into lines, fallback to [])
const instructionLines = computed(() => {
  const text = props.plant.instructions || ''
  return text.split(/\r?\n|\u2022|\*/).map(line => line.trim()).filter(line => line.length)
})
</script>

<style scoped>
.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
.hide-scrollbar::-webkit-scrollbar{display:none}
li:hover button{background-color:#f3f4f6}
</style>
