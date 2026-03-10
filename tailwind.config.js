/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: '#111110',
        gray: {
          page: '#e5e4e0',
        },
      },
    },
  },
  plugins: [],
}
