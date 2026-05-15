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

  <div class="modal-overlay">

    <div
      class="modal-card"
      :class="{ dark: isDarkMode }"
    >

      <h2>📚 Registrar préstamo</h2>

      <input
        v-model="name"
        @keydown="blockNumbersInName"
        placeholder="Nombre y apellido del estudiante"
      />

      <input
        v-model="cedula"
        @keydown="blockLettersInCedula"
        maxlength="8"
        placeholder="Cédula de identidad"
      />

      <input
        type="date"
        v-model="dueDate"
        :min="today"
        :max="maxDate"
      />

      <div class="actions">

        <button class="btn-secondary" @click="$emit('close')">
          Cancelar
        </button>

        <button class="btn-primary" @click="submit">
          Confirmar
        </button>

      </div>

    </div>

  </div>

  <div v-if="showError" class="error-overlay">

    <div
      class="error-card"
      :class="{ dark: isDarkMode }"
    >

      <h3>⚠️ {{ errorMessage }}</h3>

      <button class="btn-danger" @click="showError = false">
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

  background: rgba(0, 0, 0, 0.4);
  z-index: 999;

  pointer-events: auto;
}

/* =========================
   📦 MODAL CARD (CENTRADO AUTOMÁTICO)
   ========================= */
.modal-card {
  width: 340px;

  padding: 24px;
  border-radius: 14px;

  background: #ffffff;
  color: #111827;

  box-shadow: 0 12px 35px rgba(0,0,0,0.18);

  transition: 0.2s ease;
}

.modal-card h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 700;
}

/* =========================
   🌙 DARK MODE (SOLO ESTÉTICA)
   ========================= */
.modal-card.dark {
  background: #0b1220;
  color: #f1f5f9;

  border: 1px solid #1f2937;

  box-shadow: 0 12px 35px rgba(0,0,0,0.55);
}

/* =========================
   ✏️ INPUTS
   ========================= */
.modal-card input {
  width: 100%;
  margin: 8px 0;
  padding: 10px 12px;

  border-radius: 10px;
  border: 2px solid #d1d5db;

  box-sizing: border-box;
  font-size: 14px;
}

.modal-card.dark input {
  background: #0f172a;
  color: white;
  border: 1px solid #334155;
}

/* =========================
   🔘 ACTIONS
   ========================= */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

/* =========================================================
   🔲 NUEVOS ESTILOS PROFESIONALES PARA BOTONES
   ========================================================= */
button {
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 🔵 Botón Primario (Confirmar) */
.btn-primary {
  background: #5aa9e6;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(90, 169, 230, 0.2);
}

.btn-primary:hover {
  background: #4693cd;
  box-shadow: 0 4px 12px rgba(90, 169, 230, 0.35);
}

.modal-card.dark .btn-primary {
  background: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.modal-card.dark .btn-primary:hover {
  background: #2563eb;
}

/* ⚪ Botón Secundario (Cancelar) */
.btn-secondary {
  background: transparent;
  color: #64748b;
  border: 2px solid #cbd5e1;
  padding: 8px 16px; /* Ajuste por el grosor del borde */
}

.btn-secondary:hover {
  background: #f8fafc;
  color: #334155;
  border-color: #94a3b8;
}

.modal-card.dark .btn-secondary {
  color: #94a3b8;
  border-color: #334155;
}

.modal-card.dark .btn-secondary:hover {
  background: #1e293b;
  color: #f1f5f9;
}

/* 🔴 Botón Alerta (OK Error) */
.btn-danger {
  background: #ef4444;
  color: white;
  width: 100%;
  margin-top: 15px;
}

.btn-danger:hover {
  background: #dc2626;
}

.error-card.dark .btn-danger {
  background: #ea580c;
}

.error-card.dark .btn-danger:hover {
  background: #d97706;
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
  animation: fadeIn 0.2s ease;
}

.error-card {
  background: white;
  padding: 24px;
  border-radius: 14px;
  width: 280px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  animation: popIn 0.25s ease;
}

.error-card h3 {
  margin: 0;
  font-size: 16px;
  color: #111827;
}

.error-card.dark {
  background: #0b1220;
  color: white;
  border: 1px solid #1f2937;
}

.error-card.dark h3 {
  color: #f3f4f6;
}

/* =========================
   🧠 ANIMACIONES
   ========================= */
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

input, select {
  transition: all 0.2s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}
</style>
