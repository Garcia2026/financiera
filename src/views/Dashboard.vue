<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 relative overflow-hidden text-gray-200">
    <div class="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl opacity-5 -translate-x-1/2 -translate-y-1/2" aria-hidden="true"></div>
    <div class="absolute top-1/3 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-5 translate-x-1/2" aria-hidden="true"></div>
    <div class="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl opacity-5" aria-hidden="true"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div v-if="usuario" class="bg-gradient-to-r from-blue-900/90 to-blue-800/90 backdrop-blur-sm text-white py-2 px-4 rounded-lg shadow-lg shadow-blue-500/20 flex items-center gap-2 border border-blue-500/30"
             :class="store.animationsEnabled ? 'animate-[fade-in-right_0.6s_ease-out]' : ''">
          <div class="bg-blue-500/30 rounded-full p-1 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <span class="font-medium text-sm">{{ usuario }}</span>
            <p class="text-xs text-blue-200/80">{{ ultimoAcceso }}</p>
          </div>
        </div>

        <h2 class="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 text-center glow-emerald"
            :class="store.animationsEnabled ? 'animate-[fade-in-down_0.6s_ease-out]' : ''">
          Dashboard Empresarial
        </h2>

        <div class="bg-gradient-to-r from-emerald-900/80 to-emerald-800/80 backdrop-blur-md text-white py-2 px-4 rounded-lg shadow-lg shadow-emerald-500/20 border border-emerald-500/30"
             :class="store.animationsEnabled ? 'animate-[fade-in-left_0.6s_ease-out]' : ''">
          <div class="flex flex-col items-end">
            <div class="text-xs opacity-90 font-medium">{{ currentDate }}</div>
            <div class="font-mono font-bold text-base leading-tight tracking-wider text-emerald-300">{{ currentTime }}</div>
          </div>
        </div>
      </div>

      <div v-if="alertas.length > 0" class="mb-8 animate-[fade-in_0.8s_ease-out]">
        </div>

      <div class="glass-container rounded-xl shadow-lg p-4 mb-6 animate-[fade-in_0.7s_ease-out]">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex flex-wrap gap-3 items-center">
            <div class="relative">
              <select v-model="filtroPeriodo" @change="actualizarDatos" class="input-primary select-input pr-10 pl-10">
                <option value="hoy">Hoy</option>
                <option value="semana">Esta semana</option>
                <option value="mes">Este mes</option>
                <option value="trimestre">Este trimestre</option>
                <option value="anual">Este año</option>
              </select>
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>

            <div class="relative">
              <select v-model="vistaSeleccionada" @change="actualizarDatosVisuales" class="input-primary select-input pr-10 pl-10">
                <option value="general">Vista General</option>
                <option value="financiera">Vista Financiera</option>
                <option value="operativa">Vista Operativa</option>
                <option value="detallada">Vista Detallada</option>
              </select>
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z" /></svg>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button @click="actualizarDatos" :disabled="isLoading" class="btn-secondary tech-btn relative overflow-hidden flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="z-10 relative flex items-center">
                  <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2.088-2.088z"></path></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {{ isLoading ? 'Cargando...' : 'Actualizar' }}
              </span>
              <span class="tech-btn-bg absolute inset-0"></span>
            </button>
            <button @click="exportarDatos" class="btn-secondary tech-btn relative overflow-hidden flex-shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar
            </button>
          </div>
        </div>
      </div>
  <QuickActions :actions="quickActions" class="mt-4" />

  <div v-if="vistaSeleccionada === 'general' && !isLoading">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
      <SummaryCard title="Tiendas" :value="totalTiendas" value-class="text-emerald-400" border-class="border-emerald-500" icon-bg-class="bg-emerald-900/30 border border-emerald-500/20" :delay="0">
        <template #default>
          <div v-if="filtroPeriodo !== 'anual'" class="flex items-center mt-1 text-xs">
            <div class="flex items-center" :class="crecimientoTiendas >= 0 ? 'text-green-400' : 'text-red-400'">
              <svg v-if="crecimientoTiendas >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              {{ Math.abs(crecimientoTiendas) }}% vs período ant.
            </div>
          </div>
        </template>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </template>
        <template #footer>
          <router-link to="/tiendas" class="mt-3 block text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 w-max group">
            <span>Ver tiendas</span>
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </router-link>
        </template>
      </SummaryCard>

      <SummaryCard title="Servicios Pendientes" :value="serviciosPendientes" value-class="text-amber-400" border-class="border-amber-500" icon-bg-class="bg-amber-900/30 border border-amber-500/20" :delay="0.1">
        <template #default>
          <div class="flex items-center justify-between mt-1 text-xs w-full">
            <span class="text-amber-400/80">{{ porcentajePendientes }}% del total</span>
          </div>
          <div class="mt-3 w-full bg-gray-700 rounded-full h-1.5">
            <div class="bg-amber-500 h-1.5 rounded-full" :style="{ width: porcentajePendientes + '%' }"></div>
          </div>
        </template>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </template>
      </SummaryCard>

      <SummaryCard title="Por cobrar" :value="formatearDinero(montoPendiente)" value-class="text-blue-400" border-class="border-blue-500" icon-bg-class="bg-blue-900/30 border border-blue-500/20" :delay="0.2">
        <template #default>
          <div v-if="filtroPeriodo !== 'anual'" class="flex items-center mt-1 text-xs">
            <div class="flex items-center" :class="crecimientoPorCobrar >= 0 ? 'text-green-400' : 'text-red-400'">
              <svg v-if="crecimientoPorCobrar >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              {{ Math.abs(crecimientoPorCobrar) }}% vs período ant.
            </div>
          </div>
        </template>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </template>
        <template #footer>
          <router-link to="/finanzas" class="mt-3 block text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 w-max group">
            <span>Ver finanzas</span>
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </router-link>
        </template>
      </SummaryCard>

      <SummaryCard title="Ingresos (Tiendas Pagadas)" :value="formatearDinero(ingresosTotales)" value-class="text-purple-400" border-class="border-purple-500" icon-bg-class="bg-purple-900/30 border border-purple-500/20" :delay="0.3">
        <template #default>
          <div v-if="filtroPeriodo !== 'anual'" class="flex items-center mt-1 text-xs">
            <div class="flex items-center" :class="crecimientoIngresos >= 0 ? 'text-green-400' : 'text-red-400'">
              <svg v-if="crecimientoIngresos >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              {{ Math.abs(crecimientoIngresos) }}% vs período ant.
            </div>
          </div>
        </template>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </template>
        <template #footer>
          <router-link to="/finanzas" class="mt-3 block text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 w-max group">
            <span>Ver finanzas</span>
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </router-link>
        </template>
      </SummaryCard>

      <SummaryCard title="Gastos" :value="formatearDinero(gastosTotales)" value-class="text-red-400" border-class="border-red-500" icon-bg-class="bg-red-900/30 border border-red-500/20" :delay="0.4">
        <template #default>
          <div v-if="filtroPeriodo !== 'anual'" class="flex items-center mt-1 text-xs">
            <div class="flex items-center" :class="crecimientoGastos >= 0 ? 'text-red-400' : 'text-green-400'">
              <svg v-if="crecimientoGastos >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              {{ Math.abs(crecimientoGastos) }}% vs período ant.
            </div>
          </div>
        </template>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        </template>
        <template #footer>
          <router-link to="/finanzas" class="mt-3 block text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 w-max group">
            <span>Ver finanzas</span>
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </router-link>
        </template>
      </SummaryCard>

      <SummaryCard title="Beneficio Neto" :value="formatearDinero(beneficioNeto)" value-class="text-teal-400" border-class="border-teal-500" icon-bg-class="bg-teal-900/30 border border-teal-500/20" :delay="0.5">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2 1.343 2 3 2m0-8V7m0 1v8m0 0v1m0-1c1.11 0 2.08-.402 2.599-1M3 12a9 9 0 0118 0" /></svg>
        </template>
        <template #footer>
          <router-link to="/finanzas" class="mt-3 block text-sm text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 w-max group">
            <span>Ver finanzas</span>
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </router-link>
        </template>
      </SummaryCard>
    </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg:col-span-2 chart-container animate-[fade-in-up_0.6s_ease-out]" style="animation-delay: 0.1s;">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
              <h3 class="chart-title">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                Flujo de Caja ({{ nombrePeriodoVistaCashFlow }})
              </h3>
              <div class="flex space-x-2 flex-shrink-0">
                <button @click="cambiarVistaCashFlow('diario')" class="chart-tab-btn" :class="{ 'active': vistaCashFlow === 'diario' }">Diario</button>
                <button @click="cambiarVistaCashFlow('semanal')" class="chart-tab-btn" :class="{ 'active': vistaCashFlow === 'semanal' }">Semanal</button>
                <button @click="cambiarVistaCashFlow('mensual')" class="chart-tab-btn" :class="{ 'active': vistaCashFlow === 'mensual' }">Mensual</button>
              </div>
            </div>
            <div class="chart-wrapper">
              <div class="h-72 md:h-96 w-full"> <canvas ref="cashFlowChart"></canvas> </div>
            </div>
          </div>

          <div class="chart-container animate-[fade-in-up_0.6s_ease-out]" style="animation-delay: 0.2s;">
            <h3 class="chart-title flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Métricas Clave
            </h3>
            <div class="flex flex-col space-y-4 p-2">
              <div class="metric-card">
                <div class="flex justify-between mb-2">
                  <span class="text-sm font-medium text-gray-400">Margen de Ganancia</span>
                  <span class="text-sm font-semibold" :class="margenGanancia >= 40 ? 'text-emerald-400' : margenGanancia >= 20 ? 'text-blue-400' : margenGanancia >= 0 ? 'text-yellow-400' : 'text-red-400'">{{ margenGanancia.toFixed(1) }}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div class="h-2 rounded-full transition-all duration-500 ease-out"
                        :class="margenGanancia >= 40 ? 'bg-emerald-500' : margenGanancia >= 20 ? 'bg-blue-500' : margenGanancia >= 0 ? 'bg-yellow-500' : 'bg-red-500'"
                        :style="{ width: `${Math.min(Math.max(0, margenGanancia), 100)}%` }">
                  </div>
                </div>
              </div>
              <div class="metric-card">
                <div class="flex justify-between mb-2"> <span class="text-sm font-medium text-gray-400">Tasa de Cumplimiento (Ej.)</span> <span class="text-sm font-semibold text-gray-500">N/D</span> </div>
                <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-gray-500 h-2 rounded-full" style="width: 0%"></div></div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <section class="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-700/50 transform transition-all duration-500 hover:bg-gray-800/60 hover:shadow-emerald-500/5 animate-[fade-in-up_0.6s_ease-out]">
            <header class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                Servicios Recientes
              </h3>
              <router-link to="/tiendas" class="text-sm bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1 group border border-emerald-500/20">
                <span>Ver todos</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </router-link>
            </header>
          </section>
