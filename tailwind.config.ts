import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        gilroy: ["var(--font-gilroy)"],
        PoppinsFont: ["var(--font-poppins)"],
      },
      screens: {
        small: "425px",
      },
      colors: {
        bodybackground: "var(--body-background)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shine: "shine 8s ease-in-out infinite",
        shineButton: "shineButton 3s ease-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        scan: "scan 2s ease-in-out infinite",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "to-and-fro": "to-and-fro 0.6s   infinite",
        backcolor: "backcolor 0.6s  infinite",
        linecolor: "linecolor 0.6s  infinite",
        textcolor: "textcolor 0.6s   infinite",
        buttonanim: "buttonanim 0.6s   infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-toast-in": "slide-toast-in 0.3s ease-out forwards",
        "slide-toast-out": "slide-toast-out 0.3s ease-in forwards",
        "fade-toast-in": "fade-toast-in 0.2s ease-out forwards",
        "fade-toast-out": "fade-toast-out 0.2s ease-in forwards",
        "bounce-toast-in": "bounce-toast-in 0.5s ease-out forwards",
        "bounce-toast-out": "bounce-toast-out 0.5s ease-in forwards",
        "rotate-toast-in": "rotate-toast-in 0.4s ease-out forwards",
        "rotate-toast-out": "rotate-toast-out 0.4s ease-in forwards",
        "flip-toast-in": "flip-toast-in 0.5s ease-out forwards",
        "flip-toast-out": "flip-toast-out 0.5s ease-in forwards",
      },
      keyframes: {
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        "slide-toast-in": {
          from: {
            transform: "translateX(100%)",
            opacity: "0",
          },
          to: {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        "slide-toast-out": {
          from: {
            transform: "translateX(0)",
            opacity: "1",
          },
          to: {
            transform: "translateX(100%)",
            opacity: "0",
          },
        },
        "fade-toast-in": {
          from: {
            opacity: "0",
            transform: "scale(0.95)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "fade-toast-out": {
          from: {
            opacity: "1",
            transform: "scale(1)",
          },
          to: {
            opacity: "0",
            transform: "scale(0.95)",
          },
        },
        "bounce-toast-in": {
          "0%": {
            transform: "scale(0.5)",
            opacity: "0",
          },
          "70%": {
            transform: "scale(1.1)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "bounce-toast-out": {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "30%": {
            transform: "scale(1.1)",
          },
          "100%": {
            transform: "scale(0.5)",
            opacity: "0",
          },
        },
        "rotate-toast-in": {
          from: {
            transform: "rotate(-90deg)",
            opacity: "0",
          },
          to: {
            transform: "rotate(0)",
            opacity: "1",
          },
        },
        "rotate-toast-out": {
          from: {
            transform: "rotate(0)",
            opacity: "1",
          },
          to: {
            transform: "rotate(90deg)",
            opacity: "0",
          },
        },
        "flip-toast-in": {
          from: {
            transform: "perspective(400px) rotateY(90deg)",
            opacity: "0",
          },
          to: {
            transform: "perspective(400px) rotateY(0)",
            opacity: "1",
          },
        },
        "flip-toast-out": {
          from: {
            transform: "perspective(400px) rotateY(0)",
            opacity: "1",
          },
          to: {
            transform: "perspective(400px) rotateY(-90deg)",
            opacity: "0",
          },
        },
        shine: {
          from: {
            backgroundPosition: "200% 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        shineButton: {
          "0%": {
            backgroundPosition: "200% 0",
          },
          "25%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "-200% 0",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        scan: {
          "0%": {
            transform: "translateY(-20%)",
          },
          "100%": {
            transform: "translateY(400px)",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "to-and-fro": {
          "0%, 100%": {
            transform: "translateX(-15px)",
          },
          "50%": {
            transform: "translateX(15px)",
          },
        },
        backcolor: {
          "0%, 100%": {
            backgroundColor: "#4AF35E",
          },
          "50%": {
            backgroundColor: "#050923",
          },
        },
        linecolor: {
          "0%, 100%": {
            backgroundColor: "#ffffff",
          },
          "50%": {
            backgroundColor: "#000000",
          },
        },
        textcolor: {
          "0%, 100%": {
            color: "#ffffff",
          },
          "50%": {
            color: "#000000",
          },
        },
        buttonanim: {
          "0%, 100%": {
            color: "#ffffff",
            borderColor: " #ffffff",
          },
          "50%": {
            color: "#000000",
            borderColor: " #000000",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    function ({
      addVariant,
    }: {
      addVariant: (name: string, rule: string) => void;
    }) {
      addVariant("light", "&.light *");
    },
  ],
};
export default config;
