import { api } from "./config";

// Types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

/**
 * Get all categories in the system
 * @returns Promise containing list of all categories
 */
export async function getAllCategories() {
  return api.get("/v1/categories");
}

/**
 * Get specific category by ID
 * @param id - Category ID to retrieve
 * @returns Promise containing category data
 */
export async function getCategoryById(id: string) {
  return api.get(`/v1/categories/${id}`);
}

/**
 * Create a new category
 * @param categoryData - Category information to create
 * @returns Promise containing created category data
 */
export async function createCategory(categoryData: CreateCategoryRequest) {
  return api.post("/v1/categories", categoryData);
}

/**
 * Update existing category by ID
 * @param id - Category ID to update
 * @param categoryData - Updated category information
 * @returns Promise containing updated category data
 */
export async function updateCategory(
  id: string,
  categoryData: UpdateCategoryRequest
) {
  return api.put(`/v1/categories/${id}`, categoryData);
}

/**
 * Delete category by ID
 * @param id - Category ID to delete
 * @returns Promise containing deletion response
 */
export async function deleteCategory(id: string) {
  return api.delete(`/v1/categories/${id}`);
}
