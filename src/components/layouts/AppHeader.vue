<template>
  <header class="app-header">

    <!-- 📚 IZQUIERDA: IDENTIDAD -->
    <div class="left-section">

      <div class="logo-container">
        <img :src="logo" alt="logo" class="logo" />
      </div>

      <div class="title-container">
        <h1 class="main-title">
          📚 Biblioteca Escolar
        </h1>

        <p class="subtitle">
          Unidad Educativa Gral. Rafael Urdaneta
        </p>
      </div>

    </div>

    <!-- 📊 CENTRO: DASHBOARD -->
    <div class="dashboard">

      <div class="kpi">
        <span class="value">{{ totalBooks }}</span>
        <span class="label">Libros</span>
      </div>

      <div class="kpi">
        <span class="value">{{ totalCopies }}</span>
        <span class="label">Copias</span>
      </div>

      <div class="kpi green">
        <span class="value">{{ availableCopies }}</span>
        <span class="label">Disponibles</span>
      </div>

      <div class="kpi yellow">
        <span class="value">{{ borrowedCopies }}</span>
        <span class="label">Prestados</span>
      </div>

      <div class="kpi red">
        <span class="value">{{ overdueCopies }}</span>
        <span class="label">Vencidos</span>
      </div>

    </div>

    <!-- 🌙 DERECHA -->
    <div class="right-section">

      <button class="theme-button" @click="$emit('toggle-theme')">
        {{ isDark ? '☀️ Claro' : '🌙 Oscuro' }}
      </button>

    </div>

  </header>
</template>

<script setup>
import logo from '../../assets/logo_liceo.jpg'

defineProps({
  isDark: Boolean,

  totalBooks: Number,
  totalCopies: Number,
  availableCopies: Number,
  borrowedCopies: Number,
  overdueCopies: Number
})

defineEmits(['toggle-theme'])
</script>

<style scoped>

/* =========================
   🧊 HEADER PRINCIPAL
   ========================= */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 22px;

  background: rgba(31, 58, 95, 0.92);
  backdrop-filter: blur(10px);

  color: white;

  min-height: 84px;
}

/* =========================
   📦 IZQUIERDA
   ========================= */
.left-section {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* =========================
   🖼️ LOGO (más sólido)
   ========================= */
.logo-container {
  width: 56px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255,255,255,0.12);
  border-radius: 12px;

  backdrop-filter: blur(6px);
}

.logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

/* =========================
   📝 TEXTO MÁS LEGIBLE
   ========================= */
.title-container {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.main-title {
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  opacity: 0.85;
}

/* =========================
   📊 DASHBOARD (SEPARADO PRO)
   ========================= */
.dashboard {
  display: flex;
  align-items: center;

  gap: 22px;          /* 🔥 separación fuerte entre KPIs */
  padding: 0 24px;    /* 🔥 aire lateral */
}

/* =========================
   📦 KPI CARD
   ========================= */
.kpi {
  text-align: center;

  padding: 10px 16px;

  min-width: 85px;

  border-radius: 14px;

  background: rgba(255,255,255,0.10);
  backdrop-filter: blur(6px);

  transition: all 0.2s ease;

  position: relative;
}

/* ✨ HOVER SUAVE */
.kpi:hover {
  transform: translateY(-3px);
  background: rgba(255,255,255,0.16);
}

/* =========================
   🔢 VALOR KPI
   ========================= */
.kpi .value {
  display: block;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.1;
}

/* =========================
   🏷️ LABEL KPI
   ========================= */
.kpi .label {
  font-size: 11px;
  opacity: 0.85;
  margin-top: 4px;
}

/* =========================
   🎨 INDICADORES MÁS VISIBLES
   ========================= */
.kpi.green {
  border-bottom: 3px solid #22c55e;
}

.kpi.yellow {
  border-bottom: 3px solid #f59e0b;
}

.kpi.red {
  border-bottom: 3px solid #ef4444;
}

/* =========================
   🌙 DERECHA
   ========================= */
.right-section {
  display: flex;
  align-items: center;
}

/* =========================
   🔘 BOTÓN TEMA
   ========================= */
.theme-button {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);

  color: white;

  padding: 9px 14px;
  border-radius: 12px;

  font-weight: 600;
  cursor: pointer;

  transition: all 0.2s ease;
}

.theme-button:hover {
  background: rgba(255,255,255,0.18);
  transform: translateY(-2px);
}

/* =========================
   🌙 DARK MODE
   ========================= */
:global(.page.dark) .app-header {
  background: rgba(15, 23, 42, 0.95);
}

:global(.page.dark) .kpi {
  background: rgba(255,255,255,0.06);
}

:global(.page.dark) .theme-button {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

:global(.page.dark) .theme-button:hover {
  background: rgba(51, 65, 85, 0.8);
}

</style>
