/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tezos: {
          blue:    '#2C7DF7',
          cyan:    '#00C2FF',
          dark:    '#060D1F',
          card:    '#0C1528',
          border:  '#1A2E52',
          muted:   '#7A9CC4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
