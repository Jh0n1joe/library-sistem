<script setup>
import { useLibraryStore } from '../stores/library'
import { computed } from 'vue'

const store = useLibraryStore()

// 👇 simula loading (puedes conectarlo a API luego)
const isLoading = computed(() => {
  return store.books === null || store.books === undefined
})

// cantidad de skeletons visibles mientras carga
const skeletonCount = 6
</script>

<template>
  <div>
    <h2>📚 Libros</h2>

    <!-- contador -->
    <p v-if="!isLoading">
      Total de libros: {{ store.books.length }}
    </p>

    <!-- =========================
         🧊 SKELETON LOADING
         ========================= -->
    <div v-if="isLoading" class="skeleton-grid">
      <div v-for="n in skeletonCount" :key="n" class="card skeleton">
        <div class="line title"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line short"></div>
      </div>
    </div>

    <!-- =========================
         📚 LISTA REAL
         ========================= -->
    <div v-else>
      <p v-if="store.books.length === 0" class="empty-state">
        No hay libros aún
      </p>

      <div v-else>
        <div
          v-for="(book, index) in store.books"
          :key="index"
          class="card"
        >
          <p><b>📖 {{ book.title }}</b></p>
          <p>✍️ {{ book.editor }}</p>
          <p>🏷️ {{ book.category }}</p>
          <p>📦 Estante: {{ book.shelf }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

/* =========================
   📦 CARD NORMAL
   ========================= */
.card {
  padding: 12px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 8px;
  background: #f9f9f9;
}

/* =========================
   🌙 DARK MODE
   ========================= */
:global(.page.dark) .card {
  background: #1e293b;
  border: 1px solid #334155;
  color: #e5e7eb;
}

/* =========================
   📭 EMPTY
   ========================= */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

/* =========================
   🧊 SKELETON GRID
   ========================= */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

/* =========================
   🧱 SKELETON CARD
   ========================= */
.skeleton {
  position: relative;
  overflow: hidden;
  background: #e5e7eb;
}

/* líneas */
.line {
  height: 10px;
  background: #d1d5db;
  margin: 8px 0;
  border-radius: 6px;
}

.line.title {
  width: 70%;
  height: 14px;
}

.line.short {
  width: 40%;
}

/* =========================
   ✨ SHIMMER EFFECT
   ========================= */
.skeleton::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.5),
    transparent
  );
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    left: 150%;
  }
}
</style>
