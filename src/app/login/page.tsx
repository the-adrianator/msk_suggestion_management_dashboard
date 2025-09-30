"use client";

import LoginScreen from "@/components/LoginScreen";

// Login page wrapper; redirects will be handled by calling page as needed
export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/";
  };
  return <LoginScreen onLogin={handleLogin} />;
}
