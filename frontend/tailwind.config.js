/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        dark: {
          950: '#09090b',
          900: '#121214',
          800: '#1a1a1e',
          700: '#2a2a30',
          600: '#3f3f46',
        },
        brand: {
          blue: '#60a5fa',
          orange: '#e05c3a',
          yellow: '#fbbf24',
          green: '#34d399',
        }
      }
    },
  },
  plugins: [],
}
