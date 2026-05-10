<script setup>
import { useLibraryStore } from '../stores/library'

const store = useLibraryStore()
</script>

<template>
  <div>
    <h2>📚 Libros</h2>

    <!-- contador -->
    <p>Total de libros: {{ store.books.length }}</p>

    <!-- estado vacío -->
    <p v-if="store.books.length === 0">
      No hay libros aún
    </p>

    <!-- lista -->
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
</template>

<style>
.card {
  padding: 12px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 8px;
  background: #f9f9f9;
}
</style>
