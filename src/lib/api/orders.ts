import { api } from "./config";

// Types
export interface OrderItem {
  menuItemId: string;
  quantity: number;
  modifiers?: string[];
}

export interface CreateOrderRequest {
  tableId: string;
  items: OrderItem[];
}

export interface AddItemToOrderRequest {
  menuItemId: string;
  quantity: number;
  modifiers?: string[];
}

export interface UpdateQuantityRequest {
  quantity: number;
}

/**
 * Get all orders in the system
 * @returns Promise containing list of all orders
 */
export async function getAllOrders() {
  return api.get("/v1/orders");
}

/**
 * Get all open orders
 * @returns Promise containing list of open orders
 */
export async function getOpenOrders() {
  return api.get("/v1/orders/open");
}

/**
 * Get specific order by ID
 * @param id - Order ID to retrieve
 * @returns Promise containing order data
 */
export async function getOrderById(id: string) {
  return api.get(`/v1/orders/${id}`);
}

/**
 * Create a new order
 * @param orderData - Order information to create
 * @returns Promise containing created order data
 */
export async function createOrder(orderData: CreateOrderRequest) {
  return api.post("/v1/orders", orderData);
}

/**
 * Add items to an existing order
 * @param id - Order ID to add items to
 * @param itemsData - Items to add to the order
 * @returns Promise containing updated order data
 */
export async function addItemsToOrder(
  id: string,
  itemsData: AddItemToOrderRequest
) {
  return api.post(`/v1/orders/${id}/items`, itemsData);
}

/**
 * Remove item from an order
 * @param id - Order ID
 * @param itemId - Item ID to remove
 * @returns Promise containing updated order data
 */
export async function removeItemFromOrder(id: string, itemId: string) {
  return api.delete(`/v1/orders/${id}/items/${itemId}`);
}

/**
 * Update item quantity in an order
 * @param id - Order ID
 * @param itemId - Item ID to update quantity
 * @param quantityData - New quantity information
 * @returns Promise containing updated order data
 */
export async function updateOrderItemQuantity(
  id: string,
  itemId: string,
  quantityData: UpdateQuantityRequest
) {
  return api.put(`/v1/orders/${id}/items/${itemId}/quantity`, quantityData);
}

/**
 * Close an order
 * @param id - Order ID to close
 * @returns Promise containing closed order data
 */
export async function closeOrder(id: string) {
  return api.put(`/v1/orders/${id}/close`);
}

/**
 * Void an order
 * @param id - Order ID to void
 * @returns Promise containing voided order data
 */
export async function voidOrder(id: string) {
  return api.put(`/v1/orders/${id}/void`);
}
