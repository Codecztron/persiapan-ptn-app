/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Jika Anda menggunakan HTML di luar src
    "./src/**/*.{js,ts,jsx,tsx}", // Perhatikan pola path ini
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
