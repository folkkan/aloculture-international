import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Botanical specimen palette — variegated Alocasia
        canvas: "#FAFAF7", // gallery white (light bg)
        ink: "#15211B", // near-black forest (light text)
        forest: "#1F3B2C", // deep botanical green (accent)
        moss: "#5A7361", // muted sage (secondary text)
        cream: "#E9E4D6", // the variegation
        // dark mode
        "canvas-dark": "#0C0F0D", // deep forest near-black
        "surface-dark": "#141A16",
        "ink-dark": "#EDEAE0", // warm ivory text
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      maxWidth: {
        shell: "1320px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
