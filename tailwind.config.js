/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark luxury UI palette
        obsidian: '#0F0D0B',
        charcoal: '#171411',
        panel: '#1E1B18',
        surface: '#252119',
        rim: '#2E2A25',
        gold: '#C8A96E',
        champagne: '#E2CFA0',
        cream: '#F5EDD9',
        parchment: '#EDE0C4',
        // Text hierarchy
        luminary: '#EDE4D4',
        muted: '#7A6E62',
        whisper: '#3D3730',
        // Keep for postcard internals
        ink: '#2C2A29',
        pastel: {
          pink: '#FBE4E4',
          blue: '#E0EAFC',
          yellow: '#FEF3D5',
          green: '#E4F1E5',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        serif: ['"Playfair Display"', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 40px -8px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        'envelope': '0 20px 60px -10px rgba(0,0,0,0.7)',
        'gold': '0 0 30px rgba(200,169,110,0.15)',
        'glow': '0 0 60px rgba(200,169,110,0.08)',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
