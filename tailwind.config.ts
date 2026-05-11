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
        midnight: "#06140c",
        pitch: "#b78b56",
        outfield: "#0f2d1b",
        pavilion: "#173723",
        crease: "#f4ebd0",
        leather: "#8b3b26",
        sun: "#d7ad57",
        skyDay: "#9dcae6"
      },
      fontFamily: {
        display: ["Rajdhani", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"],
        accent: ["Rajdhani", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(244,235,208,0.1), 0 18px 50px rgba(8, 32, 18, 0.45)",
        stadium: "0 40px 120px rgba(3, 18, 8, 0.65)"
      },
      backgroundImage: {
        "grass-stripes":
          "repeating-linear-gradient(90deg, rgba(31,87,51,0.32) 0px, rgba(31,87,51,0.32) 72px, rgba(18,60,35,0.44) 72px, rgba(18,60,35,0.44) 144px)"
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
        },
        crowdPulse: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.82" }
        }
      },
      animation: {
        floaty: "floaty 5s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.8s ease-in-out infinite alternate",
        beam: "beam 4s ease-in-out infinite",
        crowd: "crowdPulse 5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
