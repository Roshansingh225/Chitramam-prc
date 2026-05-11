import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"]
      },
      colors: {
        sail: {
          ink: "#061a33",
          navy: "#0b2f57",
          blue: "#145da0",
          steel: "#526170",
          mist: "#eef3f7",
          line: "#d5dde6",
          copper: "#b7791f"
        }
      },
      boxShadow: {
        panel: "0 18px 55px rgba(6, 26, 51, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
