import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { auth, db } from './firebase.js'

const app = createApp(App)
app.use(router)
app.provide('auth', auth)
app.provide('db', db)
app.mount('#app')