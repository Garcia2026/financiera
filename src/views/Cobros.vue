<template>
  <div class="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 text-gray-200">

    <div class="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-cyan-500/20 rounded-lg shadow-lg shadow-cyan-500/10 mb-8 py-4 px-6 transform transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20">
      <h2 class="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 glow-cyan mb-2 text-center">Gestión de Cobros</h2>
      <p class="text-cyan-100/70 text-center text-sm md:text-base">Visualiza y administra los cobros de tus tiendas y servicios</p>
    </div>

    <div v-if="!cargando" class="mb-8">
      <h3 class="text-xl font-semibold text-cyan-300 mb-4">Resumen General de Cobros</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-card border-l-4 border-green-500 hover:shadow-green-500/10">
          <h4 class="font-bold text-lg text-gray-100 mb-1">Total Pagado</h4>
          <p class="text-2xl font-medium text-green-400">Q{{ (resumenCobros.totalPagado || 0).toFixed(2) }}</p>
          <p class="text-sm text-gray-400">{{ resumenCobros.cantidadPagados }} cobros</p>
        </div>
        <div class="glass-card border-l-4 border-yellow-500 hover:shadow-yellow-500/10">
          <h4 class="font-bold text-lg text-gray-100 mb-1">Total Pendiente</h4>
          <p class="text-2xl font-medium text-yellow-400">Q{{ (resumenCobros.totalPendiente || 0).toFixed(2) }}</p>
          <p class="text-sm text-gray-400">{{ resumenCobros.cantidadPendientes }} cobros</p>
        </div>
        <div class="glass-card border-l-4 border-red-500 hover:shadow-red-500/10">
          <h4 class="font-bold text-lg text-gray-100 mb-1">Total Vencido</h4>
          <p class="text-2xl font-medium text-red-400">Q{{ (resumenCobros.totalVencido || 0).toFixed(2) }}</p>
          <p class="text-sm text-gray-400">{{ resumenCobros.cantidadVencidos }} cobros</p>
        </div>
        <div class="glass-card border-l-4 border-blue-500 hover:shadow-blue-500/10">
          <h4 class="font-bold text-lg text-gray-100 mb-1">Cobros Proyectados (Próx. Mes)</h4>
          <p class="text-2xl font-medium text-blue-400">Q{{ (resumenCobros.totalProyectado || 0).toFixed(2) }}</p>
          <p class="text-sm text-gray-400">{{ resumenCobros.cantidadProyectados }} cobros</p>
        </div>
      </div>
    </div>

    <div class="glass-container rounded-xl shadow-lg border border-gray-700/30 p-4 mb-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-center gap-3">
          <div class="relative flex-grow min-w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg></div>
            <input v-model="busquedaCobro" type="text" placeholder="Buscar por tienda, ODS..." class="input-primary pl-10 pr-10 w-full" />
            <button v-if="busquedaCobro" @click="busquedaCobro = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
          </div>
          <div class="relative flex-grow min-w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg></div>
            <select v-model="filtroEstadoCobro" class="input-primary select-input pl-10 pr-8 w-full">
              <option value="" class="option-dark text-gray-500">Todos los Estados</option>
              <option value="Pendiente de Pago" class="option-dark">Pendiente de Pago</option>
              <option value="Vencido" class="option-dark">Vencido</option>
              <option value="Pagado" class="option-dark">Pagado</option>
              <option value="Proyectado" class="option-dark">Proyectado</option>
            </select>
             <button v-if="filtroEstadoCobro" @click="filtroEstadoCobro = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
          </div>
          <div class="relative flex-grow min-w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg></div>
            <select v-model="filtroMesCobro" class="input-primary select-input pl-10 pr-8 w-full">
                <option value="" class="option-dark text-gray-500">Todos los meses</option>
                <option v-for="(mes, index) in mesesServicioDisponibles" :key="index" :value="mes" class="option-dark">{{ formatearMes(mes) }}</option>
            </select>
            <button v-if="filtroMesCobro" @click="filtroMesCobro = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-container rounded-xl shadow-lg border border-gray-700/30 overflow-hidden mb-10 relative">
      <div v-if="cargando" class="loading-overlay">
        <svg class="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span class="ml-2 text-gray-200">Cargando Cobros...</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-900/70 backdrop-blur-sm">
            <tr>
              <th class="th-table">Tienda</th>
              <th class="th-table hidden md:table-cell">Mes Servicio</th>
              <th class="th-table">Monto (Q)</th>
              <th class="th-table hidden lg:table-cell">Tipo Pago</th>
              <th class="th-table hidden md:table-cell">Fecha Facturación</th>
              <th class="th-table">Fecha Vencimiento</th>
              <th class="th-table hidden lg:table-cell">Días Rest./Venc.</th>
              <th class="th-table">Estado Cobro</th>
              <th class="th-table">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700/50">
            <tr v-for="cobro in cobrosFiltrados" :key="cobro.tiendaId + '-' + cobro.mesServicio" class="hover:bg-gray-700/40 transition-colors duration-150">
              <td class="td-table">
                <div class="font-medium text-gray-100 hover:text-cyan-300 transition-colors">{{ cobro.nombreTienda }}</div>
                <div v-if="cobro.ods" class="text-xs text-gray-500">ODS: {{ cobro.ods }}</div>
              </td>
              <td class="td-table hidden md:table-cell">{{ formatearMes(cobro.mesServicio) }}</td>
              <td class="td-table font-semibold">Q{{ (cobro.costo || 0).toFixed(2) }}</td>
              <td class="td-table hidden lg:table-cell">
                <span class="badge" :class="{'text-emerald-400': cobro.tipoPago === 'Contado', 'text-cyan-400': cobro.tipoPago === 'Crédito'}">{{ cobro.tipoPago }}</span>
                <span v-if="cobro.tipoPago === 'Crédito'" class="text-xs text-gray-500 ml-1">({{ cobro.diasCredito }} días)</span>
              </td>
              <td class="td-table hidden md:table-cell">{{ formatearFecha(cobro.fechaFacturacion, false) }}</td>
              <td class="td-table font-medium" :class="getVencimientoColor(cobro.diasParaVencer, cobro.estadoCobro)">{{ formatearFecha(cobro.fechaVencimiento, false) }}</td>
              <td class="td-table hidden lg:table-cell" :class="getVencimientoColor(cobro.diasParaVencer, cobro.estadoCobro)">
                <span v-if="cobro.estadoCobro === 'Pagado'">-</span>
                <span v-else-if="cobro.diasParaVencer === 0">Vence Hoy</span>
                <span v-else-if="cobro.diasParaVencer > 0">{{ cobro.diasParaVencer }} días restantes</span>
                <span v-else>{{ Math.abs(cobro.diasParaVencer) }} días vencido</span>
              </td>
              <td class="td-table">
                <span class="badge" :class="getEstadoCobroColor(cobro.estadoCobro)">{{ cobro.estadoCobro }}</span>
              </td>
              <td class="td-table">
                <button
                  v-if="cobro.estadoCobro !== 'Pagado' && cobro.estadoCobro !== 'Proyectado'"
                  @click="confirmarMarcarComoPagado(cobro)"
                  class="btn-icon text-green-400 hover:text-green-300"
                  title="Marcar como Pagado">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
                 <button
                  @click="verDetallesTienda(cobro.tiendaId)"
                  class="btn-icon text-cyan-400 hover:text-cyan-300 ml-1"
                  title="Ver Detalles de Tienda">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><title>Ver Detalles</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
              </td>
            </tr>
            <tr v-if="cobrosFiltrados.length === 0 && !cargando">
              <td colspan="9" class="px-4 py-8 text-center">
                <div class="flex flex-col items-center justify-center space-y-3">
                  <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  <p class="text-gray-500 text-lg">No se encontraron cobros</p>
                  <p class="text-gray-600 text-sm">{{ busquedaCobro || filtroEstadoCobro || filtroMesCobro ? 'Prueba con otros criterios de búsqueda o filtro' : 'No hay tiendas con cobros generados o proyectados' }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="mostrarConfirmacionPago">
        <div class="modal-backdrop">
          <div class="modal-content max-w-md">
            <div class="modal-header"><h3 class="modal-title text-green-400">Confirmar Pago</h3><button @click="mostrarConfirmacionPago = false" class="modal-close-btn" title="Cerrar">&times;</button></div>
            <div class="p-6">
              <p class="text-gray-300">¿Estás seguro que deseas marcar el cobro de <strong class="text-gray-100">{{ cobroSeleccionado?.nombreTienda }}</strong> por <strong class="text-gray-100">Q{{(cobroSeleccionado?.costo || 0).toFixed(2)}}</strong> como <strong class="text-green-400">PAGADO</strong>?</p>
              <p class="text-sm text-gray-500 mt-2">Esta acción actualizará el estado del proceso de la tienda a "Pagado".</p>
            </div>
            <div class="modal-footer gap-3">
                <button @click="mostrarConfirmacionPago = false" class="btn-secondary">Cancelar</button>
                <button @click="marcarComoPagado" class="btn-primary bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500">Sí, Marcar como Pagado</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
        <div v-if="mostrarDetallesTienda">
            <div class="modal-backdrop">
                <div class="modal-content max-w-2xl" :class="[`border-t-8 border-${getBrandColor(tiendaParaDetalle?.marca)}-500`]">
                    <div class="modal-header">
                        <h3 class="modal-title">{{ tiendaParaDetalle?.nombre || 'Detalles de Tienda' }}</h3>
                        <button @click="mostrarDetallesTienda = false" class="modal-close-btn" title="Cerrar">&times;</button>
                    </div>
                    <div class="p-6 text-sm">
                        <div v-if="tiendaParaDetalle" class="space-y-3">
                            <p><strong class="text-gray-400 w-28 inline-block">Marca:</strong> {{ tiendaParaDetalle.marca }}</p>
                            <p><strong class="text-gray-400 w-28 inline-block">ODS:</strong> {{ tiendaParaDetalle.ods || '-' }}</p>
                            <p><strong class="text-gray-400 w-28 inline-block">Mes Servicio:</strong> {{ formatearMes(tiendaParaDetalle.mesServicio) }}</p>
                            <p><strong class="text-gray-400 w-28 inline-block">Costo:</strong> Q{{ (tiendaParaDetalle.costo || 0).toFixed(2) }}</p>
                            <p><strong class="text-gray-400 w-28 inline-block">Tipo Pago:</strong> {{ tiendaParaDetalle.tipoPago }}</p>
                            <p><strong class="text-gray-400 w-28 inline-block">Estado Proceso:</strong> <span class="badge" :class="getProcessStatusColor(tiendaParaDetalle.estadoProceso)">{{ tiendaParaDetalle.estadoProceso }}</span></p>
                            </div>
                        <div v-else class="text-gray-500">No se pudieron cargar los detalles.</div>
                    </div>
                    <div class="modal-footer">
                        <button @click="mostrarDetallesTienda = false" class="btn-secondary">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs, doc, updateDoc, query, where, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase' // Asegúrate que la ruta sea correcta

const todasLasTiendas = ref([])
const listaDeCobros = ref([])
const cargando = ref(true)
const busquedaCobro = ref('')
const filtroEstadoCobro = ref('')
const filtroMesCobro = ref('')


const mostrarConfirmacionPago = ref(false)
const cobroSeleccionado = ref(null)

const mostrarDetallesTienda = ref(false)
const tiendaParaDetalle = ref(null)

// Colores de Marca (copiado de tu script de Tiendas)
const brandColors = {
    "McDonald's": 'amber', "Pizza Hut": 'red', "Kentucky": 'red', "Starbucks": 'green',
    "Dunkin Donuts": 'pink', "Edificio Naguchi": 'gray', "Pandas": 'gray', 'DEFAULT': 'emerald'
};
const getBrandColor = (brandName) => {
    const normalizedBrand = brandName?.trim() || 'DEFAULT';
    const foundKey = Object.keys(brandColors).find(key => key !== 'DEFAULT' && normalizedBrand.toLowerCase().includes(key.toLowerCase()) );
    return brandColors[foundKey] || brandColors['DEFAULT'];
};


const cargarTiendasOriginales = async () => {
  cargando.value = true
  todasLasTiendas.value = []
  try {
    const snapshot = await getDocs(collection(db, 'tiendas'))
    const tiendasTemp = []
    snapshot.forEach(doc => {
      tiendasTemp.push({ id: doc.id, ...doc.data() })
    })
    todasLasTiendas.value = tiendasTemp
    generarListaDeCobros()
  } catch (error) {
    console.error("Error cargando tiendas originales:", error)
  } finally {
    cargando.value = false
  }
}

const generarListaDeCobros = () => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0) // Normalizar a medianoche para comparaciones de fecha

  const cobrosTemp = todasLasTiendas.value
    .filter(tienda => tienda.costo && tienda.costo > 0 && tienda.mesServicio) // Solo tiendas con costo y mes de servicio
    .map(tienda => {
      const [yearServicio, monthServicio] = tienda.mesServicio.split('-').map(Number)
      // Fecha de Facturación: asumimos el primer día del mes de servicio
      const fechaFacturacion = new Date(yearServicio, monthServicio - 1, 1)
      fechaFacturacion.setHours(0,0,0,0);


      let fechaVencimiento = new Date(fechaFacturacion)
      if (tienda.tipoPago === 'Crédito' && tienda.diasCredito > 0) {
        fechaVencimiento.setDate(fechaFacturacion.getDate() + tienda.diasCredito)
      } else { // Contado, vence el mismo mes (ej. último día del mes de facturación)
        fechaVencimiento = new Date(yearServicio, monthServicio, 0); // Último día del mes de servicio/facturación
      }
      fechaVencimiento.setHours(0,0,0,0);


      let estadoCobro = 'Proyectado' // Estado por defecto
      const diffTiempo = fechaVencimiento.getTime() - hoy.getTime()
      const diffDias = Math.ceil(diffTiempo / (1000 * 3600 * 24))

      if (tienda.estadoProceso === 'Pagado') {
        estadoCobro = 'Pagado'
      } else if (fechaFacturacion > hoy && hoy.getFullYear() === fechaFacturacion.getFullYear() && hoy.getMonth() === fechaFacturacion.getMonth()) {
        // Si la fecha de facturación es en el mes actual pero futura (ej. tienda creada hoy para servicio de hoy)
        // O si es para un mes futuro.
         if (fechaFacturacion.getFullYear() > hoy.getFullYear() || (fechaFacturacion.getFullYear() === hoy.getFullYear() && fechaFacturacion.getMonth() > hoy.getMonth())) {
           estadoCobro = 'Proyectado';
         } else if (diffDias >= 0) {
           estadoCobro = 'Pendiente de Pago';
         } else {
           estadoCobro = 'Vencido';
         }
      }
      else if (diffDias < 0) {
        estadoCobro = 'Vencido'
      } else {
        estadoCobro = 'Pendiente de Pago'
      }
      
      // Si la tienda ya está marcada como 'Facturado', 'En COVA', etc., y no 'Pagado', se considera 'Pendiente' o 'Vencido'
      if (tienda.estadoProceso && tienda.estadoProceso !== 'Pagado' && tienda.estadoProceso !== 'Pendiente' && estadoCobro === 'Proyectado') {
         if (diffDias < 0) estadoCobro = 'Vencido'; else estadoCobro = 'Pendiente de Pago';
      }


      return {
        tiendaId: tienda.id,
        nombreTienda: tienda.nombre,
        marca: tienda.marca,
        ods: tienda.ods,
        mesServicio: tienda.mesServicio, // YYYY-MM
        costo: tienda.costo,
        tipoPago: tienda.tipoPago,
        diasCredito: tienda.diasCredito || 0,
        fechaFacturacion,
        fechaVencimiento,
        estadoCobro, // Pendiente de Pago, Pagado, Vencido, Proyectado
        estadoProcesoOriginal: tienda.estadoProceso,
        diasParaVencer: estadoCobro !== 'Pagado' ? diffDias : null,
      }
    })
  listaDeCobros.value = cobrosTemp
}

