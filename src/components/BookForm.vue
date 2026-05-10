<script setup>
import { ref } from 'vue'
import { useLibraryStore } from '../stores/library'

const store = useLibraryStore()

const title = ref('')
const editor = ref('')
const category = ref('')
const shelf = ref('')

function addBook() {
  // 🔒 VALIDACIÓN (EVITA LIBROS VACÍOS)
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

    // 📦 COPIA INICIAL
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
  <div>
    <h2>📚 AGREGAR LIBRO</h2>

    <input v-model="title" placeholder="Título" />
    <input v-model="editor" placeholder="Editor" />
    <input v-model="category" placeholder="Categoría" />
    <input v-model="shelf" placeholder="Estante" />

    <button @click="addBook">
      Agregar libro
    </button>
  </div>
</template>
