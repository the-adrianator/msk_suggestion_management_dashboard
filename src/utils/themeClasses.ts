// Returns appropriate class based on current theme
export function getThemeClasses(
  lightClass: string,
  darkClass: string,
  theme: "light" | "dark",
) {
  return theme === "dark" ? darkClass : lightClass;
}

// Returns background colour classes for the current theme
export function getThemeBgClasses(theme: "light" | "dark") {
  return getThemeClasses("bg-gray-50", "bg-gray-900", theme);
}

// Returns text colour classes for the current theme
export function getThemeTextClasses(theme: "light" | "dark") {
  return getThemeClasses("text-gray-900", "text-gray-100", theme);
}

// Returns warning title colour classes for the current theme
export function getThemeWarningTitleClasses(theme: "light" | "dark") {
  return getThemeClasses("text-red-800", "text-red-200", theme);
}

// Returns warning text colour classes for the current theme
export function getThemeWarningTextClasses(theme: "light" | "dark") {
  return getThemeClasses("text-red-700", "text-red-300", theme);
}

// Returns warning background colour classes for the current theme
export function getThemeWarningBgClasses(theme: "light" | "dark") {
  return getThemeClasses("bg-red-50", "bg-red-900/20", theme);
}

// Returns warning border colour classes for the current theme
export function getThemeWarningBorderClasses(theme: "light" | "dark") {
  return getThemeClasses("border-red-200", "border-red-800", theme);
}

// Returns card background colour classes for the current theme
export function getThemeCardClasses(theme: "light" | "dark") {
  return getThemeClasses("bg-white", "bg-gray-800", theme);
}

// Returns border colour classes for the current theme
export function getThemeBorderClasses(theme: "light" | "dark") {
  return getThemeClasses("border-gray-200", "border-gray-700", theme);
}

// Returns colour classes for employee risk level badges
export function getThemeRiskLevelClasses(
  riskLevel: "high" | "medium" | "low",
  theme: "light" | "dark",
) {
  switch (riskLevel) {
    case "high":
      return getThemeClasses("text-red-600", "text-red-400", theme);
    case "medium":
      return getThemeClasses("text-yellow-600", "text-yellow-400", theme);
    case "low":
      return getThemeClasses("text-green-600", "text-green-400", theme);
    default:
      return getThemeClasses("text-gray-600", "text-gray-400", theme);
  }
}

// Returns colour classes for suggestion type badges
export function getThemeTypeClasses(
  type: "exercise" | "equipment" | "behavioural" | "lifestyle",
  theme: "light" | "dark",
) {
  switch (type) {
    case "exercise":
      return getThemeClasses(
        "bg-green-100 text-green-800",
        "bg-green-900/20 text-green-300",
        theme,
      );
    case "equipment":
      return getThemeClasses(
        "bg-blue-100 text-blue-800",
        "bg-blue-900/20 text-blue-300",
        theme,
      );
    case "behavioural":
      return getThemeClasses(
        "bg-purple-100 text-purple-800",
        "bg-purple-900/20 text-purple-300",
        theme,
      );
    case "lifestyle":
      return getThemeClasses(
        "bg-orange-100 text-orange-800",
        "bg-orange-900/20 text-orange-300",
        theme,
      );
    default:
      return getThemeClasses(
        "bg-gray-100 text-gray-800",
        "bg-gray-900/20 text-gray-300",
        theme,
      );
  }
}

// Returns colour classes for suggestion status badges
export function getThemeStatusClasses(
  status: "pending" | "in_progress" | "completed" | "dismissed",
  theme: "light" | "dark",
) {
  switch (status) {
    case "pending":
      return getThemeClasses(
        "bg-yellow-100 text-yellow-800",
        "bg-yellow-900/20 text-yellow-300",
        theme,
      );
    case "in_progress":
      return getThemeClasses(
        "bg-blue-100 text-blue-800",
        "bg-blue-900/20 text-blue-300",
        theme,
      );
    case "completed":
      return getThemeClasses(
        "bg-green-100 text-green-800",
        "bg-green-900/20 text-green-300",
        theme,
      );
    case "dismissed":
      return getThemeClasses(
        "bg-red-100 text-red-800",
        "bg-red-900/20 text-red-300",
        theme,
      );
    default:
      return getThemeClasses(
        "bg-gray-100 text-gray-800",
        "bg-gray-900/20 text-gray-300",
        theme,
      );
  }
}
