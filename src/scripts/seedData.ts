import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import expandedSampleData from "../../expanded_sample_data.json";

// Adds suggestions to Firestore, mapping sample employee IDs to actual Firestore IDs
async function addSuggestions(
  employeeIdMap: Map<string, string>,
): Promise<void> {
  for (const suggestion of expandedSampleData.suggestions) {
    // Resolve employee ID from sample data to Firestore document ID
    const newEmployeeId = employeeIdMap.get(suggestion.employeeId);
    if (!newEmployeeId) {
      console.warn(
        `Employee ID ${suggestion.employeeId} not found, skipping suggestion`,
      );
      continue;
    }

    // Build the document data, only including fields that have values
    const suggestionData: Record<string, unknown> = {
      employeeId: newEmployeeId,
      type: suggestion.type,
      description: suggestion.description,
      status: suggestion.status,
      priority: suggestion.priority,
      source: suggestion.source,
      createdBy: suggestion.createdBy || "vida-system@company.com",
      dateCreated: Timestamp.fromDate(new Date(suggestion.dateCreated)),
      dateUpdated: Timestamp.fromDate(new Date(suggestion.dateUpdated)),
    };

    // Only add optional fields if they have values
    if (suggestion.dateCompleted) {
      suggestionData.dateCompleted = Timestamp.fromDate(
        new Date(suggestion.dateCompleted),
      );
    }
    if (suggestion.notes) {
      suggestionData.notes = suggestion.notes;
    }
    if (suggestion.estimatedCost) {
      suggestionData.estimatedCost = suggestion.estimatedCost;
    }

    const docRef = await addDoc(collection(db, "suggestions"), suggestionData);

    console.log(
      `Added suggestion: ${suggestion.description.substring(0, 50)}... (ID: ${docRef.id})`,
    );
  }
}

// Seeds Firestore with sample employees and suggestions; handles existing data gracefully
export async function seedFirestoreData(): Promise<void> {
  try {
    console.log("Starting to seed Firestore with expanded sample data...");

    // Check whether employees already exist to avoid duplicates
    const existingEmployees = await getDocs(collection(db, "employees"));
    if (existingEmployees.docs.length > 0) {
      console.log(
        "Employees already exist in Firestore. Skipping employee creation.",
      );
      console.log(`Found ${existingEmployees.docs.length} existing employees.`);

      // Create mapping from existing employees
      const employeeIdMap = new Map<string, string>();

      existingEmployees.docs.forEach(doc => {
        const employeeData = doc.data();
        // Try to match by name for existing employees
        const matchingEmployee = expandedSampleData.employees.find(
          emp => emp.name === employeeData.name,
        );
        if (matchingEmployee) {
          employeeIdMap.set(matchingEmployee.id, doc.id);
        }
      });

      // Add any missing employees
      for (const employee of expandedSampleData.employees) {
        if (!employeeIdMap.has(employee.id)) {
          const docRef = await addDoc(collection(db, "employees"), {
            name: employee.name,
            department: employee.department,
            riskLevel: employee.riskLevel,
            jobTitle: employee.jobTitle,
            workstation: employee.workstation,
            lastAssessment: employee.lastAssessment,
          });
          employeeIdMap.set(employee.id, docRef.id);
          console.log(
            `Added missing employee: ${employee.name} (ID: ${docRef.id})`,
          );
        }
      }

      // Continue with suggestions using existing employee mapping
      await addSuggestions(employeeIdMap);
      return;
    }

    // Add employees from expanded data (first time seeding)
    const employeeIds: string[] = [];
    for (const employee of expandedSampleData.employees) {
      const docRef = await addDoc(collection(db, "employees"), {
        name: employee.name,
        department: employee.department,
        riskLevel: employee.riskLevel,
        jobTitle: employee.jobTitle,
        workstation: employee.workstation,
        lastAssessment: employee.lastAssessment,
      });
      employeeIds.push(docRef.id);
      console.log(`Added employee: ${employee.name} (ID: ${docRef.id})`);
    }

    // Create a mapping from original employee IDs to new Firestore IDs
    const employeeIdMap = new Map<string, string>();
    expandedSampleData.employees.forEach((employee, index) => {
      employeeIdMap.set(employee.id, employeeIds[index]);
    });

    // Add suggestions
    await addSuggestions(employeeIdMap);

    console.log("Firestore data seeding completed successfully!");
    console.log(
      `Added ${expandedSampleData.employees.length} employees and ${expandedSampleData.suggestions.length} suggestions`,
    );
  } catch (error) {
    console.error("Error seeding Firestore data:", error);
    throw error;
  }
}

// Placeholder for clearing Firestore data; use Firebase console for manual deletion
// TODO: Implement proper batch deletion
export async function clearFirestoreData(): Promise<void> {
  try {
    console.log("Clearing Firestore data...");

    // Note: In a real application, I'd implement proper batch deletion
    // For now, this is just a placeholder
    console.log(
      "Data clearing not implemented - use Firebase console to clear data manually",
    );
  } catch (error) {
    console.error("Error clearing Firestore data:", error);
    throw error;
  }
}
