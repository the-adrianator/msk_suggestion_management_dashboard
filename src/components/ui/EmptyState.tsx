"use client";

import React from "react";
import { getThemeClasses } from "@/utils/themeClasses";
import { useTheme } from "@/contexts/ThemeContext";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

// Empty state component for displaying "no data" messages with optional icon and action button
export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  const { theme } = useTheme();
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div
          className={`mx-auto h-12 w-12 ${getThemeClasses("text-gray-400", "text-gray-500", theme)} mb-4`}
        >
          {icon}
        </div>
      )}
      <h3
        className={`text-lg font-medium ${getThemeClasses("text-gray-900", "text-white", theme)} mb-2`}
      >
        {title}
      </h3>
      <p
        className={`text-sm ${getThemeClasses("text-gray-600", "text-gray-400", theme)} mb-6`}
      >
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}
