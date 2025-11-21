/**
 * Tailwind CSS configuration for SevenAI frontend.
 *
 * Defines custom colors used throughout the UI. The primary color
 * (dark green) is applied to headers, primary buttons and focus
 * elements. The accent color (gold) is used for secondary headings,
 * icons and plan badges. Neutral backgrounds are kept light for
 * readability.
 */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#004d40', // يستخدم الأخضر الداكن للهيدر والأزرار الأساسية وعناصر التركيز
        accent: '#b39500',  // يستخدم الذهبي للعناوين الثانوية والأيقونات وشارات الخطط
      },
    },
  },
  plugins: [],
};