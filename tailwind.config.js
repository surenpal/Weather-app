/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
      },
      colors: {
        glass: "rgba(255, 255, 255, 0.2)",
        glassDark: "rgba(0, 0, 0, 0.3)",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};