const cobrosFiltrados = computed(() => {
  let resultado = listaDeCobros.value;

  if (busquedaCobro.value) {
    const termino = busquedaCobro.value.toLowerCase().trim();
    if (termino) {
      resultado = resultado.filter(cobro =>
        cobro.nombreTienda.toLowerCase().includes(termino) ||
        (cobro.ods && cobro.ods.toLowerCase().includes(termino))
      );
    }
  }

  if (filtroEstadoCobro.value) {
    resultado = resultado.filter(cobro => cobro.estadoCobro === filtroEstadoCobro.value);
  }

  if (filtroMesCobro.value) {
    resultado = resultado.filter(cobro => cobro.mesServicio === filtroMesCobro.value);
  }
  
  // Ordenar: Vencidos primero, luego Pendientes, luego Proyectados, luego Pagados. Dentro de cada grupo, por fecha de vencimiento.
  resultado.sort((a, b) => {
    const ordenEstado = { 'Vencido': 1, 'Pendiente de Pago': 2, 'Proyectado': 3, 'Pagado': 4 };
    if (ordenEstado[a.estadoCobro] !== ordenEstado[b.estadoCobro]) {
      return ordenEstado[a.estadoCobro] - ordenEstado[b.estadoCobro];
    }
    // Si el estado es el mismo, ordenar por fecha de vencimiento (más antiguo primero para Vencidos/Pendientes)
    const fechaA = a.fechaVencimiento.getTime();
    const fechaB = b.fechaVencimiento.getTime();
    if (a.estadoCobro === 'Vencido' || a.estadoCobro === 'Pendiente de Pago') {
         return fechaA - fechaB; // Ascendente para Vencidos y Pendientes (los más antiguos primero)
    }
    return fechaB - fechaA; // Descendente para otros (los más recientes primero)
  });

  return resultado;
});

