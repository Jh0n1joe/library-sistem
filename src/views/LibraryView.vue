<template>
  <div :class="['page', { dark: isDark }]">

    <!-- 🏫 HEADER CON DASHBOARD -->
    <AppHeader
      :isDark="isDark"
      @toggle-theme="toggleTheme"

      :totalBooks="totalBooks"
      :totalCopies="totalCopies"
      :availableCopies="availableCopies"
      :borrowedCopies="borrowedCopies"
      :overdueCopies="overdueCopies"
    />

    <!-- 🔍 CONTENIDO PRINCIPAL -->
    <main class="container">

      <!-- 📚 BLOQUE SUPERIOR -->
      <section class="top-section">

        <h2 class="title">
          📚 Biblioteca Escolar
        </h2>

        <BookForm />

      </section>

      <!-- 🔎 FILTROS -->
      <section class="filters-section">
        <Filters />
      </section>

    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import AppHeader from '../components/layouts/AppHeader.vue'
import BookForm from '../components/BookForm.vue'
import Filters from '../components/Filters.vue'
import { useLibraryStore } from '../stores/library'

const store = useLibraryStore()

const isDark = ref(false)
const userOverride = ref(false)

/* =========================
   📊 KPI REACTIVOS CORREGIDOS
   ========================= */
const totalBooks = computed(() => store.books.length)

const totalCopies = computed(() =>
  store.books.reduce((acc, b) => acc + (b.copies?.length || 0), 0)
)

const availableCopies = computed(() =>
  store.books.reduce(
    (acc, b) => acc + b.copies.filter(c => c.status === 'available').length,
    0
  )
)

const borrowedCopies = computed(() =>
  store.books.reduce(
    (acc, b) => acc + b.copies.filter(c => c.status === 'borrowed').length,
    0
  )
)

/* 🔥 FIX IMPORTANTE: vencidos en tiempo real */
const overdueCopies = computed(() => {
  const now = new Date()

  return store.books.reduce((acc, book) => {
    return acc + book.copies.filter(copy => {

      if (copy.status !== 'borrowed') return false
      if (!copy.dueDate) return false

      const due = new Date(copy.dueDate)

      return due < now

    }).length
  }, 0)
})

function toggleTheme() {
  userOverride.value = true
  isDark.value = !isDark.value
}

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

onMounted(() => {
  detectSystemTheme()
})
</script>

<style scoped>

/* =========================
   🌐 ROOT GLOBAL FIX
   ========================= */
:global(html, body, #app) {
  height: 100%;
  margin: 0;
}

/* =========================
   📦 APP LIGHT MODE
   ========================= */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  background: #f4f7ff;
  color: #0f172a;
}

/* =========================
   📦 CONTENEDOR
   ========================= */
.container {
  flex: 1;
  padding: 24px;

  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* =========================
   📚 SECCIONES LIGHT
   ========================= */
.top-section {
  background: #ffffff;
  padding: 22px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
}

.filters-section {
  background: #ffffff;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
}

/* =========================
   🏷️ TITLE
   ========================= */
.title {
  margin-bottom: 10px;
  font-size: 22px;
  font-weight: 700;
}

/* =========================================================
   🌙 DARK MODE (REWORKED - REAL DASHBOARD LEVEL)
   ========================================================= */

.page.dark {
  background: #0a0f1c;
  color: #e5e7eb;

  filter: brightness(0.88);
}

/* =========================
   📦 SECCIÓN PRINCIPAL (SURFACE 1)
   ========================= */
.page.dark .container {
  background: transparent;
}

/* =========================
   📚 TOP SECTION (SURFACE 2)
   ========================= */
.page.dark .top-section {
  background: #111827; /* más sólido, sin transparencia */
  border: 1px solid #1f2937;
  box-shadow: 0 10px 30px rgba(0,0,0,0.45);
}

/* =========================
   🔎 FILTERS (SURFACE 2 MÁS OSCURO)
   ========================= */
.page.dark .filters-section {
  background: #0f172a;
  border: 1px solid #1e293b;
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
}

/* =========================
   🧠 TITLES DARK
   ========================= */
.page.dark .title {
  color: #f1f5f9;
}

/* =========================
   🔥 EXTRA: ELIMINAR “BLANCO SUCIO” GLOBAL
   ========================= */
.page.dark * {
  scrollbar-color: #334155 #0a0f1c;
}

/* =========================
   🧩 OPTIONAL DEPTH BOOST
   ========================= */
.page.dark .top-section:hover,
.page.dark .filters-section:hover {
  border-color: #334155;
  transition: 0.2s;
}
</style>
