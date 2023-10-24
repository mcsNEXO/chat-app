/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "app-height": "var(--app-height)",
      },
      backgroundColor: {
        "dark-gray": "var(--bg-dark-gray)",
        "active-gray": "var(--bg-active-gray)",
        primary: "var(--bg-primary)",
      },
    },
  },
  plugins: [],
};
