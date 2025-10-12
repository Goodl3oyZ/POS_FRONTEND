import { api } from "./config";

/**
 * Get all payments for a specific order
 * @param orderId - Order ID to get payments for
 * @returns Promise containing list of order payments
 */
export async function getOrderPayments(orderId: string) {
  return api.get(`/v1/orders/${orderId}/payments`);
}
