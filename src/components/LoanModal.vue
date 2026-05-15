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

/* =========================
   🌑 OVERLAY (CENTRO REAL GLOBAL)
   ========================= */
.modal-overlay {
  position: fixed;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.35); /* puedes ajustar opacidad */
  z-index: 999;

  pointer-events: auto;
}

/* =========================
   📦 MODAL CARD (CENTRADO AUTOMÁTICO)
   ========================= */
.modal-card {
  width: 320px;

  padding: 20px;
  border-radius: 14px;

  background: #ffffff;
  color: #111827;

  box-shadow: 0 12px 35px rgba(0,0,0,0.18);

  transition: 0.2s ease;
}

/* =========================
   🌙 DARK MODE (SOLO ESTÉTICA)
   ========================= */
.modal-card.dark {
  background: #0f172a;
  color: #f1f5f9;

  border: 1px solid #334155;

  box-shadow: 0 12px 35px rgba(0,0,0,0.55);
}

/* =========================
   ✏️ INPUTS
   ========================= */
.modal-card input {
  width: 100%;
  margin: 6px 0;
  padding: 9px;

  border-radius: 8px;
  border: 1px solid #d1d5db;

  box-sizing: border-box;
}

.modal-card.dark input {
  background: #111827;
  color: white;
  border: 1px solid #334155;
}

/* =========================
   🔘 ACTIONS
   ========================= */
.actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 15px;
}

/* =========================
   🚨 ERROR MODAL
   ========================= */
.error-overlay {
  position: fixed;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0,0,0,0.6);
  z-index: 1000;
}

.error-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
}

.error-card.dark {
  background: #111827;
  color: white;
  border: 1px solid #334155;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-overlay {
  animation: fadeIn 0.2s ease;
}

.modal-card {
  animation: popIn 0.25s ease;
}

button {
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

input, select {
  transition: all 0.2s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}
</style>
