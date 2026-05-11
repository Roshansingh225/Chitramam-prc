import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#060816",
        pitch: "#07111f",
        neonBlue: "#4be1ff",
        neonGreen: "#71ffbb",
        neonGold: "#ffd166",
        neonPink: "#ff4fd8"
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"],
        accent: ["Rajdhani", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 0 30px rgba(75, 225, 255, 0.16)",
        stadium: "0 40px 120px rgba(6, 8, 22, 0.7)"
      },
      backgroundImage: {
        "grid-radial":
          "radial-gradient(circle at top, rgba(75,225,255,0.18), transparent 35%), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseRing: {
          "0%": { transform: "scale(0.96)", opacity: "0.35" },
          "100%": { transform: "scale(1.06)", opacity: "0.9" }
        },
        beam: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.8" }
        }
      },
      animation: {
        floaty: "floaty 5s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.8s ease-in-out infinite alternate",
        beam: "beam 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
