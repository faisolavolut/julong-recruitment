import type { Config } from "tailwindcss";
import flowbite from "flowbite/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#313678",
        background: "var(--background)",
        foreground: "var(--foreground)",
        second: "#C3D5FF",
        "background-default": "#F4F7FF",
        "default-stroke": "#C3D5FF",
        "default-text": "#313678",
        "active=advice": "#313678",
        "active-stroke": "#C3D5FF",
        "active-text": "#FFFFFF",
        "disabled-stroke": "#94A3B8",
        "disabled-text": "#94A3B8",
        accent: "#f4f4f5",
        layer: "#F8FAFB",
        "card-layer": "#EBF1F6",
        "card-active": "#F6FAFD",
        "sidebar-label": "#AEB4BC",
      },

      backgroundImage: {
        "linear-blue":
          "linear-gradient(90deg, rgba(195,213,255,0.6) 0%, rgba(195,213,255,0.4) 100%)",
        "linear-sidebar-active":
          "linear-gradient(90deg, rgba(62,62,97,1) 0%, rgba(46,46,72,1) 100%)",
        "linear-primary":
          "linear-gradient(90deg, rgba(62,62,97,1) 0%, rgba(46,46,72,1) 100%)",
      },
      fontFamily: {
        body: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      maxWidth: {
        "2xs": "16rem",
        "8xl": "90rem",
      },
    },
  },
  plugins: [flowbite],
} satisfies Config;