const mesesServicioDisponibles = computed(() => {
    const meses = new Set();
    todasLasTiendas.value.forEach(tienda => {
        if (tienda.mesServicio) {
            meses.add(tienda.mesServicio);
        }
    });
    return Array.from(meses).sort((a,b) => b.localeCompare(a)); // Ordenar más recientes primero
});


const resumenCobros = computed(() => {
  const resumen = {
    totalPagado: 0, cantidadPagados: 0,
    totalPendiente: 0, cantidadPendientes: 0,
    totalVencido: 0, cantidadVencidos: 0,
    totalProyectado: 0, cantidadProyectados: 0,
  };
  const hoy = new Date();
  const primerDiaProximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
  const ultimoDiaProximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 2, 0);


  listaDeCobros.value.forEach(cobro => {
    switch (cobro.estadoCobro) {
      case 'Pagado':
        resumen.totalPagado += cobro.costo;
        resumen.cantidadPagados++;
        break;
      case 'Pendiente de Pago':
        resumen.totalPendiente += cobro.costo;
        resumen.cantidadPendientes++;
        break;
      case 'Vencido':
        resumen.totalVencido += cobro.costo;
        resumen.cantidadVencidos++;
        break;
      case 'Proyectado':
        // Contar solo los del próximo mes para el resumen específico de "Proyectados (Próx. Mes)"
        const [yearServicio, monthServicio] = cobro.mesServicio.split('-').map(Number);
        const fechaServicio = new Date(yearServicio, monthServicio - 1, 1);
        if (fechaServicio >= primerDiaProximoMes && fechaServicio <= ultimoDiaProximoMes) {
            resumen.totalProyectado += cobro.costo;
            resumen.cantidadProyectados++;
        }
        break;
    }
  });
  return resumen;
});

