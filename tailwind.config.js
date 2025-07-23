/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        saintCarell: ["saintCarell", "sans-serif"],
        squid: ["squid", "sans-serif"],
        fright: ["fright", "sans-serif"],
        LEMONMILK: ["LEMONMILK", "sans-serif"],
        "Refrigerator-medium": ["Refrigerator-medium", "sans-serif"],
        "Verve-regular": ["Verve-regular", "sans-serif"],
      },
      colors: {
        blue: {
          50: "#DFDFF0",
          75: "#dfdff2",
          100: "#F0F2FA",
          200: "#010101",
          300: "#4FB7DD",
        },
        yellow: {
          100: "#8e983f",
          300: "#edff66",
        },
      },
    },
  },
  plugins: [],
};
