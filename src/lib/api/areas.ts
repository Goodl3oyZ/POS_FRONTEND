import { api } from "./config";

// Types
export interface CreateAreaRequest {
  name: string;
  description?: string;
}

export interface UpdateAreaRequest {
  name?: string;
  description?: string;
}

/**
 * Get all areas in the system
 * @returns Promise containing list of all areas
 */
export async function getAllAreas() {
  return api.get("/v1/areas");
}

/**
 * Get specific area by ID
 * @param id - Area ID to retrieve
 * @returns Promise containing area data
 */
export async function getAreaById(id: string) {
  return api.get(`/v1/areas/${id}`);
}

/**
 * Create a new area
 * @param areaData - Area information to create
 * @returns Promise containing created area data
 */
export async function createArea(areaData: CreateAreaRequest) {
  return api.post("/v1/areas", areaData);
}

/**
 * Update existing area by ID
 * @param id - Area ID to update
 * @param areaData - Updated area information
 * @returns Promise containing updated area data
 */
export async function updateArea(id: string, areaData: UpdateAreaRequest) {
  return api.put(`/v1/areas/${id}`, areaData);
}

/**
 * Delete area by ID
 * @param id - Area ID to delete
 * @returns Promise containing deletion response
 */
export async function deleteArea(id: string) {
  return api.delete(`/v1/areas/${id}`);
}
