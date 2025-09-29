import { filterSuggestions, sortSuggestions } from "../filters";
import { Suggestion, SuggestionFilters } from "@/types";

// Mock suggestion data for testing
const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    employeeId: "emp1",
    type: "exercise",
    description: "Take regular breaks every 30 minutes",
    status: "pending",
    priority: "high",
    source: "vida",
    createdBy: "vida-system",
    dateCreated: "2024-01-10T09:00:00.000Z",
    dateUpdated: "2024-01-10T09:00:00.000Z",
  },
  {
    id: "2",
    employeeId: "emp2",
    type: "equipment",
    description: "Adjust monitor height to eye level",
    status: "in_progress",
    priority: "medium",
    source: "admin",
    createdBy: "hsmanager@company.com",
    dateCreated: "2024-01-15T10:30:00.000Z",
    dateUpdated: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "3",
    employeeId: "emp1",
    type: "behavioural",
    description: "Practice proper lifting techniques",
    status: "completed",
    priority: "low",
    source: "admin",
    createdBy: "hsmanager@company.com",
    dateCreated: "2024-01-20T14:15:00.000Z",
    dateUpdated: "2024-01-22T09:30:00.000Z",
    dateCompleted: "2024-01-22T09:30:00.000Z",
  },
  {
    id: "4",
    employeeId: "emp3",
    type: "lifestyle",
    description: "Incorporate desk exercises into daily routine",
    status: "dismissed",
    priority: "high",
    source: "vida",
    createdBy: "vida-system",
    dateCreated: "2024-01-25T11:45:00.000Z",
    dateUpdated: "2024-01-25T11:45:00.000Z",
  },
];

describe("filterSuggestions", () => {
  it("should return all suggestions when no filters applied", () => {
    const filters: SuggestionFilters = {};
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(4);
  });

  it("should filter by employee", () => {
    const filters: SuggestionFilters = { employee: "emp1" };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.employeeId === "emp1")).toBe(true);
  });

  it("should filter by category/type", () => {
    const filters: SuggestionFilters = { category: "exercise" };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("exercise");
  });

  it("should filter by status", () => {
    const filters: SuggestionFilters = { status: "pending" };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("pending");
  });

  it("should filter by source", () => {
    const filters: SuggestionFilters = { source: "admin" };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.source === "admin")).toBe(true);
  });

  it("should filter by priority", () => {
    const filters: SuggestionFilters = { priority: "high" };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.priority === "high")).toBe(true);
  });

  it("should filter by search term", () => {
    const filters: SuggestionFilters = { search: "breaks" };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].description).toContain("breaks");
  });

  it("should filter by multiple criteria", () => {
    const filters: SuggestionFilters = {
      employee: "emp1",
      status: "pending",
    };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].employeeId).toBe("emp1");
    expect(result[0].status).toBe("pending");
  });

  it("should return empty array when no matches found", () => {
    const filters: SuggestionFilters = { status: "non-existent" };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(0);
  });

  it("should handle case-insensitive search", () => {
    const filters: SuggestionFilters = { search: "MONITOR" };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].description).toContain("monitor");
  });
});

describe("sortSuggestions", () => {
  it("should sort by dateUpdated descending by default", () => {
    const result = sortSuggestions(mockSuggestions, "dateUpdated", "desc");
    expect(result[0].id).toBe("4"); // Most recent
    expect(result[3].id).toBe("1"); // Oldest
  });

  it("should sort by dateUpdated ascending", () => {
    const result = sortSuggestions(mockSuggestions, "dateUpdated", "asc");
    expect(result[0].id).toBe("1"); // Oldest
    expect(result[3].id).toBe("4"); // Most recent
  });

  it("should sort by priority", () => {
    const result = sortSuggestions(mockSuggestions, "priority", "desc");
    expect(result[0].priority).toBe("high");
    expect(result[1].priority).toBe("high");
    expect(result[2].priority).toBe("medium");
    expect(result[3].priority).toBe("low");
  });

  it("should sort by status", () => {
    const result = sortSuggestions(mockSuggestions, "status", "asc");
    expect(result[0].status).toBe("pending");
    expect(result[1].status).toBe("in_progress");
    expect(result[2].status).toBe("completed");
    expect(result[3].status).toBe("dismissed");
  });
});
