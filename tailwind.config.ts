import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "hsl(220 25% 6%)",
          subtle: "hsl(220 25% 8%)"
        },
        card: {
          DEFAULT: "hsl(220 22% 10%)",
          border: "hsl(220 18% 18%)"
        },
        text: {
          DEFAULT: "hsl(0 0% 98%)",
          muted: "hsl(220 10% 70%)"
        },
        accent: {
          DEFAULT: "hsl(212 100% 62%)",
          soft: "hsl(212 100% 62% / 0.14)"
        },
        good: "hsl(156 70% 45%)",
        warn: "hsl(44 100% 60%)",
        bad: "hsl(0 84% 60%)"
      },
      boxShadow: {
        glass:
          "0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)"
      },
      backdropBlur: {
        glass: "18px"
      },
      borderRadius: {
        xl: "1rem"
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;

