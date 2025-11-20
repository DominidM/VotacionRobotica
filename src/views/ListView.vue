<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Meet the Contestants</h1>

    <div class="space-y-6">
      <div v-for="p in projects" :key="p.id" class="rounded-lg overflow-hidden">
        <div class="thumb-lg relative mb-3">
          <img :src="p.thumb || placeholder" class="w-full h-full object-cover rounded" @error="onErr" />
        </div>
        <div class="app-card">
          <div class="flex items-start gap-4">
            <div class="flex-1 min-w-0">
              <div class="text-lg font-semibold">{{ p.title }}</div>
              <div class="text-sm text-muted mb-3">{{ p.author }} · Descripción corta del proyecto que resume la idea.</div>

              <div class="flex gap-3">
                <router-link :to="{ name: 'ProjectDetail', params: { id: p.id } }" class="btn-primary">View Details & Vote</router-link>
                <button class="border rounded px-3 py-2 text-slate-200">Share</button>
              </div>
            </div>

            <div class="hidden sm:block w-32">
              <!-- box pequeño para acciones (opcional) -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const projects = [
  { id: 'proj1', title: 'AI-Powered Farming', author: 'Team A', thumb: '' },
  { id: 'proj2', title: 'Medical Bot', author: 'Team B', thumb: '' },
  { id: 'proj3', title: 'Eco-Chain', author: 'Team C', thumb: '' },
]

const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
    <rect width="100%" height="100%" fill="#0b1220"/>
    <text x="50%" y="50%" fill="#7c8aa3" font-size="14" text-anchor="middle" dy=".35em">No image</text>
  </svg>
`)

function onErr(e){ e.target.src = placeholder }
</script>

<style scoped>
.thumb-lg { height: 220px; border-radius: 10px; overflow:hidden; }
</style>