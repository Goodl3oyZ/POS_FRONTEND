import { api } from "./config";

/**
 * Get all roles in the system
 * @returns Promise containing list of all roles
 */
export async function getAllRoles() {
  return api.get("/v1/roles");
}

/**
 * Get specific role by ID
 * @param id - Role ID to retrieve
 * @returns Promise containing role data
 */
export async function getRoleById(id: string) {
  return api.get(`/v1/roles/${id}`);
}
