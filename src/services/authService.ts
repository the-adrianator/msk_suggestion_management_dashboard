import { AdminUser } from "@/types";

// Mock admin users for simulated authentication
const MOCK_ADMINS: AdminUser[] = [
  {
    email: "hsmanager@company.com",
    name: "Alex Thompson",
    role: "Health & Safety Manager",
    permissions: ["create_suggestions", "update_status", "view_all"],
  },
  {
    email: "admin@company.com",
    name: "Admin User",
    role: "Administrator",
    permissions: ["create_suggestions", "update_status", "view_all"],
  },
  {
    email: "viewer@company.com",
    name: "Viewer User",
    role: "Viewer",
    permissions: ["view_all"],
  },
];

// Simulates sign-in and persists a session to localStorage
export async function mockSignIn(email: string): Promise<AdminUser | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const admin = MOCK_ADMINS.find((a) => a.email === email) || null;
  if (admin && typeof window !== "undefined") {
    localStorage.setItem(
      "adminSession",
      JSON.stringify({ user: admin, timestamp: Date.now() }),
    );
  }
  return admin;
}

// Retrieves the current admin session from localStorage
export function getCurrentAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const session = localStorage.getItem("adminSession");
    if (!session) return null;
    const { user, timestamp } = JSON.parse(session);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - timestamp > maxAge) {
      localStorage.removeItem("adminSession");
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

// Clears the current admin session
export function signOut(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminSession");
  }
}

// Checks if the current admin has the given permission
export function hasPermission(permission: string): boolean {
  const admin = getCurrentAdmin();
  return admin?.permissions.includes(permission) || false;
}

// Convenience helpers
export const canCreateSuggestions = () => hasPermission("create_suggestions");
export const canUpdateStatus = () => hasPermission("update_status");
export const canViewAll = () => hasPermission("view_all");
