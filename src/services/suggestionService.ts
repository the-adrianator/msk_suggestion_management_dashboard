import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Suggestion,
  CreateSuggestionData,
  UpdateSuggestionData,
  SuggestionFilters,
  SuggestionWithEmployee,
  StatusUpdateResult,
} from "@/types";
import { getEmployeeById } from "./employeeService";

const COLLECTION_NAME = "suggestions";

// Retrieves all suggestions from Firestore, sorted by date updated
export async function getSuggestions(): Promise<Suggestion[]> {
  try {
    const suggestionsRef = collection(db, COLLECTION_NAME);
    const q = query(suggestionsRef, orderBy("dateUpdated", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      dateCreated:
        doc.data().dateCreated?.toDate?.()?.toISOString() ||
        doc.data().dateCreated,
      dateUpdated:
        doc.data().dateUpdated?.toDate?.()?.toISOString() ||
        doc.data().dateUpdated,
      dateCompleted:
        doc.data().dateCompleted?.toDate?.()?.toISOString() ||
        doc.data().dateCompleted,
    })) as Suggestion[];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw new Error("Failed to fetch suggestions");
  }
}

// Retrieves a single suggestion by its ID
export async function getSuggestionById(
  suggestionId: string,
): Promise<Suggestion | null> {
  try {
    const suggestionRef = doc(db, COLLECTION_NAME, suggestionId);
    const suggestionSnap = await getDoc(suggestionRef);

    if (suggestionSnap.exists()) {
      const data = suggestionSnap.data();
      return {
        id: suggestionSnap.id,
        ...data,
        // Convert Firestore timestamps to ISO strings
        dateCreated:
          data.dateCreated?.toDate?.()?.toISOString() || data.dateCreated,
        dateUpdated:
          data.dateUpdated?.toDate?.()?.toISOString() || data.dateUpdated,
        dateCompleted:
          data.dateCompleted?.toDate?.()?.toISOString() || data.dateCompleted,
      } as Suggestion;
    }

    return null;
  } catch (error) {
    console.error("Error fetching suggestion:", error);
    throw new Error("Failed to fetch suggestion");
  }
}

// Retrieves suggestions for a specific employee
export async function getSuggestionsByEmployee(
  employeeId: string,
): Promise<Suggestion[]> {
  try {
    const suggestionsRef = collection(db, COLLECTION_NAME);
    const q = query(suggestionsRef, where("employeeId", "==", employeeId));
    const querySnapshot = await getDocs(q);

    const suggestions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      dateCreated:
        doc.data().dateCreated?.toDate?.()?.toISOString() ||
        doc.data().dateCreated,
      dateUpdated:
        doc.data().dateUpdated?.toDate?.()?.toISOString() ||
        doc.data().dateUpdated,
      dateCompleted:
        doc.data().dateCompleted?.toDate?.()?.toISOString() ||
        doc.data().dateCompleted,
    })) as Suggestion[];

    // Sort by dateUpdated in descending order (most recent first)
    return suggestions.sort(
      (a, b) =>
        new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime(),
    );
  } catch (error) {
    console.error("Error fetching suggestions by employee:", error);
    throw new Error("Failed to fetch suggestions by employee");
  }
}

// Creates a new suggestion in Firestore
export async function createSuggestion(
  suggestionData: CreateSuggestionData,
  createdBy: string,
): Promise<string> {
  try {
    const now = new Date().toISOString();

    const suggestionRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(suggestionRef, {
      ...suggestionData,
      status: "pending",
      source: "admin",
      createdBy,
      dateCreated: Timestamp.fromDate(new Date(now)),
      dateUpdated: Timestamp.fromDate(new Date(now)),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating suggestion:", error);
    throw new Error("Failed to create suggestion");
  }
}

// Updates an existing suggestion in Firestore
export async function updateSuggestion(
  suggestionId: string,
  updateData: UpdateSuggestionData,
): Promise<void> {
  try {
    const suggestionRef = doc(db, COLLECTION_NAME, suggestionId);
    const now = new Date().toISOString();

    const updateFields: Record<string, unknown> = {
      ...updateData,
      dateUpdated: Timestamp.fromDate(new Date(now)),
    };

    // If status is being set to completed, set dateCompleted
    if (updateData.status === "completed") {
      updateFields.dateCompleted = Timestamp.fromDate(new Date(now));
    }

    // Remove undefined values to avoid Firestore errors
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    await updateDoc(suggestionRef, updateFields);
  } catch (error) {
    console.error("Error updating suggestion:", error);
    throw new Error("Failed to update suggestion");
  }
}

/**
 * Update suggestion status with optimistic UI support
 */
export const updateSuggestionStatus = async (
  id: string,
  status: Suggestion["status"],
  notes?: string,
): Promise<StatusUpdateResult> => {
  try {
    const updateData = {
      status,
      dateUpdated: new Date().toISOString(),
    } as Record<string, unknown>;

    if (notes) {
      updateData.notes = notes;
    }

    // Set completion date if status is completed
    if (status === "completed") {
      updateData.dateCompleted = new Date().toISOString();
    }

    await updateSuggestion(id, updateData as UpdateSuggestionData);
    return { success: true };
  } catch (error) {
    console.error("Error updating suggestion status:", error);
    return { success: false, error: "Failed to update suggestion status" };
  }
};

// Deletes a suggestion from Firestore
export async function deleteSuggestion(suggestionId: string): Promise<void> {
  try {
    const suggestionRef = doc(db, COLLECTION_NAME, suggestionId);
    await deleteDoc(suggestionRef);
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    throw new Error("Failed to delete suggestion");
  }
}

// Retrieves suggestions filtered by status
export async function getSuggestionsByStatus(
  status: "pending" | "in_progress" | "completed" | "dismissed",
): Promise<Suggestion[]> {
  try {
    const suggestionsRef = collection(db, COLLECTION_NAME);
    const q = query(
      suggestionsRef,
      where("status", "==", status),
      orderBy("dateUpdated", "desc"),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      dateCreated:
        doc.data().dateCreated?.toDate?.()?.toISOString() ||
        doc.data().dateCreated,
      dateUpdated:
        doc.data().dateUpdated?.toDate?.()?.toISOString() ||
        doc.data().dateUpdated,
      dateCompleted:
        doc.data().dateCompleted?.toDate?.()?.toISOString() ||
        doc.data().dateCompleted,
    })) as Suggestion[];
  } catch (error) {
    console.error("Error fetching suggestions by status:", error);
    throw new Error("Failed to fetch suggestions by status");
  }
}

/**
 * Get suggestions with employee data for display
 */
export const getSuggestionsWithEmployees = async (): Promise<
  SuggestionWithEmployee[]
> => {
  try {
    const suggestions = await getSuggestions();
    const suggestionsWithEmployees: SuggestionWithEmployee[] = [];

    for (const suggestion of suggestions) {
      const employee = await getEmployeeById(suggestion.employeeId);
      if (employee) {
        suggestionsWithEmployees.push({
          ...suggestion,
          employee: {
            name: employee.name,
            department: employee.department,
            riskLevel: employee.riskLevel,
          },
        });
      }
    }

    return suggestionsWithEmployees;
  } catch (error) {
    console.error("Error fetching suggestions with employees:", error);
    throw new Error("Failed to fetch suggestions with employee data");
  }
};
