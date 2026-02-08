/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F6F8F7',      // off-white
        brand: {
          900: '#083826',   // deep evergreen
          700: '#0F6B4E',   // primary darker
          600: '#168A69',   // <--- Added for buttons
          500: '#1FA07A',   // lively green
          300: '#6FD8B3'    // soft accent
        },
        accent: {
          900: '#7A2B1F',
          700: '#C94A33',
          600: '#E36340',   // <--- Added for buttons
          500: '#FF7A4D',   // warm coral
          300: '#FFB69A'    // sand
        },
        slate: {
          900: '#071627',
          700: '#233044'
        },
        graph: {
          present: { 0: '#0F6B4E', 1: '#1FA07A' },
          absent: { 0: '#7A2B1F', 1: '#FF7A4D' },
          combined: { 0: '#0F6B4E', 1: '#FF7A4D' }
        }
      },
      borderRadius: {
        lg: '12px',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(8, 24, 36, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Ensure we keep any other existing extensions unless we know to remove them.
      // The previous config had `primary` and `sand` which are now replaced/remapped.
    },
  },
  plugins: [],
}

