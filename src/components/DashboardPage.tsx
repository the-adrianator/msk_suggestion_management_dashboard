"use client";

import { AdminUser, Employee, Suggestion } from "@/types";
import PermissionGuard from "./PermissionGuard";
import { useRouter } from "next/navigation";
import { PlusIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getThemeTextClasses,
  getThemeBorderClasses,
} from "@/utils/themeClasses";
import DashboardOverview from "@/components/DashboardOverview";
import { getSuggestions } from "@/services/suggestionService";
import { getEmployees } from "@/services/employeeService";
import { useEffect, useState } from "react";
import { useSuggestions } from "@/hooks/useSuggestions";
import RecentSuggestions from "./RecentSuggestions";
import Toast from "@/components/Toast";

interface DashboardPageProps {
  admin: AdminUser;
}

export default function DashboardPage({ admin }: DashboardPageProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { suggestions, isLoading, error, updateStatus } = useSuggestions();
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [recentSuggestions, setRecentSuggestions] = useState<Suggestion[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suggestions, employees] = await Promise.all([
          getSuggestions(),
          getEmployees(),
        ]);

        setEmployees(employees);
        setRecentSuggestions(
          suggestions
            .sort(
              (a, b) =>
                new Date(b.dateUpdated).getTime() -
                new Date(a.dateUpdated).getTime(),
            )
            .slice(0, 6),
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showToast("Failed to load dashboard data.", "error");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold ${getThemeTextClasses(theme)}`}
          >
            Dashboard
          </h1>
          <p
            className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}
          >
            Manage MSK health suggestions for your employees
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <PermissionGuard permission="create_suggestions">
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Suggestion
            </button>
          </PermissionGuard>
          <button
            onClick={() => router.push("/suggestions")}
            className={`inline-flex items-center justify-center px-4 py-2 border ${getThemeBorderClasses(theme)} rounded-md shadow-sm text-sm font-medium ${theme === "dark" ? "text-gray-300 bg-gray-700 hover:bg-gray-600" : "text-gray-700 bg-white hover:bg-gray-50"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer`}
          >
            <ListBulletIcon className="w-4 h-4 mr-2" />
            View All Suggestions
          </button>
        </div>
      </div>

      <DashboardOverview suggestions={suggestions} />

      <RecentSuggestions
        recentSuggestions={recentSuggestions}
        showAllRecent={showAllRecent}
        setShowAllRecent={setShowAllRecent}
        theme={theme}
        employees={employees}
        admin={admin}
        suggestions={suggestions}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
