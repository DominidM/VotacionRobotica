<template>
  <div class="detail-panel max-w-md mx-auto">
    <h2 class="text-2xl font-semibold mb-3">Regístrate para Votar</h2>
    <p class="text-sm text-muted mb-4">Usa tu correo institucional para participar.</p>

    <form @submit.prevent="onSubmit" class="space-y-3">
      <input v-model="email" type="email" placeholder="n00xxxx@upn.pe" required
             class="w-full bg-transparent border border-white/6 rounded px-3 py-2 placeholder:text-slate-400 text-slate-100" />
      <input v-model="name" placeholder="Nombre completo" required
             class="w-full bg-transparent border border-white/6 rounded px-3 py-2 placeholder:text-slate-400 text-slate-100" />

      <button type="submit" class="btn-primary w-full">Registrarme</button>
    </form>

    <div v-if="msg" class="mt-3 text-sm" :class="msgOk ? 'text-green-400' : 'text-rose-400'">{{ msg }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const projectId = route.query.projectId || null

const email = ref('')
const name = ref('')
const msg = ref('')
const msgOk = ref(false)

function onSubmit(){
  // mock: aquí iría tu lógica para enviar link o registrar usuario
  msg.value = projectId ? `Registro recibido para votar por: ${projectId}` : 'Registro recibido. Revisa tu correo.'
  msgOk.value = true
}
</script>

<style scoped>
</style>