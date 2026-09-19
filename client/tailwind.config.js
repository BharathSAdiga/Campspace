/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      colors: {
        campspace: {
          50: '#f7f7f7',
          100: '#eeeeee',
          200: '#dedede',
          300: '#bdbdbd',
          400: '#999999',
          500: '#666666',
          600: '#444444',
          700: '#2a2a2a',
          800: '#1a1a1a',
          900: '#111111',
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