const confirmarMarcarComoPagado = (cobro) => {
  cobroSeleccionado.value = cobro;
  mostrarConfirmacionPago.value = true;
}

const marcarComoPagado = async () => {
  if (!cobroSeleccionado.value) return;
  cargando.value = true; // Podrías usar un loader específico para la acción

  try {
    const tiendaRef = doc(db, 'tiendas', cobroSeleccionado.value.tiendaId);
    await updateDoc(tiendaRef, {
      estadoProceso: 'Pagado'
      // Opcionalmente, podrías añadir una fechaDePago: serverTimestamp()
    });

    // Actualizar localmente o recargar todo
    // Opción 1: Actualizar localmente
    const index = listaDeCobros.value.findIndex(c => c.tiendaId === cobroSeleccionado.value.tiendaId && c.mesServicio === cobroSeleccionado.value.mesServicio);
    if (index !== -1) {
      listaDeCobros.value[index].estadoCobro = 'Pagado';
      listaDeCobros.value[index].estadoProcesoOriginal = 'Pagado';
      listaDeCobros.value[index].diasParaVencer = null; // Ya no aplica
    }
    // Opción 2: Recargar todo (más simple si hay muchas interdependencias)
    // await cargarTiendasOriginales(); // Esto re-generará la lista de cobros

  } catch (error) {
    console.error("Error al marcar como pagado:", error);
    // Aquí podrías mostrar una notificación de error al usuario
  } finally {
    mostrarConfirmacionPago.value = false;
    cobroSeleccionado.value = null;
    cargando.value = false;
  }
}

