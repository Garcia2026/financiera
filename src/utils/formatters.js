// src/utils/formatters.js
import { Timestamp } from 'firebase/firestore';

/**
 * Parsea de forma segura un valor de fecha (Timestamp, Date, string) a un objeto Date.
 * Devuelve null si no se puede parsear.
 */
export const safeParseDate = (dateValue) => {
    if (!dateValue) return null;
    try {
        if (dateValue instanceof Timestamp) {
            return dateValue.toDate();
        }
        if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
             return dateValue; // Ya es Date válido
        }
        if (typeof dateValue === 'string') {
             // Intentar primero YYYY-MM-DD
             if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                 // IMPORTANTE: Crear como UTC para evitar saltos de día por zona horaria al mostrar solo fecha
                 const parts = dateValue.split('-').map(Number);
                 const dateObj = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
                 if (!isNaN(dateObj.getTime())) return dateObj;
             }
             // Intentar parsear como ISO string si tiene T u Z
             if (dateValue.includes('T') || dateValue.includes('Z')) {
                 const dateObj = new Date(dateValue);
                 if (!isNaN(dateObj.getTime())) return dateObj;
             }
        }
         // Último intento (puede ser poco fiable con formatos ambiguos)
        const dateObj = new Date(dateValue);
        if (!isNaN(dateObj.getTime())) return dateObj;

        console.warn('Could not parse date value:', dateValue);
        return null; // Fallback
    } catch (e) {
        console.warn('Error parsing date value:', dateValue, e);
        return null;
    }
};

/**
 * Formatea un objeto Date o valor parseable a string DD/MM/YYYY (usando UTC para evitar saltos de día).
 */
export const formatearFecha = (dateInput, incluirAno = true) => {
  const date = safeParseDate(dateInput); // Usa el parser seguro
  if (!date) return '-';
  try {
    // Forzar interpretación UTC para mostrar la fecha correcta independientemente de la zona horaria local
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Meses son 0-indexados
    const day = date.getUTCDate().toString().padStart(2, '0');

    return incluirAno ? `${day}/${month}/${year}` : `${day}/${month}`;
  } catch (e) {
    console.error("Error formateando fecha:", dateInput, e);
    return 'Error Fecha';
  }
};


/**
 * Formatea un string YYYY-MM a "Mes Año".
 */
export const formatearMes = (mesStr) => {
  if (!mesStr || typeof mesStr !== 'string' || !mesStr.includes('-')) return mesStr || '';
  try {
    const [ano, mes] = mesStr.split('-');
    // Usar UTC para evitar problemas de zona horaria al crear la fecha
    const fecha = new Date(Date.UTC(Number(ano), Number(mes) - 1, 1));
    if (isNaN(fecha.getTime())) return mesStr;
    // Usar toLocaleDateString con timeZone UTC para consistencia
    let mesFormateado = fecha.toLocaleDateString('es-GT', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    return mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);
  } catch (e) { return mesStr; }
};

/**
 * Formatea un número a moneda Quetzal (Q).
 */
export const formatearMoneda = (amount) => {
  return Number(amount || 0).toLocaleString('es-GT', { style:'currency', currency: 'GTQ', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Devuelve clases de Tailwind para badges de estado de proceso/cobro.
 */
export const getProcessStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'en proceso de ods': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'en cova': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'facturado': return 'bg-teal-100 text-teal-800 border border-teal-200';
      case 'pagado': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'pendiente': default: return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

/**
 * Devuelve clase de Tailwind para puntos de estado de visita en tabla.
 */
export const getVisitStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'realizada': return 'bg-teal-500';
    case 'cancelada': return 'bg-red-500';
    case 'programada': default: return 'bg-indigo-500';
  }
};

/**
 * Devuelve clase de Tailwind para fondo de visita en modal calendario.
 */
export const getVisitStatusBgColor = (status, tipoVisita) => {
    const lowerStatus = status?.toLowerCase();
    const lowerTipo = tipoVisita?.toLowerCase();
    if (lowerStatus === 'realizada') {
        return lowerTipo === 'primera' ? 'visit-bg-blue-done' : 'visit-bg-green-done';
    } else if (lowerStatus === 'cancelada') {
        return 'visit-bg-red-cancel';
    } else { // Programada o default
        return lowerTipo === 'primera' ? 'visit-bg-blue-prog' : 'visit-bg-green-prog';
    }
};


// --- Colores y Clases de Categoría (Gastos / Finanzas) ---
const categoryColors = [
  { class: 'bg-blue-100 text-blue-800', colorHex: '#60A5FA', iconColor: 'text-blue-600' },
  { class: 'bg-green-100 text-green-800', colorHex: '#34D399', iconColor: 'text-green-600' },
  { class: 'bg-purple-100 text-purple-800', colorHex: '#A78BFA', iconColor: 'text-purple-600' },
  { class: 'bg-yellow-100 text-yellow-800', colorHex: '#FBBF24', iconColor: 'text-yellow-600' },
  { class: 'bg-indigo-100 text-indigo-800', colorHex: '#818CF8', iconColor: 'text-indigo-600' },
  { class: 'bg-pink-100 text-pink-800', colorHex: '#F472B6', iconColor: 'text-pink-600' },
  { class: 'bg-red-100 text-red-800', colorHex: '#F87171', iconColor: 'text-red-600' },
  { class: 'bg-teal-100 text-teal-800', colorHex: '#5EEAD4', iconColor: 'text-teal-600' },
  { class: 'bg-orange-100 text-orange-800', colorHex: '#FB923C', iconColor: 'text-orange-600' },
  { class: 'bg-gray-100 text-gray-800', colorHex: '#9CA3AF', iconColor: 'text-gray-600' }
];

const hashCode = (str) => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const getColorStylesForCategory = (categoria) => {
  if (!categoria) { // Default para 'Sin Categoría'
      return categoryColors[categoryColors.length - 1]; // Usar el último (gris)
  }
  const index = Math.abs(hashCode(categoria)) % categoryColors.length;
  return categoryColors[index];
};

export const getCategoryClass = (categoria) => getColorStylesForCategory(categoria).class;
export const getCategoryColor = (categoria) => getColorStylesForCategory(categoria).colorHex; // Devuelve HEX
export const getCategoryIconColorClass = (categoria) => getColorStylesForCategory(categoria).iconColor;

// --- Colores de Marca (Tiendas) ---
const brandColors = {
  "McDonald's": 'amber', "Pizza Hut": 'red', "Kentucky": 'red', "Starbucks": 'teal',
  "Dunkin Donuts": 'pink', "Edificio Naguchi": 'gray', "Pandas": 'indigo', 'DEFAULT': 'blue'
};
export const getBrandColor = (brandName) => {
  const normalizedBrand = brandName?.trim().toLowerCase() || 'default';
  const foundKey = Object.keys(brandColors).find(key => key !== 'DEFAULT' && normalizedBrand.includes(key.toLowerCase()));
  return brandColors[foundKey] || brandColors['DEFAULT'];
};