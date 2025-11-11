import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#033ba3',
        'light-cream': '#fcfcd4',
        'dark-brown': '#371802',
        'charcoal': '#2e2e2e',
        'orange-red': '#bc4500',
        'muted-olive': '#d9d7b3',
        'warm-beige': '#f9e5c1',
        // Yin Yang Logo Colors
        'yin-yang-light': '#639df0',      // Medium-light blue (upper-left)
        'yin-yang-dark': '#5371ac',        // Darker medium blue (lower-right)
        'yin-yang-sky': '#c3dbfc',         // Pale sky blue (lightest arrow)
        'yin-yang-medium': '#6d89d4',      // Medium blue (top-right arrow)
        'yin-yang-periwinkle': '#8ba3e0',  // Light purple-blue/periwinkle (estimated)
        'yin-yang-muted': '#5270ab',       // Darker muted blue (bottom-left arrow)
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
        handwritten: ['Kalam', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;

