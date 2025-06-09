// src/composables/useTheme.js
import { ref, onMounted, watch, readonly } from 'vue';

const THEME_STORAGE_KEY = 'app-theme';

// Estado reactivo para el tema actual (true si es oscuro, false si es claro)
// Lo definimos fuera para que sea un singleton si se usa en múltiples sitios,
// aunque para este caso, con App.vue controlándolo, no es estrictamente necesario.
const isDark = ref(false);

export function useTheme() {
  const applyTheme = (themeIsDark) => {
    if (themeIsDark) {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
    isDark.value = themeIsDark;
  };

  const setThemePreference = (themeIsDark) => {
    applyTheme(themeIsDark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeIsDark ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to save theme preference:', e);
    }
  };

  const toggleTheme = () => {
    setThemePreference(!isDark.value);
  };

  const initializeTheme = () => {
    let initialThemeIsDark;
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme) {
      initialThemeIsDark = savedTheme === 'dark';
    } else {
      // Si no hay tema guardado, usar la preferencia del sistema
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initialThemeIsDark = true;
      } else {
        initialThemeIsDark = false; // Default a claro si no hay preferencia o no se puede detectar
      }
    }
    applyTheme(initialThemeIsDark); // Aplicar sin guardar en localStorage, ya que se está inicializando desde allí o desde system pref
  };

  // Inicializar el tema cuando el composable se usa por primera vez
  // (o cuando el componente que lo usa se monta)
  onMounted(() => {
    initializeTheme();

    // Escuchar cambios en la preferencia del sistema (opcional, pero bueno para la UX)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemThemeChangeHandler = (e) => {
      // Solo actualiza si no hay una preferencia explícita guardada por el usuario
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches);
      }
    };
    mediaQuery.addEventListener('change', systemThemeChangeHandler);
    
    // Limpiar el listener cuando el componente se desmonte
    // Esto es más relevante si el composable se usa en componentes que se montan/desmontan.
    // En App.vue, vivirá tanto como la app.
    // onUnmounted(() => {
    //   mediaQuery.removeEventListener('change', systemThemeChangeHandler);
    // });
  });

  // Exponer el estado del tema como readonly y la función para cambiarlo
  return {
    isDark: readonly(isDark),
    toggleTheme,
    setThemePreference // Exponer por si se quiere setear un tema directamente
  };
}