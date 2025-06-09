<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 font-sans text-gray-100">
    <div v-if="isAuthenticated" class="sticky top-0 z-50 bg-gray-900/70 backdrop-blur-xl shadow-lg shadow-emerald-500/10 mb-6 animate-fade-in border-b border-emerald-500/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center transform transition-all duration-500 hover:scale-105">
            <div class="h-10 w-10 mr-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-400/30">
              <span class="text-gray-900 font-bold text-lg">GN</span>
            </div>
            <h1 class="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 glow-emerald">
              Soluciones GN
            </h1>
          </div>
          
          <div class="hidden md:flex items-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-full border border-emerald-500/20 shadow-inner shadow-emerald-500/5">
            <div class="digital-clock text-emerald-400 font-mono text-sm md:text-base tracking-wider">
              {{ formattedTime }}
            </div>
            <div class="text-xs text-emerald-500/70">
              {{ formattedDate }}
            </div>
          </div>
          
          <button @click="menuOpen = !menuOpen" class="md:hidden text-emerald-400 hover:text-emerald-300 transition-colors duration-300 p-2 rounded-lg hover:bg-gray-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div class="hidden md:flex items-center space-x-4">
            <div class="relative group">
              <button @click="profileOpen = !profileOpen" class="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 p-2 rounded-full hover:bg-gray-800/50 transition-all duration-300 border border-transparent hover:border-emerald-500/20">
                <span class="hidden lg:inline-block">{{ userName || 'Usuario' }}</span>
                <div class="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-400/20 flex items-center justify-center text-emerald-400 font-medium border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                  {{ userInitials }}
                </div>
              </button>
              
              <div v-if="profileOpen" class="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg py-2 z-10 border border-emerald-500/20 animate-fade-in-down">
                <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/70 hover:text-emerald-400">
                  Mi perfil
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/70 hover:text-emerald-400">
                  Configuración
                </a>
                <div class="border-t border-gray-700/50 my-1"></div>
                <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/70 hover:text-red-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="hidden md:flex flex-wrap justify-center pb-3 gap-3">
          <router-link 
            v-for="(item, index) in menuItems" 
            :key="index" 
            :to="item.ruta"
            :class="[
              'px-5 py-2.5 rounded-lg text-center text-sm font-medium transition-all duration-300 transform',
              'flex items-center gap-2 relative overflow-hidden tech-btn',
              isActive(item.ruta) 
                ? 'bg-gradient-to-r from-emerald-600/40 to-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/20 scale-105 border border-emerald-500/30' 
                : 'bg-gray-800/30 text-gray-300 hover:text-emerald-300 hover:scale-105 hover:shadow-md hover:shadow-emerald-500/10 border border-gray-700/30 hover:border-emerald-500/20',
              `animate-fade-in-delayed-${index}`
            ]">
            <span class="z-10 relative">
              <span v-if="item.icono" v-html="item.icono"></span>
              <span>{{ item.nombre }}</span>
            </span>
            <span class="tech-btn-bg absolute inset-0 bg-gradient-to-r from-emerald-600/0 to-emerald-400/0 opacity-0 transition-opacity duration-300"></span>
          </router-link>
        </div>
      </div>
    </div>
    
    <div v-if="isAuthenticated && menuOpen" class="md:hidden bg-gray-800/90 backdrop-blur-md border-b border-emerald-500/20 animate-fade-in-down">
      <div class="px-4 py-3 space-y-2">
        <div class="flex justify-center items-center space-x-3 bg-gray-900/50 px-4 py-3 rounded-lg border border-emerald-500/20 mb-4 shadow-inner shadow-emerald-500/5">
          <div class="digital-clock text-emerald-400 font-mono text-base tracking-wider">
            {{ formattedTime }}
          </div>
          <div class="text-xs text-emerald-500/70">
            {{ formattedDate }}
          </div>
        </div>
        
        <router-link 
          v-for="(item, index) in menuItems" 
          :key="index" 
          :to="item.ruta"
          @click="menuOpen = false"
          :class="[
            'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
            'flex items-center gap-3',
            isActive(item.ruta) 
              ? 'bg-gray-700/50 text-emerald-400 border-l-2 border-emerald-500' 
              : 'text-gray-300 hover:bg-gray-700/30 hover:text-emerald-300 border-l-2 border-transparent'
          ]">
          <span v-if="item.icono" v-html="item.icono"></span>
          <span>{{ item.nombre }}</span>
        </router-link>
        
        <button 
          @click="logout" 
          class="w-full text-left mt-5 px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-gray-700/30 hover:text-red-300 flex items-center gap-3 border-l-2 border-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
    
    <main class="pt-4 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer v-if="isAuthenticated" class="bg-gray-900/80 backdrop-blur-md border-t border-emerald-500/20 py-6 text-gray-400 text-sm animate-fade-in shadow-lg shadow-emerald-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:justify-between items-center space-y-3 md:space-y-0">
          <p>© {{ new Date().getFullYear() }} <span class="text-emerald-400">Soluciones Integrales GN</span>. Todos los derechos reservados.</p>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ayuda</span>
            </a>
            <a href="#" class="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span>Contacto</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

