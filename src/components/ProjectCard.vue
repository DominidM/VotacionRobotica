<template>
  <div class="list-card">
    <div style="width:72px; height:56px; flex-shrink:0;">
      <img :src="project.thumb || placeholder" alt="thumb" class="w-full h-full rounded object-cover" @error="onErr" />
    </div>
    <div class="flex-1 min-w-0">
      <div class="text-sm font-semibold truncate">{{ project.title }}</div>
      <div class="text-xs text-muted truncate">{{ project.author }}</div>
    </div>
    <div class="ml-2">
      <router-link :to="{ name: 'ProjectDetail', params: { id: project.id } }" class="text-xs text-slate-300 hover:underline">Ver</router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: { type: Object, required: true }
})

const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
    <rect width="100%" height="100%" fill="#0b1220"/>
    <text x="50%" y="50%" fill="#7c8aa3" font-size="12" text-anchor="middle" dy=".35em">No image</text>
  </svg>
`)

function onErr(e){
  e.target.src = placeholder
}
</script>

<style scoped>
.list-card { cursor: pointer; }
</style>