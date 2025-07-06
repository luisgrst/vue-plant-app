<template>
  <section class="pb-6">
    <h3 class="text-sm font-medium text-text ml-1 mb-2">Recent Images</h3>
    <div class="grid grid-cols-3 gap-3">
      <!-- Add new image button -->
      <button @click="$emit('addImage')"
              class="w-full aspect-square flex items-center justify-center bg-surface border border-border rounded-xl shadow-soft hover:bg-hover transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <!-- Display fetched images -->
      <div v-for="(src, i) in imageUrls" :key="i">
        <img
          :src="src"
          :alt="`Plant ${props.plant.id} image ${i+1}`"
          class="w-full aspect-square object-cover rounded-xl shadow-soft border border-border"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  plant: { type: Object, required: true }
})
const emit = defineEmits(['addImage'])

const imageUrls = ref([])

async function fetchImages() {
  if (!props.plant?.id) return
  try {
    const res = await axios.get(`http://localhost:5000/plants/${props.plant.id}/images`)
    imageUrls.value = res.data.map(filename =>
      `http://localhost:5000/plants/${props.plant.id}/images/${encodeURIComponent(filename)}`
    )
  } catch (err) {
    console.warn('Failed to fetch images:', err)
    imageUrls.value = []
  }
}

onMounted(fetchImages)
watch(() => props.plant.id, fetchImages)
</script>
