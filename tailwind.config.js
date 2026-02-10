/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        sidebar: 'var(--sidebar)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        text: 'var(--text)',
        'text-light': 'var(--text-light)',
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      }
    }
  },
  plugins: [],
}
