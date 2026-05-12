<template>
  <header class="app-header">

    <!-- 📚 IZQUIERDA -->
    <div class="left-section">

      <!-- 🖼️ LOGO -->
      <div class="logo-container">
        <img
          :src="logo"
          alt="Rafael Urdaneta"
          class="logo"
        />
      </div>

      <!-- 📝 TEXTO -->
      <div class="title-container">
        <h1>📚 Gestor de Libros</h1>
        <p>Biblioteca Escolar – Rafael Urdaneta</p>
      </div>

    </div>

    <!-- 🌙 DERECHA -->
    <div class="right-section">

      <button
        class="theme-button"
        @click="$emit('toggle-theme')"
      >
        {{ isDark ? '☀️ Claro' : '🌙 Oscuro' }}
      </button>

    </div>

  </header>
</template>

<script setup>

/* 🖼️ IMPORTAR LOGO */
import logo from '../../assets/logo_liceo.jpg'

defineProps({
  isDark: Boolean
})

defineEmits([
  'toggle-theme'
])
</script>

<style scoped>

/* =========================
   🏫 HEADER PRINCIPAL (MODO CLARO)
   ========================= */
.app-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #1f3a5f; /* azul institucional serio */
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}


/* =========================
   🖼️ CONTENEDOR DEL LOGO
   ========================= */
.logo-container {
  display: flex;
  align-items: center;
}


/* =========================
   🏷️ LOGO INSTITUCIONAL
   ========================= */
.logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 6px;
  background: white;
  padding: 4px;
}


/* =========================
   📝 TEXTO DEL HEADER
   ========================= */
.title-container h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.title-container p {
  margin: 0;
  font-size: 12px;
  opacity: 0.85;
}


/* =========================
   🌙 MODO OSCURO (SISTEMA GLOBAL)
   ========================= */

/* 🏫 HEADER EN DARK MODE */
:global(.page.dark) .app-header {
  background: #0f172a; /* azul oscuro institucional */
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}


/* 🖼️ LOGO EN DARK MODE (MEJOR CONTRASTE) */
:global(.page.dark) .logo {
  background: #e5e7eb;
}


/* 📝 TEXTO EN DARK MODE */
:global(.page.dark) .title-container h1 {
  color: #ffffff;
}

:global(.page.dark) .title-container p {
  color: #cbd5e1;
}

/* =========================
   📦 LADO IZQUIERDO
   ========================= */
.left-section {
  display: flex;
  align-items: center;
  gap: 12px;
}


/* =========================
   📦 LADO DERECHO
   ========================= */
.right-section {
  display: flex;
  align-items: center;
  margin-left: auto;
}


/* =========================
   🔘 BOTÓN DE TEMA
   ========================= */
.theme-button {
  background: rgba(255,255,255,0.15);
  border: none;
  color: white;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 15px;
}

/* ✨ HOVER */
.theme-button:hover {
  background: rgba(255,255,255,0.25);
}


/* 🌙 DARK MODE */
:global(.page.dark) .theme-button {
  background: #1e293b;
}

:global(.page.dark) .theme-button:hover {
  background: #334155;
}
</style>
