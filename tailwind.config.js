// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Verifica que esta ruta sea correcta
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use Ubuntu as the primary sans serif font followed by Inter
        sans: ['Ubuntu', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      // ... (puedes tener otras extensiones aquí) ...
    },
  },
  plugins: [
     // require('tailwind-scrollbar'), // Descomenta si usas el plugin de scrollbar
  ],
}