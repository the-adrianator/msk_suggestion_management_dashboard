"use client";

import { useState, useEffect } from "react";
import {
  Suggestion,
  Employee,
  SuggestionFilters,
  SortField,
  SortDirection,
} from "@/types";
import { getSuggestions } from "@/services/suggestionService";
import { getEmployees } from "@/services/employeeService";
import { filterSuggestions, sortSuggestions } from "@/utils/filters";
import { formatDate, getRelativeTime } from "@/utils/dates";
import { AdminUser } from "@/types";
import PermissionGuard from "./PermissionGuard";
import StatusUpdateModal from "@/components/StatusUpdateModal";
import SuggestionCard from "@/components/SuggestionCard";
import EmployeeDrawer from "@/components/EmployeeDrawer";
import CreateSuggestionModal from "./CreateSuggestionModal";
import Toast from "./Toast";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton, CardSkeleton } from "@/components/ui/LoadingSkeleton";
import SuggestionTableData from "@/components/SuggestionTableData";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getThemeClasses,
  getThemeCardClasses,
  getThemeTextClasses,
  getThemeBorderClasses,
} from "@/utils/themeClasses";
import {
  Document,
  Grid,
  PlusIcon,
  Refresh,
  Table,
  WarningTriangle,
} from "@/components/ui/SvgIcons";

interface SuggestionTableProps {
  admin: AdminUser;
}

