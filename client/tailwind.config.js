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
        accent: {
          orange: '#ff8a3d',
          'orange-light': '#ffa559',
          'orange-subtle': 'rgba(255, 138, 61, 0.12)',
          'orange-glow': 'rgba(255, 138, 61, 0.25)',
        },
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        'liquid-glass': '24px',
      },
      boxShadow: {
        'liquid-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'liquid-glass-hover': '0 14px 44px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 0 0 20px rgba(255, 138, 61, 0.18)',
        'orange-glow': '0 0 24px rgba(255, 138, 61, 0.3)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'shimmer-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        shimmer: 'shimmer-slide 2.5s infinite',
      },
    },
  },
  plugins: [],
};
