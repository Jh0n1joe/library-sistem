<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '../stores/library'

const store = useLibraryStore()

const categoryFilter = ref('')
const shelfFilter = ref('')
const sortBy = ref('')

// 🔎 filtros
const filteredBooks = computed(() => {
  let books = store.books

  const category = categoryFilter.value.toLowerCase().trim()
  const shelf = shelfFilter.value.toLowerCase().trim()

  if (category) {
    books = books.filter(b =>
      b.category.toLowerCase().includes(category)
    )
  }

  if (shelf) {
    books = books.filter(b =>
      b.shelf.toLowerCase().includes(shelf)
    )
  }

  if (sortBy.value === 'title') {
    books = [...books].sort((a, b) =>
      a.title.localeCompare(b.title)
    )
  }

  return books
})
</script>

<template>
  <div>

    <h2>🔎 Filtros</h2>

    <input
      v-model="categoryFilter"
      placeholder="Categoría"
    />

    <input
      v-model="shelfFilter"
      placeholder="Estante"
    />

    <select v-model="sortBy">
      <option value="">Sin orden</option>
      <option value="title">
        Ordenar por título
      </option>
    </select>

    <hr />

    <!-- 📚 libros -->
    <div
      v-for="(book, bIndex) in filteredBooks"
      :key="bIndex"
    >

      <!-- 📖 titulo -->
      <p>
        <b>📖 {{ book.title }}</b>

        <span v-if="book.copies.length > 1">
          ({{ book.copies.length }})
        </span>
      </p>

      <p>✍️ {{ book.editor }}</p>
      <p>🏷️ {{ book.category }}</p>
      <p>📦 Estante: {{ book.shelf }}</p>

      <!-- 📊 estado global -->
      <p v-if="book.copies.some(c => c.status === 'available')">
        🟢 Hay copias disponibles
      </p>

      <p v-else>
        🔴 Sin disponibilidad
      </p>

      <hr />

      <!-- 📦 copias -->
      <div
        v-for="(copy, cIndex) in book.copies"
        :key="cIndex"
      >

        <p>
          📦 Copia {{ cIndex + 1 }}
        </p>

        <p v-if="copy.status === 'available'">
          🟢 Disponible
        </p>

        <p v-else>
          🔴 Prestado a
          {{ copy.borrower }}
          ({{ copy.date }})
        </p>

        <button
          @click="store.toggleCopyStatus(
            bIndex,
            cIndex
          )"
        >
          Cambiar estado
        </button>

      </div>

      <!-- 📦 control stock -->
      <div style="margin: 10px 0">

        <button
          @click="store.addCopy(bIndex)"
        >
          ➕ Agregar copia
        </button>

        <button
          @click="store.removeCopy(bIndex)"
        >
          ➖ Quitar copia
        </button>

      </div>

      <hr />

    </div>

  </div>
</template>
