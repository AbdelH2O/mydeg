/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        JetBrainsMono: ["JetBrains Mono", "monospace"],
        Poppins: ["Poppins", "sans-serif"],
        Raleway: ["Raleway", "sans-serif"],
        Roboto: ["Roboto", "sans-serif"],
      },
      transitionProperty: {
        
      }
    },
  },
  plugins: [],
}
