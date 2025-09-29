"use client";

import { AdminUser, Suggestion } from "@/types";
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
import { useEffect, useState } from "react";
import { useSuggestions } from "@/hooks/useSuggestions";

interface DashboardPageProps {
  admin: AdminUser;
}

export default function DashboardPage({ admin }: DashboardPageProps) {
  const { suggestions, isLoading, error, updateStatus } = useSuggestions();
  const { theme } = useTheme();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [recentSuggestions, setRecentSuggestions] = useState<Suggestion[]>([]);
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

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suggestions] = await Promise.all([getSuggestions()]);

        setRecentSuggestions(
          suggestions
            .sort(
              (a, b) =>
                new Date(b.dateUpdated).getTime() -
                new Date(a.dateUpdated).getTime()
            )
            .slice(0, 6)
        );

        // Calculate stats
        const newStats = {
          total: suggestions.length,
          pending: suggestions.filter(s => s.status === "pending").length,
          inProgress: suggestions.filter(s => s.status === "in_progress")
            .length,
          completed: suggestions.filter(s => s.status === "completed").length,
          high: suggestions.filter(s => s.priority === "high").length,
          medium: suggestions.filter(s => s.priority === "medium").length,
          low: suggestions.filter(s => s.priority === "low").length,
        };
        setStats(newStats);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showToast("Failed to load dashboard data.", "error");
      }
    };
    fetchData();
  }, []);

  const handleCreateSuggestion = (newSuggestion: Suggestion) => {
    setRecentSuggestions(prev => {
      const updated = [newSuggestion, ...prev]
        .sort(
          (a, b) =>
            new Date(b.dateUpdated).getTime() -
            new Date(a.dateUpdated).getTime()
        )
        .slice(0, 6);
      return updated;
    });
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      [newSuggestion.status === "pending"
        ? "pending"
        : newSuggestion.status === "in_progress"
          ? "inProgress"
          : "completed"]:
        prev[
          newSuggestion.status === "pending"
            ? "pending"
            : newSuggestion.status === "in_progress"
              ? "inProgress"
              : "completed"
        ] + 1,
      [newSuggestion.priority]: prev[newSuggestion.priority] + 1,
    }));
    setToast({
      message: "Suggestion created successfully!",
      type: "success",
      isVisible: true,
    });
    setIsCreateModalOpen(false);
  };

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
    </div>
  );
}