<DataTable :headers="['Cliente','Marca','Fecha','Estado Proceso']" :items="tiendasRecientes" :is-loading="isLoading">
  <template #empty>
    <div class="flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      No hay servicios recientes para mostrar.
    </div>
  </template>
  <template #rows="{ items }">
    <tr v-for="(tienda, index) in items" :key="tienda.id" class="hover:bg-gray-700/30 transition-colors cursor-pointer animate-[fade-in_0.6s_ease-out]" :style="{ animationDelay: `${0.05 * index}s` }" @click="verDetallesTienda(tienda.id)">
      <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-200">{{ tienda.nombre }}</td>
      <td class="px-4 py-3 whitespace-nowrap text-gray-300">{{ tienda.marca }}</td>
      <td class="hidden md:table-cell px-4 py-3 whitespace-nowrap text-gray-300">{{ formatearFecha(tienda.fechaCreacion) }}</td>
      <td class="px-4 py-3 whitespace-nowrap">
        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getEstadoProcesoClass(tienda.estadoProceso)">
          {{ tienda.estadoProceso || 'N/A' }}
        </span>
      </td>
    </tr>
  </template>
</DataTable>

          <section class="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-700/50 transform transition-all duration-500 hover:bg-gray-800/60 hover:shadow-blue-500/5 animate-[fade-in-up_0.6s_ease-out]" style="animation-delay: 0.2s">
            <header class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-blue-400 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Cobros Próximos / Vencidos
              </h3>
                <router-link to="/finanzas" class="text-sm bg-blue-900/30 hover:bg-blue-800/40 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1 group border border-blue-500/20">
                <span>Ver todos</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </router-link>
            </header>
          </section>
