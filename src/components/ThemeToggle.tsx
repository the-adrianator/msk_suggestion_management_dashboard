"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { animationClasses } from "@/utils/animations";
import { getThemeClasses } from "@/utils/themeClasses";
import { Circle, Moon, Sun } from "@/components/ui/SvgIcons";

// Button component for toggling between light and dark themes with sun/moon icon
export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 cursor-pointer">
        <Circle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md ${getThemeClasses("text-gray-500 hover:text-gray-700", "text-gray-400 hover:text-gray-300", theme)} ${animationClasses.focusRing} ${animationClasses.hoverScale} transition-colors duration-200 cursor-pointer`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 transition-transform duration-200" />
      ) : (
        <Sun className="w-5 h-5 transition-transform duration-200" />
      )}
    </button>
  );
}
