import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './sanity/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        white: '#FDFDFB',
        navy: {
          DEFAULT: '#0E2A47',
          soft: '#1B3A5C',
        },
        gold: '#C9A96A',
        stone: '#EAE6DF',
        muted: '#5C6B7A',
      },
      fontFamily: {
        // Archivo — sturdy grotesque, monumental in caps. Headlines, prices, numbers.
        display: ['var(--font-display)', 'Archivo', 'Helvetica Neue', 'sans-serif'],
        // Inter — neutral, high-legibility text face. Everything else.
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.15em',
      },
      maxWidth: {
        content: '80rem',
      },
      transitionTimingFunction: {
        yacht: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
