<template>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Left column: Project card preview (simula diseño Figma) -->
    <div class="w-full md:w-2/5">
      <div class="rounded-xl overflow-hidden shadow-lg" style="background: linear-gradient(180deg,#0b1220,#071027); border:1px solid rgba(255,255,255,0.04);">
        <div class="h-48 bg-gradient-to-r from-slate-700 to-slate-900 flex items-center justify-center">
          <!-- Imagen de proyecto (placeholder) -->
          <div class="text-slate-300">Imagen del proyecto</div>
        </div>

        <div class="p-4">
          <h3 class="text-xl font-semibold mb-1">AI-Powered Sustainable Farming</h3>
          <p class="text-sm text-slate-400 mb-3">Un sistema que optimiza riego y consumo de energía mediante IA.</p>

          <div class="flex gap-2">
            <button class="btn-primary flex-1">View Details & Vote</button>
            <button class="border rounded px-3 py-2 text-slate-200">Share</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right column: registro / votar -->
    <div class="w-full md:w-3/5">
      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-4">Regístrate para Votar</h2>

        <p class="text-sm text-slate-400 mb-4">Usa tu correo institucional para participar.</p>

        <div v-if="!user" class="space-y-3">
          <input v-model="emailInput" type="email" placeholder="n00xxxx@upn.pe"
                 class="w-full bg-transparent border border-white/6 rounded px-3 py-2 placeholder:text-slate-400 text-slate-100" />

          <button @click="sendLink" class="btn-primary w-full">Enviar link</button>
          <p v-if="msg" class="text-sm text-rose-400">{{ msg }}</p>
        </div>

        <div v-else class="space-y-4">
          <p class="text-sm text-slate-300">Autenticado como <span class="font-medium">{{ user.email }}</span></p>

          <input v-model="name" placeholder="Nombre completo"
                 class="w-full bg-transparent border border-white/6 rounded px-3 py-2 placeholder:text-slate-400 text-slate-100" />

          <select v-model="career" class="w-full bg-transparent border border-white/6 rounded px-3 py-2 text-slate-100">
            <option value="" disabled>-- Selecciona facultad --</option>
            <option>Negocios</option>
            <option>Ingeniería</option>
            <option>Comunicaciones</option>
            <option>Ciencias de la Salud</option>
            <option>Arquitectura y Diseño</option>
            <option>Derecho y Ciencias Políticas</option>
          </select>

          <select v-model="candidate" class="w-full bg-transparent border border-white/6 rounded px-3 py-2 text-slate-100">
            <option value="" disabled>-- Selecciona proyecto --</option>
            <option value="proj1">Proyecto 1</option>
            <option value="proj2">Proyecto 2</option>
            <option value="proj3">Proyecto 3</option>
          </select>

          <button @click="submitVote" class="btn-primary w-full">Votar</button>

          <div v-if="resultMsg" :class="{'text-green-400': success, 'text-rose-400': !success}" class="mt-2">
            {{ resultMsg }}
          </div>

          <button @click="signOut" class="mt-3 w-full border rounded px-4 py-2 text-slate-200">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

const emailInput = ref('')
const localKey = 'emailForSignIn'
const name = ref('')
const career = ref('')
const candidate = ref('')
const resultMsg = ref('')
const success = ref(false)
const msg = ref('')
const user = ref(null)

const actionCodeSettings = {
  url: window.location.origin,
  handleCodeInApp: true
}

onMounted(async () => {
  try {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let savedEmail = window.localStorage.getItem(localKey)
      if (!savedEmail) {
        savedEmail = window.prompt('Confirma tu correo electrónico para completar el acceso:')
      }
      await signInWithEmailLink(auth, savedEmail, window.location.href)
      window.localStorage.removeItem(localKey)
    }
  } catch (e) {
    msg.value = 'Error al completar el inicio de sesión: ' + e.message
  }

  onAuthStateChanged(auth, (u) => {
    user.value = u
    if (u?.displayName) name.value = u.displayName
  })
})

async function sendLink() {
  msg.value = ''
  if (!emailInput.value) {
    msg.value = 'Introduce un correo.'
    return
  }
  const re = /^n00[0-9]+@upn\.pe$/
  if (!re.test(emailInput.value)) {
    msg.value = 'Usa tu correo institucional (ej. n00xxxx@upn.pe).'
    return
  }
  try {
    await sendSignInLinkToEmail(auth, emailInput.value, actionCodeSettings)
    window.localStorage.setItem(localKey, emailInput.value)
    msg.value = 'Link enviado. Revisa tu correo.'
  } catch (e) {
    msg.value = 'Error al enviar el link: ' + e.message
  }
}

async function submitVote() {
  resultMsg.value = ''
  success.value = false
  if (!user.value) {
    resultMsg.value = 'No estás autenticado.'
    return
  }
  if (!name.value || !career.value || !candidate.value) {
    resultMsg.value = 'Completa todos los campos antes de votar.'
    return
  }
  const uid = user.value.uid
  const voteRef = doc(db, 'votes', uid)
  const payload = {
    email: user.value.email,
    name: name.value,
    career: career.value,
    candidateId: candidate.value,
    timestamp: serverTimestamp()
  }
  try {
    await setDoc(voteRef, payload)
    resultMsg.value = 'Voto registrado. Gracias.'
    success.value = true
  } catch (e) {
    resultMsg.value = 'Error registrando voto: ' + e.message
    success.value = false
  }
}

async function signOut() {
  try {
    await firebaseSignOut(auth)
    resultMsg.value = ''
    msg.value = 'Sesión cerrada.'
  } catch (e) {
    msg.value = 'Error cerrando sesión: ' + e.message
  }
}
</script>

<style scoped>
</style>
