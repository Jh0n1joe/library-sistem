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
.app-header {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 14px 20px;
  background: #1f3a5f; /* azul institucional serio */
  color: white;

  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 6px;
  background: white;
  padding: 4px;
}

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
</style>
