"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeClasses } from "@/utils/themeClasses";
import { useEffect } from "react";
import { CheckMark, InfoCircle, XMark } from "@/components/ui/SvgIcons";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

// Toast notification component with auto-dismiss timer and theme-aware styling
export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  const { theme } = useTheme();

  // Automatically dismiss toast after specified duration
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const successTypeThemeClass = getThemeClasses(
    "bg-green-100 text-green-800 border-green-200",
    "bg-green-900/20 text-green-300 border-green-800",
    theme,
  );
  const errorTypeThemeClass = getThemeClasses(
    "bg-red-100 text-red-800 border-red-200",
    "bg-red-900/20 text-red-300 border-red-800",
    theme,
  );
  const infoTypeThemeClass = getThemeClasses(
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-blue-900/20 text-blue-300 border-blue-800",
    theme,
  );

  const successIconThemeClass = getThemeClasses(
    "text-green-600",
    "text-green-400",
    theme,
  );
  const errorIconThemeClass = getThemeClasses(
    "text-red-600",
    "text-red-400",
    theme,
  );
  const infoIconThemeClass = getThemeClasses(
    "text-blue-600",
    "text-blue-400",
    theme,
  );

  const typeStyles = {
    success: successTypeThemeClass,
    error: errorTypeThemeClass,
    info: infoTypeThemeClass,
  };

  const iconStyles = {
    success: successIconThemeClass,
    error: errorIconThemeClass,
    info: infoIconThemeClass,
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckMark />;
      case "error":
        return <XMark />;
      case "info":
        return <InfoCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div
        className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${typeStyles[type]}`}
      >
        <div className={`flex-shrink-0 mr-3 ${iconStyles[type]}`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 hover:opacity-75"
        >
          <XMark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
