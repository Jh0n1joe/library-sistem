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
   📦 CONTENEDOR PRINCIPAL (LIGHT)
   ========================= */
.form {
  background: #ffffff;
  padding: 15px;
  border-radius: 20px;
  max-width: 100%;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
}

/* =========================
   🏷️ TÍTULO
   ========================= */
.title {
  margin-bottom: 15px;
  font-size: 25px;
  color: #0f172a;
  transition: 0.25s;
}

/* =========================
   ✏️ INPUTS
   ========================= */
input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 2px solid #d1d5db;
  border-radius: 10px;
  box-sizing: border-box;
  background: #ffffff;
  color: #0f172a;
  transition: 0.2s;
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
  transition: all 0.2s ease;
  transform: translateY(0);
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(1px);
  opacity: 0.9;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
/* =========================================================
   🌙 DARK MODE (CORRECTO Y REALMENTE OSCURO)
   ========================================================= */

/* 🔥 ESTE ES EL CAMBIO CLAVE */
:global(.page.dark) .form {
  background: #0b1220;   /* negro tipo dashboard */
  border: 1px solid #1f2937;
  box-shadow: 0 10px 25px rgba(0,0,0,0.6);
}

/* título en dark */
:global(.page.dark) .title {
  color: #e5e7eb;
}

/* inputs en dark */
:global(.page.dark) input {
  background: #0f172a;
  color: #e5e7eb;
  border: 1px solid #334155;
}

/* botón en dark */
:global(.page.dark) button {
  background: #3b82f6;
  color: #ffffff;
}

input, select {
  transition: all 0.2s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}

</style>
