import Chart from 'chart.js/auto'
import { db } from '../firebase/firebase'
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'

export function useDashboardOptions() {
  return {
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
      beneficioNeto: 0,
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
        this.beneficioNeto = this.ingresosTotales - this.gastosTotales;
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
        this.beneficioNeto = this.ingresosTotales - this.gastosTotales;
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
        ctx.font = '16px Ubuntu';
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
}
}
