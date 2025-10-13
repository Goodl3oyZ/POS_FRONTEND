import { api } from "./config";

// Types
export interface UpdateTableStatusRequest {
  status: string;
}

export interface TableWithOpenOrders {
  id: string;
  name: string;
  status: string; // e.g. "occupied"
  qr_code?: string;
  orders: Array<{
    id: string;
    table_id: string;
    table_name?: string;
    source?: string;
    status: string; // "open" | ...
    subtotal_baht: number;
    discount_baht: number;
    total_baht: number;
    note?: string;
    created_at?: string;
    closed_at?: string | null;
    items?: Array<{
      id: string;
      menu_item_id: string;
      menu_item_name: string;
      quantity: number;
      unit_price_baht: number;
      line_total_baht: number;
      note?: string;
      modifiers?: any[];
    }> | null;
  }>;
}

/**
 * Get all tables in the system
 * @returns Promise containing list of all tables
 */
export async function getAllTables() {
  return api.get("/v1/tables");
}

/**
 * Get specific table by ID
 * @param id - Table ID to retrieve
 * @returns Promise containing table data
 */
export async function getTableById(id: string) {
  return api.get(`/v1/tables/${id}`);
}

/**
 * Update table status
 * @param id - Table ID to update status
 * @param statusData - New status information
 * @returns Promise containing updated table data
 */

// อัปเดตสถานะโต๊ะ เช่น AVAILABLE / BILLING / PAID
export async function updateTableStatus(tableId: string, status: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`PUT /v1/tables/${tableId}/status payload:`, { status });
  }
  return api.put(`/v1/tables/${tableId}/status`, { status });
}
/** Get all tables with open orders */
export async function getTablesWithOpenOrders() {
  // GET /v1/tables/with-open-orders
  return api.get<{ data: TableWithOpenOrders[] }>(
    "/v1/tables/with-open-orders"
  );
}
