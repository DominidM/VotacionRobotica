<template>
  <div class="max-w-md mx-auto text-center py-12">
    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-400 mb-6 shadow-lg">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <h2 class="text-2xl font-bold mb-2">¡Éxito! Tu voto ha sido registrado.</h2>
    <p class="texto-muted mb-6">Gracias por participar. Tu voto ha sido guardado correctamente y se contará en los resultados.</p>

    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <router-link to="/results" class="btn-primario text-center">Ver resultados</router-link>
      <router-link to="/" class="border rounded px-4 py-2 text-slate-200 text-center">Volver al listado</router-link>
    </div>
  </div>
</template>

<script setup>
// componente simple, no necesita lógica adicional por ahora
</script>

<style scoped>
.texto-muted { color: #9aa4b2; }
.btn-primario {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:.5rem;
  background: linear-gradient(90deg,#6d28d9,#4f46e5);
  color:#fff;
  padding:.6rem 1rem;
  border-radius:12px;
  font-weight:700;
  text-decoration: none;
}
</style>