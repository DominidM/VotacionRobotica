<template>
  <div class="bg-white p-4 rounded shadow">
    <div v-if="!user">
      <p>Ingresa tu correo institucional para recibir el enlace de acceso:</p>
      <input v-model="emailInput" type="email" placeholder="correo@universidad.edu" class="w-full p-2 border rounded mb-2" />
      <button @click="sendLink" class="w-full p-2 bg-blue-600 text-white rounded">Enviar link</button>
      <p class="text-sm text-red-600 mt-2" v-if="msg">{{ msg }}</p>
    </div>

    <div v-else>
      <p class="text-sm mb-2">Autenticado como: <strong>{{ user.email }}</strong></p>

      <form @submit.prevent="submitVote">
        <input v-model="name" placeholder="Nombre completo" required class="w-full p-2 border rounded mb-2" />
        <select v-model="career" required class="w-full p-2 border rounded mb-2">
          <option value="">-- Selecciona carrera --</option>
          <option value="Sistemas">Ingeniería de Sistemas</option>
          <option value="Electronica">Electrónica</option>
          <option value="Mecatronica">Mecatrónica</option>
        </select>

        <select v-model="candidate" required class="w-full p-2 border rounded mb-2">
          <option value="">-- Selecciona proyecto --</option>
          <option value="proj1">Proyecto 1</option>
          <option value="proj2">Proyecto 2</option>
          <option value="proj3">Proyecto 3</option>
        </select>

        <button type="submit" class="w-full p-2 bg-green-600 text-white rounded">Votar</button>
      </form>

      <div v-if="resultMsg" :class="{'text-green-600': success, 'text-red-600': !success}" class="mt-3">
        {{ resultMsg }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const auth = inject('auth');
const db = inject('db');

const emailInput = ref('');
const localKey = 'emailForSignIn';
const name = ref('');
const career = ref('');
const candidate = ref('');
const resultMsg = ref('');
const success = ref(false);
const msg = ref('');
const user = ref(null);

const actionCodeSettings = {
  url: window.location.href,
  handleCodeInApp: true
};

onMounted(() => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem(localKey);
    if (!email) email = window.prompt('Confirma tu correo:');
    signInWithEmailLink(auth, email, window.location.href).catch(e => msg.value = 'Error: ' + e.message);
  }
  onAuthStateChanged(auth, u => {
    user.value = u;
    if (u?.displayName) name.value = u.displayName;
  });
});

async function sendLink(){
  if (!emailInput.value) { msg.value = 'Introduce un correo'; return; }
  try {
    await sendSignInLinkToEmail(auth, emailInput.value, actionCodeSettings);
    window.localStorage.setItem(localKey, emailInput.value);
    msg.value = 'Link enviado. Revisa tu correo institucional.';
  } catch(e) {
    msg.value = 'Error: ' + e.message;
  }
}

async function submitVote(){
  if (!user.value) { resultMsg.value = 'No autenticado'; return; }
  const uid = user.value.uid;
  const voteRef = doc(db, 'votes', uid);
  const payload = {
    email: user.value.email,
    name: name.value,
    career: career.value,
    candidateId: candidate.value,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
  try {
    await setDoc(voteRef, payload);
    resultMsg.value = 'Voto registrado. Gracias.';
    success.value = true;
  } catch(e) {
    resultMsg.value = 'Error registrando voto: ' + e.message;
    success.value = false;
  }
}
</script>

<style scoped>
/* pequeños estilos, personaliza si quieres */
</style>