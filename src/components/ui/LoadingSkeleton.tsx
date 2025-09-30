"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getThemeClasses,
  getThemeCardClasses,
  getThemeBorderClasses,
} from "@/utils/themeClasses";

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export default function LoadingSkeleton({
  lines = 3,
  className = "",
}: LoadingSkeletonProps) {
  const { theme } = useTheme();

  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 ${getThemeClasses("bg-gray-200", "bg-gray-700", theme)} rounded mb-2`}
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

export function TableSkeleton() {
  const { theme } = useTheme();

  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <div
              className={`h-4 ${getThemeClasses("bg-gray-200", "bg-gray-700", theme)} rounded w-1/4`}
            ></div>
            <div
              className={`h-4 ${getThemeClasses("bg-gray-200", "bg-gray-700", theme)} rounded w-1/4`}
            ></div>
            <div
              className={`h-4 ${getThemeClasses("bg-gray-200", "bg-gray-700", theme)} rounded w-1/3`}
            ></div>
            <div
              className={`h-4 ${getThemeClasses("bg-gray-200", "bg-gray-700", theme)} rounded w-1/6`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  const { theme } = useTheme();

  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`${getThemeCardClasses(theme)} p-4 rounded-lg border ${getThemeBorderClasses(theme)}`}
          >
            <div
              className={`h-4 ${getThemeClasses("bg-gray-200", "bg-gray-700", theme)} rounded w-3/4 mb-2`}
            ></div>
            <div
              className={`h-3 ${getThemeClasses("bg-gray-200", "bg-gray-700", theme)} rounded w-1/2 mb-2`}
            ></div>
            <div
              className={`h-3 ${getThemeClasses("bg-gray-200", "bg-gray-700", theme)} rounded w-1/4`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
