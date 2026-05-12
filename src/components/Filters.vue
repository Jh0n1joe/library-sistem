<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLibraryStore } from '../stores/library'
import LoanModal from '../components/LoanModal.vue'

const store = useLibraryStore()

const categoryFilter = ref('')
const shelfFilter = ref('')
const sortBy = ref('')
const search = ref('')

const nowTick = ref(Date.now())
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    nowTick.value = Date.now()
  }, 60000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const showModal = ref(false)
const selectedBookId = ref(null)
const selectedCopyId = ref(null)

const categories = computed(() =>
  [...new Set(store.books.map(b => b.category))]
)

const shelves = computed(() =>
  [...new Set(store.books.map(b => b.shelf))]
)

function resetFilters() {
  categoryFilter.value = ''
  shelfFilter.value = ''
  sortBy.value = ''
  search.value = ''
}

function parseCustomDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  return date
}

function getTimeRemaining(dueDate) {
  const due = parseCustomDate(dueDate)
  if (!due) return 'Fecha inválida'

  const now = new Date(nowTick.value)
  const diff = due - now

  if (diff <= 0) return 'Vencido'

  const totalMinutes = Math.floor(diff / (1000 * 60))
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  return `${days}d ${hours}h ${minutes}m restantes`
}

function getDueAlert(dueDate) {
  const due = parseCustomDate(dueDate)
  if (!due) return null

  const now = new Date(nowTick.value)
  const diff = due - now
  const hours = diff / (1000 * 60 * 60)

  if (diff <= 0) return '🔴 VENCIDO'
  if (hours <= 24) return '🟠 VENCE PRONTO'
  if (hours <= 72) return '🟡 PRÓXIMO A VENCER'

  return null
}

function openLoanModal(bookId, copyId) {
  selectedBookId.value = bookId
  selectedCopyId.value = copyId
  showModal.value = true
}

function handleAction(bookId, copy) {
  if (copy.status === 'available') {
    openLoanModal(bookId, copy.id)
  }
}

function handleLoan(data) {
  store.loanCopy(
    selectedBookId.value,
    selectedCopyId.value,
    data
  )
  showModal.value = false
}

const filteredBooks = computed(() => {
  let books = store.books

  const category = categoryFilter.value.toLowerCase().trim()
  const shelf = shelfFilter.value.toLowerCase().trim()
  const searchTerm = search.value.toLowerCase().trim()

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

  if (searchTerm) {
    books = books.filter(b =>
      b.title.toLowerCase().startsWith(searchTerm)
    )
  }

  if (sortBy.value === 'title-asc') {
    books = [...books].sort((a, b) =>
      a.title.localeCompare(b.title)
    )
  }

  if (sortBy.value === 'title-desc') {
    books = [...books].sort((a, b) =>
      b.title.localeCompare(a.title)
    )
  }

  if (sortBy.value === 'availability') {
    books = [...books].sort((a, b) =>
      b.copies.some(c => c.status === 'available') -
      a.copies.some(c => c.status === 'available')
    )
  }

  if (sortBy.value === 'copies') {
    books = [...books].sort((a, b) =>
      b.copies.length - a.copies.length
    )
  }

  if (sortBy.value === 'recent') {
    books = [...books].sort((a, b) =>
      b.id - a.id
    )
  }

  return books
})

function getCopyCount(book) {
  return book.copies?.length || 0
}
</script>

