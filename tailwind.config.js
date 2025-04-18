/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1D3D6F", // Dark Blue
        secondary: "#2C4F85", // Steel Blue
        accent: "#F7B500", // Yellow/Orange
        light: "#E8ECEF", // Light Gray
        dark: "#000000", // Black
        white: "#FFFFFF", // White
      },
    },
  },
  plugins: [],
};
