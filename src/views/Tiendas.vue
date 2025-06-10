<template>
  <div class="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 text-slate-700">

    <div class="bg-white border border-gray-200 rounded-lg shadow-lg mb-8 py-4 px-6">
      <h2 class="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 mb-2 text-center">Registro de Tiendas</h2>
      <p class="text-slate-500 text-center text-sm md:text-base">Gestiona y controla tus tiendas y servicios</p>
    </div>

    <div v-if="tiendas.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold text-teal-600 mb-4">Resumen General</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="light-card border-l-4 border-teal-500 transition-all duration-300 hover:shadow-md hover:shadow-teal-500/10">
          <h4 class="font-bold text-lg text-slate-800 mb-1">Total de Tiendas Registradas</h4>
          <p class="text-3xl font-bold text-slate-700">{{ resumenGeneral.totalTiendas }}</p>
        </div>
        <div class="light-card border-l-4 border-teal-500 transition-all duration-300 hover:shadow-md hover:shadow-teal-500/10">
          <h4 class="font-bold text-lg text-slate-800 mb-1">Costo Total General</h4>
          <p class="text-3xl font-bold text-slate-700">Q{{ (resumenGeneral.costoTotalGeneral || 0).toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <div v-if="resumenPorMarca.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold text-emerald-600 mb-4">Resumen por Marca</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(marcaResumen, index) in resumenPorMarca" :key="index"
             class="light-card border-l-4 transition-all duration-300 hover:shadow-md"
             :class="[`border-${getBrandColor(marcaResumen.nombre)}-500`, `hover:shadow-${getBrandColor(marcaResumen.nombre)}-500/10`]">
          <h4 class="font-bold text-lg text-slate-800 mb-1">{{ marcaResumen.nombre }}</h4>
          <p class="text-sm text-slate-500">Tiendas: <span class="font-medium text-slate-700">{{ marcaResumen.conteo }}</span></p>
          <p class="text-sm text-slate-500">Ingresos Totales: <span class="font-medium text-slate-700">Q{{ (marcaResumen.ingresos || 0).toFixed(2) }}</span></p>
        </div>
      </div>
    </div>

    <div v-if="resumenPorConsultor.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold text-teal-600 mb-4">Resumen por Consultor</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(consultorResumen, index) in resumenPorConsultor" :key="index"
             class="light-card border-l-4 border-teal-500 transition-all duration-300 hover:shadow-md hover:shadow-teal-500/10">
          <h4 class="font-bold text-lg text-slate-800 mb-1">{{ consultorResumen.nombre }}</h4>
          <p class="text-sm text-slate-500">Tiendas Asignadas: <span class="font-medium text-slate-700">{{ consultorResumen.conteo }}</span></p>
          <p class="text-sm text-slate-500">Ingresos Totales: <span class="font-medium text-slate-700">Q{{ (consultorResumen.ingresos || 0).toFixed(2) }}</span></p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-xl border border-gray-200 mb-10 overflow-hidden">
      <div class="bg-slate-50 border-b border-gray-200 px-6 py-4">
        <h3 class="text-lg font-semibold text-teal-600">
          {{ modoEdicion ? 'Editar Tienda' : 'Nueva Tienda' }}
        </h3>
      </div>

      <form @submit.prevent="modoEdicion ? actualizarTienda() : guardarTienda()" class="p-6">
        <div class="md:col-span-3 mb-6" v-if="modoEdicion">
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"> <div class="flex"> <div class="flex-shrink-0"><svg class="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg></div> <div class="ml-3"><p class="text-sm font-medium text-yellow-700">Estás editando la tienda <span class="font-bold text-yellow-800">{{ tiendaSeleccionada.nombre }}</span></p></div> </div> </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          <div class="md:col-span-3 form-section">
            <h4 class="form-section-title">
                <svg class="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                Información de la Tienda
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="relative"> <label class="label-form">Nombre de la tienda</label> <input v-model="nueva.nombre" type="text" placeholder="Nombre de tienda" class="input-primary" required /> </div>
              <div class="relative"> <label class="label-form">Marca</label> <select v-model="nueva.marca" class="input-primary select-input" required> <option disabled value="" class="text-gray-500 option-light">Seleccionar Marca</option> <option v-for="(marca, i) in marcas" :key="i" class="option-light">{{ marca }}</option> </select> </div>
              <div class="relative"> <label class="label-form">Técnico</label> <input v-model="nueva.tecnico" type="text" placeholder="Técnico" class="input-primary" /> </div>
              <div class="relative"> <label class="label-form">No. ODS</label> <input v-model="nueva.ods" type="text" placeholder="No. ODS" class="input-primary" /> </div>
              <div class="relative">
                <label class="label-form">Categoría</label>
                <select v-model="nueva.categoria" class="input-primary select-input" required>
                  <option disabled value="" class="text-gray-500 option-light">-- Selecciona una categoría --</option>
                  <option v-for="(cat, index) in categoriasDisponibles" :key="index" :value="cat" class="option-light">
                    {{ cat }}
                  </option>
                </select>
              </div>
              <div class="relative">
                <label class="label-form">Consultor</label>
                <select v-model="nueva.consultor" class="input-primary select-input" required>
                  <option disabled value="" class="text-gray-500 option-light">-- Selecciona un consultor --</option>
                  <option v-for="(consultor, index) in consultoresDisponibles" :key="index" :value="consultor" class="option-light">
                    {{ consultor }}
                  </option>
                </select>
              </div>
              <div class="relative"> <label class="label-form">Mes de Servicio</label> <input v-model="nueva.mesServicio" type="month" class="input-primary month-input" required /> </div>
              <div class="relative md:col-span-3"> <label class="label-form">Descripción del Servicio</label> <textarea v-model="nueva.descripcion" placeholder="Detalles del servicio a realizar..." class="input-primary" rows="2"></textarea> </div>
            </div>
          </div>

          <div class="md:col-span-3 form-section mt-2">
              <h4 class="form-section-title">
                  <svg class="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Programación y Estado de Visitas
              </h4>
              <div class="bg-slate-50 rounded-lg p-4 border border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div class="relative">
                      <label class="label-form">Número de visitas</label>
                      <select v-model.number="nueva.numVisitas" class="input-primary select-input" required> <option :value="1" class="option-light">1 visita</option>
                          <option :value="2" class="option-light">2 visitas</option>
                      </select>
                  </div>
                  <div class="relative">
                      <label class="label-form">Primera visita</label>
                      <input v-model="nueva.fechaPrimeraVisita" type="date" class="input-primary date-input" :class="{'border-red-500 !bg-red-50 focus:!ring-red-500': !validarPrimeraVisita() && nueva.fechaPrimeraVisita}" />
                      <span v-if="!validarPrimeraVisita() && nueva.fechaPrimeraVisita" class="error-message">1ros 15 días</span>
                  </div>
                  <div class="relative" :class="{ 'opacity-50': !nueva.fechaPrimeraVisita }">
                      <label class="label-form">Estado Visita 1</label>
                      <select v-model="nueva.estadoPrimeraVisita" class="input-primary select-input" :disabled="!nueva.fechaPrimeraVisita">
                          <option value="Programada" class="option-light">Programada</option>
                          <option value="Realizada" class="option-light">Realizada</option>
                          <option value="Cancelada" class="option-light">Cancelada</option>
                      </select>
                  </div>
                  <template v-if="nueva.numVisitas == 2">
                      <div class="relative md:col-start-2">
                          <label class="label-form">Segunda visita</label>
                          <input v-model="nueva.fechaSegundaVisita" type="date" class="input-primary date-input" :class="{'border-red-500 !bg-red-50 focus:!ring-red-500': !validarSegundaVisita() && nueva.fechaSegundaVisita}" />
                          <span v-if="!validarSegundaVisita() && nueva.fechaSegundaVisita" class="error-message">Después del día 15</span>
                      </div>
                      <div class="relative" :class="{ 'opacity-50': !nueva.fechaSegundaVisita }">
                          <label class="label-form">Estado Visita 2</label>
                          <select v-model="nueva.estadoSegundaVisita" class="input-primary select-input" :disabled="!nueva.fechaSegundaVisita">
                              <option value="Programada" class="option-light">Programada</option>
                              <option value="Realizada" class="option-light">Realizada</option>
                              <option value="Cancelada" class="option-light">Cancelada</option>
                          </select>
                      </div>
                  </template>
                </div>
              </div>
          </div>

          <div class="md:col-span-3 form-section mt-2">
            <h4 class="form-section-title">
                <svg class="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Proceso Administrativo
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="relative"> <label class="label-form">Costo (Q)</label> <input v-model.number="nueva.costo" type="number" placeholder="0.00" step="0.01" class="input-primary" required /> </div>
              <div class="relative"> <label class="label-form">Tipo de pago</label> <select v-model="nueva.tipoPago" class="input-primary select-input" required> <option value="Contado" class="option-light">Contado</option> <option value="Crédito" class="option-light">Crédito</option> </select> </div>
              <div class="relative"> <label class="label-form">Días de crédito</label> <input v-model.number="nueva.diasCredito" type="number" placeholder="0" class="input-primary" :disabled="nueva.tipoPago !== 'Crédito'" /> </div>
              <div class="relative">
                <label class="label-form">Estado del Proceso</label>
                <select v-model="nueva.estadoProceso" class="input-primary select-input" required>
                  <option value="Pendiente" class="option-light">Pendiente</option>
                  <option value="En proceso de ODS" class="option-light">En proceso de ODS</option>
                  <option value="En COVA" class="option-light">En COVA</option>
                  <option value="Facturado" class="option-light">Facturado</option>
                  <option value="Pagado" class="option-light">Pagado</option>
                </select>
              </div>
            </div>
          </div>

          <div class="md:col-span-3 mt-6 pt-4 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row gap-3">
                  <button type="submit" class="btn-primary flex-1" :disabled="!formularioValido || cargando">
                      <span class="flex items-center justify-center">
                          <svg v-if="!cargando" class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path v-if="modoEdicion" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path><path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg v-if="cargando" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {{ cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar Tienda' : 'Guardar Tienda') }}
                      </span>
                  </button>
                  <button v-if="modoEdicion" @click.prevent="cancelarEdicion()" type="button" class="btn-secondary flex-1">
                      <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      Cancelar
                  </button>
              </div>
          </div>

          <div v-if="!formularioValido && formEnviado" class="md:col-span-3 alert-danger-light mt-4">
            <div class="flex">
                <div class="flex-shrink-0"><svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></div>
                <div class="ml-3">
                    <h3 class="font-medium text-red-700">Por favor corrige los siguientes errores:</h3>
                    <ul class="mt-2 list-disc list-inside text-sm text-red-600">
                        <li v-if="!nueva.nombre">Nombre requerido</li>
                        <li v-if="!nueva.marca">Marca requerida</li>
                        <li v-if="!nueva.categoria">Categoría requerida</li>
                        <li v-if="!nueva.consultor">Consultor requerido</li>
                        <li v-if="!nueva.costo || nueva.costo <= 0">Costo requerido y debe ser mayor a 0</li>
                        <li v-if="nueva.fechaPrimeraVisita && !validarPrimeraVisita()">Fecha 1ra visita inválida (primeros 15 días)</li>
                        <li v-if="nueva.fechaSegundaVisita && !validarSegundaVisita()">Fecha 2da visita inválida (después del día 15)</li>
                        <li v-if="!nueva.mesServicio">Mes servicio requerido</li>
                        <li v-if="!nueva.tipoPago">Tipo de pago requerido</li>
                        <li v-if="!nueva.estadoProceso">Estado del proceso requerido</li>
                        </ul>
                </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-center gap-3">
                <div class="relative flex-grow min-w-[180px] sm:min-w-[200px]">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg></div>
                    <input v-model="busqueda" type="text" placeholder="Buscar tienda..." class="input-primary pl-10 pr-10 w-full" />
                    <button v-if="busqueda" @click="busqueda = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
                </div>
                <div class="relative flex-grow min-w-[180px] sm:min-w-[200px]">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg></div>
                    <select v-model="filtroMes" class="input-primary select-input pl-10 pr-8 w-full">
                        <option value="" class="option-light text-gray-500">Todos los meses</option>
                        <option v-for="(mes, index) in mesesDisponibles" :key="index" :value="mes" class="option-light">{{ formatearMes(mes) }}</option>
                    </select>
                    <button v-if="filtroMes" @click="filtroMes = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
                </div>
                <div class="relative flex-grow min-w-[180px] sm:min-w-[200px]">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg></div>
                    <select v-model="filtroConsultor" class="input-primary select-input pl-10 pr-8 w-full">
                        <option value="" class="option-light text-gray-500">Todos los consultores</option>
                        <option v-for="(consultor, index) in consultoresDisponibles" :key="index" :value="consultor" class="option-light">{{ consultor }}</option>
                    </select>
                    <button v-if="filtroConsultor" @click="filtroConsultor = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
                </div>
                <button @click="abrirModalCalendario" title="Ver calendario de visitas del mes seleccionado" class="btn-secondary px-3 py-2 flex-shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span class="ml-1 hidden sm:inline">Calendario</span>
                </button>
            </div>
            <div class="w-full md:w-auto md:flex md:justify-center mt-3 md:mt-0">
                <button @click="abrirModalMarcas" class="btn-secondary w-full md:w-auto">
                    <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    Administrar Marcas
                </button>
            </div>
        </div>
    </div>

    <div class="flex justify-between items-center mb-3">
        <div class="text-sm text-slate-500">
            <span class="font-medium text-slate-700">{{ tiendasFiltradas.length }}</span> {{ tiendasFiltradas.length === 1 ? 'tienda encontrada' : 'tiendas encontradas' }}
            <span v-if="busqueda || filtroMes || filtroConsultor">
                {{ busqueda ? ` con búsqueda "${busqueda}"` : '' }}
                {{ (busqueda && (filtroMes || filtroConsultor)) ? ' y' : '' }}
                {{ filtroMes ? ` en ${formatearMes(filtroMes)}` : '' }}
                {{ (filtroMes && filtroConsultor && busqueda) ? ', ' : (filtroMes && filtroConsultor) ? ' y' : '' }}
                {{ filtroConsultor ? ` por consultor "${filtroConsultor}"` : '' }}
            </span>
        </div>
        <button @click="exportarDatos" class="btn-link" :disabled="cargando || tiendasFiltradas.length === 0">
            <svg v-if="!cargando" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <svg v-if="cargando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ cargando ? 'Exportando...' : 'Exportar a PDF' }}
        </button>
    </div>

    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-10 relative">
      <div v-if="cargando && !mostrarModalMarcas && !mostrarConfirmacion && !mostrarDetalles && !mostrarModalCalendario" class="loading-overlay-light">
        <svg class="animate-spin h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span class="ml-2 text-slate-600">Cargando datos...</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="th-table">Tienda</th>
              <th class="th-table">Marca</th>
              <th class="th-table hidden sm:table-cell">Consultor</th>
              <th class="th-table">ODS</th>
              <th class="th-table hidden md:table-cell">Mes Servicio</th>
              <th class="th-table hidden lg:table-cell">Costo</th>
              <th class="th-table hidden lg:table-cell">Tipo Pago</th>
              <th class="th-table hidden lg:table-cell">Días Cred.</th>
              <th class="th-table hidden md:table-cell">Estado Proc.</th>
              <th class="th-table hidden md:table-cell">Est. V1</th>
              <th class="th-table hidden md:table-cell">Est. V2</th>
              <th class="th-table">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(tienda, i) in tiendasFiltradas" :key="tienda.id || i" class="hover:bg-slate-50 transition-colors duration-150">
              <td class="td-table"> <div class="font-medium text-slate-800 hover:text-teal-600 transition-colors">{{ tienda.nombre }}</div> </td>
              <td class="td-table"> <span class="badge-light">{{ tienda.marca }}</span> </td>
              <td class="td-table hidden sm:table-cell"> {{ tienda.consultor || '-' }} </td>
              <td class="td-table"> {{ tienda.ods || '-' }} </td>
              <td class="td-table hidden md:table-cell"> {{ formatearMes(tienda.mesServicio) }} </td>
              <td class="td-table hidden lg:table-cell"> Q{{ (tienda.costo || 0).toFixed(2) }} </td>
              <td class="td-table hidden lg:table-cell"> <span class="font-semibold" :class="{'text-emerald-600': tienda.tipoPago === 'Contado', 'text-teal-600': tienda.tipoPago === 'Crédito'}">{{ tienda.tipoPago }}</span> </td>
              <td class="td-table hidden lg:table-cell"> {{ tienda.tipoPago === 'Crédito' ? (tienda.diasCredito || 0) : '-' }} </td>
              <td class="td-table hidden md:table-cell"> <span class="badge" :class="getProcessStatusColor(tienda.estadoProceso)">{{ tienda.estadoProceso }}</span> </td>
              <td class="td-table hidden md:table-cell text-center"> <span :class="getVisitStatusColor(tienda.estadoPrimeraVisita)" class="status-dot" :title="tienda.estadoPrimeraVisita || 'N/A'"></span> </td>
              <td class="td-table hidden md:table-cell text-center"> <span v-if="tienda.numVisitas == 2" :class="getVisitStatusColor(tienda.estadoSegundaVisita)" class="status-dot" :title="tienda.estadoSegundaVisita || 'N/A'"></span> <span v-else>-</span> </td>
              <td class="td-table">
                <div class="flex space-x-1">
                    <button @click="editarTienda(tienda)" class="btn-icon text-yellow-500 hover:text-yellow-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><title>Editar</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                    <button @click="confirmarEliminar(tienda)" class="btn-icon text-red-500 hover:text-red-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><title>Eliminar</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    <button @click="verDetalles(tienda)" class="btn-icon text-teal-500 hover:text-teal-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><title>Ver Detalles</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button>
                </div>
              </td>
            </tr>
            <tr v-if="tiendasFiltradas.length === 0 && !cargando">
              <td :colspan="12" class="px-4 py-8 text-center">
                <div class="flex flex-col items-center justify-center space-y-3"><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class="text-slate-500 text-lg">No se encontraron tiendas</p><p class="text-slate-400 text-sm">{{ busqueda || filtroMes || filtroConsultor ? 'Prueba con otros criterios de búsqueda o filtro' : 'Aún no has añadido ninguna tienda' }}</p></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="modal-fade">
        <div v-if="mostrarModalMarcas" class="modal-backdrop-light">
            <div class="modal-content-light max-w-md">
                <div class="modal-header-light">
                    <h3 class="modal-title-light">Administrar Marcas</h3>
                    <button @click="cerrarModalMarcas" class="modal-close-btn-light" title="Cerrar">&times;</button>
                </div>
                <div class="p-6">
                    <p class="text-sm text-slate-500 mb-4">Añade o elimina marcas.</p>
                    <div class="flex gap-2 mb-4">
                        <input v-model="nuevaMarca" @keyup.enter="agregarMarca" type="text" placeholder="Nueva marca" class="input-primary flex-1" />
                        <button @click="agregarMarca" class="btn-primary">Agregar</button>
                    </div>
                    <div class="modal-list-container-light">
                        <ul class="divide-y divide-gray-200">
                            <li v-for="(marca, i) in marcas" :key="i" class="modal-list-item-light">
                                <span class="text-slate-700">{{ marca }}</span>
                                <button @click="eliminarMarca(i)" class="btn-icon text-gray-500 hover:text-red-600 hover:bg-gray-100" title="Eliminar marca">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </li>
                            <li v-if="marcas.length === 0" class="py-8 text-center text-slate-500">
                                <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                No hay marcas definidas
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer-light">
                    <button @click="cerrarModalMarcas" class="btn-primary">Guardar Cambios y Cerrar</button>
                </div>
            </div>
        </div>
    </Transition>

    <Transition name="modal-fade">
        <div v-if="mostrarConfirmacion" class="modal-backdrop-light">
            <div class="modal-content-light max-w-md">
                <div class="modal-header-light">
                    <h3 class="modal-title-light text-red-600">Confirmar eliminación</h3>
                    <button @click="mostrarConfirmacion = false" class="modal-close-btn-light" title="Cerrar">&times;</button>
                </div>
                <div class="p-6">
                    <div class="alert-danger-light mb-4">
                        <div class="flex">
                            <div class="flex-shrink-0"><svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg></div>
                            <div class="ml-3"><p class="text-sm font-medium text-red-700">¡Acción irreversible! Se eliminarán también los mantenimientos asociados.</p></div>
                        </div>
                    </div>
                    <p class="text-slate-600">¿Estás seguro que deseas eliminar la tienda <strong class="text-slate-800">{{ tiendaSeleccionada?.nombre || 'seleccionada' }}</strong>?</p>
                </div>
                <div class="modal-footer-light gap-3">
                    <button @click="mostrarConfirmacion = false" class="btn-secondary">Cancelar</button>
                    <button @click="eliminarTienda" class="btn-danger">Sí, eliminar permanentemente</button>
                </div>
            </div>
        </div>
    </Transition>

    <Transition name="modal-fade">
        <div v-if="mostrarDetalles" class="modal-backdrop-light">
            <div class="modal-content-light max-w-4xl max-h-[90vh] overflow-y-auto"
                 :class="[`border-t-8 border-${getBrandColor(tiendaSeleccionada?.marca)}-500`]">
                <div class="modal-header-light">
                    <h3 class="modal-title-light">{{ tiendaSeleccionada?.nombre || 'Detalles' }}</h3>
                    <button @click="mostrarDetalles = false" class="modal-close-btn-light" title="Cerrar">&times;</button>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="detail-card-light border-emerald-500">
                            <h4 class="detail-card-title-light text-emerald-600"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>Información básica</h4>
                            <dl class="detail-dl-light">
                                <dt>Marca:</dt><dd>{{ tiendaSeleccionada.marca || '-' }}</dd>
                                <dt>Consultor:</dt><dd>{{ tiendaSeleccionada.consultor || '-' }}</dd>
                                <dt>Técnico:</dt><dd>{{ tiendaSeleccionada.tecnico || '-' }}</dd>
                                <dt>ODS:</dt><dd>{{ tiendaSeleccionada.ods || '-' }}</dd>
                                <dt>Categoría:</dt><dd>{{ tiendaSeleccionada.categoria || '-' }}</dd>
                                <dt>Mes Servicio:</dt><dd>{{ formatearMes(tiendaSeleccionada.mesServicio) || '-' }}</dd>
                                <dt class="col-span-2">Descripción:</dt><dd class="col-span-2 whitespace-pre-wrap detail-description-light">{{ tiendaSeleccionada.descripcion || '-' }}</dd>
                                <dt>Creado:</dt><dd>{{ tiendaSeleccionada.fechaCreacion ? formatearFecha(tiendaSeleccionada.fechaCreacion, true) : '-' }}</dd>
                            </dl>
                        </div>
                        <div class="detail-card-light border-teal-500">
                            <h4 class="detail-card-title-light text-teal-600"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>Visitas programadas</h4>
                            <dl class="detail-dl-light">
                                <dt>Visitas:</dt><dd>{{ tiendaSeleccionada.numVisitas || 1 }}</dd>
                                <dt>1ra Visita:</dt><dd>{{ tiendaSeleccionada.fechaPrimeraVisita ? formatearFecha(tiendaSeleccionada.fechaPrimeraVisita) : 'N/P' }}</dd>
                                <dt>Estado V1:</dt><dd><span class="badge" :class="getVisitStatusColor(tiendaSeleccionada.estadoPrimeraVisita, true)">{{ tiendaSeleccionada.estadoPrimeraVisita || 'N/A' }}</span></dd>
                                <template v-if="tiendaSeleccionada.numVisitas == 2">
                                    <dt>2da Visita:</dt><dd>{{ tiendaSeleccionada.fechaSegundaVisita ? formatearFecha(tiendaSeleccionada.fechaSegundaVisita) : 'N/P' }}</dd>
                                    <dt>Estado V2:</dt><dd><span class="badge" :class="getVisitStatusColor(tiendaSeleccionada.estadoSegundaVisita, true)">{{ tiendaSeleccionada.estadoSegundaVisita || 'N/A' }}</span></dd>
                                </template>
                            </dl>
                        </div>
                        <div class="detail-card-light border-purple-500 md:col-span-2">
                            <h4 class="detail-card-title-light text-purple-600"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>Proceso Administrativo</h4>
                            <dl class="detail-dl-light md:grid-cols-4">
                                <dt>Costo:</dt><dd class="font-semibold">Q{{ (tiendaSeleccionada.costo || 0).toFixed(2) }}</dd>
                                <dt>Tipo Pago:</dt><dd><span class="font-semibold" :class="{'text-emerald-600': tiendaSeleccionada.tipoPago === 'Contado', 'text-teal-600': tiendaSeleccionada.tipoPago === 'Crédito'}">{{ tiendaSeleccionada.tipoPago || '-' }}</span></dd>
                                <dt>Días Créd.:</dt><dd>{{ tiendaSeleccionada.tipoPago === 'Crédito' ? (tiendaSeleccionada.diasCredito || 0) : '-' }}</dd>
                                <dt>Estado Proc.:</dt><dd><span class="badge" :class="getProcessStatusColor(tiendaSeleccionada.estadoProceso)">{{ tiendaSeleccionada.estadoProceso || '-' }}</span></dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div class="modal-footer-light justify-between">
                    <button @click="editarTiendaDesdeDetalles(tiendaSeleccionada)" class="btn-warning"> <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> Editar Tienda </button>
                    <button @click="mostrarDetalles = false" class="btn-secondary">Cerrar</button>
                </div>
            </div>
        </div>
    </Transition>

    <Transition name="modal-fade">
        <div v-if="mostrarModalCalendario" class="modal-backdrop-light">
            <div class="modal-content-light max-w-5xl max-h-[90vh]">
                <div class="modal-header-light">
                    <h3 class="modal-title-light">Calendario de Visitas - {{ nombreMesCalendario }}</h3>
                    <button @click="mostrarModalCalendario = false" class="modal-close-btn-light" title="Cerrar">&times;</button>
                </div>
                <div class="p-4 md:p-6 overflow-y-auto">
                    <div v-if="diasDelMesCalendario.length > 0">
                        <div class="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <div>Dom</div> <div>Lun</div> <div>Mar</div> <div>Mié</div> <div>Jue</div> <div>Vie</div> <div>Sáb</div>
                        </div>
                        <div class="grid grid-cols-7 gap-1.5">
                            <div v-for="(dia, index) in diasDelMesCalendario" :key="index"
                                 class="calendar-day-light" :class="{
                                 'placeholder': dia.esPlaceholder,
                                 'today': dia.esHoy && !dia.esPlaceholder
                                 }">
                                <span class="day-number-light" :class="{'text-teal-600 font-bold': dia.esHoy}">
                                    {{ dia.numero }}
                                </span>
                                <div v-if="!dia.esPlaceholder && dia.visitas && dia.visitas.length > 0" class="day-visits-light">
                                    <div v-for="(visita, vIndex) in dia.visitas.slice(0, 3)" :key="vIndex" class="visit-entry-light"
                                         :class="getVisitStatusBgColor(visita.estado, visita.tipo)"
                                         :title="`${visita.nombre} (${visita.tipo === 'primera' ? '1ra' : '2da'} - ${visita.estado})`"
                                         @click="verDetallesDesdeCalendario(visita.tiendaId)">
                                        <span class="truncate">{{ visita.nombre }}</span>
                                    </div>
                                    <div v-if="dia.visitas.length > 3" class="visit-more-light">
                                        + {{ dia.visitas.length - 3 }} más
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="calendar-legend-light">
                            <span><span class="legend-dot bg-teal-500"></span>1ra Prog.</span>
                            <span><span class="legend-dot bg-teal-400"></span>1ra Realiz.</span>
                            <span><span class="legend-dot bg-emerald-500"></span>2da Prog.</span>
                            <span><span class="legend-dot bg-emerald-400"></span>2da Realiz.</span>
                            <span><span class="legend-dot bg-red-500"></span>Cancelada</span>
                            <span><span class="legend-dot today-dot-light"></span>Hoy</span>
                        </div>
                    </div>
                    <div v-else class="text-center text-slate-500 py-10">
                        Selecciona un mes con tiendas registradas para ver el calendario.
                    </div>
                </div>
                <div class="modal-footer-light">
                    <button @click="mostrarModalCalendario = false" class="btn-secondary">Cerrar</button>
                </div>
            </div>
        </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, serverTimestamp, Timestamp, query, where } from 'firebase/firestore'
// Asegúrate que la ruta a tu configuración de Firebase sea correcta
// import { db } from '../firebase/firebase' // Ejemplo: Verifica esta línea
// Para este ejemplo, asumiré que 'db' está disponible globalmente o inyectado de otra forma si la línea anterior está comentada.
// Si estás usando un proyecto sin Firebase, puedes comentar las importaciones de Firebase y las funciones que lo usan.
let db = null; // Initialize db as null, will be set in onMounted


import jsPDF from 'jspdf';
import 'jspdf-autotable';

const tiendas = ref([])
const marcas = ref([])
const nuevaMarca = ref('')
const busqueda = ref('')
const filtroMes = ref('')
const filtroConsultor = ref('')
const mesesDisponibles = ref([])
const modoEdicion = ref(false)
const tiendaSeleccionada = ref(null)
const mostrarModalMarcas = ref(false)
const mostrarConfirmacion = ref(false)
const mostrarDetalles = ref(false)
const formEnviado = ref(false)
const cargando = ref(false)
const mostrarModalCalendario = ref(false)
const diasDelMesCalendario = ref([])
const nombreMesCalendario = ref('')

const categoriasDisponibles = ref([
  'Mant. Preventivo',
  'Venta de plantas',
  'Jardinizacion',
  'Reparacion de sistema riego',
  'Proyecto nuevo'
]);

const consultoresDisponibles = ref([
  'Ilduara',
  'Gladys Lopez',
  'Alan Garcia',
  'Byron Rivas',
  'Andrea Mendival',
  'Helen',
  'Ingrid Fuentes'
].sort((a,b) => a.localeCompare(b)));

const tiendaVacia = {
    nombre: '', marca: '', tecnico: '', ods: '',
    categoria: '', consultor: '',
    descripcion: '', mesServicio: '', numVisitas: 1,
    fechaPrimeraVisita: '', estadoPrimeraVisita: 'Programada',
    fechaSegundaVisita: '', estadoSegundaVisita: 'Programada', costo: null,
    tipoPago: 'Contado',
    diasCredito: 0,
    estadoProceso: 'Pendiente', fechaCreacion: null
}
const nueva = ref({ ...tiendaVacia })

const brandColors = {
    "McDonald's": 'yellow', "Pizza Hut": 'red', "Kentucky": 'red', "Starbucks": 'green', // 'green' is like emerald
    "Dunkin Donuts": 'pink', "Edificio Naguchi": 'gray', "Pandas": 'gray', 'DEFAULT': 'teal' // Default to teal
};
const getBrandColor = (brandName) => {
    const normalizedBrand = brandName?.trim().toUpperCase() || 'DEFAULT'; // Ensure uppercase for matching keys
    // Ajuste para que coincida con los colores de Tailwind (ej. green-500, teal-500)
    const colorMap = {
        'YELLOW': 'yellow',
        'RED': 'red',
        'GREEN': 'emerald',
        'PINK': 'pink',
        'GRAY': 'gray',
        'TEAL': 'teal',
    };
    // Find the key in brandColors that is a substring of normalizedBrand
    const foundKey = Object.keys(brandColors).find(key => normalizedBrand.includes(key.toUpperCase()));
    const brandColorKey = foundKey ? brandColors[foundKey] : brandColors['DEFAULT'];

    return colorMap[brandColorKey.toUpperCase()] || 'teal'; // Fallback to teal
};


const resumenPorMarca = computed(() => {
  const marcasResumen = {};
  tiendas.value.forEach(tienda => {
    const marca = (tienda.marca || 'Sin Marca/Cliente').trim();
    const costo = Number(tienda.costo) || 0;
    if (!marcasResumen[marca]) {
      marcasResumen[marca] = { nombre: marca, conteo: 0, ingresos: 0 };
    }
    marcasResumen[marca].conteo++;
    marcasResumen[marca].ingresos += costo;
  });
  return Object.values(marcasResumen).sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const resumenPorConsultor = computed(() => {
  const consultoresResumen = {};
  tiendas.value.forEach(tienda => {
    const consultor = (tienda.consultor || 'No asignado').trim();
    const costo = Number(tienda.costo) || 0;
    if (!consultoresResumen[consultor]) {
      consultoresResumen[consultor] = { nombre: consultor, conteo: 0, ingresos: 0 };
    }
    consultoresResumen[consultor].conteo++;
    consultoresResumen[consultor].ingresos += costo;
  });
  return Object.values(consultoresResumen).sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const resumenGeneral = computed(() => {
  const totalTiendas = tiendas.value.length;
  const costoTotalGeneral = tiendas.value.reduce((sum, tienda) => sum + (Number(tienda.costo) || 0), 0);
  return {
    totalTiendas,
    costoTotalGeneral
  };
});

const tiendasFiltradas = computed(() => {
    let resultado = tiendas.value;
    if (busqueda.value) {
        const termino = busqueda.value.toLowerCase().trim();
        if (termino) {
            resultado = resultado.filter(tienda =>
                Object.values(tienda).some(val => String(val).toLowerCase().includes(termino))
            );
        }
    }
    if (filtroMes.value) {
        resultado = resultado.filter(tienda => tienda.mesServicio === filtroMes.value);
    }
    if (filtroConsultor.value) {
        resultado = resultado.filter(tienda => tienda.consultor === filtroConsultor.value);
    }
    resultado.sort((a, b) => {
        const fechaA = a.fechaCreacion instanceof Timestamp ? a.fechaCreacion.toMillis() : 0;
        const fechaB = b.fechaCreacion instanceof Timestamp ? b.fechaCreacion.toMillis() : 0;
        return fechaB - fechaA; // Sort by newest first
    });
    return resultado;
});

const formularioValido = computed(() => {
    if (!nueva.value.nombre || !nueva.value.marca || !nueva.value.categoria || !nueva.value.consultor ||
        !nueva.value.mesServicio || nueva.value.costo === null || nueva.value.costo <= 0 ||
        !nueva.value.tipoPago || !nueva.value.estadoProceso) {
        return false;
    }
    if (nueva.value.fechaPrimeraVisita && !validarPrimeraVisita()) return false;
    if (nueva.value.numVisitas == 2 && nueva.value.fechaSegundaVisita && !validarSegundaVisita()) return false;
    return true;
});

const validarPrimeraVisita = () => { if (!nueva.value.fechaPrimeraVisita) return true; try { const fecha = new Date(nueva.value.fechaPrimeraVisita + 'T00:00:00'); const dia = fecha.getUTCDate(); return dia >= 1 && dia <= 15; } catch (e) { return false; } }
const validarSegundaVisita = () => { if (!nueva.value.fechaSegundaVisita) return true; try { const fecha = new Date(nueva.value.fechaSegundaVisita + 'T00:00:00'); const dia = fecha.getUTCDate(); return dia > 15 && dia <= 31; } catch(e) { return false; } }
const formatearFecha = (fechaInput, incluirAno = false) => { if (!fechaInput) return ''; try { let fecha; if (fechaInput instanceof Timestamp) { fecha = fechaInput.toDate() } else if (fechaInput instanceof Date && !isNaN(fechaInput.getTime())) { fecha = fechaInput; } else if (typeof fechaInput === 'string' && fechaInput.includes('-')) { const parts = fechaInput.split('-'); if (parts.length === 3) { fecha = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))); } else { return 'Fecha inválida'; } } else { return 'Fecha inválida'; } if (isNaN(fecha.getTime())) { return 'Fecha inválida'; } const opciones = incluirAno ? { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' } : { day: '2-digit', month: '2-digit', timeZone: 'UTC' }; return fecha.toLocaleDateString('es-GT', opciones) } catch (e) { return 'Fecha inválida'; } }
const formatearMes = (mesStr) => { if (!mesStr || !mesStr.includes('-')) return ''; try { const [ano, mes] = mesStr.split('-'); const fecha = new Date(Date.UTC(Number(ano), Number(mes) - 1, 1)); if (isNaN(fecha.getTime())) { return mesStr; } let mesFormateado = fecha.toLocaleDateString('es-GT', { month: 'long', year: 'numeric', timeZone: 'UTC' }); return mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1); } catch (e) { return mesStr; } }

// Firebase dependent functions
const cargarTiendas = async () => {
    if (!db) { console.warn("DB no inicializado, saltando cargarTiendas"); return; }
    cargando.value = true; tiendas.value = [];
    try {
        const snapshot = await getDocs(collection(db, 'tiendas'));
        const tiendasTemp = [];
        snapshot.forEach(doc => { tiendasTemp.push({ id: doc.id, ...doc.data() }) });
        tiendas.value = tiendasTemp;
        actualizarMesesDisponibles();
    } catch (error) { console.error("Error cargando tiendas:", error); }
    finally { cargando.value = false; }
}

const cargarMarcas = async () => {
    if (!db) { console.warn("DB no inicializado, saltando cargarMarcas"); return; }
    cargando.value = true;
    try {
        const marcasDocRef = doc(db, 'configuracion', 'marcas');
        const marcasDoc = await getDoc(marcasDocRef);
        if (marcasDoc.exists() && marcasDoc.data().lista) {
            marcas.value = marcasDoc.data().lista;
        } else {
            marcas.value = ["McDonald's", "Pizza Hut", "Kentucky", "Starbucks", "Dunkin Donuts", "Edificio Naguchi", "Pandas", "Cliente Varios", "Proyecto Interno"];
        }
        marcas.value.sort((a, b) => a.localeCompare(b));
    } catch (error) { console.error("Error cargando marcas:", error); }
    finally { cargando.value = false; }
}

const guardarTienda = async () => {
    if (!db) { console.warn("DB no inicializado, saltando guardarTienda"); return; }
    formEnviado.value = true;
    if (!formularioValido.value) return;
    cargando.value = true;
    try {
        const tiendaData = { ...nueva.value, fechaCreacion: serverTimestamp() };
        delete tiendaData.id;
        Object.keys(tiendaData).forEach(key => { if (tiendaData[key] === '') tiendaData[key] = null; });
        if (!tiendaData.fechaPrimeraVisita) tiendaData.estadoPrimeraVisita = null;
        if (!tiendaData.fechaSegundaVisita) tiendaData.estadoSegundaVisita = null;
        if (tiendaData.numVisitas != 2) { tiendaData.fechaSegundaVisita = null; tiendaData.estadoSegundaVisita = null; }
        if (tiendaData.tipoPago !== 'Crédito') tiendaData.diasCredito = 0;

        const docRef = await addDoc(collection(db, 'tiendas'), tiendaData);
        const mantenimiento = {
            tienda: tiendaData.nombre, tecnico: tiendaData.tecnico, consultor: tiendaData.consultor,
            fecha: tiendaData.mesServicio + "-01", numVisitas: tiendaData.numVisitas,
            fechaPrimeraVisita: tiendaData.fechaPrimeraVisita, estadoPrimeraVisita: tiendaData.estadoPrimeraVisita,
            fechaSegundaVisita: tiendaData.fechaSegundaVisita, estadoSegundaVisita: tiendaData.estadoSegundaVisita,
            fechaCreacion: serverTimestamp(), tiendaId: docRef.id
        };
        await addDoc(collection(db, 'mantenimientos'), mantenimiento);
        await cargarTiendas();
        nueva.value = { ...tiendaVacia };
        formEnviado.value = false;
    } catch (error) { console.error("Error guardando tienda:", error); }
    finally { cargando.value = false; }
}

const actualizarTienda = async () => {
    if (!db) { console.warn("DB no inicializado, saltando actualizarTienda"); return; }
    formEnviado.value = true;
    if (!formularioValido.value || !nueva.value.id) return;
    cargando.value = true;
    const tiendaId = nueva.value.id;
    try {
        const tiendaActualizada = { ...nueva.value };
        delete tiendaActualizada.id; delete tiendaActualizada.fechaCreacion;
        Object.keys(tiendaActualizada).forEach(key => { if (tiendaActualizada[key] === '') tiendaActualizada[key] = null; });
        if (!tiendaActualizada.fechaPrimeraVisita) tiendaActualizada.estadoPrimeraVisita = null;
        if (!tiendaActualizada.fechaSegundaVisita) tiendaActualizada.estadoSegundaVisita = null;
        if (tiendaActualizada.numVisitas != 2) { tiendaActualizada.fechaSegundaVisita = null; tiendaActualizada.estadoSegundaVisita = null; }
        if (tiendaActualizada.tipoPago !== 'Crédito') tiendaActualizada.diasCredito = 0;

        await updateDoc(doc(db, 'tiendas', tiendaId), tiendaActualizada);
        const qMantenimiento = query(collection(db, 'mantenimientos'), where("tiendaId", "==", tiendaId));
        const mantenimientosSnapshot = await getDocs(qMantenimiento);
        for (const docSnapshot of mantenimientosSnapshot.docs) {
            await updateDoc(doc(db, 'mantenimientos', docSnapshot.id), {
                tienda: tiendaActualizada.nombre, tecnico: tiendaActualizada.tecnico, consultor: tiendaActualizada.consultor,
                numVisitas: tiendaActualizada.numVisitas, fechaPrimeraVisita: tiendaActualizada.fechaPrimeraVisita,
                estadoPrimeraVisita: tiendaActualizada.estadoPrimeraVisita, fechaSegundaVisita: tiendaActualizada.fechaSegundaVisita,
                estadoSegundaVisita: tiendaActualizada.estadoSegundaVisita,
            });
        }
        await cargarTiendas();
        cancelarEdicion();
    } catch (error) { console.error("Error actualizando tienda:", error); }
    finally { cargando.value = false; }
}

const eliminarTienda = async () => {
    if (!db) { console.warn("DB no inicializado, saltando eliminarTienda"); return; }
    if (!tiendaSeleccionada.value?.id) return;
    cargando.value = true; mostrarConfirmacion.value = false;
    const tiendaId = tiendaSeleccionada.value.id; const tiendaNombre = tiendaSeleccionada.value.nombre;
    try {
        const qMantenimiento = query(collection(db, 'mantenimientos'), where("tiendaId", "==", tiendaId));
        const mantenimientosSnapshot = await getDocs(qMantenimiento);
        const deletePromises = [];
        mantenimientosSnapshot.forEach((docSnapshot) => { deletePromises.push(deleteDoc(doc(db, 'mantenimientos', docSnapshot.id))); });
        await Promise.all(deletePromises);
        await deleteDoc(doc(db, 'tiendas', tiendaId));
        await cargarTiendas();
    } catch (error) { console.error(`Error eliminando tienda ${tiendaNombre}:`, error); }
    finally { cargando.value = false; tiendaSeleccionada.value = null; }
}

const cerrarModalMarcas = async () => {
    if (!db) { console.warn("DB no inicializado, saltando cerrarModalMarcas"); mostrarModalMarcas.value = false; return; }
    mostrarModalMarcas.value = false; cargando.value = true;
    try {
        const marcasOrdenadas = [...marcas.value].sort((a, b) => a.localeCompare(b));
        await setDoc(doc(db, 'configuracion', 'marcas'), { lista: marcasOrdenadas }, { merge: true });
        marcas.value = marcasOrdenadas;
    } catch (error) { console.error("Error guardando marcas:", error); }
    finally { cargando.value = false; }
};

// Non-Firebase functions
const actualizarMesesDisponibles = () => { const meses = new Set(); tiendas.value.forEach(tienda => { if (tienda.mesServicio) { meses.add(tienda.mesServicio) } }); mesesDisponibles.value = Array.from(meses).sort().reverse(); }
const editarTienda = (tienda) => {
    tiendaSeleccionada.value = { ...tienda };
    nueva.value = {
        id: tienda.id, nombre: tienda.nombre || tiendaVacia.nombre, marca: tienda.marca || tiendaVacia.marca,
        tecnico: tienda.tecnico || tiendaVacia.tecnico, ods: tienda.ods || tiendaVacia.ods,
        categoria: tienda.categoria || tiendaVacia.categoria, consultor: tienda.consultor || tiendaVacia.consultor,
        descripcion: tienda.descripcion || tiendaVacia.descripcion, mesServicio: tienda.mesServicio || tiendaVacia.mesServicio,
        numVisitas: tienda.numVisitas ?? tiendaVacia.numVisitas,
        fechaPrimeraVisita: tienda.fechaPrimeraVisita || tiendaVacia.fechaPrimeraVisita,
        estadoPrimeraVisita: tienda.estadoPrimeraVisita || tiendaVacia.estadoPrimeraVisita,
        fechaSegundaVisita: tienda.fechaSegundaVisita || tiendaVacia.fechaSegundaVisita,
        estadoSegundaVisita: tienda.estadoSegundaVisita || tiendaVacia.estadoSegundaVisita,
        costo: tienda.costo ?? tiendaVacia.costo, tipoPago: tienda.tipoPago || tiendaVacia.tipoPago,
        diasCredito: tienda.diasCredito ?? tiendaVacia.diasCredito,
        estadoProceso: tienda.estadoProceso || tiendaVacia.estadoProceso, fechaCreacion: tienda.fechaCreacion
    };
    modoEdicion.value = true; mostrarDetalles.value = false; formEnviado.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
const verDetalles = (tienda) => { tiendaSeleccionada.value = { ...tienda }; mostrarDetalles.value = true; }
const editarTiendaDesdeDetalles = (tienda) => { mostrarDetalles.value = false; editarTienda(tienda); }
const cancelarEdicion = () => { modoEdicion.value = false; tiendaSeleccionada.value = null; nueva.value = { ...tiendaVacia }; formEnviado.value = false; }
const confirmarEliminar = (tienda) => { tiendaSeleccionada.value = tienda; mostrarConfirmacion.value = true; }
const abrirModalMarcas = () => { mostrarModalMarcas.value = true };
const agregarMarca = () => { const marcaTrimmed = nuevaMarca.value.trim(); if (!marcaTrimmed) return; const existe = marcas.value.some(m => m.toLowerCase() === marcaTrimmed.toLowerCase()); if (!existe) { marcas.value.push(marcaTrimmed); marcas.value.sort((a, b) => a.localeCompare(b)); nuevaMarca.value = ''; } };
const eliminarMarca = (index) => { marcas.value.splice(index, 1); };

const exportarDatos = () => {
  if (cargando.value) return;
  if (tiendasFiltradas.value.length === 0) {
    // Consider using a custom modal for alerts instead of window.alert
    console.warn("No hay tiendas para exportar según los filtros actuales.");
    return;
  }
  cargando.value = true;

  try {
    const pdfDoc = new jsPDF();
    const A4_WIDTH = 210; const A4_HEIGHT = 297; const MARGIN = 15;
    pdfDoc.setFontSize(18); pdfDoc.setTextColor(40, 40, 40);
    pdfDoc.text("Reporte de Tiendas", MARGIN, MARGIN + 5);
    pdfDoc.setFontSize(10); pdfDoc.setTextColor(100, 100, 100);
    const reportDate = `Generado el: ${new Date().toLocaleDateString('es-GT', {day: '2-digit', month: '2-digit', year: 'numeric'})} ${new Date().toLocaleTimeString('es-GT')}`;
    pdfDoc.text(reportDate, MARGIN, MARGIN + 12);
    let currentY = MARGIN + 25;
    pdfDoc.setFontSize(12); pdfDoc.setTextColor(40, 40, 40);
    pdfDoc.text("Resumen de Datos Exportados (Filtros Aplicados):", MARGIN, currentY); currentY += 7;
    pdfDoc.setFontSize(10);
    pdfDoc.text(`- Total de Tiendas: ${tiendasFiltradas.value.length}`, MARGIN + 5, currentY); currentY += 5;
    const costoTotalFiltrado = tiendasFiltradas.value.reduce((sum, tienda) => sum + (Number(tienda.costo) || 0), 0);
    pdfDoc.text(`- Costo Total: Q${costoTotalFiltrado.toFixed(2)}`, MARGIN + 5, currentY); currentY += 10;

    const tableColumn = ["Nombre", "Marca", "Consultor", "ODS", "Mes Serv.", "Costo (Q)", "Tipo Pago", "Estado Proc."];
    const tableRows = [];
    tiendasFiltradas.value.forEach(tienda => {
      const tiendaData = [
        tienda.nombre || '-', tienda.marca || '-', tienda.consultor || '-', tienda.ods || '-',
        tienda.mesServicio ? formatearMes(tienda.mesServicio) : '-',
        (Number(tienda.costo) || 0).toFixed(2),
        tienda.tipoPago || '-', tienda.estadoProceso || '-'
      ];
      tableRows.push(tiendaData);
    });

    if (typeof pdfDoc.autoTable === 'function') {
        pdfDoc.autoTable({
            head: [tableColumn], body: tableRows, startY: currentY, theme: 'striped',
            headStyles: { fillColor: [20, 184, 166] }, // Teal-500
            styles: { fontSize: 7, cellPadding: 1.5, overflow: 'linebreak' },
            columnStyles: {
                0: { cellWidth: 'auto' }, 1: { cellWidth: 25 }, 2: { cellWidth: 25 },
                3: { cellWidth: 15 }, 4: { cellWidth: 22 }, 5: { cellWidth: 18, halign: 'right' },
                6: { cellWidth: 18 }, 7: { cellWidth: 'auto' }
            },
            didDrawPage: function (data) {
                const pageCount = pdfDoc.internal.getNumberOfPages();
                pdfDoc.setFontSize(8); pdfDoc.setTextColor(150, 150, 150);
                pdfDoc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, A4_HEIGHT - 10);
            }
        });
    } else {
        console.error("Error: pdfDoc.autoTable is not a function.");
        // Consider using a custom modal for alerts
    }
    pdfDoc.save(`reporte_tiendas_${new Date().toISOString().slice(0,10)}.pdf`);
  } catch (error) {
    console.error("Error generando PDF:", error);
    // Consider using a custom modal for alerts
  } finally { cargando.value = false; }
};

const abrirModalCalendario = () => { const mesSeleccionado = filtroMes.value; if (!mesSeleccionado) { const hoy = new Date(); const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`; generarDatosCalendario(mesActual); } else { generarDatosCalendario(mesSeleccionado); } mostrarModalCalendario.value = true; }
const generarDatosCalendario = (mesCompleto) => { if (!mesCompleto || !/^\d{4}-\d{2}$/.test(mesCompleto)) { diasDelMesCalendario.value = []; nombreMesCalendario.value = "Mes inválido"; return; } try { const [year, month] = mesCompleto.split('-').map(Number); const monthIndex = month - 1; const fechaTitulo = new Date(Date.UTC(year, monthIndex, 1)); nombreMesCalendario.value = fechaTitulo.toLocaleDateString('es-GT', { month: 'long', year: 'numeric', timeZone: 'UTC' }).replace(/^\w/, c => c.toUpperCase()); const primerDiaDelMes = new Date(Date.UTC(year, monthIndex, 1)); const ultimoDiaDelMes = new Date(Date.UTC(year, monthIndex + 1, 0)); const numDiasMes = ultimoDiaDelMes.getUTCDate(); const diaSemanaPrimerDia = primerDiaDelMes.getUTCDay(); const diasArray = []; const hoy = new Date(); const hoyStr = `${hoy.getUTCFullYear()}-${String(hoy.getUTCMonth() + 1).padStart(2, '0')}-${String(hoy.getUTCDate()).padStart(2, '0')}`; const diasPrevios = diaSemanaPrimerDia; const ultimoDiaMesAnterior = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate(); for (let i = diasPrevios - 1; i >= 0; i--) { diasArray.push({ numero: ultimoDiaMesAnterior - i, esPlaceholder: true, visitas: [] }); } const visitasPorDia = {}; tiendas.value.forEach(tienda => { if (tienda.mesServicio === mesCompleto) { if (tienda.fechaPrimeraVisita) { const fechaStr = tienda.fechaPrimeraVisita; if (!visitasPorDia[fechaStr]) visitasPorDia[fechaStr] = []; visitasPorDia[fechaStr].push({ nombre: tienda.nombre, tipo: 'primera', estado: tienda.estadoPrimeraVisita || 'Programada', tiendaId: tienda.id }); } if (tienda.numVisitas == 2 && tienda.fechaSegundaVisita) { const fechaStr = tienda.fechaSegundaVisita; if (!visitasPorDia[fechaStr]) visitasPorDia[fechaStr] = []; visitasPorDia[fechaStr].push({ nombre: tienda.nombre, tipo: 'segunda', estado: tienda.estadoSegundaVisita || 'Programada', tiendaId: tienda.id }); } } }); for (let dia = 1; dia <= numDiasMes; dia++) { const fechaCompletaStr = `${year}-${String(month).padStart(2, '0')}-${String(dia).padStart(2, '0')}`; diasArray.push({ numero: dia, esPlaceholder: false, esHoy: fechaCompletaStr === hoyStr, fechaCompleta: fechaCompletaStr, visitas: visitasPorDia[fechaCompletaStr] || [] }); } const celdasRestantes = (7 - (diasArray.length % 7)) % 7; for (let i = 1; i <= celdasRestantes; i++) { diasArray.push({ numero: i, esPlaceholder: true, visitas: [] }); } while (diasArray.length < 35 && diasArray.length % 7 !== 0) { diasArray.push({ numero: diasArray.filter(d => d.esPlaceholder).length + 1 - diasPrevios + numDiasMes, esPlaceholder: true, visitas: [] });} if (diasArray.length === 35 && (diaSemanaPrimerDia > 4 && numDiasMes > 29 || diaSemanaPrimerDia > 5 && numDiasMes > 28) && (diasArray.length + numDiasMes + diasPrevios > 35) ) { for (let i = 1; i <= 7; i++) { diasArray.push({ numero: i + numDiasMes - ((numDiasMes + diasPrevios)%7), esPlaceholder: true, visitas: [] }); } } diasDelMesCalendario.value = diasArray; } catch (error) { console.error("Error generando calendario:", error); diasDelMesCalendario.value = []; nombreMesCalendario.value = "Error"; } }
const verDetallesDesdeCalendario = (tiendaId) => { const tienda = tiendas.value.find(t => t.id === tiendaId); if (tienda) { mostrarModalCalendario.value = false; verDetalles(tienda); } else { console.warn("Tienda no encontrada:", tiendaId); } }

const getProcessStatusColor = (status) => {
    switch (status) {
        case 'En proceso de ODS': return 'bg-yellow-100 text-yellow-700';
        case 'En COVA': return 'bg-sky-100 text-sky-700';
        case 'Facturado': return 'bg-green-100 text-green-700';
        case 'Pagado': return 'bg-emerald-100 text-emerald-700';
        case 'Pendiente': default: return 'bg-slate-100 text-slate-600';
    }
}

const getVisitStatusColor = (status, isBadge = false) => {
    const baseClasses = isBadge ? 'badge ' : 'status-dot ';
    switch (status) {
        case 'Realizada': return baseClasses + (isBadge ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500');
        case 'Cancelada': return baseClasses + (isBadge ? 'bg-red-100 text-red-700' : 'bg-red-500');
        case 'Programada': default: return baseClasses + (isBadge ? 'bg-teal-100 text-teal-700' : 'bg-teal-500');
    }
}

const getVisitStatusBgColor = (status, tipoVisita) => {
    switch (status) {
        case 'Realizada':
            return tipoVisita === 'primera' ? 'bg-teal-400 hover:bg-teal-500 text-white' : 'bg-emerald-400 hover:bg-emerald-500 text-white';
        case 'Cancelada':
            return 'bg-red-400 hover:bg-red-500 text-white';
        case 'Programada':
        default:
            return tipoVisita === 'primera' ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white';
    }
}

onMounted(async () => {
  console.log("Tiendas (Light Theme with Teal/Emerald - Suspense Fix) montado.");
  try {
    // Intenta importar db y luego inicializarlo.
    // La ruta '../firebase/firebase' debe ser correcta respecto a la ubicación de este componente.
    const firebaseModule = await import('../firebase/firebase');
    db = firebaseModule.db; // Asume que firebase.js exporta 'db'
    console.log("Firebase DB initialized in onMounted:", db);

    // Solo cargar datos si db se inicializó correctamente
    if (db) {
      await cargarMarcas();
      await cargarTiendas();
    } else {
      console.warn("Firebase DB no se pudo inicializar. Saltando carga de datos.");
      // Opcionalmente, puedes cargar datos de ejemplo aquí para desarrollo sin Firebase
      // marcas.value = ["Marca Ejemplo 1", "Marca Ejemplo 2"];
      // tiendas.value = [ /* ...datos de ejemplo... */ ];
      // actualizarMesesDisponibles(); // Si tienes datos de ejemplo
    }
  } catch (e) {
    console.error("Error al inicializar Firebase o cargar datos en onMounted:", e);
    // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    // o cargando datos de respaldo/ejemplo.
  }
});

</script>

<style scoped>
/* General Light Theme Adjustments */
.light-card {
  @apply bg-white shadow rounded-lg p-4 border border-gray-200;
}
.input-primary {
  @apply w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-slate-700 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
        transition-all duration-150 text-sm shadow-sm
        disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed;
}
.select-input {
  @apply appearance-none bg-no-repeat bg-right pr-8;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* gray-400 arrow */
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
}
.input-primary:focus.select-input {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2314b8a6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* teal-500 arrow */
}
.option-light { /* Changed from option-dark */
  @apply bg-white text-slate-700;
}
.input-primary.date-input::-webkit-calendar-picker-indicator,
.input-primary.month-input::-webkit-calendar-picker-indicator {
    filter: none; /* Remove invert for light theme */
    cursor: pointer;
}
.label-form { @apply block text-sm font-medium text-slate-600 mb-1.5; }
.error-message { @apply text-xs text-red-600 mt-1 absolute left-0 -bottom-5 whitespace-nowrap; }
.form-section { @apply md:col-span-3; }
.form-section-title { @apply text-lg font-semibold text-slate-700 mb-3 flex items-center border-b border-gray-200 pb-2; }

.btn-primary {
  @apply px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400
        transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center;
}
.btn-secondary {
  @apply px-4 py-2 bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-700 font-semibold rounded-lg shadow
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400
        transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center;
}
.btn-warning {
  @apply px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-semibold rounded-lg shadow
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300
        transition duration-150 ease-in-out flex items-center justify-center;
}
.btn-danger {
  @apply px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400
        transition duration-150 ease-in-out flex items-center justify-center;
}
.btn-link {
  @apply text-sm text-teal-600 hover:text-teal-700 hover:underline
        focus:outline-none focus:underline flex items-center
        disabled:opacity-60 disabled:cursor-not-allowed disabled:no-underline;
}
.btn-icon {
  @apply p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500
        transition duration-150 ease-in-out;
}

.alert-danger-light { /* Changed from alert-danger */
  @apply bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-md;
}
.loading-overlay-light { /* Changed from loading-overlay */
  @apply absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-xl;
}

.th-table {
  @apply px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-slate-100 border-b border-gray-200;
}
.td-table { @apply px-3 py-3 whitespace-nowrap text-sm text-slate-600; }

.badge { @apply px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap; }
.badge-light { /* Changed from badge-gray */
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-gray-200;
}
.status-dot { @apply inline-block w-3 h-3 rounded-full align-middle shadow-sm; }

/* Modal Light Theme Adjustments */
.modal-backdrop-light {
  @apply fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out;
}
.modal-content-light {
  @apply bg-white border border-gray-200 rounded-xl shadow-2xl w-full transform transition-all duration-300 ease-out mx-auto;
}
.modal-header-light {
  @apply flex justify-between items-center p-4 border-b border-gray-200;
}
.modal-title-light {
  @apply text-xl font-bold text-teal-600;
}
.modal-close-btn-light {
  @apply text-gray-400 hover:text-teal-600 text-3xl leading-none font-semibold p-1 -m-1 transition
        focus:outline-none focus:ring-1 focus:ring-teal-500 rounded-full;
}
.modal-footer-light {
  @apply p-4 border-t border-gray-200 flex justify-end;
}
.modal-list-container-light {
  @apply bg-slate-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto p-2 shadow-inner;
}
.modal-list-item-light {
  @apply flex justify-between items-center py-2 px-3 hover:bg-slate-100 rounded-md transition-colors duration-150;
}

/* Detail Modal Light Theme */
.detail-card-light {
  @apply bg-white rounded-lg shadow-lg p-4 border-t-4 border-opacity-70; /* Default border, specific below */
}
/* Specific border colors for detail cards, ensure these color classes are generated by Tailwind or defined */
.detail-card-light.border-emerald-500 { @apply border-t-emerald-500; }
.detail-card-light.border-teal-500 { @apply border-t-teal-500; }
.detail-card-light.border-purple-500 { @apply border-t-purple-500; }
.detail-card-light.border-yellow-500 { @apply border-t-yellow-500; }
.detail-card-light.border-red-500 { @apply border-t-red-500; }
.detail-card-light.border-pink-500 { @apply border-t-pink-500; }
.detail-card-light.border-gray-500 { @apply border-t-gray-500; }


.detail-card-title-light {
  @apply text-lg font-semibold mb-3 flex items-center border-b pb-2 border-gray-200;
}
.detail-dl-light { @apply grid grid-cols-2 gap-x-4 gap-y-3 text-sm; }
.detail-dl-light dt { @apply text-slate-500 font-medium; }
.detail-dl-light dd { @apply text-slate-700; }
.detail-description-light {
  @apply bg-slate-50 p-2 rounded border border-gray-200 text-xs text-slate-600;
}

/* Calendar Light Theme */
.calendar-day-light {
  @apply border border-gray-200 rounded-md p-1.5 min-h-[110px] flex flex-col text-xs transition-colors duration-150 relative bg-white hover:bg-slate-50;
}
.calendar-day-light.placeholder {
  @apply bg-slate-50 text-slate-400 opacity-70;
}
.calendar-day-light.today {
  @apply bg-teal-50 border-teal-400;
}
.day-number-light {
  @apply font-semibold mb-1 text-right mr-1 text-slate-500;
}
.day-visits-light {
  @apply mt-1 space-y-1 overflow-hidden flex-grow;
}
.visit-entry-light {
  @apply p-1 rounded text-[10px] leading-tight truncate cursor-pointer transition-all duration-150 ease-in-out flex items-center gap-1 shadow-sm;
}
.visit-more-light {
  @apply text-center text-slate-500 text-[9px] mt-1 font-medium;
}
.calendar-legend-light {
  @apply mt-4 flex justify-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 items-center;
}
.legend-dot { /* This class can remain, colors defined in template */
  @apply inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle shadow-sm;
}
.today-dot-light { /* Replaces .today-dot */
    @apply ring-1 ring-offset-1 ring-offset-white ring-teal-500;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-content-light,
.modal-fade-leave-active .modal-content-light {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-fade-enter-from .modal-content-light,
.modal-fade-leave-to .modal-content-light {
  transform: scale(0.95) translateY(-10px); opacity: 0;
}


/* Tailwind PurgeCSS Safelist (ensure these classes are generated) */
/* Consider reviewing and adding specific shades of teal, emerald, yellow, red, green, pink, gray, sky, purple if used dynamically and not directly in template */
.border-amber-500 {} .border-red-500 {} .border-green-500 {} .border-pink-500 {} .border-gray-500 {} .border-blue-500 {} .border-black {} .border-indigo-500 {} .border-purple-500 {} .border-cyan-500 {} .border-emerald-500 {} .border-sky-500 {} .border-teal-500 {} .border-yellow-500 {}
.hover\:shadow-amber-500\/10 {} .hover\:shadow-red-500\/10 {} .hover\:shadow-green-500\/10 {} .hover\:shadow-pink-500\/10 {} .hover\:shadow-gray-500\/10 {} .hover\:shadow-blue-500\/10 {} .hover\:shadow-black\/10 {} .hover\:shadow-indigo-500\/10 {} .hover\:shadow-purple-500\/10 {} .hover\:shadow-cyan-500\/10 {} .hover\:shadow-emerald-500\/10 {} .hover\:shadow-sky-500\/10 {} .hover\:shadow-teal-500\/10 {} .hover\:shadow-yellow-500\/10 {}

.text-yellow-700 {} .text-sky-700 {} .text-green-700 {} .text-emerald-700 {} .text-emerald-600 {} .text-slate-600 {} .text-red-700 {} .text-teal-600 {} .text-teal-700 {} .text-purple-600 {}
.bg-yellow-100 {} .bg-sky-100 {} .bg-green-100 {} .bg-emerald-100 {} .bg-slate-100 {} .bg-red-100 {} .bg-teal-100 {}

.bg-emerald-500 {} .bg-red-500 {} .bg-teal-500 {} .bg-teal-400 {} .bg-emerald-400 {}
.hover\:bg-teal-500 {} .hover\:bg-emerald-500 {} .hover\:bg-red-500 {}
.hover\:bg-teal-600 {} .hover\:bg-emerald-600 {}

.border-red-500 {} .focus\:\!ring-red-500 {} .\!bg-red-50 {}
.border-t-8 {}
.border-teal-400 {} .bg-teal-50 {} .text-teal-600 {}
</style>
