import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import './assets/css/themes.css'
import './assets/css/light-components.css'
import { createPinia } from 'pinia'
import { useAppStore } from './stores'

// 1. Importa el plugin y su CSS
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
const store = useAppStore()
store.loadAnimationsPref()

// 2. Opcional: Define las opciones de configuración para las notificaciones
const options = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
}

// 3. Registra el router y LUEGO el plugin Toast ANTES de montar la app
app.use(router)
app.use(Toast, options)

// 4. Monta la aplicación
app.mount('#app')