<DataTable :headers="['Cliente','Monto','Fecha Venc. (Estimada)','Estado Cobro']" :items="cobrosProximos" :is-loading="isLoading">
  <template #empty>
    <div class="flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
      No hay cobros próximos o vencidos para mostrar.
    </div>
  </template>
  <template #rows="{ items }">
    <tr v-for="(cobro, index) in items" :key="cobro.id" class="hover:bg-gray-700/30 transition-colors cursor-pointer animate-[fade-in_0.6s_ease-out]" :style="{ animationDelay: `${0.05 * index}s` }" @click="verDetallesCobro(cobro.tiendaId)">
      <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-200">{{ cobro.cliente }}</td>
      <td class="px-4 py-3 whitespace-nowrap text-gray-300">{{ formatearDinero(cobro.monto) }}</td>
      <td class="px-4 py-3 whitespace-nowrap text-gray-300">{{ formatearFecha(cobro.fechaVencimiento) }}</td>
      <td class="px-4 py-3 whitespace-nowrap">
        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getCobroStatusClass(cobro.estadoCobro)">
          {{ cobro.estadoCobro }}
        </span>
      </td>
    </tr>
  </template>
</DataTable>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
        <p class="ml-4 text-emerald-400 text-lg">Cargando datos del dashboard...</p>
      </div>

      <div v-if="vistaSeleccionada !== 'general' && !isLoading" class="animate-[fade-in_0.8s_ease-out]">
        <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 mb-6">
            Contenido de Vista {{ vistaSeleccionada.charAt(0).toUpperCase() + vistaSeleccionada.slice(1) }}
        </h3>
        <div class="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-700/50">
            <p class="text-gray-300">Aquí se mostraría el contenido específico para la vista "{{ vistaSeleccionada }}".</p>
            <p class="text-gray-300 mt-2">Por ejemplo, la vista <router-link to="/finanzas" class="text-cyan-400 hover:underline">Financiera Detallada</router-link> o la <router-link to="/tiendas" class="text-emerald-400 hover:underline">Gestión de Tiendas</router-link> ya existen como módulos separados.</p>
            <p class="mt-4 text-sm text-gray-400">Este dashboard principal consolida los indicadores clave.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDashboardOptions } from "../composables/useDashboard"
