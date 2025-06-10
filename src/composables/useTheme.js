// src/composables/useTheme.js
import { ref, onMounted, readonly } from 'vue'
import logger from "@/utils/logger";

const THEME_STORAGE_KEY = 'app-theme'

// Estado reactivo para el tema actual
const currentTheme = ref('light')

export function useTheme() {
  const applyTheme = (themeName) => {
    document.documentElement.classList.remove('theme-dark', 'theme-corporativo')
    if (themeName === 'dark') {
      document.documentElement.classList.add('theme-dark')
    } else if (themeName === 'corporativo') {
      document.documentElement.classList.add('theme-corporativo')
    }
    currentTheme.value = themeName
  }

  const setThemePreference = (themeName) => {
    applyTheme(themeName)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeName)
    } catch (e) {
      logger.error('Failed to save theme preference:', e)
    }
  }

  const toggleTheme = () => {
    setThemePreference(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  const initializeTheme = () => {
    let initialTheme
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

    if (savedTheme) {
      initialTheme = savedTheme
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      initialTheme = 'dark'
    } else {
      initialTheme = 'light'
    }
    applyTheme(initialTheme)
  }

  onMounted(() => {
    initializeTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemThemeChangeHandler = (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', systemThemeChangeHandler)
  })

  return {
    currentTheme: readonly(currentTheme),
    toggleTheme,
    setThemePreference,
  }
}

