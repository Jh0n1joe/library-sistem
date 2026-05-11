<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'submit'])

const name = ref('')
const cedula = ref('')
const dueDate = ref('')

// 🌙 modo oscuro sistema
const isDarkMode =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

// 📅 fecha mínima (hoy)
const today = new Date().toISOString().split('T')[0]

// 📅 fecha máxima (año 9999)
const maxDate = '9999-12-31'

// 🚨 error modal
const showError = ref(false)
const errorMessage = ref('')

// 👤 solo letras
function blockNumbersInName(event) {
  const key = event.key

  if (
    key === 'Backspace' ||
    key === 'Delete' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'Tab'
  ) return

  if (/[0-9]/.test(key)) {
    event.preventDefault()
  }
}

// 🪪 solo números
function blockLettersInCedula(event) {
  const key = event.key

  if (
    key === 'Backspace' ||
    key === 'Delete' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'Tab'
  ) return

  if (!/[0-9]/.test(key)) {
    event.preventDefault()
  }
}

// ⚠️ error
function openError(message) {
  errorMessage.value = message
  showError.value = true
}

// 📦 submit
function submit() {

  if (!name.value || !cedula.value || !dueDate.value) {
    openError('Debes completar todos los campos')
    return
  }

  if (cedula.value.length < 6) {
    openError('La cédula debe tener al menos 6 dígitos')
    return
  }

  emit('submit', {
    name: name.value,
    cedula: cedula.value,
    dueDate: dueDate.value
  })

  emit('close')
}
</script>

<template>

  <!-- 🌑 MODAL OVERLAY -->
  <div class="modal-overlay">

    <div
      class="modal-card"
      :class="{ dark: isDarkMode }"
    >

      <h2>📚 Registrar préstamo</h2>

      <!-- 👤 NOMBRE -->
      <input
        v-model="name"
        @keydown="blockNumbersInName"
        placeholder="Nombre y apellido del estudiante"
      />

      <!-- 🪪 CÉDULA -->
      <input
        v-model="cedula"
        @keydown="blockLettersInCedula"
        maxlength="8"
        placeholder="Cédula de identidad"
      />

      <!-- 📅 FECHA (sin pasado + max 9999) -->
      <input
        type="date"
        v-model="dueDate"
        :min="today"
        :max="maxDate"
      />

      <div class="actions">

        <button @click="$emit('close')">
          Cancelar
        </button>

        <button @click="submit">
          Confirmar
        </button>

      </div>

    </div>

  </div>

  <!-- 🚨 ERROR MODAL -->
  <div v-if="showError" class="error-overlay">

    <div
      class="error-card"
      :class="{ dark: isDarkMode }"
    >

      <h3>⚠️ {{ errorMessage }}</h3>

      <button @click="showError = false">
        OK
      </button>

    </div>

  </div>

</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-card {
  background: #fff;
  color: #111;
  padding: 20px;
  border-radius: 12px;
  width: 320px;
  transition: 0.3s;
}

.modal-card.dark {
  background: #1e1e1e;
  color: #f1f1f1;
}

.modal-card input {
  width: 100%;
  margin: 6px 0;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-card.dark input {
  background: #2a2a2a;
  color: white;
  border: 1px solid #444;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.error-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.error-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}

.error-card.dark {
  background: #222;
  color: #fff;
}
</style>
