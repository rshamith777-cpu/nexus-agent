/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'nexus-primary': '#2563EB',
        'nexus-deep': '#0B1F4D',
        'nexus-navy': '#06142F',
        'nexus-electric': '#3B82F6',
        'nexus-cyan': '#38BDF8',
        'nexus-soft': '#93C5FD',
        'nexus-bluewhite': '#EAF2FF',
        'nexus-dark': '#071225',
        nexus: {
          950: '#040d1f',
          900: '#06142F',
          850: '#071225',
          800: '#0B1F4D',
          700: '#14315E',
          600: '#1E40AF',
          500: '#2563EB',
          400: '#3B82F6',
          300: '#60A5FA',
          200: '#93C5FD',
          100: '#EAF2FF',
          accent: '#38BDF8',
          cyan: '#38BDF8',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E'
        }
      },
      fontFamily: {
        glitch: ['"Glitch Goblin"', 'monospace'],
        mono: ['"Glitch Goblin"', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['"Glitch Goblin"', 'Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-up': 'revealUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
