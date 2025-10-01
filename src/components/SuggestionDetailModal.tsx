"use client";

import { Suggestion } from "@/types";
import { formatDate, getRelativeTime } from "@/utils/dates";
import { formatCurrency } from "@/utils/currency";
import PermissionGuard from "./PermissionGuard";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getThemeClasses,
  getThemeTextClasses,
  getThemeBorderClasses,
} from "@/utils/themeClasses";
import {
  getStatusBadge,
  getPriorityBadge,
  getTypeBadge,
} from "@/components/ui/Badges";
import { XMark } from "@/components/ui/SvgIcons";

interface SuggestionDetailModalProps {
  suggestion: Suggestion | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (suggestion: Suggestion) => void;
  employeeName: string;
}

// Modal displaying comprehensive suggestion details with all fields and metadata
export default function SuggestionDetailModal({
  suggestion,
  isOpen,
  onClose,
  onUpdate,
  employeeName,
}: SuggestionDetailModalProps) {
  const { theme } = useTheme();
  if (!isOpen || !suggestion) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div
        className={`relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-2xl rounded-lg ${getThemeClasses("bg-white/90 border-white/20", "bg-gray-800/90 border-gray-700/50", theme)} backdrop-blur-md`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${getThemeBorderClasses(theme)}`}>
          <div className="flex items-center justify-between">
            <h2
              className={`text-xl font-semibold ${getThemeTextClasses(theme)}`}
            >
              Suggestion Details
            </h2>
            <button
              onClick={onClose}
              className={`${getThemeClasses("text-gray-400 hover:text-gray-600", "text-gray-400 hover:text-gray-300", theme)} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 cursor-pointer`}
            >
              <XMark className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Employee and Description */}
          <div>
            <h3
              className={`text-sm font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} mb-2`}
            >
              Employee
            </h3>
            <p
              className={`text-lg font-medium ${getThemeTextClasses(theme)} mb-4`}
            >
              {employeeName}
            </p>

            <h3
              className={`text-sm font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} mb-2`}
            >
              Description
            </h3>
            <p className={getThemeTextClasses(theme)}>
              {suggestion.description}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {getTypeBadge(suggestion.type, theme)}
            {getStatusBadge(suggestion, theme)}
            {getPriorityBadge(suggestion.priority, theme)}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThemeClasses("bg-gray-100 text-gray-800", "bg-gray-900/20 text-gray-300", theme)}`}
            >
              {suggestion.source}
            </span>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3
                className={`text-sm font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} mb-1`}
              >
                Created
              </h3>
              <p className={`text-sm ${getThemeTextClasses(theme)}`}>
                {formatDate(suggestion.dateCreated)}
              </p>
            </div>
            <div>
              <h3
                className={`text-sm font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} mb-1`}
              >
                Last Updated
              </h3>
              <p className={`text-sm ${getThemeTextClasses(theme)}`}>
                {formatDate(suggestion.dateUpdated)} (
                {getRelativeTime(suggestion.dateUpdated)})
              </p>
            </div>
            {suggestion.dateCompleted && (
              <div>
                <h3
                  className={`text-sm font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} mb-1`}
                >
                  Completed
                </h3>
                <p className={`text-sm ${getThemeTextClasses(theme)}`}>
                  {formatDate(suggestion.dateCompleted)}
                </p>
              </div>
            )}
            {suggestion.estimatedCost && (
              <div>
                <h3
                  className={`text-sm font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} mb-1`}
                >
                  Estimated Cost
                </h3>
                <p className={`text-sm ${getThemeTextClasses(theme)}`}>
                  {formatCurrency(suggestion.estimatedCost)}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {suggestion.notes && (
            <div>
              <h3
                className={`text-sm font-medium ${getThemeClasses("text-gray-500", "text-gray-400", theme)} mb-2`}
              >
                Notes
              </h3>
              <p
                className={`text-sm ${getThemeTextClasses(theme)} ${getThemeClasses("bg-gray-50", "bg-gray-700", theme)} p-3 rounded-md`}
              >
                {suggestion.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium ${getThemeClasses("text-gray-700 bg-white border-gray-300 hover:bg-gray-50", "text-gray-300 bg-gray-600 border-gray-500 hover:bg-gray-500", theme)} border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
            >
              Close
            </button>
            <PermissionGuard permission="update_status">
              <button
                onClick={() => {
                  onUpdate(suggestion);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Update Status
              </button>
            </PermissionGuard>
          </div>
        </div>
      </div>
    </div>
  );
}
