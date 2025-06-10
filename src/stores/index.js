import { defineStore } from 'pinia'

const STORAGE_KEY = 'animations-enabled'

export const useAppStore = defineStore('app', {
  state: () => ({
    animationsEnabled: true
  }),
  actions: {
    loadAnimationsPref() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved !== null) {
          this.animationsEnabled = saved === 'true'
        }
      } catch (e) {
        console.error('Failed to load animations preference', e)
      }
    },
    saveAnimationsPref() {
      try {
        localStorage.setItem(STORAGE_KEY, this.animationsEnabled)
      } catch (e) {
        console.error('Failed to save animations preference', e)
      }
    },
    toggleAnimations() {
      this.animationsEnabled = !this.animationsEnabled
      this.saveAnimationsPref()
    },
    setAnimationsEnabled(value) {
      this.animationsEnabled = value
      this.saveAnimationsPref()
    }
  }
})
