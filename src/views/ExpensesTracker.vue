<template>
  <!-- Fondos decorativos sutiles para el tema claro -->
  <div class="absolute top-0 left-0 w-full h-[300px] -z-10 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-[0.05]" aria-hidden="true"></div>
      <div class="absolute top-[80px] right-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl opacity-[0.05]" aria-hidden="true"></div>
  </div>

  <div id="pdf-content" class="relative z-20 px-4 py-8 max-w-7xl mx-auto text-gray-800">
      <h2 class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 text-center mb-8 animate-fade-in-down">
          Control de Gastos y Análisis Financiero
      </h2>

      <!-- Panel de Control y Acciones -->
      <div class="card p-5 mb-8 animate-fade-in">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
              <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <select v-model="selectedMonth" @change="filterByDate" class="input-primary select-input w-full sm:w-48">
                      <option value="">Todo el Año</option>
                      <option v-for="month in months" :key="month.value" :value="month.value">{{ month.name }}</option>
                  </select>
                  <select v-model="selectedYear" @change="filterByDate" class="input-primary select-input w-full sm:w-32">
                      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                  </select>
              </div>
              <div class="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">
                   <button @click="exportToPDF" class="btn-secondary flex-shrink-0" :disabled="exportingPDF">
                      <span v-if="exportingPDF" class="flex items-center">
                          <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Exportando...
                      </span>
                      <span v-else class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Exportar PDF
                      </span>
                  </button>
                  <button @click="handleCapitalAction('add')" class="btn-secondary flex-shrink-0">
                      <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>Capital</span>
                  </button>
                  <button @click="handlePrestamoAction('add')" class="btn-secondary flex-shrink-0">
                      <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>Préstamo</span>
                  </button>
                  <button @click="handlePagoPrestamoAction('add')" class="btn-secondary flex-shrink-0">
                       <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m15.356 2H15m0 0l-3-3m3 3l3-3M4.582 12H9m11 0h-2m2 0l-3 3m3-3l3 3" /></svg>Pago Préstamo</span>
                  </button>
                  <button @click="showAddExpenseModal = true; resetForm()" class="btn-primary flex-shrink-0">
                      <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>Registrar Gasto</span>
                  </button>
              </div>
          </div>
      </div>

      <!-- Resumen Financiero (Tarjetas) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
           <!-- Tarjetas de resumen rediseñadas con el nuevo tema -->
          <div class="summary-card border-teal-500 animate-fade-in-up">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="summary-title">Ingresos Op. (Pagados)</h3>
                <p class="summary-amount text-teal-600">{{ formatearDinero(ingresosOperacionalesPagadosPeriodoTotal) }}</p>
              </div>
              <div class="summary-icon-bg bg-teal-100"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            </div>
          </div>
          <div class="summary-card border-cyan-500 animate-fade-in-up" style="animation-delay: 0.05s">
             <div class="flex justify-between items-start">
              <div>
                  <h3 class="summary-title">Ingresos Op. Proyectados</h3>
                  <p class="summary-amount text-cyan-600">{{ formatearDinero(ingresosOperacionalesProyectadosPeriodoTotal) }}</p>
              </div>
              <div class="summary-icon-bg bg-cyan-100"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2M3 10h18M7 15h1m4 0h1m5-11l-3-3m0 0l-3 3m3-3v12" /></svg></div>
            </div>
          </div>
          <div class="summary-card border-red-500 animate-fade-in-up" style="animation-delay: 0.1s">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="summary-title">Gastos Op. (Periodo)</h3> <p class="summary-amount text-red-600">{{ formatearDinero(gastosPeriodoTotal) }}</p>
              </div>
              <div class="summary-icon-bg bg-red-100"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></div>
            </div>
          </div>
           <div class="summary-card border-purple-500 animate-fade-in-up" style="animation-delay: 0.15s">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="summary-title">Capital Inyectado (Periodo)</h3> <p class="summary-amount text-purple-600">{{ formatearDinero(capitalInyectadoPeriodoTotal) }}</p>
              </div>
              <div class="summary-icon-bg bg-purple-100"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 20h4m-4 0h-2M4 12H2m10 8V6m0 14H8m4-14v14m0 0h8m0-14H12M4 6h16" /></svg></div>
            </div>
          </div>
          <div class="summary-card border-yellow-500 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="summary-title">Préstamos Recibidos (Periodo)</h3> <p class="summary-amount text-yellow-600">{{ formatearDinero(prestamosRecibidosPeriodoTotal) }}</p>
              </div>
              <div class="summary-icon-bg bg-yellow-100"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            </div>
          </div>
          <div class="summary-card border-green-500 animate-fade-in-up" style="animation-delay: 0.25s">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="summary-title">Ganancia Neta Op.</h3>
                <p class="summary-amount" :class="gananciaNetaOperacional >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatearDinero(gananciaNetaOperacional) }}
                </p>
              </div>
              <div class="summary-icon-bg bg-green-100"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
            </div>
          </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="chart-container animate-fade-in-up">
              <h3 class="chart-title">{{ mainChartTitle }}</h3>
              <div class="chart-wrapper">
                  <template v-if="cargando"><div class="loading-placeholder">Cargando gráfico...</div></template>
                  <template v-else-if="mainFinancialChartData.datasets.length > 0 && mainFinancialChartData.labels.length > 0 && mainFinancialChartData.datasets.some(ds => ds.data.some(val => val > 0))">
                      <component :is="mainChartComponent" :data="mainFinancialChartData" :options="mainFinancialChartOptions" :key="mainChartType" />
                  </template>
                  <template v-else><div class="no-data-placeholder">No hay datos suficientes para el gráfico.</div></template>
              </div>
          </div>
          <div class="chart-container animate-fade-in-up" style="animation-delay: 0.1s">
              <h3 class="chart-title">Distribución de Gastos por Categoría</h3>
              <div class="chart-wrapper">
                  <template v-if="cargando"><div class="loading-placeholder">Cargando gráfico...</div></template>
                  <template v-else-if="doughnutChartData.datasets.length > 0 && doughnutChartData.datasets[0]?.data.some(val => val > 0)">
                      <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
                  </template>
                  <template v-else><div class="no-data-placeholder">No hay gastos para graficar.</div></template>
              </div>
          </div>
      </div>

      <!-- Detalle de Movimientos (NUEVO AGRUPAMIENTO POR CATEGORÍA) -->
      <div class="card p-5 animate-fade-in">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Detalle de Movimientos del Periodo</h3>

          <div class="mb-6">
              <h4 class="text-lg font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">Gastos Operativos</h4>
              <div v-if="groupedGastosPorCategoria.length === 0" class="text-gray-500 text-sm italic">No hay gastos registrados en este periodo.</div>
              <ul v-else class="space-y-3">
                  <li v-for="group in groupedGastosPorCategoria" :key="group.category"
                      class="bg-gray-50 border border-gray-200 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100"
                      @click="toggleGroupExpanded(group.category)">
                      <div class="flex justify-between items-center">
                          <div>
                              <p class="text-gray-800 font-medium">{{ group.category }}</p>
                              <p class="text-sm text-gray-500">{{ group.items.length }} transacción(es)</p>
                          </div>
                          <div class="flex items-center">
                              <p class="text-red-600 font-semibold mr-4 flex-shrink-0">{{ formatearDinero(group.total) }}</p>
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 transform transition-transform duration-200" :class="{ 'rotate-180': expandedGroups[group.category] }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                      </div>
                      <!-- Detalle expandido -->
                      <ul v-if="expandedGroups[group.category]" class="mt-4 space-y-2 pl-4 border-l-2 border-gray-200">
                          <li v-for="item in group.items" :key="item.id" class="bg-white p-2.5 rounded-md flex justify-between items-center text-sm border border-gray-200/80">
                              <div>
                                  <p class="text-gray-700 font-medium">{{ item.descripcion }}</p>
                                  <p class="text-gray-500">{{ formatearFecha(item.fecha, true) }}</p>
                              </div>
                              <div class="flex items-center">
                                  <p class="text-red-500 font-medium mr-4 flex-shrink-0">{{ formatearDinero(item.monto) }}</p>
                                  <button @click.stop="editGasto(item)" class="text-blue-500 hover:text-blue-700 transition-colors duration-150 p-1 rounded-full hover:bg-blue-100" title="Editar Gasto">
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                                  </button>
                                  <button @click.stop="deleteGasto(item.id)" class="text-red-500 hover:text-red-700 ml-1 transition-colors duration-150 p-1 rounded-full hover:bg-red-100" title="Eliminar Gasto">
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m14 0H5m2 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-4 0v7m-4-7v7" /></svg>
                                  </button>
                              </div>
                          </li>
                      </ul>
                  </li>
              </ul>
          </div>

           <!-- Movimientos de Capital y Préstamos -->
          <div class="mb-6">
              <h4 class="text-lg font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">Movimientos de Capital</h4>
              <div v-if="movimientosCapitalPeriodo.length === 0" class="text-gray-500 text-sm italic">No hay movimientos de capital.</div>
              <ul v-else class="space-y-2">
                <li v-for="mov in movimientosCapitalPeriodo" :key="mov.id" class="list-item-detailed">
                  <div>
                    <p class="font-medium text-gray-800">{{ mov.tipo === 'capital_inicial' ? 'Capital Inicial' : 'Aporte de Capital' }}</p>
                    <p class="text-sm text-gray-500">{{ formatearFecha(mov.fecha, false) }} | {{ mov.descripcion || 'Sin descripción' }}</p>
                  </div>
                  <div class="flex items-center">
                    <p class="font-semibold mr-4 text-green-600">{{ formatearDinero(mov.monto) }}</p>
                    <button @click="handleCapitalAction('edit', mov)" class="btn-icon text-blue-500 hover:bg-blue-100" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                    <button @click="handleCapitalAction('delete', mov.id)" class="btn-icon text-red-500 hover:bg-red-100" title="Eliminar"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m14 0H5m2 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-4 0v7m-4-7v7" /></svg></button>
                  </div>
                </li>
              </ul>
          </div>
          <div class="mb-6">
              <h4 class="text-lg font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">Préstamos Recibidos</h4>
               <div v-if="prestamosRecibidosPeriodo.length === 0" class="text-gray-500 text-sm italic">No hay préstamos recibidos.</div>
              <ul v-else class="space-y-2">
                <li v-for="mov in prestamosRecibidosPeriodo" :key="mov.id" class="list-item-detailed">
                  <div>
                    <p class="font-medium text-gray-800">Préstamo de {{ mov.entidad }}</p>
                    <p class="text-sm text-gray-500">{{ formatearFecha(mov.fecha, false) }} | {{ mov.descripcion || 'Sin descripción' }}</p>
                  </div>
                   <div class="flex items-center">
                    <p class="font-semibold mr-4 text-green-600">{{ formatearDinero(mov.monto) }}</p>
                    <button @click="handlePrestamoAction('edit', mov)" class="btn-icon text-blue-500 hover:bg-blue-100" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                    <button @click="handlePrestamoAction('delete', mov.id)" class="btn-icon text-red-500 hover:bg-red-100" title="Eliminar"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m14 0H5m2 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-4 0v7m-4-7v7" /></svg></button>
                  </div>
                </li>
              </ul>
          </div>
           <div>
              <h4 class="text-lg font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">Pagos de Préstamos</h4>
               <div v-if="pagosPrestamosPeriodo.length === 0" class="text-gray-500 text-sm italic">No hay pagos de préstamos.</div>
              <ul v-else class="space-y-2">
                 <li v-for="pago in pagosPrestamosPeriodo" :key="pago.id" class="list-item-detailed">
                  <div>
                    <p class="font-medium text-gray-800">Pago a {{ pago.entidadPrestamo }}</p>
                    <p class="text-sm text-gray-500">{{ formatearFecha(pago.fecha, false) }} | {{ pago.descripcion || 'Sin descripción' }}</p>
                  </div>
                  <div class="flex items-center">
                    <p class="font-semibold mr-4 text-red-600">{{ formatearDinero(pago.monto) }}</p>
                    <button @click="handlePagoPrestamoAction('edit', pago)" class="btn-icon text-blue-500 hover:bg-blue-100" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                    <button @click="handlePagoPrestamoAction('delete', pago.id)" class="btn-icon text-red-500 hover:bg-red-100" title="Eliminar"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m14 0H5m2 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-4 0v7m-4-7v7" /></svg></button>
                  </div>
                </li>
              </ul>
          </div>
      </div>
  </div>

  <!-- Modales -->
  <!-- Modal para Gastos -->
  <Transition name="modal">
      <div v-if="showAddExpenseModal" class="modal-overlay">
          <div class="modal-container">
              <h3 class="modal-title">{{ editingGasto ? 'Editar Gasto' : 'Registrar Nuevo Gasto' }}</h3>
              <div v-if="errorMessage" class="alert-error">{{ errorMessage }}</div>
              <form @submit.prevent="saveGasto" class="space-y-4">
                  <div>
                      <label for="gasto-fecha" class="input-label">Fecha</label>
                      <input type="date" id="gasto-fecha" v-model="newGasto.fecha" required class="input-primary">
                  </div>
                  <div>
                      <label for="gasto-descripcion" class="input-label">Descripción</label>
                      <input type="text" id="gasto-descripcion" v-model="newGasto.descripcion" required class="input-primary" placeholder="Ej: Compra de suministros">
                  </div>
                  <div>
                      <label for="gasto-categoria" class="input-label">Categoría</label>
                      <input type="text" id="gasto-categoria" v-model="newGasto.categoria" required class="input-primary" placeholder="Ej: Oficina, Transporte, Gasolina" list="category-suggestions">
                      <datalist id="category-suggestions">
                          <option v-for="category in uniqueCategories" :key="category" :value="category"></option>
                      </datalist>
                  </div>
                  <div>
                      <label for="gasto-monto" class="input-label">Monto (GTQ)</label>
                      <input type="number" id="gasto-monto" v-model="newGasto.monto" required min="0" step="0.01" class="input-primary" placeholder="Ej: 150.00">
                  </div>
                  <div class="flex justify-end gap-3 pt-4">
                      <button type="button" @click="showAddExpenseModal = false; resetForm()" class="btn-secondary">Cancelar</button>
                      <button type="submit" class="btn-primary" :disabled="cargando">{{ editingGasto ? 'Actualizar Gasto' : 'Guardar Gasto' }}</button>
                  </div>
              </form>
          </div>
      </div>
  </Transition>

  <!-- Modal para Capital -->
  <Transition name="modal">
       <div v-if="showAddCapitalModal" class="modal-overlay">
           <div class="modal-container">
              <h3 class="modal-title">{{ editingCapital ? 'Editar Movimiento de Capital' : 'Registrar Capital' }}</h3>
               <div v-if="errorMessage" class="alert-error">{{ errorMessage }}</div>
              <form @submit.prevent="saveCapital" class="space-y-4">
                  <div>
                      <label for="capital-fecha" class="input-label">Fecha</label>
                      <input type="date" id="capital-fecha" v-model="newCapital.fecha" required class="input-primary">
                  </div>
                  <div>
                      <label for="capital-tipo" class="input-label">Tipo de Movimiento</label>
                      <select id="capital-tipo" v-model="newCapital.tipo" required class="input-primary select-input">
                          <option disabled value="">Seleccione un tipo</option>
                          <option value="capital_inicial">Capital Inicial</option>
                          <option value="capital">Aporte Adicional</option>
                      </select>
                  </div>
                  <div>
                      <label for="capital-monto" class="input-label">Monto (GTQ)</label>
                      <input type="number" id="capital-monto" v-model="newCapital.monto" required min="0" step="0.01" class="input-primary" placeholder="Ej: 5000.00">
                  </div>
                  <div>
                      <label for="capital-descripcion" class="input-label">Descripción (Opcional)</label>
                      <textarea id="capital-descripcion" v-model="newCapital.descripcion" rows="2" class="input-primary" placeholder="Ej: Aporte de socio para capital de trabajo"></textarea>
                  </div>
                  <div class="flex justify-end gap-3 pt-4">
                      <button type="button" @click="showAddCapitalModal = false" class="btn-secondary">Cancelar</button>
                      <button type="submit" class="btn-primary" :disabled="cargando">{{ editingCapital ? 'Actualizar' : 'Guardar' }}</button>
                  </div>
              </form>
          </div>
      </div>
  </Transition>

  <!-- Modal para Préstamos -->
   <Transition name="modal">
       <div v-if="showAddPrestamoModal" class="modal-overlay">
           <div class="modal-container">
              <h3 class="modal-title">{{ editingPrestamo ? 'Editar Préstamo' : 'Registrar Préstamo' }}</h3>
              <div v-if="errorMessage" class="alert-error">{{ errorMessage }}</div>
              <form @submit.prevent="savePrestamo" class="space-y-4">
                  <div>
                      <label for="prestamo-fecha" class="input-label">Fecha</label>
                      <input type="date" id="prestamo-fecha" v-model="newPrestamo.fecha" required class="input-primary">
                  </div>
                  <div>
                      <label for="prestamo-entidad" class="input-label">Entidad</label>
                      <input type="text" id="prestamo-entidad" v-model="newPrestamo.entidad" required class="input-primary" placeholder="Ej: Banco G&T, Proveedor X">
                  </div>
                  <div>
                      <label for="prestamo-monto" class="input-label">Monto (GTQ)</label>
                      <input type="number" id="prestamo-monto" v-model="newPrestamo.monto" required min="0" step="0.01" class="input-primary" placeholder="Ej: 10000.00">
                  </div>
                   <div>
                      <label for="prestamo-descripcion" class="input-label">Descripción (Opcional)</label>
                      <textarea id="prestamo-descripcion" v-model="newPrestamo.descripcion" rows="2" class="input-primary" placeholder="Ej: Préstamo para compra de equipo"></textarea>
                  </div>
                  <div class="flex justify-end gap-3 pt-4">
                      <button type="button" @click="showAddPrestamoModal = false" class="btn-secondary">Cancelar</button>
                      <button type="submit" class="btn-primary" :disabled="cargando">{{ editingPrestamo ? 'Actualizar' : 'Guardar' }}</button>
                  </div>
              </form>
          </div>
      </div>
  </Transition>
  
  <!-- Modal para Pagos de Préstamos -->
  <Transition name="modal">
       <div v-if="showAddPagoPrestamoModal" class="modal-overlay">
           <div class="modal-container">
              <h3 class="modal-title">{{ editingPagoPrestamo ? 'Editar Pago de Préstamo' : 'Registrar Pago de Préstamo' }}</h3>
               <div v-if="errorMessage" class="alert-error">{{ errorMessage }}</div>
              <form @submit.prevent="savePagoPrestamo" class="space-y-4">
                  <div>
                      <label for="pago-fecha" class="input-label">Fecha de Pago</label>
                      <input type="date" id="pago-fecha" v-model="newPagoPrestamo.fecha" required class="input-primary">
                  </div>
                  <div>
                      <label for="pago-prestamo-id" class="input-label">Préstamo a Pagar</label>
                      <select id="pago-prestamo-id" v-model="newPagoPrestamo.prestamoId" required class="input-primary select-input">
                          <option value="" disabled>Seleccione un préstamo</option>
                          <option v-for="prestamo in todosLosPrestamosRecibidos" :key="prestamo.id" :value="prestamo.id">
                              {{ formatearFecha(prestamo.fecha, false) }} - {{ prestamo.entidad }} ({{ formatearDinero(prestamo.monto) }})
                          </option>
                      </select>
                  </div>
                   <div>
                      <label for="pago-monto" class="input-label">Monto Pagado (GTQ)</label>
                      <input type="number" id="pago-monto" v-model="newPagoPrestamo.monto" required min="0" step="0.01" class="input-primary" placeholder="Ej: 1000.00">
                  </div>
                  <div>
                      <label for="pago-descripcion" class="input-label">Descripción (Opcional)</label>
                       <textarea id="pago-descripcion" v-model="newPagoPrestamo.descripcion" rows="2" class="input-primary" placeholder="Ej: Abono a capital"></textarea>
                  </div>
                  <div class="flex justify-end gap-3 pt-4">
                      <button type="button" @click="showAddPagoPrestamoModal = false" class="btn-secondary">Cancelar</button>
                      <button type="submit" class="btn-primary" :disabled="cargando">{{ editingPagoPrestamo ? 'Actualizar' : 'Guardar' }}</button>
                  </div>
              </form>
          </div>
      </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch, shallowRef, reactive } from 'vue';
