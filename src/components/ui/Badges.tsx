import { Suggestion } from "@/types";
import { isOverdue } from "@/utils/dates";
import {
  getThemeClasses,
  getThemeRiskLevelClasses,
  getThemeTypeClasses,
  getThemeStatusClasses,
} from "@/utils/themeClasses";

// Returns JSX for status badge with overdue indicator if applicable
export const getStatusBadge = (
  suggestion: Suggestion,
  theme: "light" | "dark",
) => {
  const isOverdueSuggestion = isOverdue(
    suggestion.dateCreated,
    suggestion.status,
  );
  const overdueThemeClass = getThemeClasses(
    "bg-red-100 text-red-800",
    "bg-red-900/20 text-red-300",
    theme,
  );

  return (
    <div className="flex items-center space-x-2">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThemeStatusClasses(suggestion.status, theme)}`}
      >
        {suggestion.status.replace("_", " ")}
      </span>
      {isOverdueSuggestion && suggestion.status !== "completed" && (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${overdueThemeClass}`}
        >
          Overdue
        </span>
      )}
    </div>
  );
};

// Returns JSX for priority badge with colour-coded styling
export const getPriorityBadge = (
  priority: "high" | "medium" | "low",
  theme: "light" | "dark",
) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThemeRiskLevelClasses(priority, theme)}`}
    >
      {priority}
    </span>
  );
};

// Returns JSX for suggestion type badge with category-specific colours
export const getTypeBadge = (
  type: "exercise" | "equipment" | "behavioural" | "lifestyle",
  theme: "light" | "dark",
) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThemeTypeClasses(type, theme)}`}
    >
      {type}
    </span>
  );
};
