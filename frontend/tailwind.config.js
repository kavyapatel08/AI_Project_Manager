export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#12142B",
        surface: "#1C1F3D",
        surfaceLight: "#252A4A",
        ink: "#EEEFFB",
        muted: "#9295B8",
        accent: "#6C5CE7",
        high: "#FF6B6B",
        medium: "#FFD166",
        low: "#06D6A0",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}