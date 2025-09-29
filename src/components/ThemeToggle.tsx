'use client';

import { useTheme } from '@/contexts/ThemeContext';

// Button to toggle between light and dark themes
export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  if (!mounted) return null;
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </button>
  );
}
