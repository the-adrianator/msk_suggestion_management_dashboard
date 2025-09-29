"use client";

import { useState, useEffect } from "react";
import { getSuggestionsWithEmployees } from "@/services/suggestionService";
import { updateSuggestionStatus } from "@/services/suggestionService";
import type { SuggestionWithEmployee } from "@/types";

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestionWithEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load suggestions on mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSuggestionsWithEmployees();
        setSuggestions(data);
      } catch (err) {
        setError("Failed to load suggestions");
        console.error("Error loading suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  // Update suggestion status with optimistic UI
  const updateStatus = async (id: string, status: string, notes?: string) => {
    // Optimistic update
    setSuggestions((prev) =>
      prev.map((suggestion) => {
        if (suggestion.id === id) {
          return {
            ...suggestion,
            status: status as
              | "pending"
              | "in_progress"
              | "completed"
              | "dismissed",
            dateUpdated: new Date().toISOString(),
            dateCompleted:
              status === "completed" ? new Date().toISOString() : undefined,
            notes: notes || suggestion.notes,
          };
        }
        return suggestion;
      }),
    );

    try {
      const result = await updateSuggestionStatus(
        id,
        status as "pending" | "in_progress" | "completed" | "dismissed",
        notes,
      );
      if (!result.success) {
        // Revert optimistic update on failure
        setSuggestions((prev) =>
          prev.map((suggestion) => {
            if (suggestion.id === id) {
              // Revert to original state - would need to store original state
              // For now, just reload the data
              loadSuggestions();
            }
            return suggestion;
          }),
        );
        throw new Error(result.error || "Failed to update suggestion");
      }
    } catch (err) {
      // Revert optimistic update on failure
      setSuggestions((prev) =>
        prev.map((suggestion) => {
          if (suggestion.id === id) {
            // Revert to original state - would need to store original state
            // For now, just reload the data
            loadSuggestions();
          }
          return suggestion;
        }),
      );
      throw err;
    }
  };

  // Reload suggestions
  const loadSuggestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSuggestionsWithEmployees();
      setSuggestions(data);
    } catch (err) {
      setError("Failed to load suggestions");
      console.error("Error loading suggestions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    isLoading,
    error,
    updateStatus,
    reload: loadSuggestions,
  };
}
