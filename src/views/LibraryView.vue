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

    <!-- 🏫 HEADER PRINCIPAL -->
    <AppHeader
      :isDark="isDark"
      @toggle-theme="toggleTheme"
    />

    <!-- 📚 CONTENIDO PRINCIPAL -->
    <main class="container">

      <!-- 🏷️ TÍTULO -->
      <h2 class="title">
        📚 Gestión de Biblioteca
      </h2>

      <!-- 📝 FORMULARIO -->
      <BookForm />

      <!-- ➖ SEPARADOR -->
      <hr />

      <!-- 🔎 FILTROS -->
      <Filters />

    </main>

  </div>
</template>

<style scoped>

/* =========================
   📦 LAYOUT PRINCIPAL
   ========================= */

.container {
  flex: 1;              /* 🔥 CLAVE REAL */
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

/* =========================
   🎨 TEMA (COLORES BASE)
   ========================= */

.page {
  background: #84a0d7;
  color: #ffffff;
}

.page.dark {
  background: #121b30;
  color: #e5e7eb;
}

/* =========================
   📏 SEPARADORES (HR)
   ========================= */

hr {
  border: none;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.page.dark hr {
  border-top: 1px solid rgba(255,255,255,0.15);
}

/* =========================
   🔘 CONTROLES (TOGGLE)
   ========================= */

.theme-toggle {
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px;
}

.theme-toggle button {
  background: #121b30;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  color: white;
}

.page.dark .theme-toggle button {
  background: #5aa9e6;
}

</style>
