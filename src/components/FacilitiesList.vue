<script setup>
import { ref } from 'vue'
import { useLibraryStore } from '../stores/library'
import Filters from './Filters.vue'

const store = useLibraryStore()

// 🪟 estado del modal de devolución
const showReturnModal = ref(false)

// 📦 datos seleccionados para devolución
const selectedReturn = ref({
  bookId: null,
  copyId: null
})

/**
 * 📤 recibe la acción desde Filters.vue
 */
function openReturnModal(data) {

  selectedReturn.value = data

  showReturnModal.value = true
}

/**
 * ✔ confirma devolución
 */
function confirmReturn() {

  store.returnCopy(
    selectedReturn.value.bookId,
    selectedReturn.value.copyId
  )

  showReturnModal.value = false
}
</script>

<template>

  <!-- 📚 FILTROS (hijo) -->
  <Filters />

  <!-- 🪟 MODAL DEVOLUCIÓN -->
  <div
    v-if="showReturnModal"
    class="modal-overlay"
  >

    <div class="modal-card">

      <h3>
        📦 ¿Se ha devuelto el libro?
      </h3>

      <div class="actions">

        <button
          @click="showReturnModal = false"
        >
          ❌ No
        </button>

        <button
          @click="confirmReturn"
        >
          ✔ Sí
        </button>

      </div>

    </div>

  </div>

</template>

<style scoped>

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;
}

.modal-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  min-width: 300px;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

</style>
