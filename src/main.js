import { createApp } from 'vue';
import App from './App.vue';
import './assets/style.css'; 

import { auth, db } from './firebase.js';

const app = createApp(App);
app.provide('auth', auth);
app.provide('db', db);
app.mount('#app');