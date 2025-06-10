// src/services/firebaseService.js
import { 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    Timestamp, 
    serverTimestamp
  } from 'firebase/firestore'
  import { db } from '../firebase.js'
  
  /**
   * Obtiene todos los documentos de una colección
   * @param {string} coleccion - Nombre de la colección
   * @returns {Promise<Array>} Lista de documentos
   */
  export const obtenerDocumentos = async (coleccion) => {
    try {
      const snapshot = await getDocs(collection(db, coleccion))
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error(`Error al obtener documentos de ${coleccion}:`, error)
      throw error
    }
  }
  
  /**
   * Obtiene un documento específico por ID
   * @param {string} coleccion - Nombre de la colección
   * @param {string} id - ID del documento
   * @returns {Promise<Object>} Documento
   */
  export const obtenerDocumento = async (coleccion, id) => {
    try {
      const docRef = doc(db, coleccion, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        }
      } else {
        throw new Error(`Documento ${id} no encontrado en ${coleccion}`)
      }
    } catch (error) {
      console.error(`Error al obtener documento ${id} de ${coleccion}:`, error)
      throw error
    }
  }
  
  /**
   * Agrega un nuevo documento a una colección
   * @param {string} coleccion - Nombre de la colección
   * @param {Object} datos - Datos del documento
   * @param {boolean} agregarTimestamp - Si se agrega timestamp automático
   * @returns {Promise<string>} ID del nuevo documento
   */
  export const agregarDocumento = async (coleccion, datos, agregarTimestamp = true) => {
    try {
      const datosFinales = { ...datos }
      
      if (agregarTimestamp) {
        datosFinales.fechaCreacion = serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, coleccion), datosFinales)
      return docRef.id
    } catch (error) {
      console.error(`Error al agregar documento a ${coleccion}:`, error)
      throw error
    }
  }
  
  /**
   * Actualiza un documento existente
   * @param {string} coleccion - Nombre de la colección
   * @param {string} id - ID del documento
   * @param {Object} datos - Datos a actualizar
   * @param {boolean} agregarTimestamp - Si se agrega timestamp de actualización
   * @returns {Promise<void>}
   */
  export const actualizarDocumento = async (coleccion, id, datos, agregarTimestamp = true) => {
    try {
      const datosFinales = { ...datos }
      
      if (agregarTimestamp) {
        datosFinales.fechaActualizacion = serverTimestamp()
      }
      
      await updateDoc(doc(db, coleccion, id), datosFinales)
    } catch (error) {
      console.error(`Error al actualizar documento ${id} en ${coleccion}:`, error)
      throw error
    }
  }
  
  /**
   * Elimina un documento
   * @param {string} coleccion - Nombre de la colección
   * @param {string} id - ID del documento
   * @returns {Promise<void>}
   */
  export const eliminarDocumento = async (coleccion, id) => {
    try {
      await deleteDoc(doc(db, coleccion, id))
    } catch (error) {
      console.error(`Error al eliminar documento ${id} de ${coleccion}:`, error)
      throw error
    }
  }
  
  /**
   * Obtiene documentos que cumplen con una condición
   * @param {string} coleccion - Nombre de la colección
   * @param {string} campo - Campo para filtrar
   * @param {string} operador - Operador de comparación
   * @param {any} valor - Valor a comparar
   * @returns {Promise<Array>} Lista de documentos
   */
  export const obtenerDocumentosFiltrados = async (coleccion, campo, operador, valor) => {
    try {
      const q = query(collection(db, coleccion), where(campo, operador, valor))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error(`Error al obtener documentos filtrados de ${coleccion}:`, error)
      throw error
    }
  }
  
  /**
   * Obtiene los gastos de la base de datos
   * @returns {Promise<Array>} Lista de gastos
   */
  export const obtenerGastos = async () => {
    return await obtenerDocumentos('gastos')
  }
  
  /**
   * Obtiene los cobros de la base de datos
   * @param {boolean} soloCompletados - Si solo se obtienen cobros con estado 'Pagado'
   * @returns {Promise<Array>} Lista de cobros
   */
  export const obtenerCobros = async (soloCompletados = false) => {
    try {
      let cobros = await obtenerDocumentos('cobros')
      
      // Procesar montos para asegurar que sean números
      cobros = cobros.map(cobro => ({
        ...cobro,
        monto: typeof cobro.monto === 'number' ? cobro.monto : parseFloat(cobro.monto) || 0
      }))
      
      if (soloCompletados) {
        return cobros.filter(cobro => 
          cobro.estado && typeof cobro.estado === 'string' && 
          cobro.estado.toLowerCase().trim() === 'pagado'
        )
      }
      
      return cobros
    } catch (error) {
      console.error('Error al obtener cobros:', error)
      throw error
    }
  }
  
  /**
   * Obtiene las tiendas de la base de datos
   * @returns {Promise<Array>} Lista de tiendas
   */
  export const obtenerTiendas = async () => {
    return await obtenerDocumentos('tiendas')
  }
  
  export default {
    obtenerDocumentos,
    obtenerDocumento,
    agregarDocumento,
    actualizarDocumento,
    eliminarDocumento,
    obtenerDocumentosFiltrados,
    obtenerGastos,
    obtenerCobros,
    obtenerTiendas
  }
