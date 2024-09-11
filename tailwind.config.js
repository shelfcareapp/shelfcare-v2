/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#490A03',
        primaryDark: '#270501',
        secondary: '#FFF1D6'
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        baskerville: ['Baskerville', 'serif']
      }
    }
  },
  plugins: []
};
