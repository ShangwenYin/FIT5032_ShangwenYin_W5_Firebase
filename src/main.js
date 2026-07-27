import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBl3okaNVY4ogrq8yCegqwVm3zoYK0v6W0",
  authDomain: "shangwenyin-week5.firebaseapp.com",
  projectId: "shangwenyin-week5",
  storageBucket: "shangwenyin-week5.firebasestorage.app",
  messagingSenderId: "789824078163",
  appId: "1:789824078163:web:64a8ec33046c27e949a1a6"
};

// Initialize Firebase
initializeApp(firebaseConfig);