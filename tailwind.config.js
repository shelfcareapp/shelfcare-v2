/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}'
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
