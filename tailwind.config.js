/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        messageAppear: 'messageAppear 0.3s ease-out',
        pulse: 'pulse 1.5s infinite',
        wave: 'wave 1s ease-in-out infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        messageAppear: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(135deg, var(--accent-color) 0%, #FF7979 100%)',
        'gradient-text': 'linear-gradient(135deg, var(--text-dark), var(--accent-color))',
        'gradient-bg': 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
      },
      colors: {
        accent: {
          DEFAULT: 'var(--accent-color)',
          hover: 'var(--accent-hover)',
        },
        text: {
          dark: 'var(--text-dark)',
          light: 'var(--text-light)',
        },
      },
      boxShadow: {
        card: 'var(--card-shadow)',
        hover: '0 8px 16px rgba(255, 71, 133, 0.2)',
        button: '0 4px 8px rgba(255, 71, 133, 0.3)',
      },
    },
  },
  plugins: [],
}