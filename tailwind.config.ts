import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        green: {
          DEFAULT: "#22c55e",
          dark: "#16a34a",
        }
      },
      animation: {
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
