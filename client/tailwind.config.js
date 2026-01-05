/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0f172a",    // Deep Navy
          accent: "#6366f1",  // Electric Indigo
          highlight: "#f472b6" // Soft Pink
        }
      }
    },
  },
  plugins: [],
}