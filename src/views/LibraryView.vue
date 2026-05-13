<script setup>
import { ref, onMounted } from 'vue'

/* =========================
   🧩 COMPONENTES
   ========================= */
import AppHeader from '../components/layouts/AppHeader.vue'
import BookForm from '../components/BookForm.vue'
import Filters from '../components/Filters.vue'

/* =========================
   🌙 ESTADO DE TEMA
   ========================= */
const isDark = ref(false)
const userOverride = ref(false)

/* =========================
   🌙 DETECCIÓN DE SISTEMA
   ========================= */
function detectSystemTheme() {
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  // estado inicial
  if (!userOverride.value) {
    isDark.value = media.matches
  }

  // listener cambios del sistema
  media.addEventListener('change', (e) => {
    if (!userOverride.value) {
      isDark.value = e.matches
    }
  })
}

/* =========================
   🔘 TOGGLE MANUAL
   ========================= */
function toggleTheme() {
  userOverride.value = true
  isDark.value = !isDark.value
}

/* =========================
   🚀 CICLO DE VIDA
   ========================= */
onMounted(() => {
  detectSystemTheme()
})
</script>

<template>
  <div :class="['page', { dark: isDark }]">

    <!-- 🏫 HEADER -->
    <AppHeader
      :isDark="isDark"
      @toggle-theme="toggleTheme"
    />

    <!-- 🔍 CONTENEDOR PRINCIPAL -->
    <main class="container">

      <!-- 🔎 BLOQUE PRINCIPAL (tipo search bar + form) -->
      <section class="top-section">
        <h2 class="title">📚 Biblioteca Escolar</h2>
        <BookForm />
      </section>

      <!-- 🔧 FILTROS -->
      <section class="filters-section">
        <Filters />
      </section>

    </main>

  </div>
</template>

<style scoped>
/* =========================
   🌐 ROOT FULLSCREEN REAL
   ========================= */

:global(html, body, #app) {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* =========================
   📦 APP ROOT
   ========================= */

.page {
  min-height: 100vh;   /* 🔥 clave real */
  width: 100%;

  display: flex;
  flex-direction: column;

  background: #84a0d7;
  color: white;

  overflow-x: hidden;
}

/* =========================
   🏫 HEADER FIX (NO SE SUBE NI DESAPARECE)
   ========================= */

.page > header {
  flex-shrink: 0;   /* 🔥 evita que se colapse */
  width: 100%;
}

/* =========================
   📦 CONTENIDO
   ========================= */

.container {
  flex: 1;              /* ocupa todo el espacio restante */
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 24px;
  box-sizing: border-box;
}

/* =========================
   🔝 SECCIONES
   ========================= */

.top-section,
.filters-section {
  width: 100%;
}

/* =========================
   🔝 BLOQUE SUPERIOR
   ========================= */

.top-section {
  background: rgba(255,255,255,0.12);
  padding: 25px;
  border-radius: 12px;
  backdrop-filter: blur(6px);
}

/* =========================
   🔧 FILTROS
   ========================= */

.filters-section {
  background: rgba(255,255,255,0.08);
  padding: 20px;
  border-radius: 12px;
}

/* =========================
   🏷️ TÍTULO
   ========================= */

.title {
  margin-bottom: 12px;
  font-size: 22px;
}

/* =========================
   🌙 DARK MODE
   ========================= */

.page.dark {
  background: #121b30;
  color: #e5e7eb;
}

.page.dark .top-section {
  background: rgba(255,255,255,0.05);
}

.page.dark .filters-section {
  background: rgba(255,255,255,0.03);
}
</style>
