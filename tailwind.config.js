/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "color-background": "var(--color-background, #f7f7f7)",
        "color-primary-main": "var(--color-primary-main, #0a66c2)",
        "color-primary-light": "var(--color-primary-light, #b6dbfb)",
        "color-primary-accent": "var(--color-primary-accent, #e67600)",
        blue: {
          100: "#e6f0ff",
          200: "#cce1ff",
          300: "#99c2ff",
          400: "#6699ff",
          500: "#4880FF",
          600: "#3366cc",
          700: "#1f4099",
          800: "#0a2d66",
        },
        white: {
          100: "#ffffff",
        },
        gray: {
          100: "#f9f9f9",
          200: "#f0f0f0",
          300: "#e0e0e0",
          400: "#d0d0d0",
          500: "#b0b0b0",
        },
      },
    },
    screens: {
      xs: "480px", // New breakpoint for small screens
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
