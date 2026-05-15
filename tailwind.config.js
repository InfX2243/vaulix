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
          primary: '#1F4B99',    // Deep blue
          accent: '#4DD6FF',     // Bright cyan
          'dark-bg': '#0B0F14',  // Very dark background
          'dark-card': '#111827', // Dark card background
          'light-bg': '#F5F7FA', // Light background
          'light-text': '#94A3B8', // Light text/secondary
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
