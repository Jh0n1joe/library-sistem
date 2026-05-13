<script setup>
import { ref } from 'vue'
import { useLibraryStore } from '../stores/library'

const store = useLibraryStore()

const title = ref('')
const editor = ref('')
const category = ref('')
const shelf = ref('')

function addBook() {
  if (
    !title.value.trim() ||
    !editor.value.trim() ||
    !category.value.trim() ||
    !shelf.value.trim()
  ) {
    alert('❌ Debes completar todos los campos')
    return
  }

  store.addBook({
    title: title.value,
    editor: editor.value,
    category: category.value,
    shelf: shelf.value,

    copies: [
      {
        id: Date.now(),
        status: 'available',
        borrower: null,
        date: null
      }
    ]
  })

  title.value = ''
  editor.value = ''
  category.value = ''
  shelf.value = ''
}
</script>

<template>
  <div class="form">

    <h2 class="title">📚 AGREGAR LIBRO</h2>

    <input v-model="title" placeholder="Título" />
    <input v-model="editor" placeholder="Editor" />
    <input v-model="category" placeholder="Categoría" />
    <input v-model="shelf" placeholder="Estante" />

    <button @click="addBook">
      Agregar libro
    </button>

  </div>
</template>

<style scoped>

/* =========================
   📦 CONTENEDOR PRINCIPAL
   ========================= */

.form {
  background: rgb(255, 255, 255);
  padding: 15px;
  border-radius: 20px;
  max-width: 100%;
}


/* =========================
   🏷️ TÍTULO
   ========================= */

.title {
  margin-bottom: 15px;
  font-size: 25px;
  color: rgb(0, 0, 0);
  transition: 0.3s;
}


/* =========================
   ✏️ INPUTS
   ========================= */

input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 3px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
}


/* =========================
   🔘 BOTÓN
   ========================= */

button {
  background: #5aa9e6;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}


/* =========================
   🌙 DARK MODE
   ========================= */

:global(.page.dark) .form {
  background: #1e293b;
}

:global(.page.dark) .title {
  color: #5aa9e6;
}

:global(.page.dark) input {
  background: #0f172a;
  color: white;
  border: 1px solid #334155;
}

:global(.page.dark) button {
  background: #3b82f6;
}

</style>
