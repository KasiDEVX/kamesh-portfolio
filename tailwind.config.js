/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background-hex)",
        surface: "var(--surface-hex)",
        accent: "var(--accent-hex)",
        neutral: "var(--neutral-hex)",
        highlight: "var(--highlight-hex)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      animation: {
        "fade-rise": "fade-rise 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        "fade-rise": {
          "from": {
            opacity: "0",
            transform: "translateY(24px)",
          },
          "to": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
}
