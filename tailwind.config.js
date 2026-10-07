/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EFE9E1',
        secondary: {
          DEFAULT: '#5c1a25',
          dark: '#3e1019',
          light: '#7a2535',
        },
        gold: {
          DEFAULT: '#c9a96e',
          light: '#e8d5a3',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        optima: ['"Optima Nova LT Pro"', 'Optima', 'Gill Sans', 'Calibri', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        shimmer: 'shimmer 4s linear infinite',
      },
    },
  },
  plugins: [],
};
