<template>
  <div class="estadisticas-page bg-gray-100 text-gray-800 min-h-screen">
    <div class="absolute top-0 left-0 w-full h-[300px] -z-10 overflow-hidden pointer-events-none">
      <div class="absolute top-[-50px] left-1/4 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-20" aria-hidden="true"></div>
      <div class="absolute top-[50px] right-1/4 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20" aria-hidden="true"></div>
    </div>

    <div class="relative z-20 px-4 py-8 max-w-7xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-center mb-8 animate-[fade-in-down_0.6s_ease-out]">
        Panel de Estadísticas Globales
      </h2>

      <div class="light-glass-container rounded-2xl shadow-lg p-5 mb-8 animate-[fade-in_0.6s_ease-out]">
        <div class="flex flex-col md:flex-row justify-start items-center gap-4">
          <h3 class="text-lg font-semibold text-gray-700 mr-4 flex-shrink-0">Filtrar Periodo:</h3>
          <select v-model="selectedMonthGlobal" @change="aplicarFiltrosGlobales" class="input-light select-input-light w-full sm:w-48">
            <option value="" class="option-light text-gray-500">Todo el Año</option>
            <option v-for="month in months" :key="month.value" :value="month.value" class="option-light">
              {{ month.name }}
            </option>
          </select>
          <select v-model="selectedYearGlobal" @change="aplicarFiltrosGlobales" class="input-light select-input-light w-full sm:w-32">
            <option v-for="year in years" :key="year" :value="year" class="option-light">{{ year }}</option>
          </select>
          <button @click="resetFilters" class="btn-secondary-light tech-btn-light relative overflow-hidden flex-shrink-0 group md:ml-auto mt-3 md:mt-0 w-full md:w-auto">
            <span class="z-10 relative flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m15.356 2H15m0 0l-3-3m3 3l3-3M4.582 12H9m11 0h-2m2 0l-3 3m3-3l3 3" /></svg>
              Resetear Filtros
            </span>
            <span class="tech-btn-bg-light absolute inset-0"></span>
          </button>
        </div>
      </div>

      <div v-if="cargandoGlobal" class="text-center py-20">
        <svg class="animate-spin h-10 w-10 text-purple-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p class="text-gray-600 text-lg">Cargando estadísticas globales...</p>
      </div>
      <div v-if="!cargandoGlobal && errorGlobal" class="text-center py-10 bg-red-100 border border-red-300 p-6 rounded-lg shadow-lg">
        <h4 class="text-xl text-red-700 font-semibold mb-2">Error al Cargar Datos</h4>
        <p class="text-red-600">{{ errorGlobal }}</p>
        <button @click="cargarDatosGlobales" class="btn-primary-light mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:ring-red-500">
          Reintentar Carga
        </button>
      </div>

      <template v-if="!cargandoGlobal && !errorGlobal">
        <section class="mb-12">
          <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-300 pb-2">Visión General del Periodo</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="summary-card-light border-emerald-500 animate-[fade-in_0.6s_ease-out]">
              <h4 class="summary-title-light">Ingresos Op. (Pagados)</h4>
              <p class="summary-amount-light text-emerald-600">{{ formatearDinero(kpi.ingresosOperacionalesPagados) }}</p>
              <p class="summary-comparison-light">{{ kpi.serviciosPagados }} servicios</p>
            </div>
            <div class="summary-card-light border-red-500 animate-[fade-in_0.6s_ease-out]" style="animation-delay: 0.05s">
              <h4 class="summary-title-light">Gastos Op. Totales</h4>
              <p class="summary-amount-light text-red-600">{{ formatearDinero(kpi.gastosOperativos) }}</p>
              <p class="summary-comparison-light">{{ kpi.numeroGastos }} transacciones</p>
            </div>
            <div class="summary-card-light border-blue-500 animate-[fade-in_0.6s_ease-out]" style="animation-delay: 0.1s">
              <h4 class="summary-title-light">Beneficio Neto Op.</h4>
              <p class="summary-amount-light" :class="kpi.beneficioNetoOperacional >= 0 ? 'text-blue-600' : 'text-red-600'">{{ formatearDinero(kpi.beneficioNetoOperacional) }}</p>
              <p class="summary-comparison-light">Margen Op: {{ kpi.margenNetoOperacional.toFixed(1) }}%</p>
            </div>
            <div class="summary-card-light border-purple-500 animate-[fade-in_0.6s_ease-out]" style="animation-delay: 0.15s">
              <h4 class="summary-title-light">Flujo Efectivo (Financiamiento)</h4>
              <p class="summary-amount-light" :class="kpi.flujoFinanciamientoNeto >= 0 ? 'text-purple-600' : 'text-orange-600'">{{ formatearDinero(kpi.flujoFinanciamientoNeto) }}</p>
              <p class="summary-comparison-light text-xs">Capital + Préstamos - Pagos Prést.</p>
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-purple-300 pb-2">Rendimiento de Tiendas y Servicios</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="summary-card-light border-cyan-500">
                <h4 class="summary-title-light">Total Servicios (Periodo Activo)</h4>
                <p class="summary-amount-light text-cyan-600">{{ kpiTiendas.totalServiciosActivos }}</p>
                <p class="summary-comparison-light">{{ kpiTiendas.serviciosPagados }} Pagados / {{ kpiTiendas.serviciosPendientesDePago }} Pendientes</p>
            </div>
            <div class="summary-card-light border-pink-500">
                <h4 class="summary-title-light">Ingreso Promedio / Servicio (Pagado)</h4>
                <p class="summary-amount-light text-pink-600">{{ formatearDinero(kpiTiendas.ingresoPromedioPorServicioPagado) }}</p>
                <p class="summary-comparison-light">Basado en {{kpiTiendas.serviciosPagados}} servicios</p>
            </div>
            <div class="summary-card-light border-yellow-500">
                <h4 class="summary-title-light">Tasa de Cobro (Periodo)</h4>
                <p class="summary-amount-light text-yellow-600">{{ kpiTiendas.tasaDeCobro.toFixed(1) }}%</p>
                <p class="summary-comparison-light text-xs">Pagados vs. (Pagados + Pendientes)</p>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="chart-container-light animate-[fade-in-up_0.6s_ease-out]">
              <h4 class="chart-title-light">Ingresos (Pagados) por Marca de Tienda</h4>
              <div class="chart-wrapper">
                <template v-if="cargandoGlobal"> <div class="loading-placeholder-light">Cargando...</div> </template>
                <template v-else-if="ingresosPorMarcaChartData.datasets.length > 0 && ingresosPorMarcaChartData.datasets[0]?.data.some(d => d > 0)">
                  <Bar :data="ingresosPorMarcaChartData" :options="barChartOptions('Marca', false, 'Ingresos (Q)', true, true)" />
                </template>
                <template v-else> <div class="no-data-placeholder-light">No hay datos de ingresos por marca para el periodo.</div> </template>
              </div>
            </div>
            <div class="chart-container-light animate-[fade-in-up_0.6s_ease-out]" style="animation-delay: 0.1s;">
              <h4 class="chart-title-light">Ingresos (Pagados) por Categoría de Servicio</h4>
              <div class="chart-wrapper">
                <template v-if="cargandoGlobal"> <div class="loading-placeholder-light">Cargando...</div> </template>
                <template v-else-if="ingresosPorCategoriaServicioChartData.datasets.length > 0 && ingresosPorCategoriaServicioChartData.datasets[0]?.data.some(d => d > 0)">
                  <Doughnut :data="ingresosPorCategoriaServicioChartData" :options="doughnutChartOptionsPreset('Categoría Servicio', true)" />
                </template>
                <template v-else> <div class="no-data-placeholder-light">No hay datos de ingresos por categoría para el periodo.</div> </template>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-lime-400 pb-2">
            Cumplimiento de Servicios Programados <span class="text-sm text-gray-500">(Periodo Seleccionado)</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div class="summary-card-light border-lime-500">
              <h4 class="summary-title-light">Servicios Analizados</h4>
              <p class="summary-amount-light text-lime-600">{{ kpiCumplimientoServicios.serviciosAnalizados }}</p>
              <p class="summary-comparison-light">{{ kpiCumplimientoServicios.serviciosCon2VisitasEsperadas }} con 2 visitas</p>
            </div>
            <div class="summary-card-light border-green-500">
              <h4 class="summary-title-light">V1 Realizada en Q1</h4>
              <p class="summary-amount-light text-green-600">{{ kpiCumplimientoServicios.porcentajeCumplimientoV1.toFixed(1) }}%</p>
              <p class="summary-comparison-light">{{ kpiCumplimientoServicios.realizadasV1EnQ1 }} de {{ kpiCumplimientoServicios.totalV1ConFecha }} prog.</p>
            </div>
            <div class="summary-card-light border-teal-500">
              <h4 class="summary-title-light">V2 Realizada en Q2</h4>
              <p class="summary-amount-light text-teal-600">{{ kpiCumplimientoServicios.porcentajeCumplimientoV2.toFixed(1) }}%</p>
              <p class="summary-comparison-light">{{ kpiCumplimientoServicios.realizadasV2EnQ2 }} de {{ kpiCumplimientoServicios.totalV2ConFecha }} prog.</p>
            </div>
            <div class="summary-card-light border-cyan-500">
              <h4 class="summary-title-light">Servicios Completos y a Tiempo</h4>
              <p class="summary-amount-light text-cyan-600">{{ kpiCumplimientoServicios.porcentajeCumplimientoTotal.toFixed(1) }}%</p>
              <p class="summary-comparison-light">{{ kpiCumplimientoServicios.serviciosCompletosYATiempo }} servicios</p>
            </div>
             <div class="summary-card-light border-blue-500">
              <h4 class="summary-title-light">Prom. Días entre Visitas</h4>
              <p class="summary-amount-light text-blue-600">{{ kpiCumplimientoServicios.promedioDiasEntreVisitas.toFixed(1) }}</p>
              <p class="summary-comparison-light">{{ kpiCumplimientoServicios.contadorDiferenciaDiasValidas }} serv. (2V Realizadas)</p>
            </div>
          </div>

          <div v-if="kpiCumplimientoServicios.listaIncumplimientos.length > 0" class="mt-6 light-glass-container rounded-lg p-4 animate-[fade-in-up_0.6s_ease-out]" style="animation-delay: 0.2s;">
            <h4 class="text-md font-semibold text-yellow-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Tiendas con Desviaciones en Programación de Visitas (Periodo):
            </h4>
            <div class="max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <ul class="text-xs space-y-1.5">
                  <li v-for="incumplimiento in kpiCumplimientoServicios.listaIncumplimientos"
                      :key="incumplimiento.tiendaId + incumplimiento.tipo + Math.random()"
                      class="p-2 bg-gray-200/80 rounded-md border-l-2 border-yellow-500 hover:bg-gray-300/80 transition-colors">
                      <strong class="text-gray-700">{{ incumplimiento.nombre }}</strong>
                      <span class="text-yellow-700 ml-1">[{{ incumplimiento.tipo }}]:</span>
                      <p class="text-gray-600 leading-tight">{{ incumplimiento.detalle }}</p>
                  </li>
              </ul>
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-teal-400 pb-2">Análisis Financiero Adicional</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="chart-container-light animate-[fade-in-up_0.6s_ease-out]">
              <h4 class="chart-title-light">{{ flujoEfectivoChartTitle }}</h4>
              <div class="chart-wrapper">
                <template v-if="cargandoGlobal"> <div class="loading-placeholder-light">Cargando...</div> </template>
                <template v-else-if="flujoEfectivoChartData.datasets.length > 0 && flujoEfectivoChartData.datasets.some(ds => ds.data.some(d => d !== 0 && d !== null))">
                    <component :is="flujoEfectivoChartComponent" :data="flujoEfectivoChartData" :options="mainChartOptionsPreset(flujoEfectivoChartComponent === Line ? 'line' : 'bar', 'Monto (GTQ)', true)" :key="selectedMonthGlobal + selectedYearGlobal + 'flujo'"/>
                </template>
                <template v-else> <div class="no-data-placeholder-light">No hay datos suficientes para el flujo de efectivo.</div> </template>
              </div>
            </div>
            <div class="chart-container-light animate-[fade-in-up_0.6s_ease-out]" style="animation-delay: 0.1s;">
              <h4 class="chart-title-light">Distribución de Gastos Operativos</h4>
              <div class="chart-wrapper">
                <template v-if="cargandoGlobal"> <div class="loading-placeholder-light">Cargando...</div> </template>
                <template v-else-if="gastosPorCategoriaChartData.datasets.length > 0 && gastosPorCategoriaChartData.datasets[0]?.data.some(d => d > 0)">
                    <Doughnut :data="gastosPorCategoriaChartData" :options="doughnutChartOptionsPreset('Categoría Gasto', true)" />
                </template>
                <template v-else> <div class="no-data-placeholder-light">No hay gastos para graficar en el periodo.</div> </template>
              </div>
            </div>
          </div>
           <div class="mt-6 summary-card-light border-orange-500 animate-[fade-in_0.6s_ease-out]" style="animation-delay: 0.2s;">
            <h4 class="summary-title-light text-orange-700">Estado de Deuda (Préstamos) - Histórico Acumulado</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-center md:text-left">
                <div><p class="text-sm text-gray-500">Total Recibido:</p><p class="text-xl font-semibold text-yellow-600">{{formatearDinero(kpiFinanzas.totalPrestamosRecibidosHist)}}</p></div>
                <div><p class="text-sm text-gray-500">Total Pagado:</p><p class="text-xl font-semibold text-emerald-600">{{formatearDinero(kpiFinanzas.totalPagosPrestamosHist)}}</p></div>
                <div><p class="text-sm text-gray-500">Saldo Pendiente:</p><p class="text-xl font-semibold text-red-600">{{formatearDinero(kpiFinanzas.saldoPendientePrestamosHist)}}</p></div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, shallowRef } from 'vue';
