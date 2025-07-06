<template>
  <div id="app" class="bg-background min-h-screen flex flex-col">
    <Navigation
      :selected="selectedView"
      :disable_dash="disableDash"
      @navigate="selectedView = $event"
    />

    <main class="flex-1 overflow-hidden relative">
      <div
        class="flex w-[300%] h-full transition-transform duration-50 ease-out"
        :style="{ transform: `translateX(-${currentIndex * (100/3)}%)` }"
      >
        <!-- Add Plant -->
        <div class="w-1/3 flex-shrink-0 h-full">
          <AddPlant @refresh="refresh" />
        </div>

        <!-- Plant List -->
        <div class="w-1/3 flex-shrink-0 h-full">
          <PlantList
            :plants="plants"
            @selectPlant="selectPlant"
            @refresh="refresh"
            @deletePlant="deletePlant"
          />
        </div>

        <!-- Dashboard -->
        <div class="w-1/3 flex-shrink-0 h-full">
          <Dashboard
            v-if="!disableDash"
            :plant="currentPlant"
            :plants="plants"
            :metrics="currentPlantMetrics"
            :sensor-stream="sensorStreamData"
            :event-stream="eventStreamData"
            :loading="loading"
            @selectPlant="selectPlant"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Navigation from './components/Navigation.vue'
import PlantList from './components/PlantList.vue'
import Dashboard from './components/Dashboard.vue'
import AddPlant from './components/AddPlant.vue'
import axios from 'axios'

// Local storage keys
const VIEW_KEY = 'selectedView'
const PLANT_ID_KEY = 'selectedPlantId'

// Reactive state
const selectedView = ref(localStorage.getItem(VIEW_KEY) || 'home')
const plants = ref([])
const currentPlant = ref({})
const currentPlantMetrics = ref({})
const metricsCache = ref({})
const disableDash = ref(true)

// Carousel index mapping
const indexMap = { add_plant: 0, home: 1, dashboard: 2 }
const currentIndex = computed(() => indexMap[selectedView.value])

// SSE streams
const sensorStreamData = ref([])
const eventStreamData = ref([])
const loading = ref(true)
let eventSource = null

// Stop existing SSE
function stopStream() {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  sensorStreamData.value = []
  eventStreamData.value = []
  loading.value = true
}

// Start new SSE for sensor + events
function startStream(plantId) {
  stopStream()
  if (!plantId) return
  loading.value = true
  const url = `http://localhost:5000/plants/${plantId}/stream`
  eventSource = new EventSource(url)

  // Sensor data events
  eventSource.addEventListener('sensor', e => {
    try {
      const data = JSON.parse(e.data)
      // console.log('Sensor event:', data)
      sensorStreamData.value.push(data)
      loading.value = false
    } catch (err) {
      // console.error('Sensor parse error:', err)
    }
  })

  // Watering (and other) events
  eventSource.addEventListener('watering', e => {
    try {
      const ev = JSON.parse(e.data)
      // console.log('Watering event:', ev)
      eventStreamData.value.push(ev)
      loading.value = false
    } catch (err) {
      // console.error('Event parse error:', err)
    }
  })

  // Generic message fallback
  eventSource.onmessage = e => {
    try {
      const msg = JSON.parse(e.data)
      console.log('Message event:', msg)
      sensorStreamData.value.push(msg)
      loading.value = false
    } catch (err) {
      console.error('Message parse error:', err)
    }
  }

  eventSource.onerror = () => {
    console.warn('SSE connection error or closed')
  }
}

// Fetch plants and metrics
async function refresh() {
  stopStream()
  const resp = await axios.get('http://localhost:5000/plants')
  plants.value = resp.data
  if (!plants.value.length) {
    disableDash.value = true
    return
  }

  // Load historical metrics
  metricsCache.value = {}
  await Promise.all(
    plants.value.map(async p => {
      try {
        const r = await axios.get(`http://localhost:5000/plants/${p.id}`)
        metricsCache.value[p.id] = r.data
      } catch {
        metricsCache.value[p.id] = {}
      }
    })
  )

  // Restore last selected plant
  const lastId = localStorage.getItem(PLANT_ID_KEY)
  let pick = plants.value[0]
  if (lastId) {
    const found = plants.value.find(x => String(x.id) === lastId)
    if (found) pick = found
  }
  selectPlant([pick, false])
  disableDash.value = false
}

// Delete a plant
async function deletePlant(id) {
  stopStream()
  try {
    const res = await fetch(`http://localhost:5000/plants/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete failed')
    await refresh()
  } catch (err) {
    alert('Could not delete plant: ' + err.message)
  }
}

// Select plant and start SSE
function selectPlant([plant, show]) {
  currentPlant.value = plant
  currentPlantMetrics.value = metricsCache.value[plant.id] || {}
  localStorage.setItem(PLANT_ID_KEY, String(plant.id))
  startStream(plant.id)
  if (show) selectedView.value = 'dashboard'
}

onMounted(refresh)
onUnmounted(stopStream)
watch(selectedView, v => localStorage.setItem(VIEW_KEY, v))
</script>
