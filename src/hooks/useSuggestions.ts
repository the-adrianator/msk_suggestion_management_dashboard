"use client";

import { useState, useEffect } from "react";
import { getSuggestionsWithEmployees } from "@/services/suggestionService";
import { updateSuggestionStatus } from "@/services/suggestionService";
import type { SuggestionWithEmployee } from "@/types";

// Custom hook for managing suggestion state with optimistic updates and reload capability
export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestionWithEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Loads suggestions from Firestore on component mount
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

  // Updates suggestion status with optimistic UI; reverts on failure
  const updateStatus = async (id: string, status: string, notes?: string) => {
    // Apply optimistic update immediately for instant feedback
    setSuggestions(prev =>
      prev.map(suggestion => {
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
        setSuggestions(prev =>
          prev.map(suggestion => {
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
      setSuggestions(prev =>
        prev.map(suggestion => {
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

  // Reloads all suggestions from Firestore (used for manual refresh or after errors)
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
