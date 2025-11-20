<template>
  <div class="detail-panel">
    <button @click="$router.back()" class="text-sm text-slate-300 mb-4">← Back</button>

    <div class="mb-4">
      <img :src="project.thumb || placeholder" class="thumb-lg rounded mb-4" @error="onErr" />
      <h1 class="text-2xl font-bold mb-2">{{ project.title }}</h1>
      <div class="text-sm text-muted mb-4">Por {{ project.author }}</div>

      <p class="text-sm text-slate-200 leading-relaxed">
        Aquí va la descripción larga del proyecto. Explica el problema, la solución, la tecnología y por qué debe ganar.
      </p>
    </div>

    <div class="mt-6 flex flex-col sm:flex-row gap-3">
      <button @click="goVote" class="btn-primary">Vote for {{ project.title }}</button>
      <button @click="$router.push('/')" class="border rounded px-3 py-2 text-slate-200">Back to list</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const id = route.params.id || 'proj1'

const all = {
  proj1: { id: 'proj1', title: 'AI-Powered Sustainable Farming', author: 'Team A', thumb: '' },
  proj2: { id: 'proj2', title: 'Automated Medical Diagnosis Bot', author: 'Team B', thumb: '' },
  proj3: { id: 'proj3', title: 'Eco-Chain Project', author: 'Team C', thumb: '' }
}
const project = all[id] || all['proj1']

const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="360">
    <rect width="100%" height="100%" fill="#0b1220"/>
    <text x="50%" y="50%" fill="#7c8aa3" font-size="16" text-anchor="middle" dy=".35em">No image</text>
  </svg>
`)

function onErr(e){ e.target.src = placeholder }

function goVote(){
  // navega al registro y pasa projectId por query
  router.push({ name: 'Register', query: { projectId: project.id } })
}
</script>

<style scoped>
.detail-panel { max-width: 720px; }
.thumb-lg { height: 320px; }
</style>