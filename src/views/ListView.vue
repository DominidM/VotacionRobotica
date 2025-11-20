<template>
  <section class="max-w-4xl mx-auto">
    <!-- Encabezado de la pantalla -->
    <header class="mb-6">
      <h1 class="h1-principal mb-2">Conoce los proyectos</h1>
      <p class="texto-muted">Explora las ideas de la feria. Selecciona un proyecto para ver detalles y votar.</p>
    </header>

    <!-- Búsqueda + filtros (dentro del mismo flujo) -->
    <div class="app-card mb-6">
      <div class="grid gap-4">
        <label for="buscar" class="sr-only">Buscar proyectos</label>
        <input id="buscar"
               v-model="search"
               type="search"
               placeholder="Buscar proyectos o nombres..."
               class="input-busqueda"
               aria-label="Buscar proyectos" />

        <div class="flex gap-2 flex-wrap">
          <button :class="['pildora', filter === '' ? 'ring-2 ring-white/10' : '']" @click="setFilter('')">Todos</button>
          <button :class="['pildora', filter === 'Electrónica' ? 'ring-2 ring-white/10' : '']" @click="setFilter('Electrónica')">Electrónica</button>
          <button :class="['pildora', filter === 'Arquitectura' ? 'ring-2 ring-white/10' : '']" @click="setFilter('Arquitectura')">Arquitectura</button>
          <button :class="['pildora', filter === 'Robótica' ? 'ring-2 ring-white/10' : '']" @click="setFilter('Robótica')">Robótica</button>
        </div>
      </div>
    </div>

    <!-- Lista principal: tarjetas verticales (todo en la misma columna) -->
    <div class="space-y-6">
      <article
        v-for="p in listaFiltrada"
        :key="p.id"
        class="lista-proyectos-item rounded-lg overflow-hidden"
        role="article"
        :aria-label="`Proyecto ${p.title}`"
      >
        <div class="thumb-grande mb-3" aria-hidden="true">
          <img :src="p.thumb || placeholder"
               class="w-full h-full object-cover rounded"
               @error="alError"
               :alt="p.title" />
        </div>

        <div class="app-card">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold leading-tight break-words">{{ p.title }}</h2>
              <div class="text-sm texto-muted mb-3">{{ p.author }} · {{ p.short }}</div>

              <div class="flex gap-3 items-center flex-col sm:flex-row">
                <!-- Botones adaptativos: full width en móvil, inline en desktop -->
                <router-link
                  :to="{ name: 'ProjectDetail', params: { id: p.id } }"
                  class="btn-primario w-full sm:w-auto text-center"
                  aria-label="Ver detalles y votar"
                >
                  Ver detalles y votar
                </router-link>

                <button
                  @click="compartir(p)"
                  class="border rounded px-3 py-2 text-slate-200 w-full sm:w-auto"
                  aria-label="Compartir proyecto"
                >
                  Compartir
                </button>
              </div>
            </div>

            <!-- Información adicional pequeña (opcional) -->
            <div class="hidden sm:block w-36 text-right text-sm texto-muted">
              <div>Categoría: {{ p.category }}</div>
              <div class="mt-2">{{ p.votes }} votos</div>
            </div>
          </div>
        </div>
      </article>

      <!-- Mensaje si no hay proyectos -->
      <div v-if="listaFiltrada.length === 0" class="text-center texto-muted py-8">
        No se encontraron proyectos que coincidan con la búsqueda.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const proyectos = ref([
  { id: 'proj1', title: 'Agricultura sostenible con IA', author: 'Equipo A', thumb: '', short: 'Sistema inteligente de riego y ahorro de recursos.', category: 'Electrónica', votes: 142 },
  { id: 'proj2', title: 'Bot de diagnóstico médico', author: 'Equipo B', thumb: '', short: 'Asistencia preliminar para triage en centros de salud.', category: 'Robótica', votes: 115 },
  { id: 'proj3', title: 'Eco-Chain', author: 'Equipo C', thumb: '', short: 'Trazabilidad de residuos con blockchain.', category: 'Arquitectura', votes: 78 },
])

const search = ref('')
const filter = ref('')

const listaFiltrada = computed(() => {
  const q = search.value.trim().toLowerCase()
  return proyectos.value.filter(p => {
    if (filter.value && p.category !== filter.value) return false
    if (!q) return true
    return p.title.toLowerCase().includes(q) ||
           p.author.toLowerCase().includes(q) ||
           (p.short && p.short.toLowerCase().includes(q))
  })
})

const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
    <rect width="100%" height="100%" fill="#0b1220"/>
    <text x="50%" y="50%" fill="#7c8aa3" font-size="18" text-anchor="middle" dy=".35em">Sin imagen</text>
  </svg>
`)

function alError(e){ e.target.src = placeholder }
function setFilter(val){ filter.value = val }
function compartir(p){
  const url = `${location.origin}/project/${p.id}`
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(() => {
      // feedback no intrusivo
      showToast('Enlace copiado al portapapeles')
    }).catch(() => {
      router.push({ name: 'ProjectDetail', params: { id: p.id } })
    })
  } else {
    // Fallback: abrir detalle si no hay portapapeles
    router.push({ name: 'ProjectDetail', params: { id: p.id } })
  }
}

/* pequeño helper de notificación no intrusiva */
function showToast(msg){
  const el = document.createElement('div')
  el.textContent = msg
  el.style.position = 'fixed'
  el.style.right = '1rem'
  el.style.bottom = '1rem'
  el.style.background = 'rgba(17,24,39,0.9)'
  el.style.color = 'white'
  el.style.padding = '0.6rem 0.9rem'
  el.style.borderRadius = '8px'
  el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)'
  el.style.zIndex = 9999
  document.body.appendChild(el)
  setTimeout(() => { el.remove() }, 1800)
}
</script>

<style scoped>
/* Ajustes locales para mejora visual y espaciado */
.thumb-grande { height: 220px; border-radius: 10px; overflow: hidden; }
.texto-muted { color: #9aa4b2; }
.lista-proyectos-item { background: transparent; }

/* Aumentar padding interno de las cards para mejor separación en móvil */
.app-card { padding: 1rem; }

/* Asegurar que en pantallas pequeñas los botones se apilen correctamente */
@media (max-width: 640px) {
  .thumb-grande { height: 160px; }
  .h1-principal { font-size: 1.5rem; }
  .app-card { padding: 0.95rem; }
}
</style>