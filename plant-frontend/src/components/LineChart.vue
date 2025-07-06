<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { computed } from 'vue'
import { Chart, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
Chart.register(annotationPlugin, LineElement, PointElement, LinearScale, Title, CategoryScale)

const props = defineProps({ labels: Array, values: Array, color: String, ideal: Array })

const last100Values = computed(() => props.values ? props.values.slice(-25) : [])
const last100Labels = computed(() => props.labels ? props.labels.slice(-25) : [])

const chartData = computed(() => ({
  labels: last100Labels.value,
  datasets: [{
    label: '',
    data: last100Values.value,
    fill: false,
    borderColor: props.color,
    tension: 0.15,
    pointRadius: 0
  }]
}))

const chartOptions = computed(() => {
  // Clamp y min to 0
  const min = props.ideal?.[0] ?? 0
  const max = props.ideal?.[1] ?? 100
  const suggestedMin = Math.max(0, min - 5)
  const suggestedMax = max + 5

  return {
    responsive: true,
    animation: { 
      duration: 2500, 
      animateScale: false,   // No scaling animation on axis
      animateRotate: false 
    },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      annotation: {
        annotations: {
          minLine: {
            type: 'line',
            yMin: min,
            yMax: min,
            borderColor: 'green',
            borderDash: [6, 12],
            borderWidth: 2,
            label: {
              enabled: true,
              content: `Min (${min})`,
              position: 'start',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              padding: 4
            }
          },
          maxLine: {
            type: 'line',
            yMin: max,
            yMax: max,
            borderColor: 'red',
            borderDash: [6, 12],
            borderWidth: 2,
            label: {
              enabled: true,
              content: `Max (${max})`,
              position: 'start',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              padding: 4
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          callback(value, index) {
            const labels = this.chart.data.labels
            const total  = labels.length
            const q1     = Math.floor(total / 4)
            const q2     = Math.floor(total / 2)
            const q3     = Math.floor(3 * total / 4)
            const last   = total - 1
            if ([0, q1, q2, q3, last].includes(index)) {
              return labels[index]
            }
            return ''
          }
        }
      },
      y: {
        grid: { display: true },
        ticks: {
          display: true,
          color: '#4B5563'
        },
        suggestedMin,
        suggestedMax,
      }
    }
  }
})
</script>
