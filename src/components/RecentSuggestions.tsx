import { AdminUser, Employee, Suggestion, Theme } from "@/types";
import { getThemeClasses, getThemeTextClasses } from "@/utils/themeClasses";
import SuggestionCard from "@/components/SuggestionCard";
import { type Dispatch, type SetStateAction, useState } from "react";
import StatusUpdateModal from "@/components/StatusUpdateModal";

interface RecentSuggestionsProps {
  recentSuggestions: Suggestion[];
  setRecentSuggestions: Dispatch<SetStateAction<Suggestion[]>>;
  showAllRecent: boolean;
  setShowAllRecent: (showAllRecent: boolean) => void;
  theme: Theme;
  employees: Employee[];
  admin: AdminUser;
  suggestions: Suggestion[];
  setToast: Dispatch<
    SetStateAction<{
      message: string;
      type: "success" | "error" | "info";
      isVisible: boolean;
    }>
  >;
  onSuggestionUpdate: () => void;
}

const RecentSuggestions = ({
  recentSuggestions,
  setRecentSuggestions,
  showAllRecent,
  setShowAllRecent,
  theme,
  employees,
  admin,
  setToast,
  onSuggestionUpdate,
}: RecentSuggestionsProps) => {
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || "Unknown Employee";
  };

  const getEmployeeDepartment = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.department || "Unknown Department";
  };

  const handleOpenStatusModal = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleUpdateSuggestion = (updatedSuggestion: Suggestion) => {
    setRecentSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === updatedSuggestion.id ? updatedSuggestion : suggestion,
      ),
    );
    // Trigger refresh of main suggestions data to update stat cards
    onSuggestionUpdate();
    setToast({
      message: "Suggestion updated successfully!",
      type: "success",
      isVisible: true,
    });
    handleCloseStatusModal();
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
          .map(suggestion => {
            console.log("suggestion", suggestion);
            return (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                employeeName={getEmployeeName(suggestion.employeeId)}
                employeeDepartment={getEmployeeDepartment(
                  suggestion.employeeId,
                )}
                onUpdate={handleOpenStatusModal}
                isExpanded={false} // All cards start collapsed
                showExpandButton={true} // Enable individual card expand/collapse
              />
            );
          })}
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

      {selectedSuggestion && (
        <StatusUpdateModal
          suggestion={selectedSuggestion}
          isOpen={isStatusModalOpen}
          onClose={handleCloseStatusModal}
          onUpdate={handleUpdateSuggestion}
        />
      )}
    </section>
  );
};

export default RecentSuggestions;
