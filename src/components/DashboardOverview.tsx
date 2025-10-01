"use client";

import { useMemo } from "react";
import type { Suggestion } from "@/types";
import {
  Document,
  Clock,
  LightningBolt,
  CheckCircle,
  WarningTriangle,
  InfoCircle,
  LowPriority,
  User,
  Lightbulb,
  Overdue,
} from "@/components/ui/SvgIcons";
import StatCard from "@/components/StatCard";
import {
  getThemeClasses,
  getThemeWarningBgClasses,
  getThemeWarningBorderClasses,
  getThemeWarningTextClasses,
  getThemeWarningTitleClasses,
} from "@/utils/themeClasses";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";

interface DashboardOverviewProps {
  suggestions: Suggestion[];
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "red" | "purple";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Dashboard overview component displaying key statistics and overdue alert banner
export default function DashboardOverview({
  suggestions,
}: DashboardOverviewProps) {
  const { theme } = useTheme();
  const router = useRouter();

  // Calculates dashboard statistics from suggestions data
  const stats = useMemo(() => {
    const total = suggestions.length;
    const pending = suggestions.filter(s => s.status === "pending").length;
    const inProgress = suggestions.filter(
      s => s.status === "in_progress",
    ).length;
    const completed = suggestions.filter(s => s.status === "completed").length;
    const dismissed = suggestions.filter(s => s.status === "dismissed").length;

    // Priority breakdown
    const highPriority = suggestions.filter(s => s.priority === "high").length;
    const mediumPriority = suggestions.filter(
      s => s.priority === "medium",
    ).length;
    const lowPriority = suggestions.filter(s => s.priority === "low").length;

    // Source breakdown
    const vidaSuggestions = suggestions.filter(s => s.source === "vida").length;
    const adminSuggestions = suggestions.filter(
      s => s.source === "admin",
    ).length;

    // Overdue suggestions (pending for more than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const overdue = suggestions.filter(s => {
      if (s.status !== "pending") return false;
      const createdDate = new Date(s.dateCreated);
      return createdDate < thirtyDaysAgo;
    }).length;

    return {
      total,
      pending,
      inProgress,
      completed,
      dismissed,
      highPriority,
      mediumPriority,
      lowPriority,
      vidaSuggestions,
      adminSuggestions,
      overdue,
    };
  }, [suggestions]);

  const statCards: {
    overview: Omit<StatCardProps, "trend">[];
    priority: Omit<StatCardProps, "trend">[];
    source: Omit<StatCardProps, "trend">[];
  } = {
    overview: [
      {
        title: "Total Suggestions",
        value: stats.total,
        icon: <Document />,
        color: "blue",
      },
      {
        title: "Pending",
        value: stats.pending,
        icon: <Clock />,
        color: "yellow",
      },
      {
        title: "In Progress",
        value: stats.inProgress,
        icon: <LightningBolt />,
        color: "blue",
      },
      {
        title: "Completed",
        value: stats.completed,
        icon: <CheckCircle />,
        color: "green",
      },
    ],
    priority: [
      {
        title: "High",
        value: stats.highPriority,
        icon: <WarningTriangle />,
        color: "red",
      },
      {
        title: "Medium",
        value: stats.mediumPriority,
        icon: <InfoCircle />,
        color: "yellow",
      },
      {
        title: "Low",
        value: stats.lowPriority,
        icon: <LowPriority />,
        color: "green",
      },
    ],
    source: [
      {
        title: "VIDA Generated",
        value: stats.vidaSuggestions,
        icon: <Lightbulb />,
        color: "purple",
      },
      {
        title: "Admin Created",
        value: stats.adminSuggestions,
        icon: <User />,
        color: "blue",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Main statistics */}
      <div>
        <h3
          className={`text-lg leading-6 font-medium ${getThemeClasses("text-gray-900", "text-white", theme)} mb-4`}
        >
          Overview
        </h3>
        <div className="grid grid-cols-1 gap-3 2xs:grid-cols-2 lg:grid-cols-4">
          {statCards.overview.map(item => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>
      </div>

      {/* Priority and source breakdown */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <h3
            className={`text-lg leading-6 font-medium ${getThemeClasses("text-gray-900", "text-white", theme)} mb-4`}
          >
            Priority Breakdown
          </h3>
          <div className="grid grid-cols-1 gap-3 2xs:grid-cols-2 xl:grid-cols-3">
            {statCards.priority.map(item => (
              <StatCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        <div>
          <h3
            className={`text-lg leading-6 font-medium ${getThemeClasses("text-gray-900", "text-white", theme)} mb-4`}
          >
            Source Breakdown
          </h3>
          <div className="grid grid-cols-1 gap-3 2xs:grid-cols-2">
            {statCards.source.map(item => (
              <StatCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* Overdue suggestions alert */}
      {stats.overdue > 0 && (
        <div
          className={`${getThemeWarningBgClasses(theme)} border ${getThemeWarningBorderClasses(theme)} rounded-md p-4`}
        >
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <div className="flex gap-1">
              <div className="flex-shrink-0">
                <Overdue />
              </div>
              <div className="ml-3 flex-1">
                <h3
                  className={`text-sm font-medium ${getThemeWarningTitleClasses(theme)}`}
                >
                  Overdue Suggestions
                </h3>
                <div
                  className={`mt-2 text-sm ${getThemeWarningTextClasses(theme)}`}
                >
                  <p>
                    {stats.overdue} suggestion{stats.overdue !== 1 ? "s" : ""}{" "}
                    have been pending for more than 30 days and may require
                    attention.
                  </p>
                </div>
              </div>
            </div>
            <div className="my-auto w-full sm:w-fit flex-shrink-0">
              <button
                onClick={() => router.push("/suggestions?overdue=1")}
                className="px-3 py-2 text-sm font-medium rounded-md bg-red-500 text-white text-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer w-full"
              >
                View Overdue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
