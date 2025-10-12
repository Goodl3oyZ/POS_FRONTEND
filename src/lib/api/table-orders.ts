import { api } from "./config";

/**
 * Get all orders for a specific table
 * @param tableId - Table ID to get orders for
 * @returns Promise containing list of table orders
 */
export async function getTableOrders(tableId: string) {
  return api.get(`/v1/tables/${tableId}/orders`);
}
