/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./auth/**/*.{js,ts,jsx,tsx}",
    "./patient/**/*.{js,ts,jsx,tsx}",
    "./doctor/**/*.{js,ts,jsx,tsx}",
    "./pharmacy/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        smoothgreen:"#E9F7E0",
        lightgreen:"#7CBC27",
        deepgreen:"#0D7135",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
};
