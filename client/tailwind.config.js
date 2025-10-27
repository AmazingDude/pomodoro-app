// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary-color) / <alpha-value>)",
        bg: "rgb(var(--bg-color) / <alpha-value>)",
        text: "rgb(var(--text-color) / <alpha-value>)",
        card: "rgb(var(--card-bg) / <alpha-value>)",
      },
    },
  },
}
