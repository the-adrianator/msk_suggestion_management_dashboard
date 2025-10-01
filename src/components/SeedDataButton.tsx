"use client";

import { useState } from "react";
import { seedFirestoreData } from "@/scripts/seedData";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeClasses } from "@/utils/themeClasses";

// Button component for seeding Firestore with sample data
export default function SeedDataButton() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Triggers the seed data script to populate Firestore with sample employees and suggestions
  const handleSeedData = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      await seedFirestoreData();
      setMessage("Data seeded successfully!");
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Displays instructions for clearing existing data; actual deletion requires Firebase console
  const handleClearAndReseed = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      // Manual deletion via Firebase console recommended for safety
      // Note: In a real app, you'd implement proper batch deletion
      setMessage(
        'Please clear data manually from Firebase Console, then click "Seed Sample Data" to avoid duplicates.',
      );
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`p-4 border ${getThemeClasses("bg-white border-gray-200", "bg-gray-80 border-gray-700", theme)} rounded-lg`}
    >
      <div className="space-x-2">
        <button
          onClick={handleSeedData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Seeding..." : "Seed Sample Data"}
        </button>

        <button
          onClick={handleClearAndReseed}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Clear & Reseed
        </button>
      </div>

      {message && (
        <div
          className={`mt-2 p-2 rounded ${
            message.includes("Error")
              ? getThemeClasses(
                  "bg-red-100 text-red-700",
                  "bg-red-900/20 text-red-300",
                  theme,
                )
              : getThemeClasses(
                  "bg-green-100 text-green-700",
                  "bg-green-900/20 text-green-300",
                  theme,
                )
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
