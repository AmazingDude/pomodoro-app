/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "2200px",
      },
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          text: "var(--color-primary-text)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          text: "var(--color-secondary-text)",
        },
        border: "var(--color-border)",
        card: "var(--color-card)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
