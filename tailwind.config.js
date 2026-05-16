/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vaulix: {
          // Strict brand tokens
          'main-bg': '#0B0F14',
          'surface-bg': '#111827',
          primary: '#1F4B99',
          accent: '#4DD6FF',
          'main-text': '#F5F7FA',
          'secondary-text': '#94A3B8',
          // Legacy aliases for compatibility
          'dark-bg': '#0B0F14',
          'dark-card': '#111827',
          'light-bg': '#F5F7FA',
          'light-text': '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