const verDetallesTienda = (tiendaId) => {
    const tienda = todasLasTiendas.value.find(t => t.id === tiendaId);
    if (tienda) {
        tiendaParaDetalle.value = tienda;
        mostrarDetallesTienda.value = true;
    } else {
        console.warn("No se encontró la tienda para detalles con ID:", tiendaId);
        // Podrías mostrar un mensaje al usuario
    }
};


// --- Funciones de Utilidad (Formato) ---
const formatearFecha = (fechaInput, incluirAno = true) => {
  if (!fechaInput) return 'N/A';
  try {
    let fecha;
    if (fechaInput instanceof Timestamp) { fecha = fechaInput.toDate() }
    else if (fechaInput instanceof Date && !isNaN(fechaInput.getTime())) { fecha = fechaInput; }
    else if (typeof fechaInput === 'string' && fechaInput.includes('-')) { fecha = new Date(fechaInput + 'T00:00:00'); }
    else { return 'Fecha inválida'; }

    if (isNaN(fecha.getTime())) { return 'Fecha inválida'; }
    const opciones = { day: '2-digit', month: '2-digit' };
    if (incluirAno) { opciones.year = 'numeric'; }
    return fecha.toLocaleDateString('es-GT', opciones);
  } catch (e) { return 'Fecha inválida'; }
}

