<template>
  <div class="min-h-screen">
    <header class="py-3 border-b border-white/6">
      <nav class="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <router-link to="/" class="text-lg font-semibold">Feria Robótica / IOT</router-link>
        <div class="flex items-center gap-3">
          <router-link to="/results" class="text-sm text-slate-300 hover:underline">Resultados</router-link>
          <router-link to="/register" class="btn-primary">Registrarse</router-link>
        </div>
      </nav>
    </header>

    <main class="max-w-6xl mx-auto p-6">
      <div class="flex gap-6 app-grid">
        <!-- Sidebar izquierdo estrecho (lista) -->
        <aside class="w-80 sticky top-6 self-start">
          <div class="app-card">
            <h2 class="text-base font-semibold mb-3">Feria Robótica / IOT</h2>

            <div class="mb-3">
              <input v-model="search" placeholder="Buscar proyectos o nombres..."
                     class="w-full bg-transparent border border-white/6 rounded px-3 py-2 placeholder:text-slate-400 text-slate-100" />
            </div>

            <div class="flex gap-2 mb-4 flex-wrap">
              <button class="small-pill">Todos</button>
              <button class="small-pill">Electrónica</button>
              <button class="small-pill">Arquitectura</button>
              <button class="small-pill">Robótica</button>
            </div>

            <div class="space-y-3 max-h-[66vh] overflow-auto pr-1">
              <ProjectCard v-for="p in filtered" :key="p.id" :project="p" />
            </div>
          </div>
        </aside>

        <!-- Columna central: lista/detalle de diseño vertical (muy parecido a Figma) -->
        <section class="flex-1">
          <router-view />
        </section>

        <!-- (opcional) Columna derecha para acciones / confirm / resultados -->
        <aside class="w-96 hidden lg:block sticky top-6 self-start">
          <div class="app-card detail-panel">
            <h3 class="text-lg font-semibold mb-3">Vista Rápida</h3>
            <p class="text-muted text-sm">Selecciona un proyecto para ver detalles y votar.</p>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProjectCard from './components/ProjectCard.vue'

const projects = ref([
  { id: 'proj1', title: 'AI-Powered Sustainable Farming', author: 'Team A', thumb: '' },
  { id: 'proj2', title: 'Automated Medical Diagnosis Bot', author: 'Team B', thumb: '' },
  { id: 'proj3', title: 'Eco-Chain Project', author: 'Team C', thumb: '' }
])

const search = ref('')
const filtered = computed(() => {
  if (!search.value) return projects.value
  const q = search.value.toLowerCase()
  return projects.value.filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
})
</script>

<style scoped>
/* Ajustes locales */
</style>