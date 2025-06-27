<template>
  <div id="app">
    <Navigation :selected="selectedView" @navigate="selectedView = $event" />
    <main class="p-1">
      <PlantList
        v-if="selectedView === 'home'"
        :plants="plants"
        @selectPlant="viewPlant"
      />
      <Dashboard
        v-else
        :plant="currentPlant"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navigation from './components/Navigation.vue'
import PlantList from './components/PlantList.vue'
import Dashboard from './components/Dashboard.vue'

const plants = ref([
  { id: 1, name: 'Aloe Vera' },
  { id: 2, name: 'Spider Plant' },
  { id: 3, name: 'Fiddle Leaf Fig' }
])
const selectedView = ref('home')
const currentPlant = ref(plants.value[0])

function viewPlant(plant) {
  currentPlant.value = plant
  selectedView.value = 'dashboard'
}
</script>

<style>
/* Global sleek modern font */
body, #app {
  font-family: 'Inter', sans-serif;
  margin: 0;
}
</style>
