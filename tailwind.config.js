/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        astronixa: {
          bg: '#02062a',
          bgDarker: '#01041c',
          card: 'rgba(3, 6, 26, 0.75)',
          sidebar: 'rgba(2, 5, 30, 0.92)',
          border: 'rgba(173, 48, 251, 0.35)',
          borderHover: 'rgba(192, 68, 255, 0.6)',
          purple: '#c044ff',
          neonPurple: '#b647ff',
          pink: '#fc3cff',
          cyan: '#2bb9f9',
          blue: '#3076fe',
          text: '#f0f1f6',
          textMuted: '#cfc2d9',
        }
      },
      backgroundImage: {
        'astronixa-gradient': 'linear-gradient(90deg, #c044ff 0%, #3076fe 100%)',
        'astronixa-title-gradient': 'linear-gradient(90deg, #2bb9f9 0%, #fc3cff 100%)',
        'astronixa-card-bg': 'linear-gradient(135deg, rgba(192, 68, 255, 0.05) 0%, rgba(48, 118, 254, 0.05) 100%)',
      },
      boxShadow: {
        'astronixa-glow': '0 0 28px 2px rgba(81, 82, 218, 0.5), inset 0 0 20px rgba(81, 82, 218, 0.35)',
        'astronixa-card': '0 0 24px rgba(81, 82, 218, 0.25), inset 0 0 18px rgba(81, 82, 218, 0.15)',
        'astronixa-card-hover': '0 0 32px rgba(147, 51, 234, 0.35), inset 0 0 20px rgba(81, 82, 218, 0.2)',
      }
    },
  },
  plugins: [],
}
