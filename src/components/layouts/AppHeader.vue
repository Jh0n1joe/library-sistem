<template>
  <header class="app-header">

    <!-- 🖼️ LOGO -->
    <div class="logo-container">
      <img
        src="/logo.png"
        alt="Rafael Urdaneta"
        class="logo"
      />
    </div>

    <!-- 📚 TEXTO INSTITUCIONAL -->
    <div class="title-container">
      <h1>📚 Gestor de Libros</h1>
      <p>Biblioteca Escolar – Rafael Urdaneta</p>
    </div>

  </header>
</template>

<script setup>
// No lógica necesaria por ahora
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
</style>
