import { api } from "./config";

// Types
export interface UpdateTableStatusRequest {
  status: string;
}

/**
 * Get all tables in the system
 * @returns Promise containing list of all tables
 */
export async function getAllTables() {
  return api.get("/v1/tables");
}

/**
 * Get specific table by ID
 * @param id - Table ID to retrieve
 * @returns Promise containing table data
 */
export async function getTableById(id: string) {
  return api.get(`/v1/tables/${id}`);
}

/**
 * Update table status
 * @param id - Table ID to update status
 * @param statusData - New status information
 * @returns Promise containing updated table data
 */
export async function updateTableStatus(
  id: string,
  statusData: UpdateTableStatusRequest
) {
  return api.put(`/v1/tables/${id}/status`, statusData);
}