import { useAppStore } from "../stores"
import SummaryCard from "../components/SummaryCard.vue"
import DataTable from "../components/DataTable.vue"
import QuickActions from "../components/QuickActions.vue"
import router from "../router"

export default {
  name: "EnterpriseDashboard",
  components: { SummaryCard, DataTable, QuickActions },
  setup() {
    const store = useAppStore();
    const quickActions = [
      {
        label: 'Nueva Tienda',
        icon: {
          template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>`
        },
        onClick: () => { router.push('/tiendas'); }
      },
      {
        label: 'Registrar Cobro',
        icon: {
          template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-3-3v6m7 2a2 2 0 012 2H5a2 2 0 012-2h12z" /></svg>`
        },
        onClick: () => { router.push('/cobros'); }
      },
      {
        label: 'Gestión de Cotizaciones',
        icon: {
          template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
        },
        onClick: () => { router.push('/cotizaciones'); }
      }
    ];
    return { store, quickActions };
  },
  ...useDashboardOptions()
}
</script>

<style scoped>
/* Estilos sin cambios significativos, solo asegúrate que las clases de Tailwind y las personalizadas estén definidas */
.glass-container {
  background-color: rgba(46, 53, 64, 0.3); /* gray-800/30 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Compatibilidad con Safari */
  border: 1px solid rgba(75, 85, 99, 0.5); /* gray-600/50 */
}

.input-primary {
  background-color: rgba(31, 41, 55, 0.6); /* gray-800/60 */
  border: 1px solid rgba(75, 85, 99, 0.5); /* gray-600/50 */
  color: #D1D5DB; /* gray-300 */
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  appearance: none; 
}

