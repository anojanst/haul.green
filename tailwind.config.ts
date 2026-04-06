import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          950: '#0a1a0f',
          900: '#0f2918',
          800: '#1a3d24',
          700: '#1f4d2b',
          600: '#2d6a3f',
          500: '#3a8a52',
          400: '#5aab70',
          300: '#8fcca0',
          200: '#c2e8cc',
          100: '#e8f5ec',
          50:  '#f4faf6',
        },
        cream: '#faf8f4',
        'warm-white': '#f7f5f0',
        ink: {
          DEFAULT: '#1a1a18',
          muted: '#4a4a46',
          faint: '#9a9a94',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      animation: {
        'spin-slow': 'spinSlow 20s linear infinite',
      },
      keyframes: {
        spinSlow: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
