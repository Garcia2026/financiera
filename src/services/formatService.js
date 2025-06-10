// src/services/formatService.js
import { Timestamp } from 'firebase/firestore'
import logger from "@/utils/logger";

/**
 * Formatea una fecha para mostrarla en formato local
 * @param {Date|Timestamp|string} fechaInput - Fecha a formatear
 * @param {Object} options - Opciones de formateo
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fechaInput, options = {}) => {
  if (!fechaInput) return '-'

  try {
    let fecha
    if (fechaInput instanceof Timestamp) {
      fecha = fechaInput.toDate()
    } else if (typeof fechaInput === 'string') {
      fecha = new Date(fechaInput)
    } else {
      fecha = new Date(fechaInput)
    }
    
    // Comprobar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      logger.warn('Fecha inválida:', fechaInput)
      return String(fechaInput)
    }

    const defaultOptions = { 
      day: '2-digit', 
      month: '2-digit',

      year: 'numeric' 
    }
    
    const formatOptions = { ...defaultOptions, ...options }
    return fecha.toLocaleDateString('es-GT', formatOptions)
  } catch (error) {
    logger.error('Error al formatear fecha:', error, fechaInput)
    return String(fechaInput)
  }
}

/**
 * Formatea un valor numérico como moneda (Q)
 * @param {number|string} cantidad - Cantidad a formatear
 * @param {Object} options - Opciones de formateo
 * @returns {string} Cantidad formateada
 */
export const formatearDinero = (cantidad, options = {}) => {
  if (cantidad === undefined || cantidad === null) return 'Q0.00'
  
  // Asegurar que cantidad sea un número
  const numero = parseFloat(cantidad)
  if (isNaN(numero)) return 'Q0.00'
  
  const defaultOptions = { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }
  
  const formatOptions = { ...defaultOptions, ...options }
  return 'Q' + numero.toLocaleString('es-GT', formatOptions)
}

/**
 * Formatea un mes en formato ISO (YYYY-MM) a texto
 * @param {string} mesStr - Mes en formato ISO (YYYY-MM)
 * @returns {string} Mes formateado (ej: "Enero 2023")
 */
export const formatearMes = (mesStr) => {
  if (!mesStr) return ''
  
  try {
    const [ano, mes] = mesStr.split('-')
    const fecha = new Date(Number(ano), Number(mes) - 1, 1)
    
    if (isNaN(fecha.getTime())) {
      return mesStr
    }
    
    return fecha.toLocaleDateString('es-GT', { 
      month: 'long', 
      year: 'numeric' 
    })
  } catch (error) {
    logger.error('Error al formatear mes:', error, mesStr)
    return mesStr
  }
}

/**
 * Normaliza un valor de estado para comparación
 * @param {string} estado - Estado a normalizar
 * @returns {string} Estado normalizado en minúsculas sin espacios
 */
export const normalizarEstado = (estado) => {
  if (!estado) return ''
  return String(estado).toLowerCase().trim()
}

export default {
  formatearFecha,
  formatearDinero,
  formatearMes,
  normalizarEstado
}