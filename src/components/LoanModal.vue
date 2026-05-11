<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'submit'])

const name = ref('')
const cedula = ref('')
const dueDate = ref('')

// 🚨 estado del popup de error
const showErrorModal = ref(false)
const errorMessage = ref('')

// 👤 solo letras
function onlyLetters(value) {
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
}

// 🪪 solo números + max 8
function onlyNumbers(value) {
  return value.replace(/[^0-9]/g, '').slice(0, 8)
}

// 📅 formato fecha
function formatDate(value) {
  let v = value.replace(/[^0-9]/g, '')

  if (v.length > 6) v = v.slice(0, 6)

  let result = ''

  if (v.length > 0) result += v.slice(0, 2)
  if (v.length >= 3) result += '-' + v.slice(2, 4)
  if (v.length >= 5) result += '-' + v.slice(4, 6)

  return result
}

// 🚨 abrir error modal
function openError(message) {
  errorMessage.value = message
  showErrorModal.value = true
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
  <div>

    <!-- 📦 MODAL PRINCIPAL -->
    <div class="modal">

      <div class="card">

        <h3>📦 Préstamo</h3>

        <input
          v-model="name"
          placeholder="Nombre y apellido"
          @input="name = onlyLetters(name)"
        />

        <input
          v-model="cedula"
          placeholder="Cédula (máx 8 dígitos)"
          @input="cedula = onlyNumbers(cedula)"
          maxlength="8"
        />

        <input
          v-model="dueDate"
          placeholder="DD-MM-YY"
          @input="dueDate = formatDate(dueDate)"
          maxlength="8"
        />

        <div class="actions">

          <button @click="submit">
            Confirmar
          </button>

          <button @click="$emit('close')">
            Cancelar
          </button>

        </div>

      </div>

    </div>

    <!-- 🚨 MODAL DE ERROR (VENTANA EMERGENTE) -->
    <div
      v-if="showErrorModal"
      class="error-modal"
    >

      <div class="error-card">

        <h3>⚠️ Error</h3>

        <p>{{ errorMessage }}</p>

        <button @click="showErrorModal = false">
          Entendido
        </button>

      </div>

    </div>

  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background: white;
  color: #111;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}

.actions {
  display: flex;
  justify-content: space-between;
}

/* 🚨 ERROR MODAL BASE */
.error-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-card {
  background: white;
  color: #111;
  padding: 20px;
  border-radius: 10px;
  width: 250px;
  text-align: center;
  transition: all 0.3s ease;
}

/* 🌙 MODO OSCURO AUTOMÁTICO */
@media (prefers-color-scheme: dark) {

  .card {
    background: #1e1e1e;
    color: #f5f5f5;
  }

  .error-card {
    background: #2a2a2a;
    color: #f5f5f5;
  }

  input {
    background: #333;
    color: white;
    border: 1px solid #555;
  }

  button {
    background: #444;
    color: white;
    border: none;
  }

}
</style>
