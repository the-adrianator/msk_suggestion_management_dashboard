import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Employee } from "@/types";

const COLLECTION_NAME = "employees";

// Retrieves all employees from Firestore, sorted by name
export async function getEmployees(): Promise<Employee[]> {
  try {
    const employeesRef = collection(db, COLLECTION_NAME);
    const q = query(employeesRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Employee[];
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Failed to fetch employees");
  }
}

// Retrieves a single employee by their ID
export async function getEmployeeById(
  employeeId: string,
): Promise<Employee | null> {
  try {
    const employeeRef = doc(db, COLLECTION_NAME, employeeId);
    const employeeSnap = await getDoc(employeeRef);

    if (employeeSnap.exists()) {
      return {
        id: employeeSnap.id,
        ...employeeSnap.data(),
      } as Employee;
    }

    return null;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw new Error("Failed to fetch employee");
  }
}

// Retrieves employees filtered by department
// Might use in future iterations
// export async function getEmployeesByDepartment(
//   department: string,
// ): Promise<Employee[]> {
//   try {
//     const employeesRef = collection(db, COLLECTION_NAME);
//     const q = query(
//       employeesRef,
//       where("department", "==", department),
//       orderBy("name", "asc"),
//     );
//     const querySnapshot = await getDocs(q);

//     return querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as Employee[];
//   } catch (error) {
//     console.error("Error fetching employees by department:", error);
//     throw new Error("Failed to fetch employees by department");
//   }
// }

// Retrieves employees filtered by risk level
// Might be useful in future iterations
// export async function getEmployeesByRiskLevel(
//   riskLevel: "high" | "medium" | "low",
// ): Promise<Employee[]> {
//   try {
//     const employeesRef = collection(db, COLLECTION_NAME);
//     const q = query(
//       employeesRef,
//       where("riskLevel", "==", riskLevel),
//       orderBy("name", "asc"),
//     );
//     const querySnapshot = await getDocs(q);

//     return querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as Employee[];
//   } catch (error) {
//     console.error("Error fetching employees by risk level:", error);
//     throw new Error("Failed to fetch employees by risk level");
//   }
// }
