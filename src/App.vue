<template>
  <div class="min-h-screen">
    <header class="site-header">
      <div class="container">
        <div class="brand">
          <router-link to="/" class="brand-link" aria-label="Inicio">
            <span class="brand-badge" aria-hidden="true">UPN</span>
            <span class="brand-text">EXPOCREA UPN - IoT</span>
          </router-link>
        </div>

        <button class="hamburger md:hidden" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen" aria-label="Abrir menú">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>

        <nav :class="['nav', menuOpen ? 'open' : '']" role="navigation" aria-label="Menú principal">
          <router-link to="/results" class="nav-link">Resultados</router-link>
          <router-link to="/register" class="btn-primario register-btn">Registrarse</router-link>
        </nav>
      </div>
    </header>

    <main class="max-w-6xl mx-auto p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
</script>

<style scoped>
/* Header layout */
.site-header {
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: linear-gradient(180deg, rgba(7,16,39,0.35), transparent);
  backdrop-filter: blur(6px);
  position: sticky;
  top: 0;
  z-index: 40;
}

/* Container aligns items and constrains width */
.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}

/* Brand */
.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-badge {
  width: 40px;
  height: 40px;
  display: inline-grid;
  place-items: center;
  background: linear-gradient(90deg,#6d28d9,#4f46e5);
  color: white;
  font-weight: 800;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(79,70,229,0.12);
  font-size: 16px;
}

.brand-text {
  color: #eaf2ff;
  font-weight: 800;
  letter-spacing: -0.01em;
  font-size: 18px;
}

/* Nav */
.nav {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Nav links */
.nav-link {
  color: #bcd3ff;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.95rem;
}
.nav-link:hover {
  background: rgba(255,255,255,0.02);
  color: #fff;
}

/* Register button override (keeps .btn-primario look but smaller) */
.register-btn {
  padding: 0.48rem 0.9rem;
  border-radius: 10px;
  font-size: 0.95rem;
}

/* Hamburger for small screens */
.hamburger {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  width: 40px;
  height: 32px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
}
.hamburger-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: #d7e6ff;
  border-radius: 2px;
}

/* Responsive: collapse nav on small screens */
@media (max-width: 767px) {
  .nav {
    position: absolute;
    right: 16px;
    top: calc(100% + 8px);
    background: linear-gradient(180deg, rgba(10,18,33,0.98), rgba(8,12,22,0.98));
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 10px;
    padding: 10px;
    flex-direction: column;
    min-width: 180px;
    transform-origin: top right;
    box-shadow: 0 10px 30px rgba(2,6,23,0.6);
    opacity: 0;
    pointer-events: none;
    transition: opacity .12s ease, transform .12s ease;
    transform: translateY(-6px) scale(.98);
  }

  .nav.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }

  .register-btn { width: 100%; }
  .nav-link { width: 100%; padding: 10px; }
}

/* Desktop: hide hamburger */
@media (min-width: 768px) {
  .hamburger { display: none; }
}
</style>