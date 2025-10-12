import { api } from "./config";

// Types
export interface CreateMenuItemRequest {
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  modifiers?: string[];
}

export interface UpdateMenuItemRequest {
  name?: string;
  price?: number;
  description?: string;
  modifiers?: string[];
}

/**
 * Get all menu items in the system
 * @returns Promise containing list of all menu items
 */
export async function getAllMenuItems() {
  return api.get("/v1/menu-items");
}

/**
 * Get all menu item modifiers
 * @returns Promise containing list of all modifiers
 */
export async function getMenuItemsModifiers() {
  return api.get("/v1/menu-items/modifiers");
}

/**
 * Get specific menu item by ID
 * @param id - Menu item ID to retrieve
 * @returns Promise containing menu item data
 */
export async function getMenuItemById(id: string) {
  return api.get(`/v1/menu-items/${id}`);
}

/**
 * Create a new menu item
 * @param menuItemData - Menu item information to create
 * @returns Promise containing created menu item data
 */
export async function createMenuItem(menuItemData: CreateMenuItemRequest) {
  return api.post("/v1/menu-items", menuItemData);
}

/**
 * Update existing menu item by ID
 * @param id - Menu item ID to update
 * @param menuItemData - Updated menu item information
 * @returns Promise containing updated menu item data
 */
export async function updateMenuItem(
  id: string,
  menuItemData: UpdateMenuItemRequest
) {
  return api.put(`/v1/menu-items/${id}`, menuItemData);
}

/**
 * Delete menu item by ID
 * @param id - Menu item ID to delete
 * @returns Promise containing deletion response
 */
export async function deleteMenuItem(id: string) {
  return api.delete(`/v1/menu-items/${id}`);
}
