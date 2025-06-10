<template>
  <div class="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 text-slate-700">

    <div class="md3-card mb-8 py-4 px-6">
      <h2 class="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 glow-emerald mb-2 text-center">Gestión de Cotizaciones</h2>
      <p class="text-emerald-100/70 text-center text-sm md:text-base">Crea, administra y da seguimiento a tus propuestas comerciales</p>
    </div>

    <div class="mb-6 text-right">
      <button @click="abrirModalNuevaCotizacion" class="btn-primary-emerald tech-btn relative overflow-hidden group">
        <span class="z-10 relative flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Nueva Cotización
        </span>
        <span class="tech-btn-bg-emerald absolute inset-0"></span>
      </button>
    </div>

    <div class="md3-card mb-6 p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="filtroCliente" class="label-form text-xs">Buscar por Cliente:</label>
          <input type="text" id="filtroCliente" v-model="filtros.cliente" placeholder="Nombre del cliente..." class="input-primary input-sm">
        </div>
        <div>
          <label for="filtroEstado" class="label-form text-xs">Filtrar por Estado:</label>
          <select id="filtroEstado" v-model="filtros.estado" class="input-primary select-input input-sm">
            <option value="" class="option-light">Todos los Estados</option>
            <option value="Borrador" class="option-light">Borrador</option>
            <option value="Enviada" class="option-light">Enviada</option>
            <option value="Aceptada" class="option-light">Aceptada</option>
            <option value="Rechazada" class="option-light">Rechazada</option>
            <option value="Facturada" class="option-light">Facturada</option>
          </select>
        </div>
        <div>
          <label for="filtroFecha" class="label-form text-xs">Filtrar por Mes de Creación:</label>
            <input type="month" id="filtroFecha" v-model="filtros.mesCreacion" class="input-primary month-input input-sm">
        </div>
      </div>
    </div>

    <div class="md3-card overflow-hidden mb-10 relative">
      <div v-if="cargandoCotizaciones" class="loading-overlay">
        <svg class="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span class="ml-2 text-gray-200">Cargando Cotizaciones...</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-900/70 backdrop-blur-sm">
            <tr>
              <th class="th-table"># Cotización</th>
              <th class="th-table">Fecha Creación</th>
              <th class="th-table">Cliente</th>
              <th class="th-table hidden md:table-cell">Validez Hasta</th>
              <th class="th-table">Total (Q)</th>
              <th class="th-table">Estado</th>
              <th class="th-table">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700/50">
            <tr v-for="cotizacion in cotizacionesFiltradas" :key="cotizacion.id" class="hover:bg-gray-700/40 transition-colors duration-150">
              <td class="td-table font-mono text-emerald-400">{{ cotizacion.numeroCotizacion }}</td>
              <td class="td-table">{{ formatearFecha(cotizacion.fechaCreacion) }}</td>
              <td class="td-table">
                <div class="font-medium text-gray-100">{{ cotizacion.clienteNombre }}</div>
                <div v-if="cotizacion.clienteContacto" class="text-xs text-gray-500">{{ cotizacion.clienteContacto }}</div>
              </td>
              <td class="td-table hidden md:table-cell">{{ formatearFecha(cotizacion.fechaVencimiento) }}</td>
              <td class="td-table font-semibold">Q{{ (cotizacion.totalGeneral || 0).toFixed(2) }}</td>
              <td class="td-table">
                <span class="badge" :class="getEstadoCotizacionColor(cotizacion.estado)">{{ cotizacion.estado }}</span>
              </td>
              <td class="td-table">
                <div class="flex space-x-1">
                  <button @click="verDetallesCotizacion(cotizacion)" class="btn-icon text-emerald-400 hover:text-emerald-300" title="Ver Detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
                  </button>
                  <button @click="editarCotizacion(cotizacion)" class="btn-icon text-amber-400 hover:text-amber-300" title="Editar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button @click="confirmarEliminarCotizacion(cotizacion)" class="btn-icon text-red-500 hover:text-red-400" title="Eliminar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="cotizacionesFiltradas.length === 0 && !cargandoCotizaciones">
              <td colspan="7" class="px-4 py-8 text-center">
                <div class="flex flex-col items-center justify-center space-y-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-gray-500 text-lg">No se encontraron cotizaciones</p>
                  <p class="text-gray-600 text-sm">{{ filtros.cliente || filtros.estado || filtros.mesCreacion ? 'Prueba con otros criterios de búsqueda o filtro' : 'Aún no has creado ninguna cotización' }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="mostrarModalCotizacion" class="modal-backdrop">
        <div class="modal-content-emerald max-w-4xl max-h-[95vh]">
          <div class="modal-header-emerald">
            <h3 class="modal-title text-emerald-300">{{ modoEdicionCotizacion ? 'Editar Cotización' : 'Crear Nueva Cotización' }}</h3>
            <button @click="cerrarModalCotizacion" class="modal-close-btn" title="Cerrar">&times;</button>
          </div>
          <form @submit.prevent="guardarCotizacion" class="overflow-y-auto p-6 space-y-6 max-h-[calc(95vh-140px)] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
            
            <div class="pb-4 border-b border-gray-700/50">
                <h4 class="text-md font-semibold text-gray-300 mb-3">Datos de la Empresa</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="cot-empresaNombre" class="label-form">Nombre Empresa</label>
                        <input type="text" id="cot-empresaNombre" v-model="nuevaCotizacion.empresaNombre" class="input-primary input-sm" placeholder="Nombre de tu empresa">
                    </div>
                    <div>
                        <label for="cot-empresaNit" class="label-form">NIT Empresa</label>
                        <input type="text" id="cot-empresaNit" v-model="nuevaCotizacion.empresaNit" class="input-primary input-sm" placeholder="NIT de tu empresa">
                    </div>
                    <div class="md:col-span-2">
                        <label for="cot-empresaDireccion" class="label-form">Dirección Empresa</label>
                        <input type="text" id="cot-empresaDireccion" v-model="nuevaCotizacion.empresaDireccion" class="input-primary input-sm" placeholder="Dirección de tu empresa">
                    </div>
                    <div>
                        <label for="cot-empresaContacto" class="label-form">Contacto Empresa</label>
                        <input type="text" id="cot-empresaContacto" v-model="nuevaCotizacion.empresaContacto" class="input-primary input-sm" placeholder="Teléfono, Email de tu empresa">
                    </div>
                     <div>
                        <label for="cot-empresaSlogan" class="label-form">Eslogan Empresa (Opcional)</label>
                        <input type="text" id="cot-empresaSlogan" v-model="nuevaCotizacion.empresaSlogan" class="input-primary input-sm" placeholder="Tu eslogan aquí">
                    </div>
                    <div>
                        <label for="cot-empresaLogoUrlEstatica" class="label-form">URL Logo Estático (Opcional, ya no se muestra en PDF)</label>
                        <input type="url" id="cot-empresaLogoUrlEstatica" v-model="nuevaCotizacion.empresaLogoUrlEstatica" class="input-primary input-sm" placeholder="https://ejemplo.com/logo.png">
                         <img v-if="nuevaCotizacion.empresaLogoUrlEstatica" :src="nuevaCotizacion.empresaLogoUrlEstatica" alt="Preview Logo" class="mt-2 h-12 w-auto border border-gray-600 rounded">
                    </div>
                     <div>
                        <label for="cot-pdfTitulo" class="label-form">Título Principal PDF (ej. COTIZACIÓN - JARDINIZACIÓN)</label>
                        <input type="text" id="cot-pdfTitulo" v-model="nuevaCotizacion.pdfTitulo" class="input-primary input-sm" placeholder="COTIZACIÓN - SERVICIOS">
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-700/50">
              <div>
                <label for="cot-clienteNombre" class="label-form">Nombre del Cliente <span class="text-red-500">*</span></label>
                <input type="text" id="cot-clienteNombre" v-model="nuevaCotizacion.clienteNombre" class="input-primary" required placeholder="Ej: Constructora XYZ">
              </div>
              <div>
                <label for="cot-fechaCreacion" class="label-form">Fecha Creación <span class="text-red-500">*</span></label>
                <input type="date" id="cot-fechaCreacion" v-model="nuevaCotizacion.fechaCreacion" class="input-primary date-input" required>
              </div>
              <div>
                <label for="cot-fechaVencimiento" class="label-form">Validez Hasta <span class="text-red-500">*</span></label>
                <input type="date" id="cot-fechaVencimiento" v-model="nuevaCotizacion.fechaVencimiento" class="input-primary date-input" required>
              </div>
              <div class="md:col-span-1">
                <label for="cot-clienteContacto" class="label-form">Contacto (Opcional)</label>
                <input type="text" id="cot-clienteContacto" v-model="nuevaCotizacion.clienteContacto" class="input-primary" placeholder="Ej: Ing. Juan Pérez, Tel: 555-1234">
              </div>
               <div class="md:col-span-2">
                <label for="cot-numero" class="label-form">Número Cotización (Autogenerado si se deja vacío)</label>
                <input type="text" id="cot-numero" v-model="nuevaCotizacion.numeroCotizacion" class="input-primary font-mono" placeholder="Ej: COT-2025-001">
              </div>
               <div class="md:col-span-3">
                <label for="cot-proyectoNombre" class="label-form">Nombre del Proyecto/Referencia</label>
                <input type="text" id="cot-proyectoNombre" v-model="nuevaCotizacion.proyectoNombre" class="input-primary" placeholder="Ej: Jardinería Residencia XYZ">
              </div>
            </div>

            <div class="space-y-3">
              <h4 class="text-md font-semibold text-gray-300">Líneas de la Cotización:</h4>
              <div v-for="(item, index) in nuevaCotizacion.lineItems" :key="index" class="grid grid-cols-12 gap-x-3 gap-y-2 items-end p-3 bg-gray-700/30 rounded-md border border-gray-600/50">
                <div class="col-span-12 md:col-span-6">
                  <label :for="'item-desc-' + index" class="label-form text-xs">Descripción <span class="text-red-500">*</span></label>
                  <input type="text" :id="'item-desc-' + index" v-model="item.descripcion" class="input-primary input-sm" required placeholder="Descripción del servicio o producto">
                </div>
                <div class="col-span-4 md:col-span-2">
                  <label :for="'item-cant-' + index" class="label-form text-xs">Cantidad <span class="text-red-500">*</span></label>
                  <input type="number" :id="'item-cant-' + index" v-model.number="item.cantidad" @input="actualizarTotalItem(index)" min="0.01" step="any" class="input-primary input-sm text-right" required>
                </div>
                <div class="col-span-4 md:col-span-2">
                  <label :for="'item-precio-' + index" class="label-form text-xs">Precio Unit. (Q) <span class="text-red-500">*</span></label>
                  <input type="number" :id="'item-precio-' + index" v-model.number="item.precioUnitario" @input="actualizarTotalItem(index)" min="0.01" step="any" class="input-primary input-sm text-right" required>
                </div>
                <div class="col-span-4 md:col-span-2">
                    <label class="label-form text-xs">Total Item (Q)</label>
                    <input type="text" :value="(item.totalItem || 0).toFixed(2)" class="input-primary input-sm text-right bg-gray-800/50" readonly>
                </div>
                <div class="col-span-12 flex justify-end md:col-span-1 md:justify-start">
                  <button type="button" @click="eliminarLineaItem(index)" class="btn-danger-outline btn-sm p-2" title="Eliminar Línea">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              <button type="button" @click="agregarLineaItem" class="btn-secondary-outline-emerald btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Agregar Línea
              </button>
            </div>
            
            <div class="pt-4 border-t border-gray-700/50">
                <label for="cot-servicioIncluye" class="label-form">El Servicio Incluye (Un punto por línea):</label>
                <textarea id="cot-servicioIncluye" v-model="nuevaCotizacion.servicioIncluye" class="input-primary" rows="5" placeholder="Ej: Suministro de todas las plantas y materiales descritos&#10;Preparación del terreno&#10;..."></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-700/50">
              <div class="md:col-span-2 space-y-4">
                <div>
                  <label for="cot-terminos" class="label-form">Términos y Condiciones</label>
                  <textarea id="cot-terminos" v-model="nuevaCotizacion.terminosCondiciones" class="input-primary" rows="4" placeholder="Ej: Pago 50% anticipado, 50% contra entrega. Validez de la oferta: 15 días."></textarea>
                </div>
                 <div>
                  <label for="cot-notas" class="label-form">Notas Adicionales (Opcional)</label>
                  <textarea id="cot-notas" v-model="nuevaCotizacion.notasAdicionales" class="input-primary" rows="2" placeholder="Cualquier observación o nota interna."></textarea>
                </div>
              </div>
              <div class="space-y-3 p-4 bg-gray-900/30 rounded-lg border border-gray-600/50">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 font-medium">Subtotal:</span>
                  <span class="text-gray-100 font-semibold text-lg">Q{{ subtotalCalculado.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <label for="cot-impuestos" class="text-gray-400 font-medium">Impuestos (IVA {{ (nuevaCotizacion.porcentajeImpuestos || 12).toFixed(0) }}%):</label>
                  <input type="number" id="cot-impuestos" v-model.number="nuevaCotizacion.impuestos" @input="calcularTotalGeneralDesdeImpuesto" class="input-primary input-sm w-24 text-right" placeholder="0.00">
                </div>
                 <div class="flex justify-between items-center pt-2 border-t border-gray-600">
                  <span class="text-emerald-400 font-bold text-xl">TOTAL GENERAL:</span>
                  <span class="text-emerald-400 font-bold text-xl">Q{{ totalGeneralCalculado.toFixed(2) }}</span>
                </div>
                 <div class="mt-2">
                    <label for="cot-estado" class="label-form">Estado de la Cotización</label>
                    <select id="cot-estado" v-model="nuevaCotizacion.estado" class="input-primary select-input">
                        <option value="Borrador" class="option-light">Borrador</option>
                        <option value="Enviada" class="option-light">Enviada</option>
                        <option value="Aceptada" class="option-light">Aceptada</option>
                        <option value="Rechazada" class="option-light">Rechazada</option>
                        <option value="Facturada" class="option-light">Facturada</option>
                    </select>
                </div>
              </div>
            </div>
            
            <div class="modal-footer-emerald mt-2">
              <button type="button" @click="cerrarModalCotizacion" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary-emerald tech-btn relative overflow-hidden group" :disabled="cargandoGuardarCotizacion">
                <span class="z-10 relative flex items-center justify-center">
                  <svg v-if="cargandoGuardarCotizacion" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {{ cargandoGuardarCotizacion ? 'Guardando...' : (modoEdicionCotizacion ? 'Actualizar Cotización' : 'Guardar Cotización') }}
                </span>
                <span class="tech-btn-bg-emerald absolute inset-0"></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="mostrarModalDetalles" class="modal-backdrop">
        <div class="modal-content-emerald max-w-4xl max-h-[90vh]">
          <div class="modal-header-emerald no-print">
            <h3 class="modal-title text-emerald-300">Detalles de Cotización: {{ cotizacionSeleccionada?.numeroCotizacion }}</h3>
            <button @click="mostrarModalDetalles = false" class="modal-close-btn" title="Cerrar">&times;</button>
          </div>
          
          <div 
            class="overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50 print-area-wrapper" 
            v-if="cotizacionSeleccionada" 
            id="areaImprimirCotizacion"
          >
            <div class="new-quote-container">
              <div class="new-quote-header">
                <h1>{{ cotizacionSeleccionada.pdfTitulo || 'COTIZACIÓN' }}</h1>
                <p v-if="cotizacionSeleccionada.proyectoNombre">{{ cotizacionSeleccionada.proyectoNombre }}</p>
              </div>
              
              <div class="new-quote-info-section">
                <div class="new-quote-company-info">
                  <h3>{{ cotizacionSeleccionada.empresaNombre }}</h3>
                  <p v-if="cotizacionSeleccionada.empresaContacto">{{ cotizacionSeleccionada.empresaContacto }}</p>
                  <p v-if="cotizacionSeleccionada.empresaDireccion">{{ cotizacionSeleccionada.empresaDireccion }}</p>
                  <p v-if="cotizacionSeleccionada.empresaNit">NIT: {{ cotizacionSeleccionada.empresaNit }}</p>
                  <p v-if="cotizacionSeleccionada.empresaSlogan" class="slogan">{{ cotizacionSeleccionada.empresaSlogan }}</p>
                </div>
                <div class="new-quote-client-info">
                  <h3>CLIENTE</h3>
                  <p>{{ cotizacionSeleccionada.clienteNombre }}</p>
                  <p v-if="cotizacionSeleccionada.clienteContacto">{{ cotizacionSeleccionada.clienteContacto }}</p>
                  <p class="date"><strong>Fecha:</strong> {{ formatearFecha(cotizacionSeleccionada.fechaCreacion) }}</p>
                  <p class="date"><strong>No. Cotización:</strong> {{ cotizacionSeleccionada.numeroCotizacion }}</p>
                  <p class="date"><strong>Validez:</strong> {{ calcularDiasValidez(cotizacionSeleccionada.fechaCreacion, cotizacionSeleccionada.fechaVencimiento) }} días</p>
                </div>
              </div>
              
              <div class="new-quote-content">
                <div class="new-quote-module">
                  <div class="new-quote-module-header">DETALLE DE PRODUCTOS Y SERVICIOS</div>
                  <div class="new-quote-module-content">
                    <table class="new-quote-table">
                      <thead>
                        <tr>
                          <th class="text-center">CANT.</th>
                          <th>DESCRIPCIÓN</th>
                          <th class="text-right">PRECIO UNIT.</th>
                          <th class="text-right">SUBTOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in cotizacionSeleccionada.lineItems" :key="`detail-item-${index}`">
                          <td class="text-center">{{ item.cantidad }}</td>
                          <td>{{ item.descripcion }}</td>
                          <td class="text-right">Q{{ (item.precioUnitario || 0).toFixed(2) }}</td>
                          <td class="text-right">Q{{ (item.totalItem || 0).toFixed(2) }}</td>
                        </tr>
                        <tr v-for="n in Math.max(0, 2 - cotizacionSeleccionada.lineItems.length)" :key="'empty-detail-'+n" class="empty-row">
                            <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div class="new-quote-summary-and-conditions-grid">
                    <div class="new-quote-conditions-area">
                        <div class="new-quote-module" v-if="cotizacionSeleccionada.servicioIncluye && cotizacionSeleccionada.servicioIncluye.trim() !== ''">
                            <div class="new-quote-module-header">EL SERVICIO INCLUYE</div>
                            <div class="new-quote-module-content">
                                <ul class="new-quote-service-list">
                                    <li v-for="(point, i) in (cotizacionSeleccionada.servicioIncluye || '').split('\n').filter(p => p.trim() !== '')" :key="`si-detail-${i}`">
                                    {{ point }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="new-quote-module" v-if="cotizacionSeleccionada.terminosCondiciones && cotizacionSeleccionada.terminosCondiciones.trim() !== ''">
                            <div class="new-quote-module-header">CONDICIONES GENERALES</div>
                            <div class="new-quote-module-content">
                                <div class="new-quote-conditions-flex">
                                    <div class="new-quote-condition-item">
                                        <pre class="new-quote-terms-text">{{ cotizacionSeleccionada.terminosCondiciones }}</pre>
                                    </div>
                                </div>
                                <p v-if="cotizacionSeleccionada.notasAdicionales" class="new-quote-additional-notes">
                                    <strong>Notas Adicionales:</strong> {{ cotizacionSeleccionada.notasAdicionales }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="new-quote-summary-area">
                        <div class="new-quote-module">
                            <div class="new-quote-module-header">RESUMEN</div>
                            <div class="new-quote-module-content">
                                <table class="new-quote-summary-table">
                                    <tr>
                                        <td>SUBTOTAL</td>
                                        <td class="text-right">Q{{ (cotizacionSeleccionada.subtotal || 0).toFixed(2) }}</td>
                                    </tr>
                                    <tr>
                                        <td>IVA ({{ (cotizacionSeleccionada.porcentajeImpuestos || 12).toFixed(0)}}%)</td>
                                        <td class="text-right">Q{{ (cotizacionSeleccionada.impuestos || 0).toFixed(2) }}</td>
                                    </tr>
                                    <tr class="new-quote-total-row">
                                        <td>TOTAL</td>
                                        <td class="text-right">Q{{ (cotizacionSeleccionada.totalGeneral || 0).toFixed(2) }}</td>
                                    </tr>
                                </table>
                                <div class="new-quote-total-section">
                                    <span>MONTO TOTAL:</span>
                                    <span class="new-quote-total-amount">Q{{ (cotizacionSeleccionada.totalGeneral || 0).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="new-quote-signature-section">
                  <div class="new-quote-signature-line">
                    Elaborado por:<br>
                    {{ cotizacionSeleccionada.empresaNombre }}
                  </div>
                  <div class="new-quote-signature-line">
                    Aprobado por:<br>
                    {{ cotizacionSeleccionada.clienteNombre }}
                  </div>
                </div>
              </div>
              
              <div class="new-quote-footer">
                <p>Para aceptación de la presente cotización, favor firmar y enviar al correo electrónico o contactar al número telefónico indicado.</p>
                <p><strong>¡Gracias por confiar en nuestros servicios!</strong></p>
              </div>
            </div>
          </div>

          <div class="modal-footer-emerald no-print">
            <button @click="imprimirVentana" class="btn-primary-emerald btn-sm mr-auto"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Imprimir Cotización
            </button>
            <button @click="mostrarModalDetalles = false" class="btn-secondary">Cerrar</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
        <div v-if="mostrarConfirmacionEliminar">
          <div class="modal-backdrop">
            <div class="modal-content-emerald max-w-md">
                <div class="modal-header-emerald"><h3 class="modal-title text-red-400">Confirmar Eliminación</h3><button @click="mostrarConfirmacionEliminar = false" class="modal-close-btn" title="Cerrar">&times;</button></div>
                <div class="p-6">
                    <p class="text-gray-300">¿Estás seguro que deseas eliminar la cotización <strong class="text-gray-100">{{ cotizacionParaEliminar?.numeroCotizacion }}</strong> para el cliente <strong class="text-gray-100">{{ cotizacionParaEliminar?.clienteNombre }}</strong>?</p>
                    <p class="text-sm text-red-400 mt-2">Esta acción no se puede deshacer.</p>
                </div>
                <div class="modal-footer-emerald gap-3">
                    <button @click="mostrarConfirmacionEliminar = false" class="btn-secondary">Cancelar</button>
                    <button @click="ejecutarEliminarCotizacion" class="btn-danger">Sí, Eliminar</button>
                </div>
            </div>
          </div>
        </div>
      </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, Timestamp, query, orderBy, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase.js'; // Asegúrate que la ruta a tu config de Firebase sea correcta

// Estados reactivos
const cotizaciones = ref([]);
const nuevaCotizacion = ref(getObjetoCotizacionVacia());
const modoEdicionCotizacion = ref(false);
const cotizacionSeleccionada = ref(null); 
const cotizacionParaEliminar = ref(null); 

// Estados de carga y visibilidad de modales
const cargandoCotizaciones = ref(true);
const cargandoGuardarCotizacion = ref(false);
const mostrarModalCotizacion = ref(false);
const mostrarModalDetalles = ref(false);
const mostrarConfirmacionEliminar = ref(false);

// Filtros
const filtros = ref({
  cliente: '',
  estado: '',
  mesCreacion: '' 
});

// Función para obtener un objeto de cotización vacío o con valores por defecto
function getObjetoCotizacionVacia() {
  const hoy = new Date();
  const fechaCreacionDefault = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  const fechaVencimientoObj = new Date(hoy);
  fechaVencimientoObj.setDate(hoy.getDate() + 15);
  const fechaVencimientoDefault = `${fechaVencimientoObj.getFullYear()}-${String(fechaVencimientoObj.getMonth() + 1).padStart(2, '0')}-${String(fechaVencimientoObj.getDate()).padStart(2, '0')}`;

  return {
    id: null,
    numeroCotizacion: '',
    fechaCreacion: fechaCreacionDefault,
    fechaVencimiento: fechaVencimientoDefault,
    clienteNombre: '',
    clienteContacto: null, 
    lineItems: [{ descripcion: '', cantidad: 1, precioUnitario: 0, totalItem: 0 }],
    subtotal: 0,
    porcentajeImpuestos: 12,
    impuestos: 0,
    totalGeneral: 0,
    terminosCondiciones: 'Validez de la oferta: 15 días.\nForma de pago: 50% anticipo, 50% contra entrega.\nTiempo de entrega: 5 días hábiles después de confirmado el anticipo.\nGarantía: 1 mes por plantas en buen estado.\nMantenimiento: 1 mes sin costo adicional.',
    notasAdicionales: null, 
    estado: 'Borrador',
    empresaNombre: "Soluciones Integrales GN", 
    empresaDireccion: "Ciudad de Guatemala",
    empresaContacto: "Tel: 3512-5327", 
    empresaNit: "120039877",
    empresaSlogan: "Especialistas en jardinización comercial", 
    empresaLogoUrlEstatica: "", 
    pdfTitulo: "COTIZACIÓN - JARDINIZACIÓN", 
    proyectoNombre: "Proyecto Integral de Paisajismo", 
    servicioIncluye: "Suministro de todas las plantas y materiales descritos\nPreparación del terreno\nPlantación y distribución según diseño\nLimpieza final del área de trabajo\nVisitas semanales de mantenimiento durante el primer mes\nReemplazo de plantas que presenten problemas durante el período de garantía", 
  };
}

// Calcula los días de validez entre dos fechas
const calcularDiasValidez = (fechaCreacion, fechaVencimiento) => {
    if (!fechaCreacion || !fechaVencimiento) return 'N/A';
    let inicio = fechaCreacion instanceof Timestamp ? fechaCreacion.toDate() : new Date(fechaCreacion);
    let fin = fechaVencimiento instanceof Timestamp ? fechaVencimiento.toDate() : new Date(fechaVencimiento);
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return 'N/A';
    const diffTiempo = Math.abs(fin.getTime() - inicio.getTime());
    const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
    return diffDias;
};

// Formatea una fecha a un string legible
const formatearFecha = (fechaInput, incluirHora = false) => {
  if (!fechaInput) return 'N/A';
  let fechaObj;
  if (fechaInput instanceof Timestamp) {
    fechaObj = fechaInput.toDate();
  } else if (typeof fechaInput === 'string') {
    if (fechaInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        fechaObj = new Date(fechaInput + 'T00:00:00Z'); 
    } else {
        fechaObj = new Date(fechaInput);
    }
  } else if (fechaInput instanceof Date) {
    fechaObj = fechaInput;
  } else {
    return 'Fecha Inválida';
  }

  if (isNaN(fechaObj.getTime())) return 'Fecha Inválida';
  
  const opciones = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' }; 
  if (incluirHora) {
    opciones.hour = '2-digit';
    opciones.minute = '2-digit';
  }
  return fechaObj.toLocaleDateString('es-GT', opciones);
};

// Genera un número de cotización consecutivo
const generarNumeroCotizacion = async () => {
    const ahora = new Date();
    const anio = ahora.getUTCFullYear(); 
    const mes = String(ahora.getUTCMonth() + 1).padStart(2, '0'); 
    const prefijo = `COT-${anio}-${mes}-`;

    const inicioMes = Timestamp.fromDate(new Date(Date.UTC(anio, ahora.getUTCMonth(), 1)));
    const finMes = Timestamp.fromDate(new Date(Date.UTC(anio, ahora.getUTCMonth() + 1, 0, 23, 59, 59, 999)));

    const q = query(collection(db, "cotizaciones"), 
                    where("fechaCreacion", ">=", inicioMes), 
                    where("fechaCreacion", "<=", finMes)
                  );
    try {
        const snapshot = await getCountFromServer(q);
        const consecutivo = snapshot.data().count + 1;
        return `${prefijo}${String(consecutivo).padStart(3, '0')}`;
    } catch (error) {
        console.error("Error generando número de cotización:", error);
        return `${prefijo}${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`; 
    }
};

// Manejo de líneas de items
const agregarLineaItem = () => {
  nuevaCotizacion.value.lineItems.push({ 
    descripcion: '', cantidad: 1, precioUnitario: 0, totalItem: 0, 
  });
};

const eliminarLineaItem = (index) => {
  nuevaCotizacion.value.lineItems.splice(index, 1);
  actualizarSubtotalYTotales();
};

const actualizarTotalItem = (index) => {
  const item = nuevaCotizacion.value.lineItems[index];
  item.totalItem = parseFloat(((Number(item.cantidad) || 0) * (Number(item.precioUnitario) || 0)).toFixed(2));
};

// Propiedades computadas
const subtotalCalculado = computed(() => {
  return parseFloat(nuevaCotizacion.value.lineItems.reduce((sum, item) => sum + (item.totalItem || 0), 0).toFixed(2));
});

const totalGeneralCalculado = computed(() => {
    return parseFloat(((subtotalCalculado.value || 0) + (nuevaCotizacion.value.impuestos || 0)).toFixed(2));
});

// Watchers
watch([() => nuevaCotizacion.value.porcentajeImpuestos, subtotalCalculado], ([newPorcentaje, newSubtotal], [oldPorcentaje, oldSubtotal]) => {
    if (newPorcentaje !== oldPorcentaje || newSubtotal !== oldSubtotal) {
        const porcentajeNum = Number(newPorcentaje) || 0;
        nuevaCotizacion.value.impuestos = parseFloat(((newSubtotal * porcentajeNum) / 100).toFixed(2));
    }
}, { immediate: true });

const calcularTotalGeneralDesdeImpuesto = () => {
    const subtotal = subtotalCalculado.value;
    const impuestosManual = Number(nuevaCotizacion.value.impuestos) || 0;
    if (subtotal > 0) {
        nuevaCotizacion.value.porcentajeImpuestos = parseFloat(((impuestosManual / subtotal) * 100).toFixed(2));
    } else if (impuestosManual > 0 && subtotal === 0) {
        nuevaCotizacion.value.porcentajeImpuestos = 0; 
    } else {
        nuevaCotizacion.value.porcentajeImpuestos = 0;
    }
};

// Carga de datos
const cargarCotizaciones = async () => {
  cargandoCotizaciones.value = true;
  try {
    const q = query(collection(db, "cotizaciones"), orderBy("fechaCreacion", "desc"));
    const querySnapshot = await getDocs(q);
    cotizaciones.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error cargando cotizaciones: ", error);
    alert("Error al cargar las cotizaciones. Por favor, intente de nuevo.");
  } finally {
    cargandoCotizaciones.value = false;
  }
};

// Manejo de Modales
const abrirModalNuevaCotizacion = async () => {
  modoEdicionCotizacion.value = false;
  nuevaCotizacion.value = getObjetoCotizacionVacia(); 
  try {
    nuevaCotizacion.value.numeroCotizacion = await generarNumeroCotizacion();
  } catch (e) {
    console.error("Fallo al generar número de cotización inicial:", e)
  }
  mostrarModalCotizacion.value = true;
};

const editarCotizacion = (cot) => {
  modoEdicionCotizacion.value = true;
  const cotEditable = JSON.parse(JSON.stringify(cot)); 
  
  const parseDateForInput = (dateField) => {
    if (!dateField) {
        const hoy = new Date();
        return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    }
    if (dateField && dateField.seconds) { 
      return new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().toISOString().split('T')[0];
    } else if (typeof dateField === 'string' && dateField.match(/^\d{4}-\d{2}-\d{2}/)) { 
        return dateField.split('T')[0]; 
    }
    console.warn("Formato de fecha no reconocido para input:", dateField);
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  };

  const baseCot = getObjetoCotizacionVacia();
  nuevaCotizacion.value = {
    ...baseCot, 
    ...cotEditable,
    id: cot.id, 
    fechaCreacion: parseDateForInput(cotEditable.fechaCreacion),
    fechaVencimiento: parseDateForInput(cotEditable.fechaVencimiento),
    clienteContacto: cotEditable.clienteContacto || null,
    notasAdicionales: cotEditable.notasAdicionales || null,
    empresaSlogan: cotEditable.empresaSlogan || baseCot.empresaSlogan,
    empresaLogoUrlEstatica: cotEditable.empresaLogoUrlEstatica || baseCot.empresaLogoUrlEstatica,
    pdfTitulo: cotEditable.pdfTitulo || baseCot.pdfTitulo,
    proyectoNombre: cotEditable.proyectoNombre || baseCot.proyectoNombre,
    servicioIncluye: cotEditable.servicioIncluye || baseCot.servicioIncluye,
    porcentajeImpuestos: Number(cotEditable.porcentajeImpuestos) || baseCot.porcentajeImpuestos,
    impuestos: Number(cotEditable.impuestos) || 0,
    subtotal: Number(cotEditable.subtotal) || 0,
    totalGeneral: Number(cotEditable.totalGeneral) || 0,
  };
  
  nuevaCotizacion.value.lineItems = (cotEditable.lineItems || []).map(item => ({
      descripcion: String(item.descripcion || ''),
      cantidad: Number(item.cantidad) || 1,
      precioUnitario: Number(item.precioUnitario) || 0,
      totalItem: Number(item.totalItem) || 0, 
  }));
  if (nuevaCotizacion.value.lineItems.length === 0) {
      nuevaCotizacion.value.lineItems = [getObjetoCotizacionVacia().lineItems[0]];
  }
  
  actualizarSubtotalYTotales();
  mostrarModalCotizacion.value = true;
};

const guardarCotizacion = async () => {
  if (!nuevaCotizacion.value.clienteNombre || 
      !nuevaCotizacion.value.fechaCreacion || 
      !nuevaCotizacion.value.fechaVencimiento || 
      nuevaCotizacion.value.lineItems.some(item => !item.descripcion || !(Number(item.cantidad)>0) || !(Number(item.precioUnitario)>=0) )) {
    alert("Por favor, complete todos los campos obligatorios.");
    return;
  }
  cargandoGuardarCotizacion.value = true;
  try {
    actualizarSubtotalYTotales(); 
    nuevaCotizacion.value.subtotal = subtotalCalculado.value;
    const porcentajeNum = Number(nuevaCotizacion.value.porcentajeImpuestos) || 0;
    nuevaCotizacion.value.impuestos = parseFloat(((nuevaCotizacion.value.subtotal * porcentajeNum) / 100).toFixed(2));

    const lineItemsParaGuardar = nuevaCotizacion.value.lineItems.map(item => {
        return {
            descripcion: String(item.descripcion || ''),
            cantidad: Number(item.cantidad) || 0,
            precioUnitario: Number(item.precioUnitario) || 0,
            totalItem: Number(item.totalItem) || 0,
        };
    });

    const datosParaGuardar = {
      numeroCotizacion: nuevaCotizacion.value.numeroCotizacion || await generarNumeroCotizacion(),
      fechaCreacion: Timestamp.fromDate(new Date(nuevaCotizacion.value.fechaCreacion + 'T00:00:00Z')),
      fechaVencimiento: Timestamp.fromDate(new Date(nuevaCotizacion.value.fechaVencimiento + 'T00:00:00Z')),
      clienteNombre: String(nuevaCotizacion.value.clienteNombre || ''),
      clienteContacto: nuevaCotizacion.value.clienteContacto || null,
      lineItems: lineItemsParaGuardar,
      subtotal: Number(nuevaCotizacion.value.subtotal) || 0,
      porcentajeImpuestos: Number(nuevaCotizacion.value.porcentajeImpuestos) || 0,
      impuestos: Number(nuevaCotizacion.value.impuestos) || 0,
      totalGeneral: Number(totalGeneralCalculado.value) || 0,
      terminosCondiciones: String(nuevaCotizacion.value.terminosCondiciones || ''),
      notasAdicionales: nuevaCotizacion.value.notasAdicionales || null,
      estado: String(nuevaCotizacion.value.estado || 'Borrador'),
      empresaNombre: String(nuevaCotizacion.value.empresaNombre || ''),
      empresaDireccion: nuevaCotizacion.value.empresaDireccion || null,
      empresaContacto: nuevaCotizacion.value.empresaContacto || null,
      empresaNit: nuevaCotizacion.value.empresaNit || null,
      empresaSlogan: nuevaCotizacion.value.empresaSlogan || null,
      empresaLogoUrlEstatica: nuevaCotizacion.value.empresaLogoUrlEstatica || null,
      pdfTitulo: nuevaCotizacion.value.pdfTitulo || 'COTIZACIÓN',
      proyectoNombre: nuevaCotizacion.value.proyectoNombre || 'Servicios Profesionales',
      servicioIncluye: nuevaCotizacion.value.servicioIncluye || null,
    };

    if (modoEdicionCotizacion.value && nuevaCotizacion.value?.id) {
      const cotRef = doc(db, "cotizaciones", nuevaCotizacion.value.id);
      await updateDoc(cotRef, datosParaGuardar);
      alert("Cotización actualizada con éxito.");
    } else {
      datosParaGuardar.timestampCreacionServer = serverTimestamp(); 
      await addDoc(collection(db, "cotizaciones"), datosParaGuardar);
      alert("Cotización guardada con éxito.");
    }
    cerrarModalCotizacion();
    await cargarCotizaciones();
  } catch (error) {
    console.error("Error guardando cotización: ", error);
    alert("Error al guardar la cotización: " + error.message);
  } finally {
    cargandoGuardarCotizacion.value = false;
  }
};

const cerrarModalCotizacion = () => {
  mostrarModalCotizacion.value = false;
  modoEdicionCotizacion.value = false;
  nuevaCotizacion.value = getObjetoCotizacionVacia(); 
};

const confirmarEliminarCotizacion = (cot) => {
    cotizacionParaEliminar.value = cot;
    mostrarConfirmacionEliminar.value = true;
};

const ejecutarEliminarCotizacion = async () => {
    if (!cotizacionParaEliminar.value?.id) return;
    try {
        await deleteDoc(doc(db, "cotizaciones", cotizacionParaEliminar.value.id));
        await cargarCotizaciones();
        alert("Cotización eliminada con éxito.");
    } catch (error) { 
        console.error("Error eliminando cotización:", error);
        alert("Error al eliminar la cotización."); 
    } finally { 
        mostrarConfirmacionEliminar.value = false; 
        cotizacionParaEliminar.value = null; 
    }
};

const verDetallesCotizacion = (cot) => {
    const base = getObjetoCotizacionVacia();
    cotizacionSeleccionada.value = {
        ...base, 
        ...JSON.parse(JSON.stringify(cot)),
        fechaCreacion: cot.fechaCreacion, 
        fechaVencimiento: cot.fechaVencimiento,
        lineItems: (cot.lineItems || []).map(item => ({...base.lineItems[0], ...item})) 
    };
    mostrarModalDetalles.value = true;
};

const imprimirVentana = () => {
  const areaImprimirElement = document.getElementById('areaImprimirCotizacion');
  if (!areaImprimirElement) {
    alert("No se pudo encontrar el área de impresión.");
    return;
  }
  
  const contenidoClonado = areaImprimirElement.cloneNode(true);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Cotización ${cotizacionSeleccionada.value?.numeroCotizacion || ''}</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.5; 
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 10pt; 
          }
          .new-quote-container { width: 100%; margin: 0 auto; background: white !important; font-family: 'Roboto', sans-serif !important; }
          .new-quote-header {
            text-align: center;
            background-color: #0d5a3a !important; 
            color: white !important;
            padding: 12px 15px; 
            border-bottom: 4px solid #0a4029 !important; 
          }
          .new-quote-header h1 { 
            margin: 0 0 4px 0;
            font-size: 12pt !important; 
            letter-spacing: 0.5px;
            font-weight: 700; 
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-header p { 
            margin: 4px 0 0;
            font-size: 10pt !important; 
            font-weight: 400;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-info-section {
            display: flex;
            justify-content: space-between;
            padding: 12px 15px; 
            background-color: #f0f8f4 !important;
            border-bottom: 1px solid #ddd !important;
            font-size: 9pt; 
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-company-info, .new-quote-client-info { flex: 1; padding: 4px; }
          .new-quote-company-info h3, .new-quote-client-info h3 { 
            color: #0d5a3a !important;
            border-bottom: 1.5px solid #0d5a3a !important; 
            padding-bottom: 2px;
            margin-top: 0;
            margin-bottom: 6px;
            font-size: 10pt !important; 
            font-weight: 700; 
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-company-info p, .new-quote-client-info p { margin: 2px 0; font-size:9pt; font-weight: 400; font-family: 'Roboto', sans-serif !important; }
          .new-quote-client-info .date { font-style: italic; font-size: 8pt; font-family: 'Roboto', sans-serif !important; }
          .new-quote-company-info .slogan { font-style: italic; font-size: 8pt; color: #555 !important; font-family: 'Roboto', sans-serif !important;}
          .new-quote-content { padding: 15px; font-family: 'Roboto', sans-serif !important; }
          .new-quote-module {
            margin-bottom: 15px; 
            border: 1px solid #ddd !important;
            border-radius: 4px; 
            overflow: hidden;
          }
          .new-quote-module-header { 
            background-color: #0d5a3a !important;
            color: white !important;
            padding: 6px 12px; 
            font-size: 12pt !important; 
            font-weight: 700; 
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-module-content { padding: 10px; background-color: white !important; font-size: 10pt; font-weight: 400; font-family: 'Roboto', sans-serif !important; }
          .new-quote-table {
            width: 100%; border-collapse: collapse;
            margin-bottom: 8px; font-size: 9pt; 
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-table th, .new-quote-table td {
            padding: 6px 8px; 
            text-align: left;
            border-bottom: 1px solid #ddd !important;
            font-weight: 400;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-table th {
            background-color: #f0f8f4 !important;
            color: #0d5a3a !important;
            font-weight: 500; 
            font-size:9pt;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-table td.text-right { text-align: right !important; }
          .new-quote-table td.text-center { text-align: center !important; }
          .new-quote-table .empty-row td { height: 1.3em; border-bottom: 1px solid #eee !important; }
          .new-quote-summary-and-conditions-grid {
            display: grid;
            grid-template-columns: 3fr 2fr; 
            gap: 12px; margin-top: 8px;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-summary-table { width: 100%; font-size: 9pt; font-family: 'Roboto', sans-serif !important;}
          .new-quote-summary-table td { padding: 4px 0; border-bottom: none; font-weight: 400; font-family: 'Roboto', sans-serif !important;}
          .new-quote-summary-table td:last-child { text-align: right; }
          .new-quote-total-row td {
            font-weight: 500 !important; 
            background-color: #f0f8f4 !important;
            color: #333 !important; border-top: 1px solid #ccc !important;
            padding-top: 5px; padding-bottom: 5px;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-total-row td:first-child { color: #0d5a3a !important; }
          .new-quote-total-section {
            text-align: right; padding: 8px 0 0 0;
            border-top: 1px solid #ddd !important; margin-top: 8px;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-total-section span { font-family: 'Roboto', sans-serif !important; }
          .new-quote-total-section span:first-child { margin-right: 6px; font-size: 10pt; font-weight: 500; }
          .new-quote-total-amount { 
            font-size: 11pt !important; 
            font-weight: 700 !important; 
            color: #0d5a3a !important;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-conditions-flex { display: flex; flex-wrap: wrap; gap: 8px; font-family: 'Roboto', sans-serif !important;}
          .new-quote-condition-item {
            flex: 1 1 180px; padding: 8px;
            background-color: #f0f8f4 !important;
            border-left: 3px solid #0d5a3a !important; 
            border-radius: 0 3px 3px 0; font-size: 8pt; 
            font-weight: 400;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-condition-item h4 { 
            margin-top: 0; margin-bottom: 4px;
            color: #0d5a3a !important; font-size: 9pt !important; font-weight: 500; 
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-condition-item p { margin: 1px 0; font-family: 'Roboto', sans-serif !important;}
          .new-quote-terms-text { white-space: pre-wrap; font-size: 9pt; line-height: 1.4; padding: 4px; background-color: #f9f9f9 !important; border: 1px solid #eee !important; border-radius: 2px; font-weight: 400; font-family: 'Roboto', sans-serif !important;}
          .new-quote-additional-notes { margin-top: 10px; font-size: 9pt; color: #555 !important; font-weight: 400; font-family: 'Roboto', sans-serif !important;}
          .new-quote-footer {
            text-align: center; padding: 12px 15px; 
            background-color: #0d5a3a !important; color: white !important;
            font-size: 9pt; margin-top: 15px; 
            border-top: 4px solid #0a4029 !important; 
            font-weight: 400;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-footer p { margin: 2px 0; font-family: 'Roboto', sans-serif !important;}
          .new-quote-footer strong { font-weight: 500; font-family: 'Roboto', sans-serif !important;} 
          .new-quote-signature-section {
            display: flex; justify-content: space-between;
            margin-top: 20mm; 
            padding: 0 8mm; font-size: 9pt;
            page-break-inside: avoid;
            font-weight: 400;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-signature-line {
            border-top: 1px solid #333 !important; width: 40%;
            padding-top: 6px; text-align: center; margin-top: 15px;
            font-family: 'Roboto', sans-serif !important;
          }
          .new-quote-service-list { list-style-type: none; padding-left: 0; font-size: 9pt; font-weight: 400; font-family: 'Roboto', sans-serif !important;}
          .new-quote-service-list li { padding: 5px 0; border-bottom: 1px dashed #ddd !important; font-family: 'Roboto', sans-serif !important;}
          .new-quote-service-list li:last-child { border-bottom: none; }
          .new-quote-service-list li:before {
            content: "✓"; color: #0d5a3a !important;
            margin-right: 8px; font-weight: bold; 
          }
          .new-quote-highlight {
            background-color: #e6fff7 !important; color: #0d5a3a !important;
            font-weight: 500 !important; 
            padding: 1px 3px; border-radius: 2px; font-size: 9pt;
            font-family: 'Roboto', sans-serif !important;
          }
          .text-right { text-align: right !important; }
          .text-center { text-align: center !important; }
          .no-print { display: none !important; }
          
          @page {
            margin: 8mm; 
            size: letter;
          }
        </style>
      </head>
      <body>
      </body>
    </html>
  `);
  doc.body.appendChild(contenidoClonado);
  doc.close();

  iframe.contentWindow.focus();
  iframe.contentWindow.print();
  // setTimeout(() => { document.body.removeChild(iframe); }, 3000); 
};

// Filtra cotizaciones
const cotizacionesFiltradas = computed(() => {
  return cotizaciones.value.filter(cot => {
    const filtroClienteLower = filtros.value.cliente.toLowerCase();
    const matchCliente = !filtros.value.cliente || (cot.clienteNombre && cot.clienteNombre.toLowerCase().includes(filtroClienteLower));
    const matchEstado = !filtros.value.estado || cot.estado === filtros.value.estado;
    
    let matchMesCreacion = true;
    if (filtros.value.mesCreacion && cot.fechaCreacion) {
        let fechaCreacionCot;
        if (cot.fechaCreacion instanceof Timestamp) {
            fechaCreacionCot = cot.fechaCreacion.toDate();
        } else if (typeof cot.fechaCreacion === 'string') {
            fechaCreacionCot = new Date(cot.fechaCreacion.includes('T') ? cot.fechaCreacion : cot.fechaCreacion + 'T00:00:00Z');
        } else if (cot.fechaCreacion instanceof Date) {
            fechaCreacionCot = cot.fechaCreacion;
        } else {
            matchMesCreacion = false; 
        }
        if(matchMesCreacion && !isNaN(fechaCreacionCot.getTime())){ 
            const mesAnioCot = `${fechaCreacionCot.getUTCFullYear()}-${String(fechaCreacionCot.getUTCMonth() + 1).padStart(2, '0')}`;
            matchMesCreacion = mesAnioCot === filtros.value.mesCreacion;
        } else {
            matchMesCreacion = false;
        }
    }
    return matchCliente && matchEstado && matchMesCreacion;
  });
});

// Colores de estado
const getEstadoCotizacionColor = (estado) => {
  switch (estado) {
    case 'Borrador': return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    case 'Enviada': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30'; 
    case 'Aceptada': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    case 'Rechazada': return 'bg-red-500/20 text-red-300 border border-red-500/30';
    case 'Facturada': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'; 
    default: return 'bg-gray-700 text-gray-400';
  }
};

// Hooks y Watchers
onMounted(async () => {
  await cargarCotizaciones();
});

watch(() => nuevaCotizacion.value.lineItems, () => {
    actualizarSubtotalYTotales(); 
}, { deep: true });

const actualizarSubtotalYTotales = () => {
    const subtotal = nuevaCotizacion.value.lineItems.reduce((sum, item) => sum + (Number(item.totalItem) || 0), 0);
    nuevaCotizacion.value.subtotal = parseFloat(subtotal.toFixed(2));
};

watch(modoEdicionCotizacion, (esEdicion) => {
    if(esEdicion && nuevaCotizacion.value.lineItems.length > 0) { 
        actualizarSubtotalYTotales();
    }
});

</script>

<style scoped>
/* ESTILOS GENERALES DE LA APLICACIÓN (EXISTENTES) */
.input-sm {
    @apply py-1.5 text-xs;
}
.label-form { @apply block text-sm font-medium text-gray-400 mb-1; }
.label-form { @apply block text-sm font-medium text-gray-400 mb-1; }
.btn-primary-emerald { @apply px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center; }
.btn-secondary { @apply px-4 py-2 bg-gray-600/70 hover:bg-gray-500/70 border border-gray-500/50 text-gray-200 font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-400 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center; }
.btn-danger { @apply px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition duration-150 ease-in-out flex items-center justify-center; }
.btn-secondary-outline-emerald { @apply px-3 py-1.5 border border-emerald-500/70 text-emerald-300 hover:bg-emerald-500/20 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center; }
.btn-danger-outline { @apply px-3 py-1.5 border border-red-500/70 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center; }
.btn-sm { @apply text-xs px-2 py-1; }
.btn-icon { @apply p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-emerald-400 transition duration-150 ease-in-out; }
.loading-overlay { @apply absolute inset-0 bg-gray-800 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl; }
.th-table { @apply px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700; }
.td-table { @apply px-4 py-3 whitespace-nowrap text-sm text-gray-300; }
.badge { @apply px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap; }
.modal-backdrop { @apply fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out; }
.modal-content-emerald { @apply bg-gray-800/95 backdrop-blur-xl border border-emerald-500/20 rounded-xl shadow-2xl shadow-black/40 w-full transform transition-all duration-300 ease-out mx-auto; }
.modal-header-emerald { @apply flex justify-between items-center p-4 border-b border-emerald-700/50; }
.modal-title { @apply text-xl font-bold; }
.modal-close-btn { @apply text-gray-500 hover:text-emerald-400 text-3xl leading-none font-semibold p-1 -m-1 transition focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded-full; }
.modal-footer-emerald { @apply p-4 border-t border-emerald-700/50 flex justify-end gap-3; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-content-emerald,
.modal-fade-leave-active .modal-content-emerald { transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02); }
.modal-fade-enter-from .modal-content-emerald,
.modal-fade-leave-to .modal-content-emerald { transform: scale(0.95) translateY(-10px); opacity: 0; }
.tech-btn:hover .tech-btn-bg-emerald { opacity: 0.2; }
.tech-btn-bg-emerald { background: linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%); } 
.glow-emerald { text-shadow: 0 0 8px rgba(16, 185, 129, 0.5), 0 0 16px rgba(5, 150, 105, 0.4); }
.scrollbar-thin { scrollbar-width: thin; scrollbar-color: theme('colors.slate.600') theme('colors.slate.700/0.5'); }
.scrollbar-thin::-webkit-scrollbar { width: 6px; }
.scrollbar-thin::-webkit-scrollbar-track { background: theme('colors.slate.700/0.5'); border-radius: 3px; }
.scrollbar-thin::-webkit-scrollbar-thumb { background-color: theme('colors.slate.600'); border-radius: 3px; }

/* --- ESTILOS PARA LA VISTA PREVIA DE COTIZACIÓN EN EL MODAL (FUENTE ROBOTO Y TAMAÑOS AJUSTADOS) --- */
.print-area-wrapper {
  padding: 10px;
  background-color: #e9e9e9;
}

.new-quote-container {
  font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Aplicar Roboto */
  line-height: 1.5; 
  color: #333;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  margin: 0 auto;
  max-width: 800px; 
  border: 1px solid #ccc;
  font-size: 10pt; 
}

.new-quote-header {
  text-align: center;
  background-color: #0d5a3a; 
  color: white;
  padding: 12px 15px; 
  border-bottom: 4px solid #0a4029; 
}
.new-quote-header h1 { 
  margin: 0 0 4px 0;
  font-size: 12pt; 
  letter-spacing: 0.5px;
  font-weight: 700; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-header p { 
  margin: 4px 0 0;
  font-size: 10pt; 
  font-weight: 400; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}

.new-quote-info-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 12px 15px; 
  background-color: #f0f8f4;
  border-bottom: 1px solid #ddd;
  font-size: 9pt; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-company-info, .new-quote-client-info {
  flex: 1;
  min-width: 250px; 
  padding: 4px; 
}
.new-quote-company-info h3, .new-quote-client-info h3 { 
  color: #0d5a3a;
  border-bottom: 1.5px solid #0d5a3a; 
  padding-bottom: 2px;
  margin-top: 0;
  margin-bottom: 6px;
  font-size: 11pt; 
  font-weight: 700; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-company-info p, .new-quote-client-info p { margin: 2px 0; font-size: 9pt; line-height: 1.4; font-weight: 400; font-family: 'Roboto', sans-serif !important; }
.new-quote-client-info .date { font-style: italic; font-size: 8pt; font-family: 'Roboto', sans-serif !important; }
.new-quote-company-info .slogan { font-style: italic; font-size: 8pt; color: #555; font-family: 'Roboto', sans-serif !important; }

.new-quote-content { padding: 15px; font-family: 'Roboto', sans-serif !important; } 
.new-quote-module {
  margin-bottom: 15px; 
  border: 1px solid #ddd;
  border-radius: 4px; 
  overflow: hidden;
}
.new-quote-module-header { 
  background-color: #0d5a3a;
  color: white;
  padding: 6px 12px; 
  font-size: 12pt; 
  font-weight: 700; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-module-content { padding: 10px; background-color: white; font-size: 10pt; font-weight: 400; font-family: 'Roboto', sans-serif !important; }

.new-quote-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
  font-size: 9pt; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-table th, .new-quote-table td {
  padding: 6px 8px; 
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 400; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-table th {
  background-color: #f0f8f4;
  color: #0d5a3a;
  font-weight: 500; 
  font-size: 9pt; 
  white-space: nowrap;
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-table tr:hover td { background-color: #f9f9f9; }
.new-quote-table td.text-right { text-align: right; }
.new-quote-table td.text-center { text-align: center; }
.new-quote-table .empty-row td { height: 1.3em; border-bottom: 1px solid #f7f7f7; }

.new-quote-summary-and-conditions-grid {
  display: grid;
  grid-template-columns: 1fr; 
  gap: 15px; 
  margin-top: 10px; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
@media (min-width: 768px) { 
  .new-quote-summary-and-conditions-grid {
    grid-template-columns: 3fr 2fr; 
  }
}

.new-quote-summary-table { width: 100%; font-size: 9pt; font-family: 'Roboto', sans-serif !important; }
.new-quote-summary-table td { padding: 4px 0; border-bottom: none; font-weight: 400; font-family: 'Roboto', sans-serif !important; }
.new-quote-summary-table td:last-child { text-align: right; }
.new-quote-total-row td {
  font-weight: 500; 
  background-color: #f0f8f4;
  padding-top: 6px; padding-bottom: 6px; 
  border-top: 1px solid #ccc;
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-total-row td:first-child { color: #0d5a3a; }

.new-quote-total-section {
  text-align: right;
  padding: 10px 0 0 0; 
  border-top: 1px solid #ddd;
  margin-top: 8px; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-total-section span { font-family: 'Roboto', sans-serif !important; }
.new-quote-total-section span:first-child { margin-right: 8px; font-weight: 500; font-size: 10pt;}
.new-quote-total-amount { 
  font-size: 11pt; 
  font-weight: 700; 
  color: #0d5a3a;
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}

.new-quote-conditions-flex { display: flex; flex-wrap: wrap; gap: 10px; font-family: 'Roboto', sans-serif !important; } 
.new-quote-condition-item {
  flex: 1 1 180px; 
  padding: 10px; 
  background-color: #f0f8f4;
  border-left: 3px solid #0d5a3a; 
  border-radius: 0 4px 4px 0; 
  font-size: 9pt; 
  font-weight: 400; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-condition-item h4 { 
  margin-top: 0; margin-bottom: 5px; 
  color: #0d5a3a; font-size: 10pt; font-weight: 500; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-condition-item p { margin: 1px 0; line-height: 1.3; font-family: 'Roboto', sans-serif !important; } 
.new-quote-terms-text { /* Para el <pre> de terminos y condiciones */
  white-space: pre-wrap; 
  font-size: 9pt; 
  line-height: 1.4; 
  padding: 6px; 
  background-color: #f9f9f9; 
  border: 1px solid #eee; 
  border-radius: 3px; 
  font-weight: 400;
  font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important; /* Forzar Roboto aquí específicamente */
  margin: 0; /* Resetear margen del pre si es necesario */
}
.new-quote-additional-notes { margin-top: 10px; font-size: 9pt; color: #444; font-style: italic; font-weight: 400; font-family: 'Roboto', sans-serif !important; }

.new-quote-footer {
  text-align: center; padding: 12px 15px; 
  background-color: #0d5a3a; color: white;
  font-size: 9pt; margin-top: 20px; 
  border-top: 4px solid #0a4029; 
  font-weight: 400; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-footer p { margin: 3px 0; font-family: 'Roboto', sans-serif !important; }
.new-quote-footer strong { font-weight: 500; font-family: 'Roboto', sans-serif !important; } 


.new-quote-signature-section {
  display: flex; justify-content: space-around;
  margin-top: 25px; 
  padding: 12px 15px; 
  font-size: 9pt;
  font-weight: 400; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}
.new-quote-signature-line {
  border-top: 1px solid #333;
  width: 40%; 
  padding-top: 6px; 
  text-align: center;
  margin-top: 15px; 
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}

.new-quote-service-list { list-style-type: none; padding-left: 0; font-size: 9pt; font-weight: 400; font-family: 'Roboto', sans-serif !important; }
.new-quote-service-list li { padding: 5px 0; border-bottom: 1px dashed #e0e0e0; font-family: 'Roboto', sans-serif !important; }
.new-quote-service-list li:last-child { border-bottom: none; }
.new-quote-service-list li:before {
  content: "✓"; color: #0d5a3a;
  margin-right: 6px; font-weight: bold; 
}
.new-quote-highlight {
  background-color: #e6fff7; color: #0d5a3a;
  font-weight: 500; 
  padding: 1px 3px; border-radius: 2px; 
  font-size: 9pt;
  font-family: 'Roboto', sans-serif !important; /* Forzar Roboto */
}

.text-right { text-align: right; }
.text-center { text-align: center; }
.no-print { display: block !important; } 
.modal-header-emerald.no-print, .modal-footer-emerald.no-print {
  display: flex !important;
}

.bg-gray-500\/20 {} .text-gray-300 {} .border-gray-500\/30 {}
.bg-blue-500\/20 {} .text-blue-300 {} .border-blue-500\/30 {}
.bg-emerald-500\/20 {} .text-emerald-300 {} .border-emerald-500\/30 {}
.bg-red-500\/20 {} .text-red-300 {} .border-red-500\/30 {}
.bg-purple-500\/20 {} .text-purple-300 {} .border-purple-500\/30 {}
.bg-gray-700 {} .text-gray-400 {}
</style>
