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

export function getThemeWarningTitleClasses(theme: "light" | "dark") {
  return getThemeClasses("text-red-800", "text-red-200", theme);
}

export function getThemeWarningTextClasses(theme: "light" | "dark") {
  return getThemeClasses("text-red-700", "text-red-300", theme);
}

export function getThemeWarningBgClasses(theme: "light" | "dark") {
  return getThemeClasses("bg-red-50", "bg-red-900/20", theme);
}

export function getThemeWarningBorderClasses(theme: "light" | "dark") {
  return getThemeClasses("border-red-200", "border-red-800", theme);
}


export function getThemeCardClasses(theme: "light" | "dark") {
  return getThemeClasses("bg-white", "bg-gray-800", theme);
}

export function getThemeBorderClasses(theme: "light" | "dark") {
  return getThemeClasses("border-gray-200", "border-gray-700", theme);
}
