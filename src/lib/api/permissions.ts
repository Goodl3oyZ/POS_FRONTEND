import { api } from "./config";

/**
 * Get all permissions in the system
 * @returns Promise containing list of all permissions
 */
export async function getAllPermissions() {
  return api.get("/v1/permissions");
}
