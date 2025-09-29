import {
  isOverdue,
  formatDate,
  formatDateTime,
  getRelativeTime,
} from "../dates";

describe("isOverdue", () => {
  it("should return false for non-pending status", () => {
    const result = isOverdue("2024-01-01T00:00:00.000Z", "completed", 30);
    expect(result).toBe(false);
  });

  it("should return false for recent pending suggestions", () => {
    const recentDate = new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 10 days ago
    const result = isOverdue(recentDate, "pending", 30);
    expect(result).toBe(false);
  });

  it("should return true for old pending suggestions", () => {
    const oldDate = new Date(
      Date.now() - 35 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 35 days ago
    const result = isOverdue(oldDate, "pending", 30);
    expect(result).toBe(true);
  });

  it("should use custom threshold", () => {
    const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(); // 10 days ago
    const result = isOverdue(date, "pending", 5); // 5 day threshold
    expect(result).toBe(true);
  });
});

describe("formatDate", () => {
  it("should format date in British format", () => {
    const result = formatDate("2024-01-15T10:30:00.000Z");
    expect(result).toBe("15/01/2024");
  });

  it("should handle different dates", () => {
    const result = formatDate("2024-12-25T00:00:00.000Z");
    expect(result).toBe("25/12/2024");
  });
});

describe("formatDateTime", () => {
  it("should format date and time in British format", () => {
    const result = formatDateTime("2024-01-15T10:30:00.000Z");
    expect(result).toBe("15/01/2024, 10:30");
  });

  it("should handle different times", () => {
    const result = formatDateTime("2024-01-15T14:45:30.000Z");
    expect(result).toBe("15/01/2024, 14:45");
  });
});

describe("getRelativeTime", () => {
  it('should return "Just now" for very recent times', () => {
    const recentTime = new Date(Date.now() - 30 * 1000).toISOString(); // 30 seconds ago
    const result = getRelativeTime(recentTime);
    expect(result).toBe("Just now");
  });

  it("should return minutes ago for recent times", () => {
    const recentTime = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
    const result = getRelativeTime(recentTime);
    expect(result).toBe("5 minutes ago");
  });

  it("should return hours ago for older times", () => {
    const olderTime = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(); // 3 hours ago
    const result = getRelativeTime(olderTime);
    expect(result).toBe("3 hours ago");
  });

  it("should return days ago for much older times", () => {
    const muchOlderTime = new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 3 days ago
    const result = getRelativeTime(muchOlderTime);
    expect(result).toBe("3 days ago");
  });

  it("should return formatted date for very old times", () => {
    const veryOldTime = new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 10 days ago
    const result = getRelativeTime(veryOldTime);
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/); // Should match DD/MM/YYYY format
  });
});
