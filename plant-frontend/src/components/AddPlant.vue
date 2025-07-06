<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['refresh'])

// form state
const mac = ref('')
const fileInput = ref(null)
const previewUrl = ref('')

const selectedFile = ref(null)  // <-- NEW: make this reactive!

const loading = ref(false)
const success = ref(false)

const canSubmit = computed(() =>
  mac.value.trim() !== '' && !!selectedFile.value && !loading.value
)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const file = event.target.files?.[0]
  selectedFile.value = file      // <-- always update this!
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  } else {
    previewUrl.value = ''
  }
}

function removeImage() {
  previewUrl.value = ''
  selectedFile.value = null      // <-- always update this!
  if (fileInput.value) fileInput.value.value = null
}

async function submitForm() {
  if (!canSubmit.value) return

  loading.value = true
  success.value = false

  const formData = new FormData()
  formData.append('mac', mac.value)
  formData.append('image', selectedFile.value)   // <-- use selectedFile here

  try {
    const response = await fetch('http://localhost:5000/plants/', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const msg = await response.text()
      throw new Error(msg)
    }
    success.value = true
    setTimeout(() => {
      mac.value = ''
      removeImage()
      success.value = false
      emit('refresh')
    }, 1000)
  } catch (err) {
    alert('Error: ' + err.message)
  } finally {
    loading.value = false
  }
}
</script>

<!-- ... (script stays the same) ... -->

<template>
  <div class="flex flex-col h-[90vh] bg-background p-4 gap-4 overflow-y-auto">
    <!-- Header -->
    <div class="bg-surface text-text font-bold text-center border border-border rounded-xl shadow-soft p-4">
      Register a new plant
    </div>

    <!-- Image Upload / Preview (ALWAYS SQUARE CONTAINER) -->
    <div class="bg-surface border border-border rounded-xl shadow-soft p-4 flex justify-center">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />

      <!-- Always show the square container -->
      <div class="image-square-container">
        <template v-if="!previewUrl">
          <div class="flex flex-col items-center justify-center h-full w-full">
            <button
              @click.prevent="triggerFileInput"
              class="inline-flex items-center justify-center space-x-2 bg-primary text-white px-4 py-3 rounded-xl shadow hover:bg-primaryHover transition"
            >
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 1v16M1 9h16" />
              </svg>
              <span class="text-sm font-medium">Image</span>
            </button>
          </div>
        </template>
        <template v-else>
          <img
            :src="previewUrl"
            alt="Preview"
            class="image-square-img"
          />
          <button
            @click="removeImage"
            class="absolute top-2 right-2 bg-surface rounded-xl p-1 shadow hover:bg-hover transition z-10"
          >
            <svg class="w-4 h-4 text-text-muted hover:text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </template>
      </div>
    </div>

    <!-- MAC Address (SECOND) -->
    <div class="bg-surface border border-border rounded-xl shadow-soft p-4">
      <label for="mac" class="block text-sm font-medium text-text mb-2">MAC Address</label>
      <input
        id="mac"
        v-model="mac"
        type="text"
        placeholder="AA:BB:CC:DD:EE:FF"
        class="w-full border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary text-text bg-white"
      />
    </div>

    <!-- Submit Button -->
    <div class="text-center">
      <button
        :disabled="!canSubmit"
        @click="submitForm"
        class="inline-flex items-center justify-center space-x-2 bg-accent text-white px-6 py-3 rounded-xl shadow hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading && !success" class="animate-spin">
          <!-- Loading Spinner -->
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </span>
        <span v-else-if="success">
          <!-- Checkmark Icon -->
          <svg class="w-5 h-5 text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </span>
        <span v-else>
          <!-- Default Icon -->
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </span>
        <span class="text-sm font-medium">
          <template v-if="loading && !success">Adding...</template>
          <template v-else-if="success">Added!</template>
          <template v-else>Add Plant</template>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.image-square-container {
  width: 220px;
  height: 220px;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.image-square-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>



