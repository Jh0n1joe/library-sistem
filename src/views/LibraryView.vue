<script setup>
import { ref, onMounted } from 'vue'
import BookForm from '../components/BookForm.vue'
import Filters from '../components/Filters.vue'

const isDark = ref(false)
const userOverride = ref(false)

// 🌙 detectar sistema
function detectSystemTheme() {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  if (!userOverride.value) {
    isDark.value = media.matches
  }

  media.addEventListener('change', (e) => {
    if (!userOverride.value) {
      isDark.value = e.matches
    }
  })
}

// 🔘 toggle manual
function toggleTheme() {
  userOverride.value = true
  isDark.value = !isDark.value
}

onMounted(() => {
  detectSystemTheme()
})
</script>

<template>
  <div :class="['page', { dark: isDark }]">

    <!-- 🏫 HEADER -->
    <AppHeader />

    <!-- 🌙 TOGGLE -->
    <div class="theme-toggle">
      <button @click="toggleTheme">
        {{ isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro' }}
      </button>
    </div>

    <!-- 📚 CONTENIDO -->
    <main class="container">

      <h2 class="title">📚 Gestión de Biblioteca</h2>

      <BookForm />

      <hr />

      <Filters />

    </main>

  </div>
</template>

<style scoped>

/* =========================
   🌐 RESET GLOBAL
   ========================= */
:global(body) {
  margin: 0;
  padding: 0;
  background: #84a0d7;
}


/* =========================
   🌞 LAYOUT BASE (MODO CLARO)
   ========================= */
.page {
  background: #84a0d7;
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* 📦 CONTENEDOR PRINCIPAL DEL CONTENIDO */
.container {
  padding: 45px;
}

/* 🏷️ TÍTULO PRINCIPAL (GESTIÓN BIBLIOTECA) */
.title {
  margin: 10px 0 20px;
  font-size: 18px;
  color: #ffffff;
}

/* 📏 LÍNEAS DIVISORIAS (hr) EN MODO CLARO */
hr {
  border-color: #d6dee8;
  margin: 10px;
}


/* =========================
   🌙 MODO OSCURO (SISTEMA)
   ========================= */

/* 🌑 FONDO GENERAL EN DARK MODE */
.page.dark {
  background: #121b30;
  color: #e5e7eb;
}

/* 🌑 BODY EN DARK MODE */
:global(body.dark-mode) {
  background: #121b30;
}

/* 🏷️ TÍTULO EN MODO OSCURO */
.page.dark .title {
  color: #ffffff;
}

/* 📏 LÍNEAS DIVISORIAS (hr) EN DARK MODE */
.page.dark hr {
  border-color: #121b30;
  margin: 10px;
}


/* =========================
   🔘 TOGGLE DE TEMA
   ========================= */

/* 📍 POSICIÓN DEL BOTÓN DE CAMBIO DE TEMA */
.theme-toggle {
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px;
}

/* 🔘 BOTÓN DE CAMBIO DE TEMA (MODO CLARO) */
.theme-toggle button {
  background: #121b30;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}


/* 🌙 BOTÓN EN MODO OSCURO */
.page.dark .theme-toggle button {
  background: #5aa9e6;
}

/* ✨ EFECTO HOVER DEL BOTÓN */
.theme-toggle button:hover {
  background: #3b82f6;
}

</style>