// Estado de la aplicación
const isAuthenticated = ref(false)
const menuOpen = ref(false)
const profileOpen = ref(false)
const userName = ref('')
const currentTime = ref(new Date())
const auth = getAuth()
const router = useRouter()
const route = useRoute()
let unsubscribe
let clockInterval

// Cierra el menú desplegable cuando cambia la ruta
watch(() => route.path, () => {
  menuOpen.value = false
  profileOpen.value = false
})

// Formato del reloj digital
const formattedTime = computed(() => {
  const hours = currentTime.value.getHours().toString().padStart(2, '0')
  const minutes = currentTime.value.getMinutes().toString().padStart(2, '0')
  const seconds = currentTime.value.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
})

// Formato de la fecha
const formattedDate = computed(() => {
  const options = { weekday: 'short', day: 'numeric', month: 'short' }
  return currentTime.value.toLocaleDateString('es-ES', options)
})

// Cierra el menú desplegable al hacer clic fuera
const closeDropdowns = (e) => {
  if (!e.target.closest('.group')) {
    profileOpen.value = false
  }
}

// Iniciales del usuario para el avatar
const userInitials = computed(() => {
  if (!userName.value) return 'U'
  return userName.value
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

// Actualización del reloj
const updateClock = () => {
  currentTime.value = new Date()
}

// Elementos del menú principal con iconos SVG actualizados para el tema oscuro
const menuItems = ref([ // Convertido a ref para asegurar reactividad si se modifica dinámicamente
  { 
    nombre: 'Dashboard', 
    ruta: '/dashboard',
    icono: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>'
  },
  { 
    nombre: 'Tiendas', 
    ruta: '/tiendas',
    icono: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>'
  },
  { 
    nombre: 'Cobros', 
    ruta: '/cobros',
    icono: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>'
  },
  {
    nombre: 'Estadísticas',
    ruta: '/estadisticas',
    icono: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
  },
  {
    nombre: 'Finanzas',
    ruta: '/finanzas',
    icono: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
  },
  // --- NUEVO ENLACE PARA COTIZACIONES ---
  {
    nombre: 'Cotizaciones',
    ruta: '/cotizaciones', // Asegúrate que esta ruta coincida con la definida en tu router/index.js
    icono: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>' // Icono de documento/cotización
  }
  // --- FIN DEL NUEVO ENLACE ---
])

// Verificar si una ruta está activa
const isActive = (path) => {
  return route.path === path
}

// Método para cerrar sesión
const logout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

onMounted(() => {
  // Iniciar el reloj
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
  
  // Suscribirse a cambios en el estado de autenticación
  unsubscribe = onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user
    
    if (user) {
      userName.value = user.displayName || user.email.split('@')[0] || 'Usuario'
    }
    
    // Si no está autenticado y no está en la página de login, redirigir a login
    if (!user && route.path !== '/login') {
      router.push('/login')
    }
  })
  
  // Agregar event listener para cerrar menús desplegables
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  // Limpiar suscripciones y event listeners
  if (unsubscribe) {
    unsubscribe()
  }
  document.removeEventListener('click', closeDropdowns)
  
  // Detener el intervalo del reloj
  if (clockInterval) {
    clearInterval(clockInterval)
  }
})
</script>

<style>
/* Transiciones de página mejoradas */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease-out;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Animaciones para elementos */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animaciones con retraso para el menú */
.animate-fade-in-delayed-0 {
  animation: fadeIn 0.5s ease-out 0.1s forwards;
  opacity: 0;
}

.animate-fade-in-delayed-1 {
  animation: fadeIn 0.5s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-fade-in-delayed-2 {
  animation: fadeIn 0.5s ease-out 0.3s forwards;
  opacity: 0;
}

.animate-fade-in-delayed-3 {
  animation: fadeIn 0.5s ease-out 0.4s forwards;
  opacity: 0;
}

.animate-fade-in-delayed-4 {
  animation: fadeIn 0.5s ease-out 0.5s forwards;
  opacity: 0;
}
/* Añadir una clase más para el nuevo item de menú si es necesario */
.animate-fade-in-delayed-5 {
  animation: fadeIn 0.5s ease-out 0.6s forwards;
  opacity: 0;
}


/* Efecto de brillo para textos esmeralda */
.glow-emerald {
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.2);
}

/* Estilo futurista para el reloj digital */
.digital-clock {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  letter-spacing: 0.1em;
  position: relative;
  padding: 0.2em 0.5em;
}

/* Efectos hover para botones tecnológicos */
.tech-btn:hover .tech-btn-bg {
  opacity: 0.2;
}

.tech-btn-bg {
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%);
}

/* Estilo futurista para botones e inputs */
button, input, select {
  transition: all 0.2s ease-in-out;
}

button:focus, input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
}

/* Estilos para scroll suave */
html {
  scroll-behavior: smooth;
}

/* Scrollbar personalizada para tema oscuro */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.8); /* bg-gray-800 */
}

::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.5); /* emerald-500 con opacidad */
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.7); /* emerald-500 más opaco */
}

/* Fuente moderna y responsiva */
body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  @apply text-gray-300 bg-gray-900; /* Clases de Tailwind para texto y fondo por defecto */
}

/* Media queries para optimizar la experiencia en dispositivos */
@media (max-width: 640px) {
  .max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .digital-clock {
    font-size: 0.9rem;
  }
}
</style>