const formatearMes = (mesStr) => { // YYYY-MM
  if (!mesStr || !mesStr.includes('-')) return mesStr || 'N/A';
  try {
    const [ano, mes] = mesStr.split('-');
    const fecha = new Date(Number(ano), Number(mes) - 1, 1);
    if (isNaN(fecha.getTime())) { return mesStr; }
    let mesFormateado = fecha.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });
    return mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);
  } catch (e) { return mesStr; }
}

// --- Helpers Visuales (Colores/Badges) ---
// Copiado de tu script de Tiendas, adaptar si es necesario
const getProcessStatusColor = (status) => {
    switch (status) {
        case 'En proceso de ODS': return 'text-yellow-400';
        case 'En COVA': return 'text-cyan-400';
        case 'Facturado': return 'text-blue-400'; // Azul para Facturado
        case 'Pagado': return 'text-green-400';
        case 'Pendiente': default: return 'text-gray-400';
    }
}

const getEstadoCobroColor = (estado) => {
  switch (estado) {
    case 'Pagado': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'Vencido': return 'bg-red-500/20 text-red-400 border border-red-500/30';
    case 'Pendiente de Pago': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'Proyectado': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}

const getVencimientoColor = (diasParaVencer, estadoCobro) => {
  if (estadoCobro === 'Pagado' || estadoCobro === 'Proyectado') return 'text-gray-400';
  if (diasParaVencer < 0) return 'text-red-400 font-semibold'; // Vencido
  if (diasParaVencer <= 7) return 'text-yellow-400'; // Próximo a vencer
  return 'text-gray-300'; // Pendiente con tiempo
}


onMounted(async () => {
  await cargarTiendasOriginales()
})

</script>

<style scoped>
/* Importa o copia los estilos de tu componente de Tiendas para consistencia */
/* ... (los mismos estilos que tienes en el <style scoped> de tu Tiendas.vue) ... */
/* --- Estilos Base con Efecto Glass y Refinamientos --- */

/* Contenedor Glass Genérico */
.glass-container {
  @apply bg-gray-800/70 backdrop-blur-lg; /* Ajusta transparencia y blur aquí */
}
.glass-card {
    @apply bg-gray-800/60 backdrop-blur-md rounded-lg shadow p-4; /* Para tarjetas de resumen */
}

/* Inputs y Textarea */
.input-primary {
  @apply w-full px-3 py-2 rounded-lg border border-gray-600/70 bg-gray-900/40 text-gray-200 placeholder-gray-500 /* Fondo más oscuro/transparente */
        focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500 /* Color de foco cyan */
        transition-all duration-150 text-sm shadow-inner shadow-black/30 /* Sombra interior más notable */
        disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed;
}
/* Estilo específico para selects para mejorar apariencia */
.select-input {
  @apply appearance-none bg-no-repeat bg-right pr-8;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* Flecha gris más clara */
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
}
.input-primary:focus.select-input {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2322d3ee' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* Flecha cyan en focus */
}
/* Estilo para las opciones del select */
.option-dark {
  @apply bg-gray-800 text-gray-200;
}

.label-form { @apply block text-sm font-medium text-gray-400 mb-1.5; }

/* Botones */
.btn-primary { @apply px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center; }
.btn-secondary { @apply px-4 py-2 bg-gray-600/70 hover:bg-gray-500/70 border border-gray-500/50 text-gray-200 font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-400 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center; }
.btn-icon { @apply p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-cyan-400 transition duration-150 ease-in-out; }

.loading-overlay { @apply absolute inset-0 bg-gray-800 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl; }

/* Tabla */
.th-table { @apply px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700; }
.td-table { @apply px-4 py-3 whitespace-nowrap text-sm text-gray-300; }
.badge { @apply px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap; }

/* Modales */
.modal-backdrop { @apply fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out; }
.modal-content { @apply bg-gray-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-2xl shadow-black/40 w-full transform transition-all duration-300 ease-out mx-auto; }
.modal-header { @apply flex justify-between items-center p-4 border-b border-gray-700/50; }
.modal-title { @apply text-xl font-bold text-cyan-400 glow-cyan; }
.modal-close-btn { @apply text-gray-500 hover:text-cyan-400 text-3xl leading-none font-semibold p-1 -m-1 transition focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-full; }
.modal-footer { @apply p-4 border-t border-gray-700/50 flex justify-end; }

/* Transiciones Modal */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content { transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02); }
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content { transform: scale(0.95) translateY(-10px); opacity: 0; }

