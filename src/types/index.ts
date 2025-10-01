// Employee interface based on PRD data model
export interface Employee {
  id: string;
  name: string;
  department: string;
  riskLevel: "high" | "medium" | "low";
  jobTitle: string;
  workstation: string;
  lastAssessment: string; // ISO timestamp
}

// Suggestion interface based on PRD data model
export interface Suggestion {
  id: string;
  employeeId: string;
  type: "exercise" | "equipment" | "behavioural" | "lifestyle";
  description: string;
  status: "pending" | "in_progress" | "completed" | "dismissed";
  priority: "low" | "medium" | "high";
  source: "vida" | "admin";
  createdBy: string; // email if source=admin
  dateCreated: string; // ISO timestamp
  dateUpdated: string; // ISO timestamp
  dateCompleted?: string; // ISO timestamp, only set when status=completed
  notes?: string;
  estimatedCost?: string; // e.g., "£85.00"
}

// Admin user interface
export interface AdminUser {
  email: string;
  name: string;
  role: string;
  permissions: string[]; // ['create_suggestions', 'update_status', 'view_all']
}

// Filter interfaces for dashboard
export interface SuggestionFilters {
  employee?: string;
  category?: string;
  status?: string;
  source?: string;
  priority?: string;
  search?: string; // free-text search over description
}

// Sort options
export type SortField = "dateUpdated" | "priority" | "status";
export type SortDirection = "asc" | "desc";

// Theme types
export type Theme = "light" | "dark";

// Form data interfaces
export interface CreateSuggestionData {
  employeeId: string;
  type: "exercise" | "equipment" | "behavioural" | "lifestyle";
  description: string;
  priority?: "low" | "medium" | "high";
  notes?: string;
  estimatedCost?: string;
}

export interface UpdateSuggestionData {
  status?: "pending" | "in_progress" | "completed" | "dismissed";
  notes?: string;
  estimatedCost?: string;
}

// Suggestion with employee data (for display purposes)
export interface SuggestionWithEmployee extends Suggestion {
  employee: {
    name: string;
    department: string;
    riskLevel: "high" | "medium" | "low";
  };
}

// Status update result
export interface StatusUpdateResult {
  success: boolean;
  error?: string;
}

// Stat card props
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