/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC', // Altrubiz Blue
        // Accessibility fix: the original brand cyan (#00AEEF) measured only
        // ~2.4-2.5:1 contrast as small/bold text on white and as white text
        // on its own background (axe-core color-contrast, serious,
        // widespread across homepage/knowledge/hub templates) -- well under
        // the WCAG 2.0/2.1 AA 4.5:1 threshold required by Israeli Standard
        // 5568 Part 1. Deepened to the same hue (~196deg) at a darker
        // lightness so every `text-secondary` / `bg-secondary` usage now
        // clears 4.5:1 in both directions, while remaining clearly the same
        // cyan-blue brand color.
        secondary: '#0078A3', // Altrubiz Cyan (AA-contrast adjusted)
        accent: '#F5A623', // Altrubiz Yellow
        dark: '#0A2E4D', // Altrubiz Dark Navy
        light: '#E6EBF1', // Light Gray Background
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
