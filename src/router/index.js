import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Tiendas from '../views/Tiendas.vue'
import Cobros from '../views/Cobros.vue'
import Estadisticas from '../views/Estadisticas.vue'
import ExpensesTracker from '../views/ExpensesTracker.vue'
// 1. Importa el nuevo componente de cotizaciones
import GestionCotizaciones from '../views/GestionCotizaciones.vue' // Asegúrate que la ruta sea correcta

const routes = [
  { path: '/', redirect: '/dashboard' }, // Redirige la ruta raíz al dashboard
  { path: '/home', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: Login },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/tiendas', name: 'tiendas', component: Tiendas },
  { path: '/cobros', name: 'cobros', component: Cobros },
  { path: '/estadisticas', name: 'estadisticas', component: Estadisticas },
  { path: '/finanzas', name: 'finanzas', component: ExpensesTracker },
  // 2. Añade la nueva ruta para el componente de cotizaciones
  {
    path: '/cotizaciones',
    name: 'cotizaciones', // o 'GestionCotizaciones' si prefieres
    component: GestionCotizaciones,
    // Opcional: puedes añadir meta información si la usas (ej. para títulos de página o guards)
    // meta: { title: 'Gestión de Cotizaciones', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Asegúrate que BASE_URL esté configurado en tu .env si es necesario, o usa createWebHistory() directamente si no.
  routes
})

export default router
