/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "kaduna-green": "#1A5D1A",
        "kaduna-green-dark": "#134413",
        "kaduna-white": "#FFFFFF",
        "kaduna-gray": "#4B5563",
      },
    },
  },
  plugins: [],
};
