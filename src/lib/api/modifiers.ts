import { api } from "./config";

// Types
export interface CreateModifierRequest {
  name: string;
  price?: number;
}

export interface UpdateModifierRequest {
  name?: string;
  price?: number;
}

/**
 * Get all modifiers in the system
 * @returns Promise containing list of all modifiers
 */
export async function getAllModifiers() {
  return api.get("/v1/modifiers");
}

/**
 * Get specific modifier by ID
 * @param id - Modifier ID to retrieve
 * @returns Promise containing modifier data
 */
export async function getModifierById(id: string) {
  return api.get(`/v1/modifiers/${id}`);
}

/**
 * Create a new modifier
 * @param modifierData - Modifier information to create
 * @returns Promise containing created modifier data
 */
export async function createModifier(modifierData: CreateModifierRequest) {
  return api.post("/v1/modifiers", modifierData);
}

/**
 * Update existing modifier by ID
 * @param id - Modifier ID to update
 * @param modifierData - Updated modifier information
 * @returns Promise containing updated modifier data
 */
export async function updateModifier(
  id: string,
  modifierData: UpdateModifierRequest
) {
  return api.put(`/v1/modifiers/${id}`, modifierData);
}

/**
 * Delete modifier by ID
 * @param id - Modifier ID to delete
 * @returns Promise containing deletion response
 */
export async function deleteModifier(id: string) {
  return api.delete(`/v1/modifiers/${id}`);
}
