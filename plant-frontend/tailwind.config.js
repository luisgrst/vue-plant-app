/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // from darkest to lightest
        'green-deep':  '#344E41',  // very dark
        'green-dark':  '#3A5A40',
        'green-mid':   '#588157',
        'green-light': '#A3B18A',
        'green-pale':  '#DAD7CD',  // very light

        // semantic aliases
        background:    '#DAD7CD',  // lightest
        surface:       '#FFFFFF',  // white cards
        border:        '#A3B18A',  // light border
        primary:       '#588157',  // mid-green
        primaryHover:  '#3A5A40',  // darker hover
        accent:        '#A3B18A',  // light-green pop
        hover:         '#DAD7CD',  // super pale

        text: {
          DEFAULT:  '#344E41',     // deep green
          muted:    '#588157',     // mid-green
        },
        tooltip: {
          bg:   '#344E41',
          text: '#DAD7CD',
        },
      },
      borderRadius: {
        full:  '9999px',
        xl:    '0.8rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