/* Glow effect */
.glow-cyan { /* Cambiado a cyan para este módulo */
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.5), 0 0 16px rgba(34, 211, 238, 0.4);
}
/* Clases dinámicas Tailwind para colores específicos (asegurar que no se purguen) */
.border-green-500 {} .hover\:shadow-green-500\/10 {} .text-green-400 {}
.border-yellow-500 {} .hover\:shadow-yellow-500\/10 {} .text-yellow-400 {}
.border-red-500 {} .hover\:shadow-red-500\/10 {} .text-red-400 {}
.border-blue-500 {} .hover\:shadow-blue-500\/10 {} .text-blue-400 {}
.bg-green-500\/20 {} .border-green-500\/30 {}
.bg-red-500\/20 {} .border-red-500\/30 {}
.bg-yellow-500\/20 {} .border-yellow-500\/30 {}
.bg-blue-500\/20 {} .border-blue-500\/30 {}
.bg-gray-500\/20 {} .border-gray-500\/30 {}
.text-gray-400 {}
.focus\:ring-green-500 {}
.border-t-8 {}
.border-amber-500 {} .border-pink-500 {} .border-gray-500 {} .border-emerald-500 {}
/* ... (añade aquí otras clases de colores dinámicos que uses y no estén cubiertas si usas purga de CSS) ... */
</style>