import { Doughnut, Bar, Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import html2pdf from 'html2pdf.js';

// ** IMPORTANTE: CONECTA TU FIREBASE AQUÍ **
// 1. Asegúrate de que la ruta a tu archivo de configuración de Firebase sea correcta.
// 2. Ejecuta `npm install firebase` en tu terminal si aún no lo has hecho.
import { db } from '../firebase/firebase'; // <-- VERIFICA ESTA RUTA
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, Timestamp, query, orderBy, serverTimestamp } from 'firebase/firestore';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);


// --- Estado Reactivo ---
const gastos = ref([]);
const tiendasData = ref([]);
const movimientosExtras = ref([]);
const cargando = ref(true);
const exportingPDF = ref(false);

const selectedMonth = ref(String(new Date().getMonth() + 1).padStart(2, '0'));
const selectedYear = ref(new Date().getFullYear());

// --- Modales y Formularios ---
const showAddExpenseModal = ref(false);
const editingGasto = ref(false);
const newGasto = ref({});

const showAddCapitalModal = ref(false);
const editingCapital = ref(false);
const newCapital = ref({});

const showAddPrestamoModal = ref(false);
const editingPrestamo = ref(false);
const newPrestamo = ref({});

const showAddPagoPrestamoModal = ref(false);
const editingPagoPrestamo = ref(false);
const newPagoPrestamo = ref({});

