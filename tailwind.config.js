/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#04040c',
        night: '#07071a',
        deep: '#0b0b24',
        slate1: '#12122e',
        line: 'rgba(160,150,255,0.14)',
        violet: {
          50: '#f3f0ff',
          200: '#d6cbff',
          300: '#b9a5ff',
          400: '#9c7dff',
          500: '#7d55ff',
          600: '#6a35f5',
          700: '#5320cc',
          900: '#2b0d78',
        },
        gold: {
          200: '#ffe6ad',
          300: '#ffd98a',
          400: '#f5c451',
          500: '#e0a83c',
          600: '#b9822a',
        },
        chalk: '#eceaf7',
        muted: '#9b96bd',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        ultra: '0.35em',
        wide2: '0.2em',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, transparent, #04040c), radial-gradient(circle at 50% 0%, rgba(125,85,255,0.18), transparent 60%)',
        'gold-violet': 'linear-gradient(120deg,#ffd98a 0%,#f5c451 22%,#b9a5ff 55%,#7d55ff 100%)',
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 3.5s linear infinite',
        marquee: 'marquee 32s linear infinite',
        'pulse-ring': 'pulseRing 3.2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.92)', opacity: '0.7' },
          '70%': { transform: 'scale(1.25)', opacity: '0' },
          '100%': { transform: 'scale(1.25)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
