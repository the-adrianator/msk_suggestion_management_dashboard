"use client";

import { AdminUser } from "@/types";
import { signOut } from "@/services/authService";
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getThemeCardClasses,
  getThemeTextClasses,
  getThemeBorderClasses,
} from "@/utils/themeClasses";

interface HeaderProps {
  admin: AdminUser;
  onToggleMobileSidebar?: () => void;
}

export default function Header({ admin, onToggleMobileSidebar }: HeaderProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <header
      className={`${getThemeCardClasses(theme)} shadow-sm border-b ${getThemeBorderClasses(theme)}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button and title */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onToggleMobileSidebar}
              className={`lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-3 cursor-pointer`}
              aria-label="Open sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1
              className={`text-sm sm:text-lg lg:text-xl font-semibold ${getThemeTextClasses(theme)}`}
            >
              MSK Suggestion Management Board
            </h1>
          </div>

          {/* User info and actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User info - Hidden on very small screens */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${getThemeTextClasses(theme)}`}
                >
                  {admin.name}
                </p>
                <p
                  className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  {admin.role}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {admin.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")}
                </span>
              </div>
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className={`inline-flex items-center px-2 sm:px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
            >
              <svg
                className="w-4 h-4 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