.input-primary:focus {
  outline: none;
  border-color: #10B981; /* emerald-500 */
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3); /* emerald-500/30 */
  background-color: rgba(31, 41, 55, 0.8); /* gray-800/80 */
}

.select-input {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e"); /* Color del icono ajustado a gray-400 */
    background-repeat: no-repeat;
    background-position: right 0.75rem center; /* Ajuste de posición */
    background-size: 1.25em 1.25em; /* Ajuste de tamaño */
    padding-right: 2.5rem; /* Espacio para el icono */
}


.btn-secondary {
  background-color: rgba(55, 65, 81, 0.6); /* gray-700/60 */
  border: 1px solid rgba(75, 85, 99, 0.5); /* gray-600/50 */
  color: #D1D5DB; /* gray-300 */
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.btn-secondary:hover:not(:disabled) {
  background-color: rgba(55, 65, 81, 0.8); /* gray-700/80 */
  border-color: #10B981; /* emerald-500 */
  color: #10B981; /* emerald-500 */
}

.tech-btn .tech-btn-bg {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
}
.tech-btn:hover:not(:disabled) .tech-btn-bg { opacity: 1; }


.summary-card {
  background-color: rgba(46, 53, 64, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-left-width: 4px; 
  border-left-style: solid;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0; 
}
.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.08);
}


.chart-container {
   background-color: rgba(46, 53, 64, 0.3);
   backdrop-filter: blur(8px);
   -webkit-backdrop-filter: blur(8px);
   border-radius: 1rem;
   padding: 1.5rem;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
   border: 1px solid rgba(75, 85, 99, 0.5);
}
.chart-title {
    font-size: 1.125rem; /* text-lg */
    font-weight: 600; /* font-semibold */
    color: #34D399; /* emerald-400 */
    display: flex;
    align-items: center;
}
.chart-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}
.chart-tab-btn {
    padding: 0.3rem 0.75rem;
    font-size: 0.875rem; /* text-sm */
    border-radius: 9999px; /* rounded-full */
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;
    color: #9CA3AF; /* gray-400 */
    background-color: rgba(55, 65, 81, 0.5); /* gray-700/50 */
}
.chart-tab-btn:hover {
    color: #D1D5DB; /* gray-300 */
    background-color: rgba(55, 65, 81, 0.7); /* gray-700/70 */
}
.chart-tab-btn.active {
   background-color: rgba(16, 185, 129, 0.3); /* emerald-500/30 */
   color: #34D399; /* emerald-400 */
   border-color: rgba(16, 185, 129, 0.5); /* emerald-500/50 */
}
.metric-card {
    padding: 0.75rem 1rem;
    background-color: rgba(55, 65, 81, 0.4); /* gray-700/40 */
    border-radius: 0.5rem;
    border: 1px solid rgba(75, 85, 99, 0.4); /* gray-600/40 */
}

/* Keyframes para animaciones */
@keyframes fade-in-right { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fade-in-left { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

.animate-\[fade-in-right_0\.6s_ease-out\] { animation: fade-in-right 0.6s ease-out forwards; }
.animate-\[fade-in-left_0\.6s_ease-out\] { animation: fade-in-left 0.6s ease-out forwards; }
.animate-\[fade-in-down_0\.6s_ease-out\] { animation: fade-in-down 0.6s ease-out forwards; }
.animate-\[fade-in-up_0\.6s_ease-out\] { animation: fade-in-up 0.6s ease-out forwards; opacity: 0; } /* Ensure opacity starts at 0 for forwards fill */
.animate-\[fade-in_0\.7s_ease-out\] { animation: fade-in 0.7s ease-out forwards; opacity: 0; }
.animate-\[fade-in_0\.8s_ease-out\] { animation: fade-in 0.8s ease-out forwards; opacity: 0; }
/* No necesitas la última .animate-[fade-in_0.6s_ease-out] ya que es igual a fade-in-up o fade-in general */


.glow-emerald {
    text-shadow: 0 0 5px rgba(52, 211, 153, 0.5), 0 0 10px rgba(52, 211, 153, 0.4), 0 0 15px rgba(52, 211, 153, 0.3);
}

</style>
