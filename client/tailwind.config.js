/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F7F3',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1B2430',
          light: '#4A5568',
        },
        signal: {
          DEFAULT: '#2D6A4F', // strong match / verified
          light: '#DCEEE4',
        },
        clay: {
          DEFAULT: '#B08968', // secondary accent
          light: '#F0E6DB',
        },
        flag: {
          DEFAULT: '#B3454B', // missing keyword / low match
          light: '#F6DEDF',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
