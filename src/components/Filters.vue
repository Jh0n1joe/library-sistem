<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLibraryStore } from '../stores/library'
import LoanModal from '../components/LoanModal.vue'

const store = useLibraryStore()

const categoryFilter = ref('')
const shelfFilter = ref('')
const sortBy = ref('')
const search = ref('')

// ⏱️ reloj reactivo
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

// 📦 modal
const showModal = ref(false)
const selectedBookId = ref(null)
const selectedCopyId = ref(null)

// 📂 categorías
const categories = computed(() =>
  [...new Set(store.books.map(b => b.category))]
)

// 📦 estantes
const shelves = computed(() =>
  [...new Set(store.books.map(b => b.shelf))]
)

// 🔄 reset filtros
function resetFilters() {
  categoryFilter.value = ''
  shelfFilter.value = ''
  sortBy.value = ''
  search.value = ''
}

// 🧠 parser fecha real (meses + días válidos)
function parseCustomDate(dateStr) {
  if (!dateStr) return null

  const parts = dateStr.split('-')
  if (parts.length !== 3) return null

  let [dd, mm, yy] = parts.map(Number)

  if (mm < 1 || mm > 12) return null
  if (dd < 1 || dd > 31) return null

  const year = 2000 + yy

  const date = new Date(year, mm - 1, dd)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  ) {
    return null
  }

  return date
}

// ⏳ tiempo restante
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

// 🚨 ALERTAS DE VENCIMIENTO
function getDueAlert(dueDate) {
  const due = parseCustomDate(dueDate)
  if (!due) return null

  const now = new Date(nowTick.value)
  const diff = due - now
  const hours = diff / (1000 * 60 * 60)

  if (diff <= 0) return '🔴 VENCIDO'
  if (hours <= 24) return '🟠 VENCE EN MENOS DE 24H'
  if (hours <= 72) return '🟡 VENCE PRONTO'

  return null
}

// 📦 abrir modal
function openLoanModal(bookId, copyId) {
  selectedBookId.value = bookId
  selectedCopyId.value = copyId
  showModal.value = true
}

// 📦 recibir préstamo
function handleLoan(data) {
  store.loanCopy(
    selectedBookId.value,
    selectedCopyId.value,
    data
  )

  showModal.value = false
}

// 🔎 filtros
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

// 📦 conteo copias
function getCopyCount(book) {
  return book.copies?.length || 0
}
</script>

<template>
  <div>

    <h2>🔎 Filtros</h2>

    <input v-model="search" placeholder="Buscar libro..." />

    <select v-model="categoryFilter">
      <option value="">Todas las categorías</option>
      <option v-for="c in categories" :key="c">
        {{ c }}
      </option>
    </select>

    <select v-model="shelfFilter">
      <option value="">Todos los estantes</option>
      <option v-for="s in shelves" :key="s">
        {{ s }}
      </option>
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

    <hr />

    <!-- 📚 libros -->
    <div v-for="book in filteredBooks" :key="book.id">

      <p>
        <b>📖 {{ book.title }}</b>
        <span v-if="getCopyCount(book) > 1">
          ({{ getCopyCount(book) }})
        </span>
      </p>

      <p>✍️ {{ book.editor }}</p>
      <p>🏷️ {{ book.category }}</p>
      <p>📦 Estante: {{ book.shelf }}</p>

      <hr />

      <!-- 📦 copias -->
      <div v-for="copy in book.copies" :key="copy.id">

        <!-- 🚨 ALERTA -->
        <p v-if="getDueAlert(copy.dueDate)">
          {{ getDueAlert(copy.dueDate) }}
        </p>

        <p v-if="copy.status === 'available'">
          🟢 Disponible
        </p>

        <p v-else-if="copy.status === 'borrowed'">
          🟡 {{ copy.borrower }} ({{ copy.cedula }})
          <br />
          📅 vence: {{ copy.dueDate }}
          <br />
          ⏳ {{ getTimeRemaining(copy.dueDate) }}
        </p>

        <p v-else>
          🔴 Vencido
        </p>

        <button @click="openLoanModal(book.id, copy.id)">
          Prestar / Devolver
        </button>

        <button @click="store.addCopy(book.id)">
          ➕ Agregar
        </button>

        <button @click="store.removeCopy(book.id, copy.id)">
          ➖ Quitar
        </button>

      </div>

    </div>

    <!-- modal -->
    <LoanModal
      v-if="showModal"
      @close="showModal = false"
      @submit="handleLoan"
    />

  </div>
</template>
