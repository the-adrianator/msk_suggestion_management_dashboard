// Utility functions for date handling and suggestion status checks

// Determines if a suggestion is overdue based on creation date and status
export function isOverdue(
  dateCreated: string,
  status: string,
  thresholdDays: number = 30,
): boolean {
  // Only pending items can be overdue (older than thresholdDays)
  if (status !== "pending") return false;

  const createdDate = new Date(dateCreated);
  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return daysDiff > thresholdDays;
}

// Formats a date string for display in British format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Formats a date and time string for display in British format
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Returns a human-readable relative time string
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  return formatDate(dateString);
}
