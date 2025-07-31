/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#18191A',
        },
        text: {
          DEFAULT: '#fff',
          light: '#e5e7eb',
          muted: '#b0b3b8',
        },
        accent: {
          DEFAULT: '#FFD700', // Gold
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 