import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: "#05070E",
          900: "#0A0E1A",
          850: "#0F1626",
          800: "#141D32",
          750: "#1A253F",
          700: "#223152",
          600: "#314570",
        },
        airbnb: {
          red: "#FF385C",
          pink: "#E00B41",
          rose: "#FF5A5F",
          darkRed: "#BD1E59",
        },
        accent: {
          cyan: "#00F2FE",
          indigo: "#6366F1",
          purple: "#A855F7",
          amber: "#F59E0B",
          emerald: "#10B981",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(255, 56, 92, 0.4)",
        "glow-cyan": "0 0 25px -5px rgba(0, 242, 254, 0.4)",
        "glow-purple": "0 0 25px -5px rgba(168, 85, 247, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "radial-highlight": "radial-gradient(circle at 50% 0%, rgba(255,56,92,0.15) 0%, transparent 70%)",
        "mesh-dark": "radial-gradient(at 0% 0%, rgba(255, 56, 92, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 242, 254, 0.06) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(168, 85, 247, 0.05) 0px, transparent 50%)",
      },
      animation: {
        "float-slow": "float 7s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "shimmer-slide": "shimmerSlide 3s linear infinite",
        "border-glow": "borderGlow 4s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmerSlide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(255, 56, 92, 0.4)" },
          "50%": { borderColor: "rgba(168, 85, 247, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
