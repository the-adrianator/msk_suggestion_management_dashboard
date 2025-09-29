export function getThemeClasses(
  lightClass: string,
  darkClass: string,
  theme: "light" | "dark",
) {
  return theme === "dark" ? darkClass : lightClass;
}

export function getThemeBgClasses(theme: "light" | "dark") {
  return getThemeClasses("bg-gray-50", "bg-gray-900", theme);
}

export function getThemeTextClasses(theme: "light" | "dark") {
  return getThemeClasses("text-gray-900", "text-gray-100", theme);
}

export function getThemeCardClasses(theme: "light" | "dark") {
  return getThemeClasses("bg-white", "bg-gray-800", theme);
}

export function getThemeBorderClasses(theme: "light" | "dark") {
  return getThemeClasses("border-gray-200", "border-gray-700", theme);
}