<template>
  <div class="page">

    <!-- 🔎 FILTROS -->
    <div class="filters-panel">

      <h2>🔎 Filtros</h2>

      <div class="filters-grid">
        <input v-model="search" placeholder="Buscar libro..." />

        <select v-model="categoryFilter">
          <option value="">Todas las categorías</option>
          <option v-for="c in categories" :key="c">{{ c }}</option>
        </select>

        <select v-model="shelfFilter">
          <option value="">Todos los estantes</option>
          <option v-for="s in shelves" :key="s">{{ s }}</option>
        </select>

        <select v-model="sortBy">
          <option value="">Sin orden</option>
          <option value="title-asc">A - Z</option>
          <option value="title-desc">Z - A</option>
          <option value="availability">Disponibilidad</option>
          <option value="copies">Copias</option>
          <option value="recent">Recientes</option>
        </select>

        <button @click="resetFilters">
          🔄 Reset
        </button>
      </div>

    </div>

    <!-- 📚 LIBROS -->
    <div class="books-container">

      <div
        class="book-card"
        v-for="book in filteredBooks"
        :key="book.id"
      >

        <div class="book-header">
          <h3>📖 {{ book.title }}</h3>

          <span v-if="getCopyCount(book) > 1">
            {{ getCopyCount(book) }} copias
          </span>
        </div>

        <p class="meta">✍️ {{ book.editor }}</p>
        <p class="meta">🏷️ {{ book.category }}</p>
        <p class="meta">📦 {{ book.shelf }}</p>

        <hr />

        <!-- 📦 COPIAS -->
        <div
          class="copy-block"
          v-for="copy in book.copies"
          :key="copy.id"
        >

          <p v-if="getDueAlert(copy.dueDate)">
            {{ getDueAlert(copy.dueDate) }}
          </p>

          <p v-if="copy.status === 'available'">
            🟢 Disponible
          </p>

          <p v-else-if="copy.status === 'borrowed'">
            🟡 {{ copy.borrower }} ({{ copy.cedula }})
            <br />
            📅 {{ copy.dueDate }}
            <br />
            ⏳ {{ getTimeRemaining(copy.dueDate) }}
          </p>

          <p v-else>
            🔴 Vencido
          </p>

          <button @click="handleAction(book.id, copy)">
            📚 Prestar
          </button>

          <button @click="store.addCopy(book.id)">
            ➕ Agregar
          </button>

          <button @click="store.removeCopy(book.id, copy.id)">
            ➖ Quitar
          </button>

        </div>

      </div>

    </div>

    <!-- 📦 MODAL -->
    <LoanModal
      v-if="showModal"
      @close="showModal = false"
      @submit="handleLoan"
    />

  </div>
</template>

<style scoped>

/* =========================
   🌞 CONTENEDOR GENERAL (PÁGINA)
   ========================= */
.page {
  background: #f5f7fb;
  min-height: 100vh;
  padding: 16px;
  font-family: Arial, sans-serif;
}


/* =========================
   📦 PANEL DE FILTROS
   ========================= */
.filters-panel {
  background: white;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 16px;
}


/* =========================
   📐 GRID DE FILTROS
   ========================= */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}


/* =========================
   📚 CONTENEDOR DE LIBROS
   ========================= */
.books-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}


/* =========================
   📦 TARJETA DE LIBRO
   ========================= */
.book-card {
  background: white;
  padding: 14px;
  border-radius: 10px;
}


/* =========================
   🧾 ENCABEZADO DE LIBRO
   ========================= */
.book-header {
  display: flex;
  justify-content: space-between;
}


/* =========================
   📌 METADATOS (AUTOR, ETC)
   ========================= */
.meta {
  opacity: 0.7;
  margin: 2px 0;
}


/* =========================
   📦 BLOQUE DE COPIAS
   ========================= */
.copy-block {
  margin-top: 10px;
  padding: 8px;
  border-left: 3px solid #ddd;
}


/* =========================
   🌙 MODO OSCURO (SISTEMA GLOBAL)
   ========================= */

/* 🌑 FONDO GENERAL */
:global(.page.dark) {
  background: #121b30;
  color: #e5e7eb;
}


/* 📦 PANEL DE FILTROS EN DARK MODE */
:global(.page.dark) .filters-panel {
  background: #1e293b;
}


/* 📚 TARJETAS DE LIBRO EN DARK MODE */
:global(.page.dark) .book-card {
  background: #1e293b;
  color: #e5e7eb;
}

/* 📦 BLOQUES DE COPIAS EN DARK MODE */
:global(.page.dark) .copy-block {
  border-left: 3px solid #334155;
}
</style>
