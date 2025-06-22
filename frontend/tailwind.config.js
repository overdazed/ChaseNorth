/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // custom red color
      colors: {
        'custom-red': '#ea2e0e',
        'video-blue': '#020001',
        'nav-grey': '#bdc7df'
      },
    },
  },
  plugins: [],
}