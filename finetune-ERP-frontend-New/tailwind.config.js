/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        lg: "20px",
      },
      colors: {
        primary: "#000000",
        secondary: "#E2C33D",
        surface: "#F5F7FA",
        keyline: "#E2C33D",
        success: "#16A34A",
        error: "#DC2626",
      },
      fontSize: {
        "display-xl": ["3.75rem", { lineHeight: "1" }],
        "display-lg": ["3rem", { lineHeight: "1" }],
        "display-md": ["2.25rem", { lineHeight: "2.5rem" }],
        "heading-xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "heading-lg": ["1.5rem", { lineHeight: "2rem" }],
        "heading-md": ["1.25rem", { lineHeight: "1.75rem" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "body-md": ["1rem", { lineHeight: "1.5rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        caption: ["0.75rem", { lineHeight: "1rem" }],
      },
    },
  },
  plugins: [],
};

