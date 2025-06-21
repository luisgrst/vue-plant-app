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
    required: true
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
  scales: {
    x: {
      ticks: {
        callback: (val, index) =>
          index % 4 === 0
            ? `${String(props.labels[index]).padStart(2, '0')}:00`
            : ''
      }
    },
    y: {
      title: {
        display: true,
        text: props.yLabel
      }
    }
  }
}
</script>
