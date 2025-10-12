import { api } from "./config";

// Types
export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  method: string;
  note?: string;
}

/**
 * Get all payments in the system
 * @returns Promise containing list of all payments
 */
export async function getAllPayments() {
  return api.get("/v1/payments");
}

/**
 * Get specific payment by ID
 * @param id - Payment ID to retrieve
 * @returns Promise containing payment data
 */
export async function getPaymentById(id: string) {
  return api.get(`/v1/payments/${id}`);
}

/**
 * Create a new payment
 * @param paymentData - Payment information to create
 * @returns Promise containing created payment data
 */
export async function createPayment(paymentData: CreatePaymentRequest) {
  return api.post("/v1/payments", paymentData);
}

/**
 * Get available payment methods
 * @returns Promise containing list of payment methods
 */
export async function getPaymentMethods() {
  return api.get("/v1/payments/methods");
}
