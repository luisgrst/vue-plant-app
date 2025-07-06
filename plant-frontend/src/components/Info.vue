<template>
  <div class="max-h-48 overflow-y-auto space-y-2">
    <div v-if="!events.length" class="text-text-muted text-center py-4">
      No events yet.
    </div>
    <ul v-else class="space-y-1">
      <template v-for="(evt, idx) in events" :key="idx">
        <!-- Divider when date changes -->
        <li v-if="shouldShowDivider(idx)" class="flex items-center ">
          <span class="flex-1 border-t border-border"></span>
          <span class="mx-2 text-xs text-text-muted">{{ formatDate(events[idx].timestamp) }}</span>
          <span class="flex-1 border-t border-border"></span>
        </li>
        <!-- Event item -->
        <li class="p-2 pl-0 bg-white rounded-md shadow-inner flex items-center space-x-3">
          <img :src="dropIcon" alt="drop icon" class="w-6 h-6 flex-shrink-0" />
          <div class="flex-1">
            <div class="text-sm font-medium text-text mb-1">{{ formatTime(evt.timestamp) }}</div>
            <div class="text-sm text-text">{{ evt.content }}</div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dropIcon from '/src/assets/drop.svg?url'

const props = defineProps({
  events: { type: Array, default: () => [] }
})

// Extract date portion (YYYY-MM-DD) from timestamp
function extractDate(ts) {
  if (ts.includes('T')) return ts.split('T')[0]
  if (ts.includes(' ')) return ts.split(' ')[0]
  return ts
}

// Format date to MM-DD
function formatDate(ts) {
  const date = extractDate(ts)
  return date.slice(5)
}

// Format time to HH:MM
function formatTime(ts) {
  if (ts.includes('T')) return ts.split('T')[1].slice(0,5)
  if (ts.includes(' ')) return ts.split(' ')[1].slice(0,5)
  return ts
}

// Determine if a divider should be shown before this index
function shouldShowDivider(idx) {
  if (idx === 0) return true
  const prevDate = extractDate(props.events[idx-1].timestamp)
  const currDate = extractDate(props.events[idx].timestamp)
  return currDate !== prevDate
}
</script>

<style scoped>
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.text-text { color: var(--text); }
</style>
