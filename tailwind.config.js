/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FDFBF7',
        pastel: {
          pink: '#FBE4E4',
          blue: '#E0EAFC',
          yellow: '#FEF3D5',
          green: '#E4F1E5',
        },
        ink: '#2C2A29',
      },
      fontFamily: {
        // Serif for labels like "To" / "From"
        serif: ['"Playfair Display"', 'serif'],
        // Handwritten font for the core message
        script: ['"Dancing Script"', 'cursive'],
        // Clean secondary font for UI elements
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
        'envelope': '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        // Subtle noise texture to make it feel like real paper
        'paper-texture': "url('/textures/noise.png')",
      }
    },
  },
  plugins: [],
}
