/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        garnet: "#881124",
        "dark-gray": "#707170",
        "light-gray": "#B2B3B2",
        "coral-red": "#F05A5D",
        "mint-blue-tint": "#D4EDE9",
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        sans: ["Open Sans", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
