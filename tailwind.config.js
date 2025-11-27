/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}", "./pricing.html"],
  theme: {
    extend: {
      // 1. SOTD "Paper & Teal" Palette
      colors: {
        paper: {
          base: '#FDFBF7',      // Fresh Press
          aged: '#F2EFE5',      // Aged Manuscript
          card: '#E6E2D6',      // Raw Cardstock
          
          // COMPATIBILITY: Maps old paper classes to new SOTD colors
          light: '#FDFBF7',     // Maps bg-paper-light -> paper-base
          DEFAULT: '#FDFBF7',   // Maps bg-paper -> paper-base
        },
        ink: {
          primary: '#0F4C4C',   // Deep Teal
          dark: '#052222',      // Midnight Green
          washed: '#4A7A7A',    // Washed Teal
          vermilion: '#EA580C', // Rich Orange (Brand Aligned)
        },
        
        // 2. COMPATIBILITY BRIDGE (Final Robust Version)
        text: {
          dark: '#052222',      // ink-dark
          light: '#FDFBF7',     // paper-base
          muted: '#4A7A7A',     // ink-washed
          secondary: '#4A7A7A', // ink-washed
          primary: '#0F4C4C',   // ink-primary
          DEFAULT: '#0F4C4C',   // ink-primary
        },
        teal: {
          dark: '#0F4C4C',      // ink-primary
          light: '#4A7A7A',     // ink-washed
          medium: '#2D5D5D',    // Mid-tone fallback
        },
        accent: {
          DEFAULT: '#EA580C',   // Rich Orange (Brand Aligned)
          dark: '#C2410C',      // Darker Orange (Hover State)
          light: '#F2EFE5',     // paper-aged
        },
      },

      // 3. Typography
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'], 
        body: ['Inter', 'sans-serif'],            
        mono: ['"JetBrains Mono"', 'monospace'],  
      },

      // 4. Tactile Physics
      boxShadow: {
        'lift-sm': '0 2px 8px -1px rgba(15, 76, 76, 0.08)',
        'lift-md': '0 10px 30px -5px rgba(15, 76, 76, 0.15)',
        'deboss': 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.9)',
        'glow': '0 0 20px rgba(15, 76, 76, 0.2)',
      },
    },
  },
  plugins: [],
};