const errorMessage = ref(null);
const expandedGroups = reactive({});
const uniqueCategories = ref([]);

// --- Constantes y Configuración ---
// Contraseña requerida para confirmar acciones sensibles
const SECURE_ACTION_PASSWORD = 'Jardines2025#';
const months = [
    { name: 'Enero', value: '01' }, { name: 'Febrero', value: '02' }, { name: 'Marzo', value: '03' },
    { name: 'Abril', value: '04' }, { name: 'Mayo', value: '05' }, { name: 'Junio', value: '06' },
    { name: 'Julio', value: '07' }, { name: 'Agosto', value: '08' }, { name: 'Septiembre', value: '09' },
    { name: 'Octubre', value: '10' }, { name: 'Noviembre', value: '11' }, { name: 'Diciembre', value: '12' }
];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const monthNamesShort = months.map(m => m.name.substring(0, 3));

const categoryColorPalette = {
  'Servicios': '#3b82f6', 'Viáticos': '#f97316', 'Transporte': '#eab308',
  'Oficina': '#8b5cf6', 'Salarios': '#14b8a6', 'Marketing': '#ec4899',
  'Pago Préstamos': '#6b7280', 'DEFAULT': '#a1a1aa'
};

// --- Funciones de Utilidad ---
const formatearDinero = (cantidad) => {
    const num = Number(cantidad);
    if (isNaN(num)) return 'Q 0.00';
    return `Q ${num.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatearFecha = (fechaInput, incluirAno = true) => {
    if (!fechaInput) return 'N/A';
    // Firebase Timestamps need to be converted to Date objects
    const fechaObj = fechaInput.toDate ? fechaInput.toDate() : new Date(fechaInput);
    if (isNaN(fechaObj.getTime())) return 'Fecha inválida';

    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const ano = fechaObj.getFullYear();
    return incluirAno ? `${dia}/${mes}/${ano}` : `${dia}/${mes}`;
};

const getMonthYearFilterRange = (yearVal, monthVal) => {
    const year = parseInt(yearVal);
    const month = monthVal ? parseInt(monthVal) - 1 : -1;
    let startDate, endDate;
    if (month >= 0) {
        startDate = new Date(year, month, 1);
        endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
    } else {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    }
    return { startDate, endDate };
};

const filterByDateRange = (items, startDate, endDate, dateField = 'fecha', useMonthService = false) => {
     return items.filter(item => {
        let itemDate;
        if (useMonthService && item.mesServicio) {
            const [itemYear, itemMonth] = item.mesServicio.split('-').map(Number);
            itemDate = new Date(itemYear, itemMonth - 1, 15);
        } else {
            if (!item[dateField]) return false;
            // Handle Firebase Timestamp
            itemDate = item[dateField].toDate ? item[dateField].toDate() : new Date(item[dateField]);
        }
        if (isNaN(itemDate.getTime())) return false;
        return itemDate >= startDate && itemDate <= endDate;
    });
};

// --- Computed Properties (Cálculos y Filtros) ---
const filteredGastos = computed(() => {
    const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
    return filterByDateRange(gastos.value, startDate, endDate);
});

const groupedGastosPorCategoria = computed(() => {
    const groups = {};
    filteredGastos.value.forEach(gasto => {
        const categoria = gasto.categoria || 'Sin Categoría';
        if (!groups[categoria]) {
            groups[categoria] = {
                category: categoria,
                total: 0,
                items: []
            };
        }
        groups[categoria].total += Number(gasto.monto) || 0;
        groups[categoria].items.push(gasto);
        groups[categoria].items.sort((a,b) => (b.fecha.toDate ? b.fecha.toDate() : new Date(b.fecha)) - (a.fecha.toDate ? a.fecha.toDate() : new Date(a.fecha)));
    });
    return Object.values(groups).sort((a, b) => b.total - a.total);
});

const filterAndSum = (items, filterFn, amountField = 'monto') => {
     const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
     const dateField = items.some(i => i.mesServicio) ? 'mesServicio' : 'fecha';
     const useMonthSvc = items.some(i => i.mesServicio);

     return filterByDateRange(items.filter(filterFn), startDate, endDate, dateField, useMonthSvc)
         .reduce((sum, item) => sum + (Number(item[amountField]) || 0), 0);
};

const ingresosOperacionalesPagadosPeriodoTotal = computed(() => filterAndSum(tiendasData.value, t => t.estadoProceso === 'Pagado', 'costo'));
const ingresosOperacionalesProyectadosPeriodoTotal = computed(() => filterAndSum(tiendasData.value, t => t.estadoProceso !== 'Cancelado', 'costo'));
const gastosPeriodoTotal = computed(() => filteredGastos.value.reduce((sum, g) => sum + Number(g.monto), 0));
const capitalInyectadoPeriodoTotal = computed(() => filterAndSum(movimientosExtras.value, m => m.tipo === 'capital' || m.tipo === 'capital_inicial'));
const prestamosRecibidosPeriodoTotal = computed(() => filterAndSum(movimientosExtras.value, m => m.tipo === 'prestamo_recibido'));

const gananciaNetaOperacional = computed(() => ingresosOperacionalesPagadosPeriodoTotal.value - gastosPeriodoTotal.value);

const movimientosCapitalPeriodo = computed(() => {
    const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
    return filterByDateRange(movimientosExtras.value.filter(m => m.tipo === 'capital' || m.tipo === 'capital_inicial'), startDate, endDate);
});

const prestamosRecibidosPeriodo = computed(() => {
     const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
    return filterByDateRange(movimientosExtras.value.filter(m => m.tipo === 'prestamo_recibido'), startDate, endDate);
});

const pagosPrestamosPeriodo = computed(() => {
     const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
    return filterByDateRange(movimientosExtras.value.filter(m => m.tipo === 'pago_prestamo'), startDate, endDate);
});

const todosLosPrestamosRecibidos = computed(() => {
    return movimientosExtras.value.filter(m => m.tipo === 'prestamo_recibido');
});

// --- Lógica de Gráficos ---
const mainChartType = computed(() => selectedMonth.value === '' ? 'line' : 'bar');
const mainChartComponent = shallowRef(Bar);
const mainChartTitle = computed(() => selectedMonth.value === '' ? `Evolución Anual ${selectedYear.value}` : `Resumen ${months.find(m => m.value === selectedMonth.value)?.name || ''} ${selectedYear.value}`);

const mainFinancialChartData = computed(() => {
    if (cargando.value) return { labels: [], datasets: [] };
    
    if (mainChartType.value === 'line') {
        const monthlyData = { ingresos: Array(12).fill(0), gastos: Array(12).fill(0) };
        const yearFilterStart = new Date(selectedYear.value, 0, 1);
        const yearFilterEnd = new Date(selectedYear.value, 11, 31);
        
        filterByDateRange(tiendasData.value, yearFilterStart, yearFilterEnd, 'mesServicio', true)
          .filter(t => t.estadoProceso === 'Pagado')
          .forEach(t => {
            const monthIndex = new Date(t.mesServicio + '-15').getMonth();
            monthlyData.ingresos[monthIndex] += Number(t.costo) || 0;
        });
        filterByDateRange(gastos.value, yearFilterStart, yearFilterEnd)
          .forEach(g => {
            const fechaGasto = g.fecha.toDate ? g.fecha.toDate() : new Date(g.fecha);
            const monthIndex = fechaGasto.getMonth();
            monthlyData.gastos[monthIndex] += Number(g.monto) || 0;
        });
        return {
            labels: monthNamesShort,
            datasets: [
                { label: 'Ingresos Op.', data: monthlyData.ingresos, borderColor: '#14b8a6', backgroundColor: 'rgba(20, 184, 166, 0.1)', tension: 0.4, fill: true },
                { label: 'Gastos Op.', data: monthlyData.gastos, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', tension: 0.4, fill: true }
            ]
        };
    } else { // Bar chart
        return {
            labels: [months.find(m => m.value === selectedMonth.value)?.name || 'Mes'],
            datasets: [
                { label: 'Ingresos Op.', data: [ingresosOperacionalesPagadosPeriodoTotal.value], backgroundColor: '#14b8a6' },
                { label: 'Gastos Op.', data: [gastosPeriodoTotal.value], backgroundColor: '#ef4444' }
            ]
        };
    }
});

 const mainFinancialChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: { ticks: { callback: value => formatearDinero(value) } }
    },
    plugins: {
        tooltip: { callbacks: { label: context => `${context.dataset.label}: ${formatearDinero(context.parsed.y)}` } },
        legend: { position: 'bottom' }
    },
    interaction: { mode: 'index', intersect: false }
}));

const doughnutChartData = computed(() => {
    const data = groupedGastosPorCategoria.value.map(g => g.total);
    const labels = groupedGastosPorCategoria.value.map(g => g.category);
    const backgroundColors = labels.map(label => categoryColorPalette[label] || categoryColorPalette['DEFAULT']);
    return {
        labels,
        datasets: [{ data, backgroundColor: backgroundColors, borderColor: '#f3f4f6', borderWidth: 3 }]
    };
});

const doughnutChartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'right' },
        tooltip: {
            callbacks: {
                label: context => `${context.label}: ${formatearDinero(context.parsed)}`,
                afterLabel: context => {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? (context.parsed / total * 100).toFixed(1) : 0;
                    return `(${percentage}%)`;
                }
            }
        }
    }
});

// --- Lógica de CRUD y Acciones ---
const resetForm = (type = 'gasto') => {
    const today = new Date().toISOString().substr(0, 10);
    switch(type) {
        case 'capital':
            newCapital.value = { fecha: today, monto: '', descripcion: '', tipo: '' };
            editingCapital.value = false;
            break;
        case 'prestamo':
             newPrestamo.value = { fecha: today, monto: '', entidad: '', descripcion: '' };
            editingPrestamo.value = false;
            break;
         case 'pagoPrestamo':
            newPagoPrestamo.value = { fecha: today, prestamoId: '', monto: '', descripcion: '' };
            editingPagoPrestamo.value = false;
            break;
        default: // gasto
             newGasto.value = { fecha: today, descripcion: '', categoria: '', monto: '' };
            editingGasto.value = false;
    }
    errorMessage.value = null;
};

const toggleGroupExpanded = (category) => {
    expandedGroups[category] = !expandedGroups[category];
};

const requestPassword = (actionText) => {
    const password = prompt(`Para ${actionText}, por favor ingrese la contraseña:`);
    if (password === null) return false;
    if (password !== SECURE_ACTION_PASSWORD) {
        alert('Contraseña incorrecta.');
        return false;
    }
    return true;
};

const handleAction = async (actionType, actionFn, successMsg, errorMsg) => {
    cargando.value = true;
    errorMessage.value = null;
    try {
        await actionFn();
        alert(successMsg);
        await cargarDatos();
    } catch (error) {
        console.error(errorMsg, error);
        errorMessage.value = `${errorMsg}: ${error.message}`;
        alert(errorMessage.value);
    } finally {
        cargando.value = false;
    }
};

const saveGasto = () => handleAction(
    'save',
    async () => {
        const gastoData = {
            ...newGasto.value,
            monto: Number(newGasto.value.monto),
            fecha: Timestamp.fromDate(new Date(newGasto.value.fecha)),
        };
        delete gastoData.id;

        if (editingGasto.value) {
            await updateDoc(doc(db, 'gastos', newGasto.value.id), gastoData);
        } else {
            gastoData.createdAt = serverTimestamp();
            await addDoc(collection(db, 'gastos'), gastoData);
        }
        showAddExpenseModal.value = false;
    },
    editingGasto.value ? 'Gasto actualizado con éxito' : 'Gasto guardado con éxito',
    'Error al guardar el gasto'
);

const saveCapital = () => handleAction(
    'save',
    async () => {
        const capitalData = {
            ...newCapital.value,
            monto: Number(newCapital.value.monto),
            fecha: Timestamp.fromDate(new Date(newCapital.value.fecha)),
        };
        delete capitalData.id;
        
        const collectionRef = collection(db, 'movimientosExtras');
        if (editingCapital.value) {
            await updateDoc(doc(collectionRef, newCapital.value.id), capitalData);
        } else {
            capitalData.createdAt = serverTimestamp();
            await addDoc(collectionRef, capitalData);
        }
        showAddCapitalModal.value = false;
    },
    'Movimiento de capital guardado',
    'Error al guardar movimiento de capital'
);

const savePrestamo = () => handleAction(
    'save',
    async () => {
        const prestamoData = {
            ...newPrestamo.value,
            tipo: 'prestamo_recibido',
            monto: Number(newPrestamo.value.monto),
            fecha: Timestamp.fromDate(new Date(newPrestamo.value.fecha)),
        };
        delete prestamoData.id;

        const collectionRef = collection(db, 'movimientosExtras');
        if (editingPrestamo.value) {
            await updateDoc(doc(collectionRef, newPrestamo.value.id), prestamoData);
        } else {
            prestamoData.createdAt = serverTimestamp();
            await addDoc(collectionRef, prestamoData);
        }
        showAddPrestamoModal.value = false;
    },
    'Préstamo guardado con éxito',
    'Error al guardar el préstamo'
);

const savePagoPrestamo = () => handleAction(
    'save',
    async () => {
        const pagoData = {
            ...newPagoPrestamo.value,
            tipo: 'pago_prestamo',
            monto: Number(newPagoPrestamo.value.monto),
            fecha: Timestamp.fromDate(new Date(newPagoPrestamo.value.fecha)),
            entidadPrestamo: todosLosPrestamosRecibidos.value.find(p => p.id === newPagoPrestamo.value.prestamoId)?.entidad || 'N/A'
        };
        delete pagoData.id;

        const collectionRef = collection(db, 'movimientosExtras');
        if (editingPagoPrestamo.value) {
            await updateDoc(doc(collectionRef, newPagoPrestamo.value.id), pagoData);
        } else {
            pagoData.createdAt = serverTimestamp();
            await addDoc(collectionRef, pagoData);
        }
        showAddPagoPrestamoModal.value = false;
    },
    'Pago de préstamo guardado con éxito',
    'Error al guardar el pago del préstamo'
);


const handleCapitalAction = (action, payload) => {
    if (action !== 'add' && !requestPassword(`${action === 'edit' ? 'editar' : 'eliminar'} un movimiento de capital`)) return;
    if(action === 'add') { resetForm('capital'); showAddCapitalModal.value = true; }
    if(action === 'edit') editCapital(payload);
    if(action === 'delete') deleteMovimientoExtra(payload, 'Capital');
};
const handlePrestamoAction = (action, payload) => {
    if (action !== 'add' && !requestPassword(`${action === 'edit' ? 'editar' : 'eliminar'} un préstamo`)) return;
    if(action === 'add') { resetForm('prestamo'); showAddPrestamoModal.value = true; }
    if(action === 'edit') editPrestamo(payload);
    if(action === 'delete') deleteMovimientoExtra(payload, 'Préstamo');
};
 const handlePagoPrestamoAction = (action, payload) => {
    if (action !== 'add' && !requestPassword(`${action === 'edit' ? 'editar' : 'eliminar'} un pago de préstamo`)) return;
    if(action === 'add') { resetForm('pagoPrestamo'); showAddPagoPrestamoModal.value = true; }
    if(action === 'edit') editPagoPrestamo(payload);
    if(action === 'delete') deleteMovimientoExtra(payload, 'Pago de Préstamo');
};


const deleteGasto = (id) => {
    if (confirm('¿Está seguro de eliminar este gasto?')) {
        handleAction('delete', () => deleteDoc(doc(db, 'gastos', id)), 'Gasto eliminado', 'Error al eliminar gasto');
    }
};

const deleteMovimientoExtra = (id, type) => {
    if (confirm(`¿Está seguro de eliminar este ${type}?`)) {
        handleAction('delete', () => deleteDoc(doc(db, 'movimientosExtras', id)), `${type} eliminado`, `Error al eliminar ${type}`);
    }
};

const editGasto = (gasto) => {
    editingGasto.value = true;
    newGasto.value = { ...gasto, fecha: formatearFecha(gasto.fecha).split('/').reverse().join('-') };
    showAddExpenseModal.value = true;
};
const editCapital = (capital) => {
    editingCapital.value = true;
    newCapital.value = { ...capital, fecha: formatearFecha(capital.fecha).split('/').reverse().join('-') };
    showAddCapitalModal.value = true;
};
const editPrestamo = (prestamo) => {
    editingPrestamo.value = true;
    newPrestamo.value = { ...prestamo, fecha: formatearFecha(prestamo.fecha).split('/').reverse().join('-') };
    showAddPrestamoModal.value = true;
};
 const editPagoPrestamo = (pago) => {
    editingPagoPrestamo.value = true;
    newPagoPrestamo.value = { ...pago, fecha: formatearFecha(pago.fecha).split('/').reverse().join('-') };
    showAddPagoPrestamoModal.value = true;
};

const exportToPDF = () => {
    exportingPDF.value = true;
    const element = document.getElementById('pdf-content');
    const opt = {
      margin:       0.5,
      filename:     `Reporte_Financiero_${selectedYear.value}_${selectedMonth.value || 'Anual'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().finally(() => {
        exportingPDF.value = false;
    });
};

// --- Carga de Datos ---
const cargarDatos = async () => {
    cargando.value = true;
    try {
        const collections = {
            gastos: query(collection(db, 'gastos'), orderBy('fecha', 'desc')),
            tiendas: query(collection(db, 'tiendas'), orderBy('mesServicio', 'desc')),
            movimientosExtras: query(collection(db, 'movimientosExtras'), orderBy('fecha', 'desc')),
        };

        const [gastosSnap, tiendasSnap, movimientosExtrasSnap] = await Promise.all([
            getDocs(collections.gastos),
            getDocs(collections.tiendas),
            getDocs(collections.movimientosExtras),
        ]);

        gastos.value = gastosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        tiendasData.value = tiendasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        movimientosExtras.value = movimientosExtrasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const categoriesSet = new Set(gastos.value.map(g => g.categoria).filter(Boolean));
        uniqueCategories.value = Array.from(categoriesSet).sort();

    } catch (error) {
        console.error("Error cargando datos de Firebase:", error);
        errorMessage.value = "Error al cargar los datos. Revisa la consola y tu conexión a Firebase.";
        alert(errorMessage.value);
    } finally {
        cargando.value = false;
    }
};

// --- Hooks de Ciclo de Vida y Watchers ---
onMounted(() => {
    cargarDatos();
    resetForm('gasto');
    resetForm('capital');
    resetForm('prestamo');
    resetForm('pagoPrestamo');
});

watch(mainChartType, (newType) => {
    mainChartComponent.value = newType === 'line' ? Line : Bar;
}, { immediate: true });

// Alias para la función de filtrado, para ser usada en el template
const filterByDate = () => {};
</script>

<style scoped>
    /* Estilos base con la nueva fuente y tema claro */
    :global(body) {
        font-family: 'Roboto', sans-serif;
        background-color: #f3f4f6; /* Gris claro para el fondo */
    }
    /* Animaciones y estilos personalizados */
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fade-in-down {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
    .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
    .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
    
    /* Estilos para el scrollbar en el modal */
    .modal-container::-webkit-scrollbar {
        width: 8px;
    }
    .modal-container::-webkit-scrollbar-track {
        background: #e5e7eb;
        border-radius: 10px;
    }
    .modal-container::-webkit-scrollbar-thumb {
        background: #9ca3af;
        border-radius: 10px;
    }
    .modal-container::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
    }

    .card { @apply bg-white border border-gray-200/80 rounded-xl shadow-md; }
    .input-primary { @apply w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 shadow-sm disabled:bg-gray-200; }
    .input-label { @apply block text-sm font-medium text-gray-600 mb-1; }
    .select-input {
        @apply appearance-none bg-no-repeat bg-right pr-10;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.75rem center;
        background-size: 1.25em 1.25em;
    }
    .btn-primary { @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none; }
    .btn-secondary { @apply bg-white hover:bg-gray-100 text-gray-700 font-medium py-2.5 px-5 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed; }
    .btn-icon { @apply p-2 rounded-full transition-colors duration-150; }
    
    .summary-card { @apply bg-white rounded-xl shadow-sm p-5 border-t-4 flex flex-col; }
    .summary-title { @apply text-sm font-medium text-gray-500 mb-1; }
    .summary-amount { @apply text-2xl font-bold leading-tight; }
    .summary-icon-bg { @apply flex items-center justify-center w-12 h-12 rounded-full; }
    
    .chart-container { @apply bg-white rounded-xl shadow-sm p-4 sm:p-6; }
    .chart-title { @apply text-lg font-semibold text-gray-800 mb-4; }
    .chart-wrapper { @apply h-80 relative; }
    .loading-placeholder, .no-data-placeholder { @apply absolute inset-0 flex items-center justify-center text-gray-500 text-sm bg-gray-50 rounded-md border border-dashed border-gray-300; }
    
    .modal-overlay { @apply fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-center p-4; }
    .modal-container { @apply bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto; }
    .modal-title { @apply text-xl font-bold text-gray-800 mb-5 text-center; }
    .alert-error { @apply bg-red-100 border border-red-200 text-red-700 text-sm p-3 rounded-md mb-4; }

    .list-item-detailed { @apply bg-white p-3 rounded-lg flex justify-between items-center border border-gray-200 hover:bg-gray-50 transition-colors; }
    
    .modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
    .modal-enter-from, .modal-leave-to { opacity: 0; }
    .modal-enter-active .modal-container, .modal-leave-active .modal-container { transition: all 0.3s ease; }
    .modal-enter-from .modal-container, .modal-leave-to .modal-container { transform: scale(0.95) translateY(10px); opacity: 0; }
    .rotate-180 { transform: rotate(180deg); }
</style>
