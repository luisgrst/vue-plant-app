<template>
  <nav
    class="absolute bottom-2 left-[calc(2vw-2px)] w-[calc(2px+96vw)] h-12
           bg-surface border border-border rounded-full
           grid grid-cols-3 overflow-hidden
           shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.05)] z-40"
    style="contain: paint;"
  >
    <!-- sliding highlight -->
    <div
      class="absolute inset-y-1 w-[calc(32vw-0.5rem)] bg-primary rounded-full
             transition-transform duration-150 ease-out"
      style="will-change: transform;"
      :class="{
        'translate-x-[0.25rem]':           selected === 'add_plant',
        'translate-x-[calc(0.25rem+32vw)]': selected === 'home',
        'translate-x-[calc(0.25rem+64vw)]': selected === 'dashboard'
      }"
    />

    <!-- buttons: only animate opacity -->
    <button
      data-key="add_plant"
      @click="$emit('navigate','add_plant')"
      class="relative z-10 flex flex-col items-center justify-center
             transition-opacity duration-150"
      :class="selected === 'add_plant' ? 'opacity-100' : 'opacity-50'"
    >
      <svg class="w-5 h-5 mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 1v16M1 9h16" />
      </svg>
    </button>

    <button
      data-key="home"
      @click="$emit('navigate','home')"
      class="relative z-10 flex flex-col items-center justify-center
             transition-opacity duration-150"
      :class="selected === 'home' ? 'opacity-100' : 'opacity-50'"
    >
      <svg class="w-5 h-5 mb-1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1
             0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2
             2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1
             1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0
             0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
        />
      </svg>
    </button>

    <button
      data-key="dashboard"
      @click="$emit('navigate','dashboard')"
      :disabled="disable_dash"
      class="relative z-10 flex flex-col items-center justify-center
             disabled:opacity-30 disabled:cursor-not-allowed
             transition-opacity duration-150"
      :class="selected === 'dashboard' ? 'opacity-100' : 'opacity-50'"
    >
      <svg
        class="w-5 h-5 mb-1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M30.039 2.719c-0.143-0.544-0.631-0.939-1.211-0.939-0.395
             0-0.748 0.184-0.977 0.47l-0.002 0.002c-1.639
             1.931-3.786 3.384-6.235 4.158l-0.096
             0.026c-1.66 0.54-3.592 0.925-5.588
             1.079l-0.086 0.005c-2.296 0.094-4.448
             0.609-6.414 1.468l0.114-0.045c-3.466
             1.876-5.78 5.485-5.78 9.633 0 0.064
             0.001 0.127 0.002 0.19l-0-0.010c0.010
             0.318 0.031 0.631 0.068 0.945 0.144
             1.149 0.443 2.193 0.877 3.163l-0.028-0.070c-1.472
             1.947-2.758 4.166-3.758 6.536l-0.076
             0.204c-0.064 0.145-0.101 0.314-0.101
             0.492 0 0.512 0.309 0.953 0.75
             1.146l0.008 0.003c0.144 0.064 0.311
             0.102 0.487 0.102 0.001 0 0.003 0
             0.004 0h-0c0 0 0.001 0 0.001 0 0.512
             0 0.953-0.308 1.146-0.75l0.003-0.008c0.863-2.053
             1.833-3.813 2.96-5.455l-0.066
             0.102c1.149 1.549 2.642 2.78 4.37
             3.593l0.070 0.030c1.482 0.678 3.216
             1.072 5.041 1.072 0.026 0 0.052-0
             0.077-0l-0.004 0c1.957-0.008 3.82-0.406
             5.517-1.119l-0.095 0.035c5.424-2.452
             9.281-7.517 9.983-13.546l0.008-0.079c0.151-1.153
             0.237-2.486 0.237-3.839 0-3.061-0.441-6.020-1.264-8.815l0.056
             0.22z"
        />
      </svg>
    </button>
  </nav>
</template>

<script setup>
const props = defineProps({
  selected: String,
  disable_dash: Boolean
})
const emit = defineEmits(['navigate'])
</script>
