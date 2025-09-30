"use client";

import { useState, useEffect, useCallback } from "react";
import { Employee, Suggestion } from "@/types";
import { getSuggestionsByEmployee } from "@/services/suggestionService";
import { formatDate } from "@/utils/dates";
import { formatCurrency } from "@/utils/currency";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getThemeTextClasses,
  getThemeBorderClasses,
  getThemeRiskLevelClasses,
} from "@/utils/themeClasses";
import StatusUpdateModal from "./StatusUpdateModal";
import { getStatusBadge, getTypeBadge } from "@/components/ui/Badges";

interface EmployeeDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeDrawer({
  employee,
  isOpen,
  onClose,
}: EmployeeDrawerProps) {
  const { theme } = useTheme();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const loadEmployeeSuggestions = useCallback(async () => {
    if (!employee) return;

    setIsLoading(true);
    try {
      const employeeSuggestions = await getSuggestionsByEmployee(employee.id);
      setSuggestions(employeeSuggestions);
    } catch (error) {
      console.error("Error loading employee suggestions:", error);
      // Set empty array on error to show "No suggestions found" message
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [employee]);

  useEffect(() => {
    if (employee && isOpen) {
      loadEmployeeSuggestions();
    }
  }, [employee, isOpen, loadEmployeeSuggestions]);

  const handleUpdateSuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateFromModal = (updatedSuggestion: Suggestion) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === updatedSuggestion.id ? updatedSuggestion : s)),
    );
    setIsUpdateModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedSuggestion(null);
  };

  if (!employee) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 cursor-pointer"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md ${theme === "dark" ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-md shadow-xl z-50 transform transition-transform duration-300 ease-in-out border-l ${theme === "dark" ? "border-gray-700/50" : "border-white/20"} ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${getThemeBorderClasses(theme)}`}
          >
            <h2
              className={`text-lg font-semibold ${getThemeTextClasses(theme)}`}
            >
              Employee Details
            </h2>
            <button
              onClick={onClose}
              className={`p-2 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-md cursor-pointer`}
            >
              <svg
                className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Employee Info */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {employee.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3
                    className={`text-lg font-medium ${getThemeTextClasses(theme)}`}
                  >
                    {employee.name}
                  </h3>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {employee.jobTitle}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Department:
                  </span>
                  <span className={`text-sm ${getThemeTextClasses(theme)}`}>
                    {employee.department}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Workstation:
                  </span>
                  <span className={`text-sm ${getThemeTextClasses(theme)}`}>
                    {employee.workstation}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Risk Level:
                  </span>
                  <span
                    className={`text-sm font-medium ${getThemeRiskLevelClasses(employee.riskLevel, theme)}`}
                  >
                    {employee.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Last Assessment:
                  </span>
                  <span className={`text-sm ${getThemeTextClasses(theme)}`}>
                    {formatDate(employee.lastAssessment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4
                className={`text-md font-medium ${getThemeTextClasses(theme)} mb-3`}
              >
                Suggestions ({suggestions.length})
              </h4>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : suggestions.length === 0 ? (
                <p
                  className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-center py-4`}
                >
                  No suggestions found for this employee.
                </p>
              ) : (
                <div className="space-y-3">
                  {suggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-3`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p
                            className={`text-sm ${getThemeTextClasses(theme)} font-medium`}
                          >
                            {suggestion.description}
                          </p>
                        </div>
                        <div className="ml-2">
                          {getStatusBadge(suggestion, theme)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {getTypeBadge(suggestion.type, theme)}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                        >
                          {suggestion.priority}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                        >
                          {suggestion.source}
                        </span>
                      </div>

                      <div
                        className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        <div className="flex justify-between">
                          <span>Updated:</span>
                          <span>{formatDate(suggestion.dateUpdated)}</span>
                        </div>
                        {suggestion.estimatedCost && (
                          <div className="flex justify-between">
                            <span>Cost:</span>
                            <span>
                              {formatCurrency(suggestion.estimatedCost)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => handleUpdateSuggestion(suggestion)}
                          className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer ${
                            theme === "dark"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedSuggestion && (
        <StatusUpdateModal
          suggestion={selectedSuggestion}
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          onUpdate={handleUpdateFromModal}
        />
      )}
    </>
  );
}
