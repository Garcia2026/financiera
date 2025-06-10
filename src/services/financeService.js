// src/services/financeService.js
import { Timestamp } from 'firebase/firestore'
import logger from "@/utils/logger";

/**
 * Calcula el total de un array de items basado en un campo específico
 * @param {Array} items - Lista de items a sumar
 * @param {string} campo - Campo que contiene el valor a sumar
 * @returns {number} Suma total
 */
export const calcularTotal = (items = [], campo = 'monto') => {
  if (!items || !items.length) return 0;
  
  return items.reduce((suma, item) => {
    const valor = parseFloat(item[campo]);
    return suma + (isNaN(valor) ? 0 : valor);
  }, 0);
}

/**
 * Filtra items por un rango de fechas
 * @param {Array} items - Lista de items a filtrar
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {Date} fechaFin - Fecha de fin
 * @param {string} campoFecha - Campo que contiene la fecha
 * @returns {Array} Items filtrados
 */
export const filtrarPorRangoFechas = (items = [], fechaInicio, fechaFin, campoFecha = 'fecha') => {
  if (!items || !items.length) return [];
  if (!fechaInicio || !fechaFin) return items;
  
  return items.filter(item => {
    if (!item[campoFecha]) {
      return false;
    }
    
    try {
      let itemDate;
      if (item[campoFecha] instanceof Timestamp) {
        itemDate = item[campoFecha].toDate();
      } else if (typeof item[campoFecha] === 'string') {
        itemDate = new Date(item[campoFecha]);
      } else {
        itemDate = new Date(item[campoFecha]);
      }
      
      // Verificar fecha válida
      if (isNaN(itemDate.getTime())) {
        return false;
      }
      
      return itemDate >= fechaInicio && itemDate <= fechaFin;
    } catch (error) {
      logger.error('Error al procesar fecha:', error, item);
      return false;
    }
  });
}

/**
 * Calcula el rango de fechas para un mes y año específicos
 * @param {string|number} mes - Mes (1-12)
 * @param {number} anio - Año
 * @returns {Object} Fechas de inicio y fin del período
 */
export const calcularRangoMesAnio = (mes, anio) => {
  // Si no se especifica mes, devolver el rango para todo el año
  if (!mes) {
    return {
      inicio: new Date(anio, 0, 1),
      fin: new Date(anio, 11, 31, 23, 59, 59)
    };
  }
  
  const mesNum = parseInt(mes) - 1; // JavaScript usa 0-11 para meses
  const ultimoDia = new Date(anio, mesNum + 1, 0).getDate();
  
  return {
    inicio: new Date(anio, mesNum, 1),
    fin: new Date(anio, mesNum, ultimoDia, 23, 59, 59)
  };
}

/**
 * Calcula el porcentaje de diferencia entre dos valores
 * @param {number} actual - Valor actual
 * @param {number} anterior - Valor anterior
 * @returns {number} Porcentaje de diferencia
 */
export const calcularPorcentajeDiferencia = (actual, anterior) => {
  if (anterior === 0) return 0;
  return Math.round(((actual - anterior) / Math.abs(anterior)) * 100);
}

/**
 * Calcula el margen de ganancia
 * @param {number} ingresos - Total de ingresos
 * @param {number} gastos - Total de gastos
 * @returns {number} Porcentaje de margen
 */
export const calcularMargenGanancia = (ingresos, gastos) => {
  if (ingresos === 0) return 0;
  const ganancia = ingresos - gastos;
  return Math.round((ganancia / ingresos) * 100);
}

/**
 * Agrupa items por una propiedad y calcula totales
 * @param {Array} items - Lista de items a agrupar
 * @param {string} campo - Campo por el que agrupar
 * @param {string} campoValor - Campo que contiene el valor para totales
 * @returns {Array} Grupos con totales calculados
 */
export const agruparPorPropiedad = (items = [], campo = 'categoria', campoValor = 'monto') => {
  if (!items || !items.length) return [];
  
  const grupos = {};
  
  items.forEach(item => {
    const clave = item[campo] || 'Sin categoría';
    
    if (!grupos[clave]) {
      grupos[clave] = {
        nombre: clave,
        total: 0,
        items: [],
        count: 0
      };
    }
    
    const valor = parseFloat(item[campoValor]);
    grupos[clave].total += isNaN(valor) ? 0 : valor;
    grupos[clave].items.push(item);
    grupos[clave].count += 1;
  });
  
  return Object.values(grupos);
}

/**
 * Calcula el porcentaje de un valor sobre un total
 * @param {number} valor - Valor para calcular el porcentaje
 * @param {number} total - Valor total
 * @returns {number} Porcentaje
 */
export const calcularPorcentaje = (valor, total) => {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
}

export default {
  calcularTotal,
  filtrarPorRangoFechas,
  calcularRangoMesAnio,
  calcularPorcentajeDiferencia,
  calcularMargenGanancia,
  agruparPorPropiedad,
  calcularPorcentaje
}