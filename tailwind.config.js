/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        iparkOrange800: '#FF6D00',
        iparkOrange600: '#FF9201',
        iparkOrange400: '#FFAB40',
        iparkOrange200: '#FFD180',
      },
    },
  },
  plugins: [],
};
