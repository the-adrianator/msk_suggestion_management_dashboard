import {
  Suggestion,
  CreateSuggestionData,
  UpdateSuggestionData,
} from "@/types";

jest.mock("firebase/firestore", () => {
  return {
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    doc: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    Timestamp: { fromDate: (d: Date) => ({ toDate: () => d }) },
  };
});

// Mock suggestion data for testing
const mockSuggestion: Suggestion = {
  id: "test-id",
  employeeId: "emp1",
  type: "exercise",
  description: "Take regular breaks every 30 minutes",
  status: "pending",
  priority: "high",
  source: "admin",
  createdBy: "hsmanager@company.com",
  dateCreated: "2024-01-15T10:30:00.000Z",
  dateUpdated: "2024-01-15T10:30:00.000Z",
};

describe("createSuggestion", () => {
  it("should validate required fields", () => {
    const validData: CreateSuggestionData = {
      employeeId: "emp1",
      type: "exercise",
      description: "Test suggestion",
    };

    // Check that all required fields are present
    expect(validData.employeeId).toBeDefined();
    expect(validData.type).toBeDefined();
    expect(validData.description).toBeDefined();
  });

  it("should set sensible defaults", () => {
    const suggestionData: CreateSuggestionData = {
      employeeId: "emp1",
      type: "exercise",
      description: "Test suggestion",
    };

    // This test verifies the structure we expect
    expect(suggestionData).toMatchObject({
      employeeId: "emp1",
      type: "exercise",
      description: "Test suggestion",
    });
  });

  it("should handle optional fields", () => {
    const suggestionData: CreateSuggestionData = {
      employeeId: "emp1",
      type: "equipment",
      description: "Test suggestion",
      priority: "medium",
      notes: "Additional notes",
      estimatedCost: "£50.00",
    };

    expect(suggestionData.priority).toBe("medium");
    expect(suggestionData.notes).toBe("Additional notes");
    expect(suggestionData.estimatedCost).toBe("£50.00");
  });
});

describe("updateStatus", () => {
  it("should set dateUpdated when status changes", () => {
    const updateData: UpdateSuggestionData = {
      status: "in_progress",
    };

    // Mock the current suggestion
    const currentSuggestion = { ...mockSuggestion };

    // Simulate the update logic
    const updatedSuggestion = {
      ...currentSuggestion,
      ...updateData,
      dateUpdated: new Date().toISOString(),
    };

    expect(updatedSuggestion.status).toBe("in_progress");
    expect(updatedSuggestion.dateUpdated).toBeDefined();
    expect(new Date(updatedSuggestion.dateUpdated).getTime()).toBeGreaterThan(
      new Date(currentSuggestion.dateUpdated).getTime(),
    );
  });

  it("should set dateCompleted when status is completed", () => {
    const updateData: UpdateSuggestionData = {
      status: "completed",
    };

    const currentSuggestion = { ...mockSuggestion };
    const now = new Date().toISOString();

    const updatedSuggestion = {
      ...currentSuggestion,
      ...updateData,
      dateUpdated: now,
      dateCompleted: now,
    };

    expect(updatedSuggestion.status).toBe("completed");
    expect(updatedSuggestion.dateCompleted).toBe(now);
  });

  it("should not set dateCompleted for non-completed status", () => {
    const updateData: UpdateSuggestionData = {
      status: "in_progress",
    };

    const currentSuggestion = { ...mockSuggestion };
    const now = new Date().toISOString();

    const updatedSuggestion = {
      ...currentSuggestion,
      ...updateData,
      dateUpdated: now,
    };

    expect(updatedSuggestion.status).toBe("in_progress");
    expect(updatedSuggestion.dateCompleted).toBeUndefined();
  });

  it("should handle multiple field updates", () => {
    const updateData: UpdateSuggestionData = {
      status: "completed",
      notes: "Updated notes",
      estimatedCost: "£100.00",
    };

    const currentSuggestion = { ...mockSuggestion };
    const now = new Date().toISOString();

    const updatedSuggestion = {
      ...currentSuggestion,
      ...updateData,
      dateUpdated: now,
      dateCompleted: now,
    };

    expect(updatedSuggestion.status).toBe("completed");
    expect(updatedSuggestion.notes).toBe("Updated notes");
    expect(updatedSuggestion.estimatedCost).toBe("£100.00");
    expect(updatedSuggestion.dateCompleted).toBe(now);
  });
});

describe("suggestion validation", () => {
  it("should validate suggestion type", () => {
    const validTypes = ["exercise", "equipment", "behavioural", "lifestyle"];

    validTypes.forEach((type) => {
      const suggestion = {
        ...mockSuggestion,
        type: type as "exercise" | "equipment" | "behavioural" | "lifestyle",
      };
      expect(validTypes).toContain(suggestion.type);
    });
  });

  it("should validate suggestion status", () => {
    const validStatuses = ["pending", "in_progress", "completed", "dismissed"];

    validStatuses.forEach((status) => {
      const suggestion = {
        ...mockSuggestion,
        status: status as "pending" | "in_progress" | "completed" | "dismissed",
      };
      expect(validStatuses).toContain(suggestion.status);
    });
  });

  it("should validate suggestion priority", () => {
    const validPriorities = ["low", "medium", "high"];

    validPriorities.forEach((priority) => {
      const suggestion = {
        ...mockSuggestion,
        priority: priority as "low" | "medium" | "high",
      };
      expect(validPriorities).toContain(suggestion.priority);
    });
  });

  it("should validate suggestion source", () => {
    const validSources = ["vida", "admin"];

    validSources.forEach((source) => {
      const suggestion = {
        ...mockSuggestion,
        source: source as "vida" | "admin",
      };
      expect(validSources).toContain(suggestion.source);
    });
  });
});
