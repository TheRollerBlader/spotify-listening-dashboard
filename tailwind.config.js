/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          'green-light': '#1ed760',
          'green-dark': '#169c46',
          black: '#121212',
          darker: '#0a0a0a',
          base: '#181818',
          card: '#1e1e1e',
          elevated: '#242424',
          subtext: '#b3b3b3',
          border: '#2e2e2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
