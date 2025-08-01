import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/Style/main.scss'
import App from './App.vue'
import './api/mockApiData/registrationMock.ts' // Importation des données mock pour l'API


  
const app = createApp(App)

// Création et installation du store Pinia
const pinia = createPinia()
app.use(pinia)

// Montage de l'application
app.mount('#app')
