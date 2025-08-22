/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
  extend: {
    backdropBlur: {
      'lg': '20px',
    },
    colors: {
      keyline: '#E2C33D',
      surface: '#F5F7FA',
    },
  },
},
  plugins: [],
}

