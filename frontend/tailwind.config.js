/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f9fafb",
        surface: "#ffffff",
        shade: "#e5e7eb",
        primary: {
          DEFAULT: "#0f172a",
          soft: "#1f2937",
        },
        accent: {
          DEFAULT: "#6366f1",
          muted: "#c7d2fe",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 10px 25px rgba(15,23,42,.08)",
      },
    },
  },
  plugins: [],
};
