import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app').$nextTick(() => {
  // Use contextBridge
  if (window.ipcRenderer) {
    window.ipcRenderer.on('main-process-message', (_event, message) => {
      console.log(message)
    })
  }
})
