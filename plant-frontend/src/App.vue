<script setup>
import { ref } from 'vue'

const plants = ref([
  { id: 1, name: 'Aloe Vera' },
  { id: 2, name: 'Basil' },
  { id: 3, name: 'Cactus' }
])

const selectedPlant = ref(plants.value[0])
const sidebarOpen = ref(false)

function selectPlant(plant) {
  selectedPlant.value = plant
  sidebarOpen.value = false
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
        'bg-gray-100 w-64 p-4 z-20 transition-transform md:translate-x-0 fixed md:static h-full overflow-y-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <h2 class="text-xl font-bold mb-4">Plants</h2>
      <ul>
        <li
          v-for="plant in plants"
          :key="plant.id"
          class="mb-2"
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
        <h1 class="text-xl font-bold">{{ selectedPlant.name }}</h1>
      </header>
      <div class="hidden md:block mb-4">
        <h1 class="text-2xl font-bold">{{ selectedPlant.name }}</h1>
      </div>
      <!-- Dashboard Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white rounded shadow p-4">
          <h3 class="font-semibold mb-2">Date</h3>
          <p>{{ new Date().toLocaleDateString() }}</p>
        </div>
        <div class="bg-white rounded shadow p-4">
          <h3 class="font-semibold mb-2">Last Update</h3>
          <p>{{ new Date().toLocaleTimeString() }}</p>
        </div>
        <div class="bg-white rounded shadow p-4">
          <h3 class="font-semibold mb-2">Moisture</h3>
          <p>45%</p>
        </div>
        <div class="bg-white rounded shadow p-4">
          <h3 class="font-semibold mb-2">Temperature</h3>
          <p>22°C</p>
        </div>
        <div class="bg-white rounded shadow p-4">
          <h3 class="font-semibold mb-2">Light Level</h3>
          <p>Medium</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  @apply bg-gray-50;
}
</style>
