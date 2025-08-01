// tailwind.config.js
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Doar adaugi culori suplimentare sau aliasuri, NU redefini `colors`
      colors: {
        primary: colors.emerald, // un alias gen "bg-primary-500"
        brand: colors.indigo,    // ex: bg-brand-600
      },
    },
  },
  plugins: [],
}
