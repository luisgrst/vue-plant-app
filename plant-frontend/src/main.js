import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const myapp = createApp(App)
myapp.mount('#app')
myapp.config.performance = true