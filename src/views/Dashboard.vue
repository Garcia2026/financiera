<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 relative overflow-hidden text-gray-200">
    <div class="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl opacity-5 -translate-x-1/2 -translate-y-1/2" aria-hidden="true"></div>
    <div class="absolute top-1/3 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-5 translate-x-1/2" aria-hidden="true"></div>
    <div class="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl opacity-5" aria-hidden="true"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div v-if="usuario" class="bg-gradient-to-r from-blue-900/90 to-blue-800/90 backdrop-blur-sm text-white py-2 px-4 rounded-lg shadow-lg shadow-blue-500/20 flex items-center gap-2 border border-blue-500/30 animate-[fade-in-right_0.6s_ease-out]">
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

        <h2 class="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 text-center glow-emerald animate-[fade-in-down_0.6s_ease-out]">
          Dashboard Empresarial
        </h2>

        <div class="bg-gradient-to-r from-emerald-900/80 to-emerald-800/80 backdrop-blur-md text-white py-2 px-4 rounded-lg shadow-lg shadow-emerald-500/20 border border-emerald-500/30 animate-[fade-in-left_0.6s_ease-out]">
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

      <div v-if="vistaSeleccionada === 'general' && !isLoading">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div class="summary-card border-emerald-500" style="animation-delay: 0s">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-medium text-gray-400 mb-1">Tiendas</h3>
                <p class="text-3xl font-bold text-emerald-400">{{ totalTiendas }}</p>
                <div v-if="filtroPeriodo !== 'anual'" class="flex items-center mt-1 text-xs">
                  <div class="flex items-center" :class="crecimientoTiendas >= 0 ? 'text-green-400' : 'text-red-400'">
                    <svg v-if="crecimientoTiendas >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    {{ Math.abs(crecimientoTiendas) }}% vs período ant.
                  </div>
                </div>
              </div>
              <div class="p-3 bg-emerald-900/30 rounded-lg shadow-inner flex items-center justify-center border border-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
            </div>
            <router-link to="/tiendas" class="mt-3 block text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 w-max group">
              <span>Ver tiendas</span>
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </router-link>
          </div>

          <div class="summary-card border-amber-500" style="animation-delay: 0.1s">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-medium text-gray-400 mb-1">Servicios Pendientes</h3>
                <p class="text-3xl font-bold text-amber-400">{{ serviciosPendientes }}</p>
                  <div class="flex items-center justify-between mt-1 text-xs w-full">
                  <span class="text-amber-400/80">{{ porcentajePendientes }}% del total</span>
                </div>
              </div>
              <div class="p-3 bg-amber-900/30 rounded-lg shadow-inner flex items-center justify-center border border-amber-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div class="mt-3 w-full bg-gray-700 rounded-full h-1.5">
              <div class="bg-amber-500 h-1.5 rounded-full" :style="{ width: porcentajePendientes + '%' }"></div>
            </div>
          </div>

          <div class="summary-card border-blue-500" style="animation-delay: 0.2s">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-medium text-gray-400 mb-1">Por cobrar</h3>
                <p class="text-3xl font-bold text-blue-400">{{ formatearDinero(montoPendiente) }}</p>
                  <div v-if="filtroPeriodo !== 'anual'" class="flex items-center mt-1 text-xs">
                    <div class="flex items-center" :class="crecimientoPorCobrar >= 0 ? 'text-green-400' : 'text-red-400'">
                    <svg v-if="crecimientoPorCobrar >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    {{ Math.abs(crecimientoPorCobrar) }}% vs período ant.
                  </div>
                </div>
              </div>
              <div class="p-3 bg-blue-900/30 rounded-lg shadow-inner flex items-center justify-center border border-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </div>
              <router-link to="/finanzas" class="mt-3 block text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 w-max group">
              <span>Ver finanzas</span>
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </router-link>
          </div>

          <div class="summary-card border-purple-500" style="animation-delay: 0.3s">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-medium text-gray-400 mb-1">Ingresos (Tiendas Pagadas)</h3>
                <p class="text-3xl font-bold text-purple-400">{{ formatearDinero(ingresosTotales) }}</p>
                <div v-if="filtroPeriodo !== 'anual'" class="flex items-center mt-1 text-xs">
                  <div class="flex items-center" :class="crecimientoIngresos >= 0 ? 'text-green-400' : 'text-red-400'">
                    <svg v-if="crecimientoIngresos >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    {{ Math.abs(crecimientoIngresos) }}% vs período ant.
                  </div>
                </div>
              </div>
              <div class="p-3 bg-purple-900/30 rounded-lg shadow-inner flex items-center justify-center border border-purple-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <router-link to="/finanzas" class="mt-3 block text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 w-max group">
              <span>Ver finanzas</span>
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </router-link>
          </div>

          <div class="summary-card border-red-500" style="animation-delay: 0.4s">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-medium text-gray-400 mb-1">Gastos</h3>
                <p class="text-3xl font-bold text-red-400">{{ formatearDinero(gastosTotales) }}</p>
                  <div v-if="filtroPeriodo !== 'anual'" class="flex items-center mt-1 text-xs">
                    <div class="flex items-center" :class="crecimientoGastos >= 0 ? 'text-red-400' : 'text-green-400'"> <svg v-if="crecimientoGastos >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    {{ Math.abs(crecimientoGastos) }}% vs período ant.
                  </div>
                </div>
              </div>
              <div class="p-3 bg-red-900/30 rounded-lg shadow-inner flex items-center justify-center border border-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
            </div>
              <router-link to="/finanzas" class="mt-3 block text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 w-max group">
              <span>Ver finanzas</span>
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </router-link>
          </div>
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
            <div class="overflow-hidden rounded-xl border border-gray-700/50 shadow-inner shadow-emerald-900/10">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-700/50">
                  <thead class="bg-gray-800/60">
                    <tr>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marca</th>
                      <th scope="col" class="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado Proceso</th>
                    </tr>
                  </thead>
                  <tbody class="bg-gray-800/30 divide-y divide-gray-700/30">
                    <tr v-if="tiendasRecientes.length === 0 && !isLoading">
                      <td colspan="4" class="px-4 py-8 text-center text-gray-400">
                        <div class="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          No hay servicios recientes para mostrar.
                        </div>
                      </td>
                    </tr>
                    <tr v-for="(tienda, index) in tiendasRecientes" :key="tienda.id"
                        class="hover:bg-gray-700/30 transition-colors cursor-pointer animate-[fade-in_0.6s_ease-out]"
                        :style="{ animationDelay: `${0.05 * index}s` }"
                        @click="verDetallesTienda(tienda.id)">
                      <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-200">{{ tienda.nombre }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-gray-300">{{ tienda.marca }}</td>
                      <td class="hidden md:table-cell px-4 py-3 whitespace-nowrap text-gray-300">{{ formatearFecha(tienda.fechaCreacion) }}</td>
                      <td class="px-4 py-3 whitespace-nowrap">
                          <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                                :class="getEstadoProcesoClass(tienda.estadoProceso)">
                            {{ tienda.estadoProceso || 'N/A' }}
                          </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

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
            <div class="overflow-hidden rounded-xl border border-gray-700/50 shadow-inner shadow-blue-900/10">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-700/50">
                  <thead class="bg-gray-800/60">
                    <tr>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Monto</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha Venc. (Estimada)</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado Cobro</th>
                    </tr>
                  </thead>
                  <tbody class="bg-gray-800/30 divide-y divide-gray-700/30">
                    <tr v-if="cobrosProximos.length === 0 && !isLoading">
                      <td colspan="4" class="px-4 py-8 text-center text-gray-400">
                        <div class="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                          No hay cobros próximos o vencidos para mostrar.
                        </div>
                      </td>
                    </tr>
                    <tr v-for="(cobro, index) in cobrosProximos" :key="cobro.id"
                        class="hover:bg-gray-700/30 transition-colors cursor-pointer animate-[fade-in_0.6s_ease-out]"
                        :style="{ animationDelay: `${0.05 * index}s` }"
                        @click="verDetallesCobro(cobro.tiendaId)"> <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-200">{{ cobro.cliente }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-gray-300">{{ formatearDinero(cobro.monto) }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-gray-300">{{ formatearFecha(cobro.fechaVencimiento) }}</td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                                :class="getCobroStatusClass(cobro.estadoCobro)">
                          {{ cobro.estadoCobro }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
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
import Chart from 'chart.js/auto';
import { db } from '../firebase/firebase'; // Asegúrate que la ruta a tu config de Firebase sea correcta
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

export default {
  name: 'EnterpriseDashboard',
  data() {
    return {
      usuario: 'Usuario Principal', // Puedes obtenerlo de tu sistema de auth
      ultimoAcceso: `Último acceso: ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      currentDate: '',
      currentTime: '',
      timer: null,
      alertas: [
        // { id: 1, mensaje: 'Nuevo servicio pendiente de asignación.' }, // Ejemplos, podrías cargarlas dinámicamente
      ],
      filtroPeriodo: 'mes', // 'hoy', 'semana', 'mes', 'trimestre', 'anual'
      vistaSeleccionada: 'general',
      isLoading: false,

      // --- Datos del Dashboard (inicializados) ---
      totalTiendas: 0,
      crecimientoTiendas: 0, // %
      serviciosPendientes: 0,
      totalServiciosPeriodo: 0, // Para calcular % pendientes del período
      montoPendiente: 0,
      crecimientoPorCobrar: 0, // %
      ingresosTotales: 0,
      crecimientoIngresos: 0, // %
      gastosTotales: 0,
      crecimientoGastos: 0, // %

      // Para el gráfico de Flujo de Caja
      cashFlowData: {
        diario: { labels: [], ingresos: [], gastos: [] },
        semanal: { labels: [], ingresos: [], gastos: [] },
        mensual: { labels: [], ingresos: [], gastos: [] },
      },
      vistaCashFlow: 'mensual', // 'diario', 'semanal', 'mensual'
      cashFlowChartInstance: null,

      tiendasRecientes: [], // Array de objetos tienda
      cobrosProximos: [], // Array de objetos cobro

      // Métricas Clave (ejemplos, algunas necesitarán cálculo más complejo)
      margenGanancia: 0, // %
      // ... otros placeholders de métricas
    };
  },
  computed: {
    nombrePeriodo() {
      const periodos = { hoy: 'Hoy', semana: 'Esta Semana', mes: 'Este Mes', trimestre: 'Este Trimestre', anual: 'Este Año' };
      return periodos[this.filtroPeriodo] || 'Período Desconocido';
    },
    nombrePeriodoVistaCashFlow() {
        const periodos = { hoy: 'Hoy', semana: 'Esta Semana', mes: 'Este Mes', trimestre: 'Este Trimestre', anual: 'Este Año' };
        if (this.vistaCashFlow === 'diario') return 'Últimos 30 días'; // Ajustado para reflejar la lógica
        if (this.vistaCashFlow === 'semanal') return 'Últimas 12 semanas'; // Ajustado para reflejar la lógica
        // Para mensual, si el filtro es 'mes', 'semana', 'hoy', muestra "Este Mes (del filtro)"
        // Si el filtro es 'trimestre', muestra los 3 meses del trimestre
        // Si el filtro es 'anual', muestra los 12 meses del año
        if (this.vistaCashFlow === 'mensual') {
            if (['mes', 'semana', 'hoy'].includes(this.filtroPeriodo)) return `Mes de ${periodos[this.filtroPeriodo]}`;
            if (this.filtroPeriodo === 'trimestre') return `Trimestre Actual`; // O podrías listar los meses
            if (this.filtroPeriodo === 'anual') return `Año ${new Date().getFullYear()}`; // O el año del filtro
        }
        return periodos[this.filtroPeriodo];
    },
    porcentajePendientes() {
      if (this.totalServiciosPeriodo === 0) return 0;
      return ((this.serviciosPendientes / this.totalServiciosPeriodo) * 100).toFixed(0);
    },
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      this.currentTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    },
    formatearDinero(cantidad) {
      const numero = Number(cantidad) || 0;
      return numero.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    formatearFecha(fechaInput, conHora = false) {
        if (!fechaInput) return 'N/A';
        let fecha;
        if (fechaInput instanceof Timestamp) {
            fecha = fechaInput.toDate();
        } else if (typeof fechaInput === 'string' || fechaInput instanceof Date) {
            fecha = new Date(fechaInput);
        } else {
            console.warn("FormatearFecha: Tipo de fecha no reconocido", fechaInput);
            return 'Fecha Inválida';
        }

        if (isNaN(fecha.getTime())) {
            console.warn("FormatearFecha: Fecha inválida después de la conversión", fechaInput);
            return 'Fecha Inválida';
        }

        const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
        if (conHora) {
            opciones.hour = '2-digit';
            opciones.minute = '2-digit';
        }
        return fecha.toLocaleDateString('es-ES', opciones);
    },

    getDateRangeForFilter(periodoKey, esAnterior = false) {
        let fechaInicio;
        let fechaFin;
        const hoy = new Date();
        let anoActual = hoy.getFullYear();
        let mesActual = hoy.getMonth(); // 0-11
        let diaActual = hoy.getDate();

        if (esAnterior) {
            switch (periodoKey) {
                case 'hoy': {
                    const ayer = new Date(hoy);
                    ayer.setDate(hoy.getDate() - 1);
                    anoActual = ayer.getFullYear(); mesActual = ayer.getMonth(); diaActual = ayer.getDate();
                    break;
                }
                case 'semana': {
                    const semanaPasadaInicio = new Date(hoy);
                    semanaPasadaInicio.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1) - 7); // Lunes de la semana pasada
                    anoActual = semanaPasadaInicio.getFullYear(); mesActual = semanaPasadaInicio.getMonth(); diaActual = semanaPasadaInicio.getDate();
                    // Para el rango anterior de 'semana', queremos la semana completa anterior.
                    // La lógica de abajo para 'semana' construirá el rango correcto a partir de este 'diaActual' ajustado.
                    break;
                }
                case 'mes':
                    mesActual -= 1;
                    if (mesActual < 0) { mesActual = 11; anoActual -= 1; }
                    break;
                case 'trimestre':
                    mesActual -= 3;
                    if (mesActual < 0) { mesActual += 12; anoActual -= 1; }
                    break;
                case 'anual':
                    anoActual -= 1;
                    break;
            }
        }

        switch (periodoKey) {
            case 'hoy':
                fechaInicio = new Date(anoActual, mesActual, diaActual, 0, 0, 0, 0);
                fechaFin = new Date(anoActual, mesActual, diaActual, 23, 59, 59, 999);
                break;
            case 'semana': {
                // Para la semana actual/anterior, diaActual ya está ajustado si esAnterior es true
                const d = new Date(anoActual, mesActual, diaActual);
                const primerDiaNum = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1); // Lunes
                fechaInicio = new Date(d.getFullYear(), d.getMonth(), primerDiaNum, 0, 0, 0, 0);
                fechaFin = new Date(d.getFullYear(), d.getMonth(), primerDiaNum + 6, 23, 59, 59, 999); // Domingo
                break;
            }
            case 'mes':
                fechaInicio = new Date(anoActual, mesActual, 1, 0, 0, 0, 0);
                fechaFin = new Date(anoActual, mesActual + 1, 0, 23, 59, 59, 999);
                break;
            case 'trimestre': {
                const mesInicioTrimestre = Math.floor(mesActual / 3) * 3;
                fechaInicio = new Date(anoActual, mesInicioTrimestre, 1, 0, 0, 0, 0);
                fechaFin = new Date(anoActual, mesInicioTrimestre + 3, 0, 23, 59, 59, 999);
                break;
            }
            case 'anual':
                fechaInicio = new Date(anoActual, 0, 1, 0, 0, 0, 0);
                fechaFin = new Date(anoActual, 11, 31, 23, 59, 59, 999);
                break;
            default:
                fechaInicio = new Date(anoActual, mesActual, 1, 0, 0, 0, 0);
                fechaFin = new Date(anoActual, mesActual + 1, 0, 23, 59, 59, 999);
        }
        // console.log(`DEBUG: getDateRangeForFilter(${periodoKey}, ${esAnterior}) -> Inicio: ${fechaInicio.toISOString()}, Fin: ${fechaFin.toISOString()}`);
        return { fechaInicio, fechaFin };
    },

    calcularCrecimiento(actual, anterior, esNegativoBueno = false) {
        if (anterior === null || anterior === undefined) return 0; // No hay base para comparar
        if (anterior === 0) {
            return actual > 0 ? 1000 : 0; // Cambio "infinito" o sin cambio si actual también es 0
        }
        let crecimiento = ((actual - anterior) / Math.abs(anterior)) * 100;
        return parseFloat(crecimiento.toFixed(1));
    },

    async actualizarDatos() {
      this.isLoading = true;
      console.log(`Dashboard: Iniciando actualización de datos para período: ${this.filtroPeriodo}`);

      const { fechaInicio, fechaFin } = this.getDateRangeForFilter(this.filtroPeriodo);
      const { fechaInicio: fechaInicioAnt, fechaFin: fechaFinAnt } = this.getDateRangeForFilter(this.filtroPeriodo, true);
      
      console.log(`Dashboard: Período actual -> Inicio: ${fechaInicio.toISOString()}, Fin: ${fechaFin.toISOString()}`);
      console.log(`Dashboard: Período anterior -> Inicio: ${fechaInicioAnt.toISOString()}, Fin: ${fechaFinAnt.toISOString()}`);


      try {
        // --- 1. Total Tiendas (General) ---
        const tiendasCollectionRef = collection(db, 'tiendas');
        const snapshotTotalTiendas = await getDocs(tiendasCollectionRef);
        this.totalTiendas = snapshotTotalTiendas.size;
        console.log("Dashboard: Total tiendas (global):", this.totalTiendas);

        // --- 2. Tiendas del PERÍODO para cálculos ---
        // Usaremos 'fechaCreacion' (Timestamp) si existe, sino 'mesServicio' como fallback para el período
        // Esto es crucial para que los filtros 'hoy' y 'semana' funcionen bien si las tiendas tienen fecha de creación precisa.
        // Si solo se usa 'mesServicio', los filtros de corto plazo agruparán todo el mes.
        
        // Para este ejemplo, seguiremos usando mesServicio para KPIs principales como en el original,
        // pero para el flujo de caja sería ideal una fecha más precisa.
        const mesInicioStr = `${fechaInicio.getFullYear()}-${String(fechaInicio.getMonth() + 1).padStart(2, '0')}`;
        const mesFinStr = `${fechaFin.getFullYear()}-${String(fechaFin.getMonth() + 1).padStart(2, '0')}`;

        let qTiendasPeriodo = query(tiendasCollectionRef,
                                    where('mesServicio', '>=', mesInicioStr),
                                    where('mesServicio', '<=', mesFinStr));
        const snapshotTiendasPeriodo = await getDocs(qTiendasPeriodo);
        const tiendasDelPeriodo = snapshotTiendasPeriodo.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.totalServiciosPeriodo = tiendasDelPeriodo.length;
        console.log("Dashboard: Tiendas en período actual (" + mesInicioStr + " a " + mesFinStr + "):", this.totalServiciosPeriodo, tiendasDelPeriodo);

        const mesInicioAntStr = `${fechaInicioAnt.getFullYear()}-${String(fechaInicioAnt.getMonth() + 1).padStart(2, '0')}`;
        const mesFinAntStr = `${fechaFinAnt.getFullYear()}-${String(fechaFinAnt.getMonth() + 1).padStart(2, '0')}`;
        let qTiendasPeriodoAnt = query(tiendasCollectionRef,
                                    where('mesServicio', '>=', mesInicioAntStr),
                                    where('mesServicio', '<=', mesFinAntStr));
        const snapshotTiendasPeriodoAnt = await getDocs(qTiendasPeriodoAnt);
        const tiendasDelPeriodoAnterior = snapshotTiendasPeriodoAnt.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.crecimientoTiendas = this.calcularCrecimiento(this.totalServiciosPeriodo, tiendasDelPeriodoAnterior.length);
        console.log("Dashboard: Tiendas período anterior (" + mesInicioAntStr + " a " + mesFinAntStr + "):", tiendasDelPeriodoAnterior.length);


        // --- 3. Servicios Pendientes (del período actual) ---
        const estadosPendientes = ['Pendiente', 'En proceso de ODS', 'En COVA'];
        this.serviciosPendientes = tiendasDelPeriodo.filter(t => estadosPendientes.includes(t.estadoProceso)).length;
        console.log("Dashboard: Servicios pendientes (período actual):", this.serviciosPendientes);

        // --- 4. Ingresos (Tiendas Pagadas en el período) ---
        const ingresosActuales = tiendasDelPeriodo
            .filter(t => t.estadoProceso === 'Pagado')
            .reduce((sum, t) => sum + (Number(t.costo) || 0), 0);
        this.ingresosTotales = ingresosActuales;

        const ingresosAnteriores = tiendasDelPeriodoAnterior
            .filter(t => t.estadoProceso === 'Pagado')
            .reduce((sum, t) => sum + (Number(t.costo) || 0), 0);
        this.crecimientoIngresos = this.calcularCrecimiento(ingresosActuales, ingresosAnteriores);
        console.log("Dashboard: Ingresos período actual:", this.ingresosTotales, "| Anterior:", ingresosAnteriores);

        // --- 5. Gastos (del período) ---
        const gastosCollectionRef = collection(db, 'gastos');
        const tsFechaInicio = Timestamp.fromDate(fechaInicio);
        const tsFechaFin = Timestamp.fromDate(fechaFin);

        const qGastosPeriodo = query(gastosCollectionRef,
                                    where('fecha', '>=', tsFechaInicio),
                                    where('fecha', '<=', tsFechaFin));
        const snapshotGastosPeriodo = await getDocs(qGastosPeriodo);
        const gastosDelPeriodo = snapshotGastosPeriodo.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        const gastosActuales = gastosDelPeriodo.reduce((sum, g) => sum + (Number(g.monto) || 0), 0);
        this.gastosTotales = gastosActuales;
        console.log("Dashboard: Gastos período actual:", this.gastosTotales, gastosDelPeriodo);


        const tsFechaInicioAnt = Timestamp.fromDate(fechaInicioAnt);
        const tsFechaFinAnt = Timestamp.fromDate(fechaFinAnt);
        const qGastosPeriodoAnt = query(gastosCollectionRef,
                                    where('fecha', '>=', tsFechaInicioAnt),
                                    where('fecha', '<=', tsFechaFinAnt));
        const snapshotGastosPeriodoAnt = await getDocs(qGastosPeriodoAnt);
        const gastosDelPeriodoAnterior = snapshotGastosPeriodoAnt.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        const gastosAnteriores = gastosDelPeriodoAnterior.reduce((sum, g) => sum + (Number(g.monto) || 0), 0);
        this.crecimientoGastos = this.calcularCrecimiento(gastosActuales, gastosAnteriores, true);
        console.log("Dashboard: Gastos período anterior:", gastosAnteriores);


        // --- 6. Monto por Cobrar (Tiendas Facturadas NO Pagadas en el período) ---
        const montoPorCobrarActual = tiendasDelPeriodo
            .filter(t => t.estadoProceso === 'Facturado')
            .reduce((sum, t) => sum + (Number(t.costo) || 0), 0);
        this.montoPendiente = montoPorCobrarActual;

        const montoPorCobrarAnterior = tiendasDelPeriodoAnterior
            .filter(t => t.estadoProceso === 'Facturado')
            .reduce((sum, t) => sum + (Number(t.costo) || 0), 0);
        this.crecimientoPorCobrar = this.calcularCrecimiento(montoPorCobrarActual, montoPorCobrarAnterior);
        console.log("Dashboard: Monto por cobrar (Facturado) período actual:", this.montoPendiente, "| Anterior:", montoPorCobrarAnterior);

        // --- 7. Margen de Ganancia ---
        if (this.ingresosTotales > 0) {
          this.margenGanancia = ((this.ingresosTotales - this.gastosTotales) / this.ingresosTotales) * 100;
        } else if (this.gastosTotales > 0 && this.ingresosTotales === 0) { // Gastos pero no ingresos
          this.margenGanancia = -100;
        } else { // Ni ingresos ni gastos
          this.margenGanancia = 0;
        }
        console.log("Dashboard: Margen de ganancia calculado:", this.margenGanancia);


        // --- 8. Tiendas Recientes (Top 5 global) ---
        const qTiendasRecientes = query(tiendasCollectionRef, orderBy('fechaCreacion', 'desc'), limit(5));
        const snapshotRecientes = await getDocs(qTiendasRecientes);
        this.tiendasRecientes = snapshotRecientes.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Dashboard: Tiendas recientes (global top 5):", this.tiendasRecientes);


        // --- 9. Cobros Próximos (Estimación) ---
        const cobros = [];
        // Para cobros próximos, consideramos tiendas facturadas A NIVEL GLOBAL que aún no estén pagadas
        // y cuya fecha de vencimiento estimada caiga en un futuro cercano o pasado reciente.
        // No solo las del 'periodo de filtro' actual, sino todas las relevantes.
        // O, si se prefiere, solo las del periodo actual:
        // const tiendasParaCobro = tiendasDelPeriodo.filter(t => ...);
        const todasLasTiendasSnapshot = await getDocs(query(tiendasCollectionRef, where('estadoProceso', '==', 'Facturado')));
        const tiendasFacturadasGlobal = todasLasTiendasSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

        console.log("Dashboard: Tiendas Facturadas Global para Cobros Próximos:", tiendasFacturadasGlobal);

        for (const tienda of tiendasFacturadasGlobal) {
            if (tienda.tipoPago === 'Crédito' && Number(tienda.diasCredito) > 0 && tienda.mesServicio) {
                const [anoServ, mesServNum] = tienda.mesServicio.split('-').map(Number); // mesServNum es 1-12

                // Fecha de referencia para sumar días de crédito: Usaremos el fin del mes de servicio.
                // new Date(year, monthIndex + 1, 0) da el último día del mes 'monthIndex'
                // mesServNum es 1-indexed, Date constructor usa 0-indexed para mes.
                const fechaFinMesServicio = new Date(anoServ, mesServNum, 0); // Correcto: new Date(2023, 10, 0) es 31 Oct 2023.

                if (isNaN(fechaFinMesServicio.getTime())) {
                    console.warn(`Cobros Próximos: Fecha inválida para fin de mes de servicio ${tienda.mesServicio} en tienda ${tienda.id}`);
                    continue;
                }
                
                let fechaVencimientoEstimada = new Date(fechaFinMesServicio);
                fechaVencimientoEstimada.setDate(fechaFinMesServicio.getDate() + (Number(tienda.diasCredito) || 0));

                const hoySoloFecha = new Date();
                hoySoloFecha.setHours(0,0,0,0);

                let estadoCobro = 'Próximo';
                if (fechaVencimientoEstimada < hoySoloFecha) {
                    estadoCobro = 'Vencido';
                }

                cobros.push({
                    id: tienda.id + '_cobro',
                    tiendaId: tienda.id,
                    cliente: tienda.nombre,
                    monto: Number(tienda.costo) || 0,
                    fechaVencimiento: fechaVencimientoEstimada,
                    estadoCobro: estadoCobro,
                });
            }
        }
        // Filtrar para mostrar solo los vencidos o próximos (ej. próximos 30 días)
        const hoyParaComparar = new Date();
        const limiteFuturo = new Date();
        limiteFuturo.setDate(hoyParaComparar.getDate() + 30); // Vencimiento en los próximos 30 días

        this.cobrosProximos = cobros
            .filter(c => c.estadoCobro === 'Vencido' || (c.fechaVencimiento >= hoyParaComparar && c.fechaVencimiento <= limiteFuturo))
            .sort((a,b) => a.fechaVencimiento - b.fechaVencimiento)
            .slice(0, 10); // Limitar a 10 para la vista

        console.log("Dashboard: Cobros próximos/vencidos procesados:", this.cobrosProximos);


        // --- 10. Preparar datos para Flujo de Caja ---
        // Para el flujo de caja, es mejor usar tiendasDelPeriodo y gastosDelPeriodo
        // que ya están filtrados por el this.filtroPeriodo.
        await this.prepararDatosCashFlow(tiendasDelPeriodo, gastosDelPeriodo, fechaInicio, fechaFin);
        this.initOrUpdateCashFlowChart();

      } catch (error) {
        console.error("Dashboard: Error al cargar datos del dashboard:", error);
      } finally {
        this.isLoading = false;
        console.log("Dashboard: Actualización de datos finalizada.");
      }
    },

    async prepararDatosCashFlow(tiendasDelPeriodo, gastosDelPeriodo, fechaInicioPeriodo, fechaFinPeriodo) {
        console.log("CashFlow: Iniciando preparación de datos. Vista:", this.vistaCashFlow, "Período Filtro:", this.filtroPeriodo);
        console.log("CashFlow: Tiendas del período para ingresos:", tiendasDelPeriodo);
        console.log("CashFlow: Gastos del período:", gastosDelPeriodo);

        this.cashFlowData = {
            diario: { labels: [], ingresos: [], gastos: [] },
            semanal: { labels: [], ingresos: [], gastos: [] },
            mensual: { labels: [], ingresos: [], gastos: [] },
        };

        const vista = this.vistaCashFlow;

        // INGRESOS: de tiendas 'Pagado' en el período. Fecha de ingreso = día 15 del mesServicio.
        const ingresosProcesados = tiendasDelPeriodo
            .filter(t => t.estadoProceso === 'Pagado' && t.costo > 0 && t.mesServicio)
            .map(t => {
                const [year, month] = t.mesServicio.split('-').map(Number);
                if (isNaN(year) || isNaN(month)) {
                    console.warn(`CashFlow: mesServicio inválido '${t.mesServicio}' para tienda ${t.id}`);
                    return null;
                }
                return {
                    fecha: new Date(year, month - 1, 15), // mes es 0-indexed
                    monto: Number(t.costo)
                };
            }).filter(ing => ing !== null && !isNaN(ing.fecha.getTime()));
        console.log("CashFlow: Ingresos procesados (Pagados, con fecha al día 15):", ingresosProcesados);


        // GASTOS: de la colección 'gastos' en el período.
        const gastosProcesados = gastosDelPeriodo.map(g => {
            let fechaGasto;
            if (g.fecha instanceof Timestamp) {
                fechaGasto = g.fecha.toDate();
            } else if (typeof g.fecha === 'string') {
                if (g.fecha.length === 10 && g.fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    fechaGasto = new Date(g.fecha + 'T00:00:00Z'); // Interpretar como UTC para evitar problemas de zona horaria si es solo fecha
                } else {
                    fechaGasto = new Date(g.fecha); // Asume que es una fecha-hora completa
                }
            } else if (g.fecha instanceof Date) {
                fechaGasto = g.fecha;
            } else {
                console.warn(`CashFlow: Fecha de gasto en formato inesperado: ${g.fecha} (tipo: ${typeof g.fecha}) para gasto ID: ${g.id}`);
                return null; // Será filtrado
            }

            if (isNaN(fechaGasto.getTime())) {
                console.error(`CashFlow: Fecha de gasto inválida después de conversión: ${g.fecha} para gasto ID: ${g.id}`);
                return null; // Será filtrado
            }
            return { fecha: fechaGasto, monto: Number(g.monto) || 0 };
        }).filter(g => g !== null);
        console.log("CashFlow: Gastos procesados (con fecha convertida):", gastosProcesados);


        if (vista === 'diario') {
            // Últimos 30 días desde fechaFinPeriodo (o menos si el período es más corto)
            let inicioVistaDiaria = new Date(fechaFinPeriodo);
            inicioVistaDiaria.setDate(fechaFinPeriodo.getDate() - 29);
            if (inicioVistaDiaria < fechaInicioPeriodo) inicioVistaDiaria = new Date(fechaInicioPeriodo); // No ir antes del inicio del período

            for (let i = 0; ; i++) {
                const dia = new Date(inicioVistaDiaria);
                dia.setDate(inicioVistaDiaria.getDate() + i);
                if (dia > fechaFinPeriodo) break; // No ir más allá del fin del período

                this.cashFlowData.diario.labels.push(dia.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }));
                
                const ingresosDia = ingresosProcesados
                    .filter(ing => ing.fecha.toDateString() === dia.toDateString())
                    .reduce((sum, ing) => sum + ing.monto, 0);
                this.cashFlowData.diario.ingresos.push(ingresosDia);

                const gastosDia = gastosProcesados
                    .filter(g => g.fecha.toDateString() === dia.toDateString())
                    .reduce((sum, g) => sum + g.monto, 0);
                this.cashFlowData.diario.gastos.push(gastosDia);
                if (this.cashFlowData.diario.labels.length >= 30) break; // Limitar a 30 puntos
            }
            console.log("CashFlow (Diario):", JSON.parse(JSON.stringify(this.cashFlowData.diario)));


        } else if (vista === 'semanal') {
            // Últimas 12 semanas, pero sin ir antes de fechaInicioPeriodo
            let fechaReferencia = new Date(fechaFinPeriodo);
            for (let i = 0; i < 12; i++) {
                let diaActualSemana = new Date(fechaReferencia);
                diaActualSemana.setDate(fechaReferencia.getDate() - (i * 7)); // Retrocede i semanas

                let inicioSemana = new Date(diaActualSemana);
                inicioSemana.setDate(diaActualSemana.getDate() - diaActualSemana.getDay() + (diaActualSemana.getDay() === 0 ? -6 : 1)); // Lunes
                inicioSemana.setHours(0,0,0,0);

                let finSemana = new Date(inicioSemana);
                finSemana.setDate(inicioSemana.getDate() + 6);
                finSemana.setHours(23,59,59,999);

                // Ajustar si la semana calculada está fuera del período del filtro principal
                if (finSemana < fechaInicioPeriodo) break; // Ya estamos antes del período, no seguir
                if (inicioSemana < fechaInicioPeriodo) inicioSemana = new Date(fechaInicioPeriodo); // Ajustar inicio de la primera semana relevante


                this.cashFlowData.semanal.labels.unshift(`${inicioSemana.toLocaleDateString('es-ES', {day:'2-digit', month:'short'})}`);
                
                const ingresosSemana = ingresosProcesados
                    .filter(ing => ing.fecha >= inicioSemana && ing.fecha <= finSemana)
                    .reduce((sum, ing) => sum + ing.monto, 0);
                this.cashFlowData.semanal.ingresos.unshift(ingresosSemana);

                const gastosSemana = gastosProcesados
                    .filter(g => g.fecha >= inicioSemana && g.fecha <= finSemana)
                    .reduce((sum, g) => sum + g.monto, 0);
                this.cashFlowData.semanal.gastos.unshift(gastosSemana);
                
                if (inicioSemana <= fechaInicioPeriodo && i > 0) break; // Si ya cubrimos el inicio del período, parar.
            }
            console.log("CashFlow (Semanal):", JSON.parse(JSON.stringify(this.cashFlowData.semanal)));

        } else if (vista === 'mensual') {
            let fechaIterador = new Date(fechaInicioPeriodo);
            while(fechaIterador <= fechaFinPeriodo) {
                const ano = fechaIterador.getFullYear();
                const mes = fechaIterador.getMonth(); // 0-indexed

                const inicioMesCorriente = new Date(ano, mes, 1);
                const finMesCorriente = new Date(ano, mes + 1, 0, 23, 59, 59, 999);

                this.cashFlowData.mensual.labels.push(inicioMesCorriente.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }));

                const ingresosMes = ingresosProcesados
                    .filter(ing => ing.fecha.getFullYear() === ano && ing.fecha.getMonth() === mes)
                    .reduce((sum, ing) => sum + ing.monto, 0);
                this.cashFlowData.mensual.ingresos.push(ingresosMes);

                const gastosMes = gastosProcesados
                    .filter(g => g.fecha.getFullYear() === ano && g.fecha.getMonth() === mes)
                    .reduce((sum, g) => sum + g.monto, 0);
                this.cashFlowData.mensual.gastos.push(gastosMes);

                // Avanzar al siguiente mes
                if (mes === 11) { // Diciembre
                    fechaIterador = new Date(ano + 1, 0, 1);
                } else {
                    fechaIterador = new Date(ano, mes + 1, 1);
                }
            }
             console.log("CashFlow (Mensual):", JSON.parse(JSON.stringify(this.cashFlowData.mensual)));
        }
    },


    initOrUpdateCashFlowChart() {
      if (this.cashFlowChartInstance) {
        this.cashFlowChartInstance.destroy();
        this.cashFlowChartInstance = null; // Importante para recrear
      }
      if (!this.$refs.cashFlowChart) {
        console.warn("CashFlow Chart: Canvas element no encontrado.");
        return;
      }

      const ctx = this.$refs.cashFlowChart.getContext('2d');
      const dataConfig = this.cashFlowData[this.vistaCashFlow];

      if (!dataConfig || !dataConfig.labels || dataConfig.labels.length === 0) {
        console.warn("CashFlow Chart: No hay datos para la vista:", this.vistaCashFlow, "Config:", dataConfig);
        // Opcional: dibujar un mensaje "No hay datos" en el canvas
        ctx.clearRect(0, 0, this.$refs.cashFlowChart.width, this.$refs.cashFlowChart.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#9CA3AF'; // gray-400
        ctx.font = '16px Inter';
        ctx.fillText('No hay datos disponibles para esta vista y período.', this.$refs.cashFlowChart.width / 2, this.$refs.cashFlowChart.height / 2);
        return;
      }
      console.log("CashFlow Chart: Renderizando con datos para vista", this.vistaCashFlow, ":", dataConfig);

      this.cashFlowChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dataConfig.labels,
          datasets: [
            {
              label: 'Ingresos',
              data: dataConfig.ingresos,
              backgroundColor: 'rgba(52, 211, 153, 0.7)', // emerald-400
              borderColor: '#34D399',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: 'Gastos',
              data: dataConfig.gastos,
              backgroundColor: 'rgba(248, 113, 113, 0.7)', // red-400
              borderColor: '#F87171',
              borderWidth: 1,
              borderRadius: 4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: false },
            legend: { labels: { color: '#D1D5DB' } },
            tooltip: {
              backgroundColor: 'rgba(31, 41, 55, 0.9)', // gray-800
              titleColor: '#F3F4F6', // gray-100
              bodyColor: '#F3F4F6',
              borderColor: '#4B5563', // gray-600
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: (context) => `${context.dataset.label}: ${this.formatearDinero(context.parsed.y)}`
              }
            }
          },
          scales: {
            x: {
              ticks: { color: '#9CA3AF' },
              grid: { color: 'rgba(75, 85, 99, 0.3)' } // gray-600/30
            },
            y: {
              ticks: {
                color: '#9CA3AF',
                callback: (value) => this.formatearDinero(value)
              },
              grid: { color: 'rgba(75, 85, 99, 0.3)' },
              beginAtZero: true
            }
          }
        }
      });
    },

    cambiarVistaCashFlow(vista) {
      this.vistaCashFlow = vista;
      // No es necesario llamar a actualizarDatos() completo si los datos base del período no cambian.
      // Solo necesitamos reprocesar los datos para el gráfico y actualizarlo.
      // Re-usamos los datos ya cargados (tiendasDelPeriodo, gastosDelPeriodo)
      // Para ello, necesitamos que estos datos estén disponibles a nivel de 'this' o pasarlos.
      // Por simplicidad y para asegurar consistencia con el filtroPeriodo, llamaremos a actualizarDatos.
      // Si esto causa lentitud, se puede optimizar guardando tiendasDelPeriodo y gastosDelPeriodo.
      this.actualizarDatos();
    },

    exportarDatos() {
      console.log('Exportando datos para el período:', this.filtroPeriodo, 'y vista:', this.vistaSeleccionada);
      // Aquí implementarías la lógica de exportación, por ejemplo, a CSV.
      // Podrías recolectar los datos de this.totalTiendas, this.ingresosTotales, etc.
      // y los datos de las tablas (tiendasRecientes, cobrosProximos).
      // Para el gráfico, podrías exportar this.cashFlowData[this.vistaCashFlow].
      alert('Funcionalidad de exportar no implementada en este ejemplo.');
    },

    verDetallesTienda(tiendaId) {
      console.log('Ver detalles de tienda con ID (desde Dashboard):', tiendaId);
      // this.$router.push({ name: 'DetalleTienda', params: { id: tiendaId } });
      alert('Navegación a detalles de tienda no implementada.');
    },

    verDetallesCobro(tiendaId) {
      console.log('Ver detalles de cobro (tienda ID):', tiendaId);
      alert('Navegación a detalles de cobro no implementada.');
    },

    getEstadoProcesoClass(estado) {
        const classes = {
            'Pendiente': 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30',
            'En proceso': 'bg-blue-900/50 text-blue-300 border border-blue-500/30',
            'En proceso de ODS': 'bg-blue-900/50 text-blue-300 border border-blue-500/30',
            'En COVA': 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/30',
            'Facturado': 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30',
            'Pagado': 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30',
            'Cancelado': 'bg-red-900/50 text-red-300 border border-red-500/30',
        };
        return classes[estado] || 'bg-gray-700/50 text-gray-300 border border-gray-500/30';
    },
    getCobroStatusClass(estadoCobro) {
        if (estadoCobro === 'Vencido') return 'bg-red-900/50 text-red-300 border border-red-500/30';
        if (estadoCobro === 'Próximo') return 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30';
        return 'bg-gray-700/50 text-gray-300 border border-gray-500/30';
    },
    actualizarDatosVisuales() {
        if (this.vistaSeleccionada === 'general') {
            // Si los datos ya están cargados y el canvas existe, intenta renderizar el gráfico.
            // Esto es útil si se cambia a 'general' y el gráfico no se mostró antes.
            this.$nextTick(() => { // Asegurar que el DOM esté actualizado
                 if (this.$refs.cashFlowChart && (!this.cashFlowChartInstance || this.cashFlowChartInstance.ctx === null) ) { // Si no hay instancia o se destruyó
                    console.log("ActualizarDatosVisuales: Vista general seleccionada, intentando re-renderizar gráfico si es necesario.");
                    // Re-preparar y re-renderizar con los datos actuales del filtro de período
                    // Necesitamos los datos originales del período
                    // Por ahora, una llamada a actualizarDatos() es más simple para asegurar la consistencia.
                    this.actualizarDatos();
                 } else if (this.$refs.cashFlowChart && this.cashFlowChartInstance) {
                    // Si ya existe, solo asegúrate que esté visible y con datos correctos (actualizarDatos ya lo haría)
                    console.log("ActualizarDatosVisuales: Gráfico ya existe, se actualizará con los datos del período.");
                 }
            });
        }
    }
  },
  mounted() {
    this.updateDateTime();
    this.timer = setInterval(this.updateDateTime, 1000);
    this.actualizarDatos();
  },
  beforeUnmount() {
    clearInterval(this.timer);
    if (this.cashFlowChartInstance) {
      this.cashFlowChartInstance.destroy();
      this.cashFlowChartInstance = null;
    }
  },
};
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
