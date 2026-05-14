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

/* =========================
   📕 PRÉSTAMO MODAL
   ========================= */
const showModal = ref(false)
const selectedBookId = ref(null)
const selectedCopyId = ref(null)

/* =========================
   ↩️ DEVOLUCIÓN INLINE (NUEVO REAL)
   ========================= */
const activeReturn = ref({
  bookId: null,
  copyId: null
})

function openReturn(bookId, copyId) {
  activeReturn.value = { bookId, copyId }
}

function confirmReturn() {
  store.returnCopy(
    activeReturn.value.bookId,
    activeReturn.value.copyId
  )

  activeReturn.value = { bookId: null, copyId: null }
}

/* =========================
   📚 DATA
   ========================= */
const categories = computed(() =>
  [...new Set(store.books.map(b => b.category))]
)

const shelves = computed(() =>
  [...new Set(store.books.map(b => b.shelf))]
)

/* =========================
   🔄 RESET
   ========================= */
function resetFilters() {
  categoryFilter.value = ''
  shelfFilter.value = ''
  sortBy.value = ''
  search.value = ''
}

/* =========================
   ⏳ TIEMPO
   ========================= */
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

/* =========================
   📕 PRÉSTAMO
   ========================= */
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

/* =========================
   🔎 FILTROS
   ========================= */
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

  return books
})

function getCopyCount(book) {
  return book.copies?.length || 0
}
</script>

<template>
  <div class="filters-page">

    <!-- 📊 FILTROS -->
    <div class="filters-panel">

      <h2 class="panel-title">
        🔎 Panel de Búsqueda y Filtros
      </h2>

      <div class="filters-grid">

        <input v-model="search" placeholder="Título del libro..." />

        <select v-model="categoryFilter">
          <option value="">Todas</option>
          <option v-for="c in categories" :key="c">
            {{ c }}
          </option>
        </select>

        <select v-model="shelfFilter">
          <option value="">Todos</option>
          <option v-for="s in shelves" :key="s">
            {{ s }}
          </option>
        </select>

        <button @click="resetFilters">
          🔄 Limpiar
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

        <!-- 📖 HEADER LIBRO -->
        <div class="book-header">
          <h3>📖 {{ book.title }}</h3>
          <span>{{ getCopyCount(book) }} copias</span>
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

          <!-- ALERTAS -->
          <p v-if="getDueAlert(copy.dueDate)">
            {{ getDueAlert(copy.dueDate) }}
          </p>

          <!-- ESTADO -->
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

          <!-- 📚 PRESTAR -->
          <button
            v-if="copy.status === 'available'"
            @click="handleAction(book.id, copy)"
          >
            📚 Prestar
          </button>

          <!-- ↩️ DEVOLVER -->
          <button
            v-else-if="copy.status === 'borrowed'"
            @click="openReturn(book.id, copy.id)"
          >
            ↩️ Devolver
          </button>

          <!-- ➕ ➖ COPIAS -->
          <button @click="store.addCopy(book.id)">➕</button>
          <button @click="store.removeCopy(book.id, copy.id)">➖</button>

          <!-- 🔥 CONFIRMACIÓN INLINE (JUSTO AQUÍ ABAJO DE LA COPIA) -->
          <div
            v-if="activeReturn.bookId === book.id && activeReturn.copyId === copy.id"
            class="return-box"
          >

            <p>¿Se ha devuelto el libro?</p>

            <div class="return-actions">
              <button @click="confirmReturn">✔ Sí</button>
              <button @click="activeReturn = { bookId: null, copyId: null }">
                ❌ No
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- 📕 PRÉSTAMO MODAL -->
    <LoanModal
      v-if="showModal"
      @close="showModal = false"
      @submit="handleLoan"
    />

  </div>
</template>

<style scoped>
/* =========================
   🌐 CONTENEDOR GENERAL
   ========================= */
.filters-page {
  background: #f5f7fb;
  min-height: 100vh;
  padding: 18px;
  font-family: 'Inter', Arial, sans-serif;
  color: #0f172a;
}

/* =========================
   📊 PANEL
   ========================= */
.filters-panel {
  background: #ffffff;
  padding: 18px;
  border-radius: 12px;
  margin-bottom: 18px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

/* =========================
   📐 GRID FILTROS
   ========================= */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

/* =========================
   📚 LIBROS → GRID PRO
   ========================= */
.books-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  align-items: stretch;
}
/* 📦 CARD PRO */
.book-card {
  background: #ffffff;
  padding: 14px;
  border-radius: 14px;

  box-shadow: 0 4px 14px rgba(0,0,0,0.08);

  color: #0f172a;

  display: flex;
  flex-direction: column;

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.book-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

/* 📖 HEADER */
.book-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copies {
  font-size: 12px;
  color: #475569;
}

/* 📌 META */
.meta {
  font-size: 13px;
  color: #334155;
  margin: 3px 0;
}

/* 📦 COPIAS */
.copy-block {
  margin-top: 10px;
  padding: 10px;
  border-left: 3px solid #e5e7eb;
  background: #f8fafc;
  border-radius: 8px;
}

/* =========================
   🔘 BOTONES
   ========================= */
button {
  margin-top: 6px;
  padding: 8px;
  border-radius: 8px;

  border: none;
  background: #3b82f6;
  color: white;

  cursor: pointer;

  font-size: 12px;
  font-weight: 600;

  transition: 0.2s;
}

button:hover {
  background: #2563eb;
}

/* =========================
   📱 RESPONSIVE (IMPORTANTE)
   ========================= */
@media (max-width: 1100px) {
  .books-container {
    grid-template-columns: repeat(2, 1fr); /* tablet */
  }
}

@media (max-width: 700px) {
  .books-container {
    grid-template-columns: 1fr; /* móvil */
  }
}

/* =========================
   🌙 DARK MODE
   ========================= */
:global(.page.dark) .filters-page {
  background: #0b1220;
  color: #e5e7eb;
}

:global(.page.dark) .filters-panel,
:global(.page.dark) .book-card {
  background: #0b1220; /* más profundo, casi “dashboard” */
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.12);
}

:global(.page.dark) .copies {
  color: #94a3b8;
}

:global(.page.dark) .meta {
  color: #cbd5e1;
}

:global(.page.dark) .copy-block {
  background: #0f172a;
  border-left: 3px solid #334155;
}

</style>
