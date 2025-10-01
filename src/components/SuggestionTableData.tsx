import React, { useState } from "react";
import { Suggestion, Employee, SortField } from "@/types";
import PermissionGuard from "@/components/PermissionGuard";
import {
  getStatusBadge,
  getPriorityBadge,
  getTypeBadge,
} from "@/components/ui/Badges";
import SuggestionDetailModal from "@/components/SuggestionDetailModal";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getThemeClasses,
  getThemeTextClasses,
  getThemeBorderClasses,
} from "@/utils/themeClasses";

interface SuggestionTableDataProps {
  filteredSuggestions: Suggestion[];
  employees: Employee[];
  sortField: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: SortField) => void;
  handleOpenEmployeeDrawer: (employee: Employee) => void;
  handleOpenModal: (suggestion: Suggestion) => void;
  formatDate: (date: string) => string;
  getRelativeTime: (date: string) => string;
  getEmployeeName: (employeeId: string) => string;
}

// Table data component rendering suggestions in desktop table layout with sortable columns
const SuggestionTableData = ({
  filteredSuggestions,
  employees,
  sortField,
  sortDirection,
  handleSort,
  handleOpenEmployeeDrawer,
  handleOpenModal,
  formatDate,
  getRelativeTime,
  getEmployeeName,
}: SuggestionTableDataProps) => {
  const { theme } = useTheme();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

  // Opens detail modal to view full suggestion information
  const handleOpenDetailModal = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsDetailModalOpen(true);
  };

  // Closes detail modal and clears selection
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSuggestion(null);
  };

  // Triggers status update modal from within detail modal
  const handleUpdateFromDetail = (suggestion: Suggestion) => {
    handleOpenModal(suggestion);
  };

  return (
    <div className="hidden md:block w-full">
      <div
        className={`w-full border ${getThemeBorderClasses(theme)} rounded-lg overflow-hidden`}
      >
        <div className="w-full overflow-x-auto" style={{ maxHeight: "600px" }}>
          <table
            className={`w-full min-w-full divide-y ${getThemeBorderClasses(theme)}`}
            style={{ minWidth: "1200px" }}
          >
            <thead
              className={`${getThemeClasses("bg-gray-50", "bg-gray-800", theme)} sticky top-0 z-30`}
            >
              <tr>
                {/* First column - Last Updated */}
                <th
                  className={`pl-4 pr-[41px] py-3 text-left text-xs font-medium ${getThemeClasses("text-gray-500 bg-gray-50 hover:bg-gray-100", "text-gray-400 bg-gray-800 hover:bg-gray-700", theme)} uppercase tracking-wider cursor-pointer w-64`}
                  onClick={() => handleSort("dateUpdated")}
                  style={{ position: "sticky", left: "0px", zIndex: 20 }}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Updated</span>
                    {sortField === "dateUpdated" && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>

                {/* Second column - Employee */}
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${getThemeClasses("text-gray-500 bg-gray-50 hover:bg-gray-100", "text-gray-400 bg-gray-800 hover:bg-gray-700", theme)} uppercase tracking-wider w-32`}
                  style={{ position: "sticky", left: "128px", zIndex: 20 }}
                >
                  Employee
                </th>

                {/* Scrollable columns */}
                <th
                  className={`pl-8 pr-4 py-3 text-left text-xs font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} uppercase tracking-wider w-64`}
                >
                  Description
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} uppercase tracking-wider w-24`}
                >
                  Category
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${getThemeClasses("text-gray-500 bg-gray-50 hover:bg-gray-100", "text-gray-400 bg-gray-800 hover:bg-gray-700", theme)} uppercase tracking-wider cursor-pointer w-24`}
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === "status" && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} uppercase tracking-wider w-20`}
                >
                  Source
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${getThemeClasses("text-gray-500 bg-gray-50 hover:bg-gray-100", "text-gray-400 bg-gray-800 hover:bg-gray-700", theme)} uppercase tracking-wider cursor-pointer w-20`}
                  onClick={() => handleSort("priority")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Priority</span>
                    {sortField === "priority" && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} uppercase tracking-wider w-24`}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody
              className={`${getThemeClasses("bg-white", "bg-gray-900", theme)} divide-y ${getThemeBorderClasses(theme)}`}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <tr
                  key={suggestion.id}
                  className={`${getThemeClasses("hover:bg-gray-50", "hover:bg-gray-800", theme)} ${
                    index % 2 === 0
                      ? getThemeClasses("bg-white", "bg-gray-900", theme)
                      : getThemeClasses("bg-gray-50", "bg-gray-800", theme)
                  }`}
                >
                  {/* First column - Last Updated */}
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm ${getThemeTextClasses(theme)} w-32 bg-inherit`}
                    style={{ position: "sticky", left: "0px", zIndex: 20 }}
                  >
                    <div>
                      <div className="font-medium">
                        {formatDate(suggestion.dateUpdated)}
                      </div>
                      <div
                        className={`${getThemeClasses("text-gray-500", "text-gray-400", theme)} text-xs`}
                      >
                        {getRelativeTime(suggestion.dateUpdated)}
                      </div>
                    </div>
                  </td>

                  {/* Second column - Employee */}
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm ${getThemeTextClasses(theme)} w-32 bg-inherit`}
                    style={{ position: "sticky", left: "128px", zIndex: 20 }}
                  >
                    <button
                      onClick={() => {
                        const employee = employees.find(
                          emp => emp.id === suggestion.employeeId,
                        );
                        if (employee) handleOpenEmployeeDrawer(employee);
                      }}
                      className={`${getThemeClasses("text-blue-600 hover:text-blue-900", "text-blue-400 hover:text-blue-300", theme)} font-medium transition-colors duration-200 cursor-pointer`}
                    >
                      {getEmployeeName(suggestion.employeeId)}
                    </button>
                  </td>

                  {/* Scrollable columns */}
                  <td
                    className={`pl-8 pr-4 py-4 text-sm ${getThemeTextClasses(theme)} w-64`}
                  >
                    <button
                      onClick={() => handleOpenDetailModal(suggestion)}
                      className={`text-left w-full truncate ${getThemeClasses("hover:text-blue-600", "hover:text-blue-400", theme)} transition-colors duration-200 cursor-pointer`}
                      title={suggestion.description}
                    >
                      {suggestion.description}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap w-24">
                    {getTypeBadge(suggestion.type, theme)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap w-24">
                    {getStatusBadge(suggestion, theme)}
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm ${getThemeTextClasses(theme)} w-20`}
                  >
                    <span className="capitalize">{suggestion.source}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap w-20">
                    {getPriorityBadge(suggestion.priority, theme)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium w-24">
                    <PermissionGuard permission="update_status">
                      <button
                        onClick={() => handleOpenModal(suggestion)}
                        className={`${getThemeClasses("text-blue-600 hover:text-blue-900", "text-blue-400 hover:text-blue-300", theme)} transition-colors duration-200 cursor-pointer`}
                      >
                        Update
                      </button>
                    </PermissionGuard>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggestion Detail Modal */}
      <SuggestionDetailModal
        suggestion={selectedSuggestion}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onUpdate={handleUpdateFromDetail}
        employeeName={
          selectedSuggestion
            ? getEmployeeName(selectedSuggestion.employeeId)
            : ""
        }
      />
    </div>
  );
};

export default SuggestionTableData;
