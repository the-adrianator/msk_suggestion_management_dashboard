import { AdminUser, Employee, Suggestion, Theme } from "@/types";
import { getThemeClasses, getThemeTextClasses } from "@/utils/themeClasses";
import SuggestionCard from "@/components/SuggestionCard";

interface RecentSuggestionsProps {
  recentSuggestions: Suggestion[];
  showAllRecent: boolean;
  setShowAllRecent: (showAllRecent: boolean) => void;
  theme: Theme;
  employees: Employee[];
  admin: AdminUser;
  handleOpenStatusModal: (suggestion: Suggestion) => void;
}

const RecentSuggestions = ({
  recentSuggestions,
  showAllRecent,
  setShowAllRecent,
  theme,
  employees,
  admin,
  handleOpenStatusModal,
}: RecentSuggestionsProps) => {
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || "Unknown Employee";
  };
  return (
    <section className="mt-8 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${getThemeTextClasses(theme)}`}>
          Recent Suggestions
        </h2>
        {recentSuggestions.length > 3 && (
          <button
            onClick={() => setShowAllRecent(!showAllRecent)}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium mr-1 ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md cursor-pointer`}
          >
            {showAllRecent ? (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                Show Less
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Show All ({recentSuggestions.length})
              </>
            )}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {recentSuggestions
          .slice(0, showAllRecent ? recentSuggestions.length : 3)
          .map(suggestion => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              employeeName={getEmployeeName(suggestion.employeeId)}
              admin={admin}
              onUpdate={handleOpenStatusModal}
              isExpanded={false} // All cards start collapsed
              showExpandButton={true} // Enable individual card expand/collapse
            />
          ))}
        {recentSuggestions.length === 0 && (
          <div className="lg:col-span-3">
            <p
              className={`text-center ${getThemeClasses("text-gray-400", "text-gray-500", theme)}`}
            >
              No recent suggestions found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentSuggestions;
