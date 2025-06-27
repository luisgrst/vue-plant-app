<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { Chart, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'
Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale)

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  values: {
    type: Array,
    required: true
  },
  yLabel: {
    type: String,
    default: ''
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: null
  },
  color: {
    type: String,
    default: 'rgb(75, 192, 192)'
  }
})

const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: props.yLabel,
      data: props.values,
      fill: false,
      borderColor: props.color,
      tension: 0.4
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        display: true,
        color: '#4B5563',
      }
    },
    y: {
      grid: { display: false },
      suggestedMin: props.min,
      suggestedMax: props.max,
      ticks: {
        display: true,
        color: '#4B5563'
      }
    }
  }
}
</script>
