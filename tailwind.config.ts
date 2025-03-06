import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cherry: {
          DEFAULT: "#edafb8",
          100: "#430f17",
          200: "#871f2e",
          300: "#ca2e45",
          400: "#de6d7e",
          500: "#edafb8",
          600: "#f1c0c7",
          700: "#f4d0d5",
          800: "#f8dfe3",
          900: "#fbeff1"
        },
        champagne: {
          DEFAULT: "#f7e1d7",
          100: "#4e230f",
          200: "#9b461f",
          300: "#d96f3e",
          400: "#e8a98b",
          500: "#f7e1d7",
          600: "#f9e8e0",
          700: "#faeee8",
          800: "#fcf4f0",
          900: "#fdf9f7"
        },
        timberwolf: {
          DEFAULT: "#dedbd2",
          100: "#322f25",
          200: "#645d4a",
          300: "#958b6f",
          400: "#bab4a1",
          500: "#dedbd2",
          600: "#e5e3dc",
          700: "#ebeae5",
          800: "#f2f1ed",
          900: "#f8f8f6"
        },
        ashgray: {
          DEFAULT: "#b0c4b1",
          100: "#202a21",
          200: "#405541",
          300: "#607f62",
          400: "#86a488",
          500: "#b0c4b1",
          600: "#c0d0c1",
          700: "#d0dbd0",
          800: "#e0e7e0",
          900: "#eff3ef"
        },
        outerspace: {
          DEFAULT: "#4a5759",
          100: "#0f1112",
          200: "#1e2324",
          300: "#2d3435",
          400: "#3b4647",
          500: "#4a5759",
          600: "#6a7c7f",
          700: "#8e9ea0",
          800: "#b3bec0",
          900: "#d9dfdf"
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        enter: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        slideIn: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-slow": "bounce 3s infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "enter": "enter 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
