"use client";

import { useState, useEffect } from "react";
import { AdminUser } from "@/types";
import { getCurrentAdmin } from "@/services/authService";
import LoginScreen from "@/components/LoginScreen";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardPage from "@/components/DashboardPage";

export default function App() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const currentAdmin = getCurrentAdmin();
    if (currentAdmin) {
      setAdmin(currentAdmin);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (loggedInAdmin: AdminUser) => {
    setAdmin(loggedInAdmin);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout admin={admin}>
      <DashboardPage admin={admin} />
    </DashboardLayout>
  );
}
