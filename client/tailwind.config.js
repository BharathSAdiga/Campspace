/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'Geist', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        folio: {
          bg: '#FAFAFA',
          muted: '#F3F4F6',
          border: '#E5E7EB',
          text: '#111827',
          subtext: '#6B7280',
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