import { collection, getDocs, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Asegúrate que la ruta sea correcta

// Importaciones de Chart.js y vue-chartjs
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'vue-chartjs';

// Registrar los componentes y elementos de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

// --- Estado Reactivo ---
const cargandoGlobal = ref(true);
const errorGlobal = ref(null);

// Almacenes de datos crudos de Firebase
const todasLasTiendas = ref([]);
const todosLosGastos = ref([]);
const todosMovimientosExtras = ref([]);

// Filtros globales
const selectedMonthGlobal = ref('');
const selectedYearGlobal = ref(new Date().getFullYear());

// --- Constantes y Configuraciones ---
const monthNamesShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const months = monthNamesShort.map((name, index) => ({ name, value: String(index + 1).padStart(2, '0') }));
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

// Paletas de colores (ajustadas para tema claro, priorizando contraste)
const lightThemePalette = {
  bluePrimary: '#2563EB', // blue-600
  purplePrimary: '#7C3AED', // purple-600
  pinkPrimary: '#DB2777', // pink-600
  greenPrimary: '#16A34A', // green-600
  redPrimary: '#DC2626', // red-600
  cyanPrimary: '#0891B2', // cyan-600
  yellowPrimary: '#CA8A04', // yellow-600
  orangePrimary: '#EA580C', // orange-600
  tealPrimary: '#0D9488', // teal-600
  limePrimary: '#65A30D', // lime-600
  defaultGrayText: '#4B5563', // gray-600 para texto
  defaultBorder: '#D1D5DB', // gray-300 para bordes
};
const categoryColorPaletteLight = {
  'Servicios': lightThemePalette.bluePrimary, 'Comida': lightThemePalette.orangePrimary, 'Transporte': lightThemePalette.yellowPrimary,
  'Oficina': lightThemePalette.purplePrimary, 'Salarios': lightThemePalette.tealPrimary, 'Marketing': lightThemePalette.pinkPrimary,
  'Pago Préstamos': lightThemePalette.defaultGrayText,
  'Mantenimiento Preventivo': lightThemePalette.greenPrimary,
  'Venta de plantas': lightThemePalette.limePrimary,
  'Jardinizacion': lightThemePalette.tealPrimary,
  'Reparacion de sistema riego': lightThemePalette.cyanPrimary,
  'Proyecto nuevo': lightThemePalette.bluePrimary,
  'DEFAULT': lightThemePalette.defaultGrayText
};
const colorKeysForChartsLight = Object.keys(lightThemePalette).filter(k => !k.includes('Gray') && !k.includes('Border'));


// --- Funciones de Utilidad (sin cambios, ya eran genéricas) ---
const formatearDinero = (cantidad) => { /* ... (sin cambios) ... */
  const num = Number(cantidad);
  if (isNaN(num)) return 'Q 0.00';
  return `Q ${num.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const formatearMes = (mesStr) => { /* ... (sin cambios) ... */
  if (!mesStr || !mesStr.includes('-')) return mesStr || 'N/A';
  try {
    const [ano, mes] = mesStr.split('-');
    const fecha = new Date(Number(ano), Number(mes) - 1, 1);
    if (isNaN(fecha.getTime())) { return mesStr; }
    let mesFormateado = fecha.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });
    return mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);
  } catch (e) { return mesStr; }
};
const formatearFecha = (fechaInput, incluirAno = true) => { /* ... (sin cambios) ... */
  if (!fechaInput) return 'N/A';
  let fechaObj;
  if (fechaInput instanceof Timestamp) { fechaObj = fechaInput.toDate(); }
  else if (typeof fechaInput === 'string') {
    if (fechaInput.match(/^\d{4}-\d{2}-\d{2}$/)) { fechaObj = new Date(fechaInput + 'T00:00:00Z'); }
    else { fechaObj = new Date(fechaInput); }
  } else if (fechaInput instanceof Date) { fechaObj = fechaInput; }
  else { return 'Fecha Inválida'; }
  if (isNaN(fechaObj.getTime())) return 'Fecha Inválida';
  const dia = String(fechaObj.getUTCDate()).padStart(2, '0');
  const mesNum = String(fechaObj.getUTCMonth() + 1).padStart(2, '0');
  const ano = fechaObj.getUTCFullYear();
  return incluirAno ? `${dia}/${mesNum}/${ano}` : `${dia}/${mesNum}`;
};
const getMonthYearFilterRangeGlobal = (yearVal, monthVal) => { /* ... (sin cambios) ... */
  const year = parseInt(yearVal);
  const month = monthVal ? parseInt(monthVal) - 1 : -1;
  let startDate, endDate;
  if (month >= 0) {
    startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
  } else {
    startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
  }
  return { startDate: Timestamp.fromDate(startDate), endDate: Timestamp.fromDate(endDate) };
};
const filterByDateRangeGlobal = (items, startDateTimestamp, endDateTimestamp, dateField = 'fecha', useMonthService = false) => { /* ... (sin cambios) ... */
    return items.filter(item => {
      let itemEffectiveDateStart;
      let itemEffectiveDateEnd;
      if (useMonthService && item.mesServicio) {
        if (!item.mesServicio.match(/^\d{4}-\d{2}$/)) return false;
        const [itemYear, itemMonthIndex] = item.mesServicio.split('-').map(Number);
        itemEffectiveDateStart = Timestamp.fromDate(new Date(Date.UTC(itemYear, itemMonthIndex - 1, 1)));
        itemEffectiveDateEnd = Timestamp.fromDate(new Date(Date.UTC(itemYear, itemMonthIndex, 0, 23, 59, 59, 999)));
        return itemEffectiveDateStart <= endDateTimestamp && itemEffectiveDateEnd >= startDateTimestamp;
      } else if (item[dateField]) {
        const dateVal = item[dateField];
        itemEffectiveDateStart = dateVal instanceof Timestamp ? dateVal : Timestamp.fromDate(new Date(dateVal));
        if (!itemEffectiveDateStart || isNaN(itemEffectiveDateStart.toDate().getTime())) return false;
        return itemEffectiveDateStart >= startDateTimestamp && itemEffectiveDateStart <= endDateTimestamp;
      } else {
        return false;
      }
    });
};

// --- Carga de Datos Global (sin cambios) ---
const cargarDatosGlobales = async () => { /* ... (sin cambios) ... */
  cargandoGlobal.value = true;
  errorGlobal.value = null;
  try {
    const tiendasQueryFb = query(collection(db, 'tiendas'), orderBy('mesServicio', 'asc'));
    const gastosQueryFb = query(collection(db, 'gastos'), orderBy('fecha', 'asc'));
    const movimientosExtrasQueryFb = query(collection(db, 'movimientosExtras'), orderBy('fecha', 'asc'));
    const [tiendasSnap, gastosSnap, movimientosExtrasSnap] = await Promise.all([
      getDocs(tiendasQueryFb), getDocs(gastosQueryFb), getDocs(movimientosExtrasQueryFb)
    ]);
    todasLasTiendas.value = tiendasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    todosLosGastos.value = gastosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    todosMovimientosExtras.value = movimientosExtrasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error cargando datos globales:", e);
    errorGlobal.value = "No se pudieron cargar los datos para las estadísticas. Por favor, intente de nuevo.";
    todasLasTiendas.value = []; todosLosGastos.value = []; todosMovimientosExtras.value = [];
  } finally { cargandoGlobal.value = false; }
};

// --- Datos Filtrados para el Periodo Seleccionado (sin cambios) ---
const tiendasFiltradasPeriodo = computed(() => { /* ... (sin cambios) ... */
  if (cargandoGlobal.value || !todasLasTiendas.value.length) return [];
  const { startDate, endDate } = getMonthYearFilterRangeGlobal(selectedYearGlobal.value, selectedMonthGlobal.value);
  return filterByDateRangeGlobal(todasLasTiendas.value, startDate, endDate, 'mesServicio', true);
});
const gastosFiltradosPeriodo = computed(() => { /* ... (sin cambios) ... */
  if (cargandoGlobal.value || !todosLosGastos.value.length) return [];
  const { startDate, endDate } = getMonthYearFilterRangeGlobal(selectedYearGlobal.value, selectedMonthGlobal.value);
  return filterByDateRangeGlobal(todosLosGastos.value, startDate, endDate, 'fecha');
});
const movimientosExtrasFiltradosPeriodo = computed(() => { /* ... (sin cambios) ... */
  if (cargandoGlobal.value || !todosMovimientosExtras.value.length) return [];
  const { startDate, endDate } = getMonthYearFilterRangeGlobal(selectedYearGlobal.value, selectedMonthGlobal.value);
  return filterByDateRangeGlobal(todosMovimientosExtras.value, startDate, endDate, 'fecha');
});

// --- KPIs Calculados (sin cambios en la lógica, solo los colores de los gráficos se ajustarán en las opciones) ---
const kpi = computed(() => { /* ... (sin cambios) ... */
  const ingresosOpPagados = tiendasFiltradasPeriodo.value.filter(t => t.estadoProceso === 'Pagado').reduce((sum, t) => sum + (Number(t.costo) || 0), 0);
  const serviciosPagadosCount = tiendasFiltradasPeriodo.value.filter(t => t.estadoProceso === 'Pagado').length;
  const gastosOp = gastosFiltradosPeriodo.value.reduce((sum, g) => sum + (Number(g.monto) || 0), 0);
  const numeroGastosCount = gastosFiltradosPeriodo.value.length;
  const beneficioOp = ingresosOpPagados - gastosOp;
  const margenOp = ingresosOpPagados === 0 ? 0 : (beneficioOp / ingresosOpPagados) * 100;
  const capitalInyectado = movimientosExtrasFiltradosPeriodo.value.filter(m => m.tipo === 'capital' || m.tipo === 'capital_inicial').reduce((sum, m) => sum + (Number(m.monto) || 0), 0);
  const prestamosRecibidos = movimientosExtrasFiltradosPeriodo.value.filter(m => m.tipo === 'prestamo_recibido').reduce((sum, m) => sum + (Number(m.monto) || 0), 0);
  const pagosPrestamos = movimientosExtrasFiltradosPeriodo.value.filter(m => m.tipo === 'pago_prestamo').reduce((sum, m) => sum + (Number(m.monto) || 0), 0);
  const flujoFinanciamiento = capitalInyectado + prestamosRecibidos - pagosPrestamos;
  return { ingresosOperacionalesPagados: ingresosOpPagados, serviciosPagados: serviciosPagadosCount, gastosOperativos: gastosOp, numeroGastos: numeroGastosCount, beneficioNetoOperacional: beneficioOp, margenNetoOperacional: margenOp, flujoFinanciamientoNeto: flujoFinanciamiento, };
});
const kpiTiendas = computed(() => { /* ... (sin cambios) ... */
    const tiendasActivasPeriodo = tiendasFiltradasPeriodo.value.filter(t => t.estadoProceso !== 'Cancelado');
    const serviciosPagados = tiendasActivasPeriodo.filter(t => t.estadoProceso === 'Pagado');
    const serviciosPendientes = tiendasActivasPeriodo.filter(t => t.estadoProceso !== 'Pagado' && t.estadoProceso !== 'Cancelado');
    const ingresosPagados = serviciosPagados.reduce((sum, t) => sum + (Number(t.costo) || 0), 0);
    const ingresoPromedio = serviciosPagados.length > 0 ? ingresosPagados / serviciosPagados.length : 0;
    const totalCobrables = serviciosPagados.length + serviciosPendientes.length;
    const tasaCobro = totalCobrables > 0 ? (serviciosPagados.length / totalCobrables) * 100 : 0;
    return { totalServiciosActivos: tiendasActivasPeriodo.length, serviciosPagados: serviciosPagados.length, serviciosPendientesDePago: serviciosPendientes.length, ingresoPromedioPorServicioPagado: ingresoPromedio, tasaDeCobro: tasaCobro, };
});
const kpiFinanzas = computed(() => { /* ... (sin cambios) ... */
    const totalPrestamosHist = todosMovimientosExtras.value.filter(m => m.tipo === 'prestamo_recibido').reduce((sum, m) => sum + (Number(m.monto) || 0), 0);
    const totalPagosHist = todosMovimientosExtras.value.filter(m => m.tipo === 'pago_prestamo').reduce((sum, m) => sum + (Number(m.monto) || 0), 0);
    return { totalPrestamosRecibidosHist: totalPrestamosHist, totalPagosPrestamosHist: totalPagosHist, saldoPendientePrestamosHist: totalPrestamosHist - totalPagosHist, };
});
const kpiCumplimientoServicios = computed(() => { /* ... (sin cambios en lógica) ... */
  const init = { serviciosAnalizados: 0, serviciosCon2VisitasEsperadas: 0, cumplenV1EnQ1: 0, realizadasV1EnQ1: 0, cumplenV2EnQ2: 0, realizadasV2EnQ2: 0, serviciosCompletosYATiempo: 0, totalServiciosDosVisitasRealizadasCompletas: 0, sumaDiferenciaDias: 0, contadorDiferenciaDiasValidas: 0, promedioDiasEntreVisitas: 0, porcentajeCumplimientoV1: 0, porcentajeCumplimientoV2: 0, porcentajeCumplimientoTotal: 0, listaIncumplimientos: [], totalV1ConFecha: 0, totalV2ConFecha: 0, };
  if (cargandoGlobal.value) return init;
  const resultados = { ...init };
  tiendasFiltradasPeriodo.value.forEach(tienda => {
    if (!tienda.mesServicio || !tienda.nombre) return;
    resultados.serviciosAnalizados++;
    let esServicioDosVisitas = tienda.numVisitas === 2;
    if (esServicioDosVisitas) resultados.serviciosCon2VisitasEsperadas++;
    const [yearServicio, monthServicioNum] = tienda.mesServicio.split('-').map(Number);
    let v1ProgramadaATiempo = false, v1RealizadaYATiempo = false;
    let v2ProgramadaATiempo = false, v2RealizadaYATiempo = false;
    let fechaV1Obj = null, fechaV2Obj = null;
    if (tienda.fechaPrimeraVisita) {
      resultados.totalV1ConFecha++;
      try {
        fechaV1Obj = tienda.fechaPrimeraVisita instanceof Timestamp ? tienda.fechaPrimeraVisita.toDate() : new Date(tienda.fechaPrimeraVisita + 'T00:00:00Z');
        if (!isNaN(fechaV1Obj.getTime())) {
          const diaV1 = fechaV1Obj.getUTCDate(), mesV1 = fechaV1Obj.getUTCMonth() + 1, anioV1 = fechaV1Obj.getUTCFullYear();
          if (anioV1 === yearServicio && mesV1 === monthServicioNum && diaV1 >= 1 && diaV1 <= 15) {
            v1ProgramadaATiempo = true; resultados.cumplenV1EnQ1++;
            if (tienda.estadoPrimeraVisita === 'Realizada') { v1RealizadaYATiempo = true; resultados.realizadasV1EnQ1++; }
          } else { resultados.listaIncumplimientos.push({ tiendaId: tienda.id, nombre: tienda.nombre, tipo: 'V1 Fuera Q1', detalle: `Prog: ${formatearFecha(fechaV1Obj)}, Esp: Q1 ${formatearMes(tienda.mesServicio)}, Est: ${tienda.estadoPrimeraVisita || 'N/A'}` }); }
        } else { resultados.listaIncumplimientos.push({ tiendaId: tienda.id, nombre: tienda.nombre, tipo: 'V1 Fecha Inválida', detalle: `FechaV1: ${tienda.fechaPrimeraVisita}, Est: ${tienda.estadoPrimeraVisita || 'N/A'}` }); }
      } catch (e) { resultados.listaIncumplimientos.push({ tiendaId: tienda.id, nombre: tienda.nombre, tipo: 'V1 Error Fecha', detalle: `Error: ${e.message}, Est: ${tienda.estadoPrimeraVisita || 'N/A'}` });}
    } else if (tienda.estadoPrimeraVisita === 'Realizada') { resultados.listaIncumplimientos.push({ tiendaId: tienda.id, nombre: tienda.nombre, tipo: 'V1 Realizada Sin Fecha', detalle: `Est: ${tienda.estadoPrimeraVisita}` });}
    if (esServicioDosVisitas) {
      if (tienda.fechaSegundaVisita) {
        resultados.totalV2ConFecha++;
        try {
          fechaV2Obj = tienda.fechaSegundaVisita instanceof Timestamp ? tienda.fechaSegundaVisita.toDate() : new Date(tienda.fechaSegundaVisita + 'T00:00:00Z');
          if (!isNaN(fechaV2Obj.getTime())) {
            const diaV2 = fechaV2Obj.getUTCDate(), mesV2 = fechaV2Obj.getUTCMonth() + 1, anioV2 = fechaV2Obj.getUTCFullYear();
            if (anioV2 === yearServicio && mesV2 === monthServicioNum && diaV2 > 15 && diaV2 <= 31) {
              v2ProgramadaATiempo = true; resultados.cumplenV2EnQ2++;
              if (tienda.estadoSegundaVisita === 'Realizada') { v2RealizadaYATiempo = true; resultados.realizadasV2EnQ2++; }
            } else { resultados.listaIncumplimientos.push({ tiendaId: tienda.id, nombre: tienda.nombre, tipo: 'V2 Fuera Q2', detalle: `Prog: ${formatearFecha(fechaV2Obj)}, Esp: Q2 ${formatearMes(tienda.mesServicio)}, Est: ${tienda.estadoSegundaVisita || 'N/A'}` }); }
          } else { resultados.listaIncumplimientos.push({ tiendaId: tienda.id, nombre: tienda.nombre, tipo: 'V2 Fecha Inválida', detalle: `FechaV2: ${tienda.fechaSegundaVisita}, Est: ${tienda.estadoSegundaVisita || 'N/A'}` }); }
        } catch (e) { resultados.listaIncumplimientos.push({ tiendaId: tienda.id, nombre: tienda.nombre, tipo: 'V2 Error Fecha', detalle: `Error: ${e.message}, Est: ${tienda.estadoSegundaVisita || 'N/A'}` }); }
      } else if (tienda.estadoSegundaVisita === 'Realizada') { resultados.listaIncumplimientos.push({ tiendaId: tienda.id, nombre: tienda.nombre, tipo: 'V2 Realizada Sin Fecha', detalle: `Est: ${tienda.estadoSegundaVisita}` });}
      if (tienda.estadoPrimeraVisita === 'Realizada' && tienda.estadoSegundaVisita === 'Realizada') {
        resultados.totalServiciosDosVisitasRealizadasCompletas++;
        if (fechaV1Obj && fechaV2Obj && !isNaN(fechaV1Obj.getTime()) && !isNaN(fechaV2Obj.getTime())) {
          if (fechaV2Obj >= fechaV1Obj) {
            const diffTime = fechaV2Obj.getTime() - fechaV1Obj.getTime();
            resultados.sumaDiferenciaDias += Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            resultados.contadorDiferenciaDiasValidas++;
          } else { resultados.listaIncumplimientos.push({ tiendaId: tienda.id, nombre: tienda.nombre, tipo: 'V2 Antes que V1', detalle: `V1: ${formatearFecha(fechaV1Obj)}, V2: ${formatearFecha(fechaV2Obj)}`}); }
        }
      }
      if (v1RealizadaYATiempo && v2RealizadaYATiempo) resultados.serviciosCompletosYATiempo++;
    } else {
      if (v1RealizadaYATiempo) resultados.serviciosCompletosYATiempo++;
    }
  });
  resultados.promedioDiasEntreVisitas = resultados.contadorDiferenciaDiasValidas > 0 ? (resultados.sumaDiferenciaDias / resultados.contadorDiferenciaDiasValidas) : 0;
  resultados.porcentajeCumplimientoV1 = resultados.totalV1ConFecha > 0 ? (resultados.realizadasV1EnQ1 / resultados.totalV1ConFecha) * 100 : 0;
  resultados.porcentajeCumplimientoV2 = resultados.totalV2ConFecha > 0 ? (resultados.realizadasV2EnQ2 / resultados.totalV2ConFecha) * 100 : 0;
  resultados.porcentajeCumplimientoTotal = resultados.serviciosAnalizados > 0 ? (resultados.serviciosCompletosYATiempo / resultados.serviciosAnalizados) * 100 : 0;
  return resultados;
});


// --- Datos para Gráficos (adaptados para tema claro en las opciones) ---
const ingresosPorMarcaChartData = computed(() => { /* ... (lógica sin cambios, colores se ajustan en opciones) ... */
  if (cargandoGlobal.value) return { labels: [], datasets: [] };
  const marcasData = {};
  tiendasFiltradasPeriodo.value.filter(t => t.estadoProceso === 'Pagado' && t.marca).forEach(tienda => {
    const marca = tienda.marca.trim() || 'Sin Marca';
    marcasData[marca] = (marcasData[marca] || 0) + (Number(tienda.costo) || 0);
  });
  const labels = Object.keys(marcasData).sort((a,b) => marcasData[b] - marcasData[a]);
  const data = labels.map(label => marcasData[label]);
  if (labels.length === 0) return { labels: [], datasets: [] };
  return { labels, datasets: [{ label: 'Ingresos Pagados', data, backgroundColor: labels.map((_, i) => lightThemePalette[colorKeysForChartsLight[i % colorKeysForChartsLight.length]] || lightThemePalette.defaultGrayText), borderRadius: 4, }] };
});

const ingresosPorCategoriaServicioChartData = computed(() => { /* ... (lógica sin cambios, colores se ajustan en opciones) ... */
  if (cargandoGlobal.value) return { labels: [], datasets: [] };
  const categoriasData = {};
  tiendasFiltradasPeriodo.value.filter(t => t.estadoProceso === 'Pagado' && t.categoria).forEach(tienda => {
    const categoria = tienda.categoria.trim() || 'Sin Categoría';
    categoriasData[categoria] = (categoriasData[categoria] || 0) + (Number(tienda.costo) || 0);
  });
  const labels = Object.keys(categoriasData).sort((a,b) => categoriasData[b] - categoriasData[a]);
  const data = labels.map(label => categoriasData[label]);
  if (labels.length === 0) return { labels: [], datasets: [] };
  return { labels, datasets: [{ data, backgroundColor: labels.map((label, i) => categoryColorPaletteLight[label] || lightThemePalette[colorKeysForChartsLight[(i+2) % colorKeysForChartsLight.length]] || lightThemePalette.defaultGrayText ), borderColor: '#FFFFFF', borderWidth: 2, hoverOffset: 8, }] };
});

const flujoEfectivoChartComponent = shallowRef(Bar);
const flujoEfectivoChartTitle = computed(() => selectedMonthGlobal.value === '' ? `Flujo Efectivo Operacional Anual ${selectedYearGlobal.value}` : `Flujo Efectivo Operacional ${months.find(m=>m.value === selectedMonthGlobal.value)?.name || ''} ${selectedYearGlobal.value}`);

const flujoEfectivoChartData = computed(() => { /* ... (lógica sin cambios, colores se ajustan en opciones) ... */
    if (cargandoGlobal.value) return { labels: [], datasets: [] };
    if (selectedMonthGlobal.value === '') {
        flujoEfectivoChartComponent.value = Line;
        const labels = monthNamesShort;
        const dataMensual = { ingresos: Array(12).fill(0), gastos: Array(12).fill(0), beneficio: Array(12).fill(0), };
        todasLasTiendas.value.forEach(t => {
            if (t.mesServicio && t.mesServicio.startsWith(selectedYearGlobal.value.toString()) && t.estadoProceso === 'Pagado') {
                const monthIndex = parseInt(t.mesServicio.split('-')[1]) - 1;
                if(monthIndex >= 0 && monthIndex < 12) dataMensual.ingresos[monthIndex] += (Number(t.costo) || 0);
            }
        });
        todosLosGastos.value.forEach(g => {
            if (g.fecha) {
                const fechaGasto = g.fecha instanceof Timestamp ? g.fecha.toDate() : new Date(g.fecha);
                if (!isNaN(fechaGasto.getTime()) && fechaGasto.getUTCFullYear() === parseInt(selectedYearGlobal.value)) {
                    const monthIndex = fechaGasto.getUTCMonth();
                    if(monthIndex >= 0 && monthIndex < 12) dataMensual.gastos[monthIndex] += (Number(g.monto) || 0);
                }
            }
        });
        for (let i = 0; i < 12; i++) { dataMensual.beneficio[i] = dataMensual.ingresos[i] - dataMensual.gastos[i]; }
        const hasData = dataMensual.ingresos.some(d => d > 0) || dataMensual.gastos.some(d => d > 0) || dataMensual.beneficio.some(d => d !== 0);
        if (!hasData) return { labels: [], datasets: [] };
        return { labels, datasets: [
            { label: 'Ingresos Op. (Pagados)', data: dataMensual.ingresos, borderColor: lightThemePalette.greenPrimary, backgroundColor: `${lightThemePalette.greenPrimary}33`, tension: 0.3, fill: 'origin' },
            { label: 'Gastos Op.', data: dataMensual.gastos, borderColor: lightThemePalette.pinkPrimary, backgroundColor: `${lightThemePalette.pinkPrimary}33`, tension: 0.3, fill: 'origin' },
            { label: 'Beneficio Neto Op.', data: dataMensual.beneficio, borderColor: lightThemePalette.bluePrimary, backgroundColor: `${lightThemePalette.bluePrimary}33`, tension: 0.3, fill: 'origin' },
        ]};
    } else {
        flujoEfectivoChartComponent.value = Bar;
        if (kpi.value.ingresosOperacionalesPagados === 0 && kpi.value.gastosOperativos === 0 && kpi.value.beneficioNetoOperacional === 0) { return { labels: [], datasets: [] }; }
        return { labels: [months.find(m=>m.value === selectedMonthGlobal.value)?.name || 'Mes'], datasets: [
            { label: 'Ingresos Op. (Pagados)', data: [kpi.value.ingresosOperacionalesPagados], backgroundColor: lightThemePalette.greenPrimary, borderRadius: 4 },
            { label: 'Gastos Op.', data: [kpi.value.gastosOperativos], backgroundColor: lightThemePalette.pinkPrimary, borderRadius: 4 },
            { label: 'Beneficio Neto Op.', data: [kpi.value.beneficioNetoOperacional], backgroundColor: lightThemePalette.bluePrimary, borderRadius: 4 },
        ]};
    }
});

const gastosPorCategoriaChartData = computed(() => { /* ... (lógica sin cambios, colores se ajustan en opciones) ... */
  if (cargandoGlobal.value) return { labels: [], datasets: [] };
  const categorias = {};
  gastosFiltradosPeriodo.value.forEach(gasto => {
    const categoria = gasto.categoria || 'Sin Categoría';
    categorias[categoria] = (categorias[categoria] || 0) + (Number(gasto.monto) || 0);
  });
  const labels = Object.keys(categorias).sort((a,b) => categorias[b] - categorias[a]);
  const data = labels.map(label => categorias[label]);
  if (labels.length === 0) return { labels: [], datasets: [] };
  return { labels, datasets: [{ data, backgroundColor: labels.map((label) => categoryColorPaletteLight[label] || lightThemePalette.defaultGrayText), borderColor: '#FFFFFF', borderWidth: 2, hoverOffset: 8, }] };
});


// --- Opciones para Gráficos (adaptadas para tema claro) ---
const chartOptionsBase = (yAxisLabel = 'Monto (GTQ)', isLightTheme = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { color: isLightTheme ? 'rgba(0, 0, 0, 0.05)' : 'rgba(107, 114, 128, 0.1)' },
      ticks: { color: isLightTheme ? lightThemePalette.defaultGrayText : '#9CA3AF', font: {size: 10} }
    },
    y: {
      beginAtZero: true,
      title: { display: true, text: yAxisLabel, color: isLightTheme ? lightThemePalette.defaultGrayText : '#9CA3AF' },
      ticks: { callback: (value) => formatearDinero(value), color: isLightTheme ? lightThemePalette.defaultGrayText : '#9CA3AF', font: {size: 10} },
      grid: { color: isLightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(107, 114, 128, 0.2)' }
    }
  },
  plugins: {
    title: { display: false },
    tooltip: {
      backgroundColor: isLightTheme ? 'rgba(255, 255, 255, 0.95)' : 'rgba(17, 24, 39, 0.9)',
      titleColor: isLightTheme ? '#1F2937' : '#E5E7EB', // gray-800 for light, gray-100 for dark
      bodyColor: isLightTheme ? '#374151' : '#D1D5DB', // gray-700 for light, gray-300 for dark
      borderColor: isLightTheme ? 'rgba(209, 213, 219, 0.7)' : 'rgba(100, 116, 139, 0.5)', // gray-300 for light
      borderWidth: 1,
      padding: 10,
      callbacks: {
        label: (context) => `${context.dataset.label || ''}: ${formatearDinero(context.parsed.y || context.parsed.x || context.parsed)}`
      }
    },
    legend: {
      position: 'bottom',
      labels: { color: isLightTheme ? lightThemePalette.defaultGrayText : '#9CA3AF', boxWidth:12, padding:15, font: {size: 11} }
    },
  },
  animation: { duration: 600, easing: 'easeOutCubic' }
});

const mainChartOptionsPreset = (type = 'bar', yAxisLabel = 'Monto (GTQ)', isLightTheme = false) => ({
  ...chartOptionsBase(yAxisLabel, isLightTheme),
  scales: {
    x: { ...chartOptionsBase(yAxisLabel, isLightTheme).scales.x, stacked: type === 'bar' },
    y: { ...chartOptionsBase(yAxisLabel, isLightTheme).scales.y, stacked: type === 'bar' }
  },
  plugins: { ...chartOptionsBase(yAxisLabel, isLightTheme).plugins, filler: {propagate: type === 'line'}},
  elements: { point: { radius: type === 'line' ? 2:0, hoverRadius: type === 'line' ? 4:0 } },
});

const barChartOptions = (xAxisLabel = 'Categoría', stacked = false, yAxisLabel = 'Monto (GTQ)', horizontal = false, isLightTheme = false) => ({
  ...chartOptionsBase(horizontal ? xAxisLabel : yAxisLabel, isLightTheme),
  indexAxis: horizontal ? 'y' : 'x',
  scales: {
    x: { ...chartOptionsBase(yAxisLabel, isLightTheme).scales.x, stacked: stacked, title: { display: !horizontal, text: horizontal ? yAxisLabel : xAxisLabel, color: isLightTheme ? lightThemePalette.defaultGrayText : '#9CA3AF' } },
    y: { ...chartOptionsBase(yAxisLabel, isLightTheme).scales.y, stacked: stacked, title: { display: horizontal, text: horizontal ? xAxisLabel : yAxisLabel, color: isLightTheme ? lightThemePalette.defaultGrayText : '#9CA3AF' }, grid: { drawOnChartArea: !horizontal } }
  },
});

const doughnutChartOptionsPreset = (titleText = 'Distribución', isLightTheme = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { animateRotate: true, animateScale: true, duration: 600 },
  plugins: {
    title: { display: false, text: titleText, color: isLightTheme ? '#1F2937' : '#E5E7EB', font: {size: 16} },
    tooltip: { ...chartOptionsBase('', isLightTheme).plugins.tooltip,
      callbacks: {
        label: (context) => `${context.label || ''}: ${formatearDinero(context.parsed)}`,
        afterLabel: (context) => {
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          return total === 0 ? '(0%)' : `(${( (context.parsed / total) * 100).toFixed(1)}%)`;
        }
      }
    },
    legend: { ...chartOptionsBase('', isLightTheme).plugins.legend, position: 'right' }
  }
});

// --- Control de Filtros (sin cambios) ---
const aplicarFiltrosGlobales = () => { /* ... (sin cambios) ... */ };
const resetFilters = () => { /* ... (sin cambios) ... */
  selectedMonthGlobal.value = '';
  selectedYearGlobal.value = new Date().getFullYear();
};

// --- Ciclo de Vida y Watchers (sin cambios) ---
onMounted(async () => { await cargarDatosGlobales(); });
watch([selectedMonthGlobal, selectedYearGlobal], () => { /* ... (sin cambios) ... */ });

</script>

<style scoped>
/* Estilos generales del componente para tema claro */
.estadisticas-page {
  @apply font-sans; /* Asegurar que se aplique la fuente base */
}
.light-glass-container {
  @apply bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg;
}
.input-light {
  @apply w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 text-sm shadow-sm disabled:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed;
}
.select-input-light {
  @apply appearance-none bg-no-repeat bg-right pr-10;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* Icono gris */
  background-position: right 0.75rem center;
  background-size: 1.25em 1.25em;
}
.input-light:focus.select-input-light {
   background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%233B82F6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* Icono azul al enfocar */
}
.option-light {
  @apply bg-white text-gray-700;
}
.btn-secondary-light {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none;
}
.btn-primary-light {
  @apply px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-purple-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center;
}
.tech-btn-light { /* Para botones con efecto sutil en tema claro */
  @apply relative overflow-hidden;
}
.tech-btn-bg-light {
  @apply absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300;
}

/* Tarjetas de Resumen (KPIs) para tema claro */
.summary-card-light {
  @apply bg-white backdrop-blur-sm rounded-xl shadow-lg p-5 border-t-4 flex flex-col border-opacity-80;
  min-height: 140px;
}
.summary-title-light {
  @apply text-sm font-medium text-gray-500 mb-1.5;
}
.summary-amount-light {
  @apply text-2xl xl:text-3xl font-bold leading-tight text-gray-800; /* Color base para montos */
}
.summary-comparison-light {
  @apply text-xs text-gray-500 mt-auto pt-1.5;
}

/* Contenedores y Títulos de Gráficos para tema claro */
.chart-container-light {
  @apply bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200;
}
.chart-title-light {
  @apply text-lg font-semibold text-gray-700 mb-4 text-center sm:text-left;
}
.chart-wrapper { /* Sin cambios, ya era genérico */
  @apply h-72 md:h-[350px] relative;
}
.loading-placeholder-light, .no-data-placeholder-light {
    @apply absolute inset-0 flex items-center justify-center text-gray-500 text-sm bg-gray-50/50 rounded-md border border-dashed border-gray-300 p-4 text-center;
}

/* Scrollbar para la lista de incumplimientos en tema claro */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.400') theme('colors.gray.200');
}
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: theme('colors.gray.200');
  border-radius: 3px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.400');
  border-radius: 3px;
}

/* Animaciones (sin cambios) */
@keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.animate-\[fade-in-down_0\.6s_ease-out\] { animation: fade-in-down 0.6s ease-out both; }
.animate-\[fade-in-up_0\.6s_ease-out\] { animation: fade-in-up 0.6s ease-out both; }
.animate-\[fade-in_0\.6s_ease-out\] { animation: fade-in 0.6s ease-out both; }

/* Clases de colores para bordes de KPI cards (asegurar que Tailwind no las purgue) */
.border-emerald-500 {} .text-emerald-600 {}
.border-red-500 {} .text-red-600 {}
.border-blue-500 {} .text-blue-600 {}
.border-purple-500 {} .text-purple-600 {}
.border-cyan-500 {} .text-cyan-600 {}
.border-pink-500 {} .text-pink-600 {}
.border-yellow-500 {} .text-yellow-600 {}
.border-orange-500 {} .text-orange-600 {} .text-orange-700 {}
.border-teal-500 {} .text-teal-600 {}
.border-lime-500 {} .text-lime-600 {} .border-lime-400 {}
</style>
