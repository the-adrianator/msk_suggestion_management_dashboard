"use client";

import { useState, useEffect } from "react";
import { Employee, CreateSuggestionData } from "@/types";
import { getEmployees } from "@/services/employeeService";
import { createSuggestion } from "@/services/suggestionService";
import { AdminUser, Suggestion } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getThemeClasses,
  getThemeTextClasses,
  getThemeBorderClasses,
} from "@/utils/themeClasses";
import { XMark } from "@/components/ui/SvgIcons";

interface CreateSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (suggestion: Suggestion) => void;
  admin: AdminUser;
}

// Modal for creating new MSK suggestions with form validation and employee selection
export default function CreateSuggestionModal({
  isOpen,
  onClose,
  onSuccess,
  admin,
}: CreateSuggestionModalProps) {
  const { theme } = useTheme();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateSuggestionData>({
    employeeId: "",
    type: "exercise",
    description: "",
    priority: "medium",
    notes: "",
    estimatedCost: "",
  });

  // Load employees when modal opens
  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  // Fetches employee list from Firestore for dropdown selection
  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const employeesData = await getEmployees();
      setEmployees(employeesData);
    } catch (err) {
      setError("Failed to load employees");
      console.error("Error loading employees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Validates form data, creates suggestion in Firestore, and triggers success callback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.employeeId || !formData.description.trim()) {
        setError("Employee and Description are required");
        return;
      }

      const suggestionId = await createSuggestion(formData, admin.email);

      // Create the new suggestion object for optimistic update
      const newSuggestion = {
        id: suggestionId,
        ...formData,
        priority: formData.priority || "medium", // Ensure priority is never undefined
        status: "pending" as const,
        source: "admin" as const,
        createdBy: admin.email,
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      };

      onSuccess(newSuggestion);
      onClose();

      // Reset form
      setFormData({
        employeeId: "",
        type: "exercise",
        description: "",
        priority: "medium",
        notes: "",
        estimatedCost: "",
      });
    } catch (err) {
      setError("Failed to create suggestion. Please try again.");
      console.error("Error creating suggestion:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updates form field values in state
  const handleInputChange = (
    field: keyof CreateSuggestionData,
    value: string,
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div
        className={`relative top-20 mx-auto p-5 border w-full max-w-md shadow-2xl rounded-lg ${getThemeClasses("bg-white/90 border-white/20", "bg-gray-800/90 border-gray-700/50", theme)} backdrop-blur-md `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute cursor-pointer top-3 right-3 p-1 rounded-full ${getThemeClasses("text-gray-400 hover:text-gray-600 hover:bg-gray-100", "text-gray-500 hover:text-gray-300 hover:bg-gray-700", theme)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-label="Close modal"
        >
          <XMark />
        </button>

        <div className="mt-3">
          <h3
            className={`text-lg font-medium ${getThemeTextClasses(theme)} mb-4`}
          >
            Create New Suggestion
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee Selection - Required */}
            <div>
              <label
                className={`block text-sm font-medium ${getThemeClasses("text-gray-700", "text-gray-300", theme)} mb-2`}
              >
                Employee *
              </label>
              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <select
                  value={formData.employeeId}
                  onChange={e =>
                    handleInputChange("employeeId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
                  required
                >
                  <option value="">Select an employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.department}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Category/Type - Required */}
            <div>
              <label
                className={`block text-sm font-medium ${getThemeClasses("text-gray-700", "text-gray-300", theme)} mb-2`}
              >
                Category *
              </label>
              <select
                value={formData.type}
                onChange={e => handleInputChange("type", e.target.value)}
                className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
                required
              >
                <option value="exercise">Exercise</option>
                <option value="equipment">Equipment</option>
                <option value="behavioural">Behavioural</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            {/* Description - Required */}
            <div>
              <label
                className={`block text-sm font-medium ${getThemeClasses("text-gray-700", "text-gray-300", theme)} mb-2`}
              >
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
                placeholder="Describe the MSK risk reduction suggestion..."
                required
              />
            </div>

            {/* Priority - Optional */}
            <div>
              <label
                className={`block text-sm font-medium ${getThemeClasses("text-gray-700", "text-gray-300", theme)} mb-2`}
              >
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={e => handleInputChange("priority", e.target.value)}
                className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Notes - Optional */}
            <div>
              <label
                className={`block text-sm font-medium ${getThemeClasses("text-gray-700", "text-gray-300", theme)} mb-2`}
              >
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={e => handleInputChange("notes", e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
                placeholder="Additional notes or context..."
              />
            </div>

            {/* Estimated Cost - Optional */}
            <div>
              <label
                className={`block text-sm font-medium ${getThemeClasses("text-gray-700", "text-gray-300", theme)} mb-2`}
              >
                Estimated Cost
              </label>
              <input
                type="text"
                value={formData.estimatedCost}
                onChange={e =>
                  handleInputChange("estimatedCost", e.target.value)
                }
                className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
                placeholder="e.g., £85.00"
              />
            </div>

            {error && (
              <div
                className={`${getThemeClasses("text-red-600", "text-red-400", theme)} text-sm`}
              >
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-sm font-medium ${getThemeClasses("text-gray-700 bg-gray-100 hover:bg-gray-200", "text-gray-300 bg-gray-700 hover:bg-gray-600", theme)} rounded-md cursor-pointer`}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Creating..." : "Create Suggestion"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
