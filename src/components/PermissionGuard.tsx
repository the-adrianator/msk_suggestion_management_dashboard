"use client";

import { ReactNode } from "react";
import { hasPermission } from "@/services/authService";

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

// Renders children only if the current admin has the required permission
export default function PermissionGuard({
  children,
  permission,
  fallback = null,
}: PermissionGuardProps) {
  const hasRequiredPermission = hasPermission(permission);
  if (!hasRequiredPermission) return <>{fallback}</>;
  return <>{children}</>;
}

// Convenience wrappers for common permissions
// Might use in future iterations - used PermissionGuard directly instead for this iteration
// export function CreateSuggestionGuard({
//   children,
//   fallback,
// }: Omit<PermissionGuardProps, "permission">) {
//   return (
//     <PermissionGuard permission="create_suggestions" fallback={fallback}>
//       {children}
//     </PermissionGuard>
//   );
// }

// export function UpdateStatusGuard({
//   children,
//   fallback,
// }: Omit<PermissionGuardProps, "permission">) {
//   return (
//     <PermissionGuard permission="update_status" fallback={fallback}>
//       {children}
//     </PermissionGuard>
//   );
// }

// export function ViewAllGuard({
//   children,
//   fallback,
// }: Omit<PermissionGuardProps, "permission">) {
//   return (
//     <PermissionGuard permission="view_all" fallback={fallback}>
//       {children}
//     </PermissionGuard>
//   );
// }
