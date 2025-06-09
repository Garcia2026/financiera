<template>
  <div class="relative w-full h-screen overflow-hidden" :style="backgroundStyle">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center flex-col text-center text-white px-4 z-10">
      
      <Transition appear @before-enter="beforeEnter" @enter="enter">
        <h1 class="text-4xl md:text-6xl font-extrabold text-cyan-400 drop-shadow-md a11y-pulse">
          Soluciones Integrales GN
        </h1>
      </Transition>
      
      <Transition appear @before-enter="beforeEnter" @enter="enter" :style="{ transitionDelay: '200ms' }">
        <p class="text-xl md:text-2xl mt-4 text-blue-200">
          Tenemos un mundo de posibilidades para ti
        </p>
      </Transition>

      <div class="mt-10">
        <Transition appear @before-enter="beforeEnter" @enter="enter" :style="{ transitionDelay: '400ms' }">
          <router-link
            to="/login"
            class="px-10 py-3 bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Entrar al sistema
          </router-link>
        </Transition>
      </div>

    </div>
  </div>
</template>

<script setup>
const backgroundStyle = {
  backgroundImage: "url('/assets/futuristic-bg.avif')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

// 2. Funciones para controlar la animación de entrada
const beforeEnter = (el) => {
  el.style.opacity = 0
  el.style.transform = 'translateY(20px)'
}

const enter = (el) => {
  el.style.opacity = 1
  el.style.transform = 'translateY(0)'
  el.style.transition = 'all 0.6s ease-out'
}
</script>

<style scoped>
/* 3. Mejoras de accesibilidad para animaciones */
@media (prefers-reduced-motion: reduce) {
  /* Desactiva la animación de pulso si el usuario lo prefiere */
  .a11y-pulse {
    animation: none;
  }
  
  /* Elimina la transición de entrada para los elementos */
  .v-enter-active {
    transition: none !important;
  }
}

/* Reemplazamos 'animate-pulse' para que respete la configuración de accesibilidad */
.a11y-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>