export default function SuggestionTable({ admin }: SuggestionTableProps) {
  const { theme } = useTheme();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(
    [],
  );
  const [filters, setFilters] = useState<SuggestionFilters>({});
  const [sortField, setSortField] = useState<SortField>("dateUpdated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [suggestionsData, employeesData] = await Promise.all([
          getSuggestions(),
          getEmployees(),
        ]);
        setSuggestions(suggestionsData);
        setEmployees(employeesData);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters and sorting when data or filters change
  useEffect(() => {
    let filtered = filterSuggestions(suggestions, filters, employees);
    filtered = sortSuggestions(filtered, sortField, sortDirection);
    setFilteredSuggestions(filtered);
  }, [suggestions, filters, sortField, sortDirection, employees]);

  const handleFilterChange = (newFilters: Partial<SuggestionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleUpdateSuggestion = (updatedSuggestion: Suggestion) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === updatedSuggestion.id ? updatedSuggestion : s)),
    );
  };

  const handleOpenModal = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleOpenEmployeeDrawer = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDrawerOpen(true);
  };

  const handleCloseEmployeeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEmployee(null);
  };

  const handleCreateSuggestion = (newSuggestion: Suggestion) => {
    setSuggestions(prev => [newSuggestion, ...prev]);
    setToast({
      message: "Suggestion created successfully!",
      type: "success",
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || "Unknown Employee";
  };

  if (isLoading) {
    return (
      <div
        className={`${getThemeCardClasses(theme)} rounded-lg shadow-sm border ${getThemeBorderClasses(theme)} p-6`}
      >
        <div className="hidden md:block">
          <TableSkeleton />
        </div>
        <div className="md:hidden">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${getThemeCardClasses(theme)} rounded-lg shadow-sm border ${getThemeBorderClasses(theme)} p-6`}
      >
        <EmptyState
          title="Something went wrong"
          description={error}
          icon={<WarningTriangle className="w-12 h-12 text-red-500" />}
          action={
            <div className="space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <Refresh className="mr-2" />
                Retry
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  // Retry loading data
                  const loadData = async () => {
                    try {
                      const [fetchedSuggestions, fetchedEmployees] =
                        await Promise.all([getSuggestions(), getEmployees()]);
                      setSuggestions(fetchedSuggestions);
                      setEmployees(fetchedEmployees);
                    } catch (err: unknown) {
                      const errorMessage =
                        err instanceof Error
                          ? err.message
                          : "Failed to load data.";
                      setError(errorMessage);
                      console.error("Error loading data:", err);
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  loadData();
                }}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden w-full">
      {/* Filters and Search */}
      <div
        className={`${getThemeClasses("bg-gray-50", "bg-gray-800", theme)} rounded-lg p-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label
              className={`block text-sm font-medium ${getThemeTextClasses(theme)} mb-1`}
            >
              Search All
            </label>
            <input
              type="text"
              placeholder="Search names, descriptions, status, priority..."
              value={filters.search || ""}
              onChange={e => handleFilterChange({ search: e.target.value })}
              className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
            />
          </div>

          {/* Employee Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${getThemeTextClasses(theme)} mb-1`}
            >
              Employee
            </label>
            <select
              value={filters.employee || ""}
              onChange={e =>
                handleFilterChange({ employee: e.target.value || undefined })
              }
              className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
            >
              <option value="">All Employees</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${getThemeTextClasses(theme)} mb-1`}
            >
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={e =>
                handleFilterChange({ status: e.target.value || undefined })
              }
              className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${getThemeTextClasses(theme)} mb-1`}
            >
              Priority
            </label>
            <select
              value={filters.priority || ""}
              onChange={e =>
                handleFilterChange({ priority: e.target.value || undefined })
              }
              className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${getThemeClasses("bg-white text-gray-900", "bg-gray-700 text-white", theme)}`}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p
          className={`text-sm ${getThemeClasses("text-gray-600", "text-gray-400", theme)} mb-2 md:mb-0`}
        >
          Showing {filteredSuggestions.length} of {suggestions.length}{" "}
          suggestions
        </p>
        <div className="flex items-center space-x-3">
          {/* View Toggle Button */}
          <div
            className={`hidden md:flex items-center ${getThemeClasses("bg-gray-100", "bg-gray-700", theme)} rounded-lg p-1`}
          >
            <button
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === "table"
                  ? getThemeClasses(
                      "bg-white text-gray-900 shadow-sm",
                      "bg-gray-600 text-white shadow-sm",
                      theme,
                    )
                  : getThemeClasses(
                      "text-gray-500 hover:text-gray-700",
                      "text-gray-400 hover:text-gray-300",
                      theme,
                    )
              }`}
            >
              <Table className="w-4 h-4 mr-1.5" />
              Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? getThemeClasses(
                      "bg-white text-gray-900 shadow-sm",
                      "bg-gray-600 text-white shadow-sm",
                      theme,
                    )
                  : getThemeClasses(
                      "text-gray-500 hover:text-gray-700",
                      "text-gray-400 hover:text-gray-300",
                      theme,
                    )
              }`}
            >
              <Grid className="w-4 h-4 mr-1.5" />
              Grid
            </button>
          </div>

          <PermissionGuard permission="create_suggestions">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-1.5 md:py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Suggestion
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Desktop Table View */}
      {viewMode === "table" && (
        <SuggestionTableData
          filteredSuggestions={filteredSuggestions}
          employees={employees}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleOpenEmployeeDrawer={handleOpenEmployeeDrawer}
          handleOpenModal={handleOpenModal}
          formatDate={formatDate}
          getRelativeTime={getRelativeTime}
          getEmployeeName={getEmployeeName}
        />
      )}

      {/* Desktop Grid View */}
      {viewMode === "grid" && (
        <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {filteredSuggestions.map(suggestion => {
            const employee = employees.find(
              emp => emp.id === suggestion.employeeId,
            );
            if (!employee) return null;

            return (
              <div key={suggestion.id}>
                <SuggestionCard
                  suggestion={suggestion}
                  employeeName={employee.name}
                  onUpdate={handleOpenModal}
                  showExpandButton={true}
                  onEmployeeClick={employeeId => {
                    const emp = employees.find(e => e.id === employeeId);
                    if (emp) handleOpenEmployeeDrawer(emp);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredSuggestions.map(suggestion => {
          const employee = employees.find(
            emp => emp.id === suggestion.employeeId,
          );
          if (!employee) return null;

          return (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              employeeName={employee.name}
              onUpdate={handleOpenModal}
              showExpandButton={true}
              onEmployeeClick={employeeId => {
                const emp = employees.find(e => e.id === employeeId);
                if (emp) handleOpenEmployeeDrawer(emp);
              }}
            />
          );
        })}
      </div>

      {filteredSuggestions.length === 0 && (
        <EmptyState
          title={
            suggestions.length === 0
              ? "No suggestions yet"
              : "No matching suggestions"
          }
          description={
            suggestions.length === 0
              ? "Get started by creating your first suggestion or seeding sample data."
              : "Try adjusting your filters to see more suggestions."
          }
          icon={<Document className="w-12 h-12" />}
          action={
            suggestions.length === 0 ? (
              <div className="space-x-3">
                <PermissionGuard permission="create_suggestions" admin={admin}>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create First Suggestion
                  </button>
                </PermissionGuard>
              </div>
            ) : (
              <button
                onClick={() => setFilters({})}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            )
          }
        />
      )}

      {/* Status Update Modal */}
      {selectedSuggestion && (
        <StatusUpdateModal
          suggestion={selectedSuggestion}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdateSuggestion}
        />
      )}

      {/* Employee Drawer */}
      <EmployeeDrawer
        employee={selectedEmployee}
        isOpen={isDrawerOpen}
        onClose={handleCloseEmployeeDrawer}
      />

      {/* Create Suggestion Modal */}
      <CreateSuggestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuggestion}
        admin={admin}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
