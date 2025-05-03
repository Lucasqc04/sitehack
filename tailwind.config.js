/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hack: {
          primary: '#00ff41', // Verde neon mais brilhante
          secondary: '#08a045', // Verde mais escuro
          accent: '#8eff1b', // Verde limão 
          dark: '#0d0208', // Preto com leve tom
          light: '#a2ff00', // Verde mais claro
        }
      },
      animation: {
        'text-flicker': 'flicker 0.5s ease-in-out infinite alternate',
        'scanline': 'scanline 3s linear infinite',
        'matrix-effect': 'matrix-effect 25s linear infinite',
        'pulse-hack': 'pulse-hack 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'matrix-pattern': 'linear-gradient(180deg, rgba(0, 255, 0, 0.05) 0%, rgba(0, 255, 0, 0) 100%)',
      },
      keyframes: {
        'flicker': {
          '0%, 18%, 22%, 25%, 53%, 57%, 100%': { opacity: 1 },
          '20%, 24%, 55%': { opacity: 0.5 },
        },
        'pulse-hack': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
}