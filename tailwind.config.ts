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

