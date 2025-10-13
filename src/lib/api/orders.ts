// lib/api/orders.ts
import { api } from "./config";

/* ========= Types ========= */

// FE (camel)
export interface OrderItemCamel {
  menuItemId: string;
  quantity: number;
  modifiers?: string[]; // ids
  note?: string;
}
export interface CreateOrderCamel {
  tableId: string;
  source?: string;
  note?: string;
  items?: OrderItemCamel[]; // not recommended, but supported
}

// BE (snake)
export interface OrderItemSnake {
  menu_item_id: string | number;
  quantity: number;
  modifier_ids?: string[];
  note?: string;
}
export interface CreateOrderSnake {
  table_id: string | number;
  source?: string;
  note?: string;
  items?: OrderItemSnake[];
}

/* ========= Helpers ========= */

function toSnakeItem(i: OrderItemCamel | OrderItemSnake | any): OrderItemSnake {
  // already snake?
  if (i && typeof i === "object" && "menu_item_id" in i) {
    return {
      menu_item_id: String(i.menu_item_id),
      quantity: Number(i.quantity ?? 1),
      modifier_ids: Array.isArray(i.modifier_ids) ? i.modifier_ids : [],
      note: typeof i.note === "string" ? i.note : undefined,
    };
  }
  // camel -> snake
  return {
    menu_item_id: String(i.menuItemId ?? i.id ?? ""),
    quantity: Number(i.quantity ?? 1),
    modifier_ids: Array.isArray(i.modifiers) ? i.modifiers : [],
    note: typeof i.note === "string" ? i.note : undefined,
  };
}

function toSnakeCreateOrder(
  data: CreateOrderCamel | CreateOrderSnake | any
): CreateOrderSnake {
  if (data && "table_id" in data) {
    return {
      table_id: (data as any).table_id,
      source: (data as any).source,
      note: (data as any).note,
      items: Array.isArray((data as any).items)
        ? (data as any).items.map(toSnakeItem)
        : undefined,
    };
  }
  return {
    table_id: (data as any).tableId,
    source: (data as any).source,
    note: (data as any).note,
    items: Array.isArray((data as any).items)
      ? (data as any).items.map(toSnakeItem)
      : undefined,
  };
}

/* ========= Orders API ========= */

export async function getAllOrders() {
  return api.get("/v1/orders");
}
export async function getOpenOrders() {
  return api.get("/v1/orders/open");
}
export async function getOrderById(id: string) {
  return api.get(`/v1/orders/${id}`);
}

/**
 * POST /v1/orders
 * ตัวอย่างที่ถูกต้อง:
 * {
 *   "table_id": "a5d9553a-812c-4b28-92ea-df9c9d49146f",
 *   "source": "customer",
 *   "note": "Customer requested window seat"
 * }
 */
export async function createOrder(
  data: CreateOrderCamel | CreateOrderSnake | any
) {
  const payload = toSnakeCreateOrder(data);
  if (process.env.NODE_ENV !== "production") {
    console.log("POST /v1/orders payload:", payload);
  }
  return api.post("/v1/orders", payload);
}

/**
 * POST /v1/orders/:id/items
 * รองรับ 3 รูปแบบ:
 * 1) ออบเจ็กต์เดี่ยว    -> addItemsToOrder(id, { menuItemId, quantity, ... })
 * 2) อาร์เรย์ของออบเจ็กต์ -> addItemsToOrder(id, [{...},{...}])
 * 3) ห่อเป็น { items: [...] } -> addItemsToOrder(id, { items: [...] })
 *
 * รูปแบบที่ backend ต้องการต่อ 1 รายการ:
 * {
 *   "menu_item_id": "4a5e5279-fb7a-4424-9fd9-0775ee9340e4",
 *   "quantity": 2,
 *   "note": "Extra hot, less sugar",
 *   "modifier_ids": ["332c3b94-...", "e8f5bdec-..."]
 * }
 */
export async function addItemsToOrder(
  orderId: string,
  data:
    | OrderItemCamel
    | OrderItemSnake
    | Array<OrderItemCamel | OrderItemSnake>
    | { items: Array<OrderItemCamel | OrderItemSnake> }
) {
  let payload: any;

  // แบบ { items: [...] }
  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as any).items)
  ) {
    payload = { items: (data as any).items.map(toSnakeItem) };
  }
  // แบบอาร์เรย์ล้วน
  else if (Array.isArray(data)) {
    payload = { items: data.map(toSnakeItem) };
  }
  // ออบเจ็กต์เดี่ยว
  else {
    payload = toSnakeItem(data as any);
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`POST /v1/orders/${orderId}/items payload:`, payload);
  }
  return api.post(`/v1/orders/${orderId}/items`, payload);
}

export async function removeItemFromOrder(orderId: string, itemId: string) {
  return api.delete(`/v1/orders/${orderId}/items/${itemId}`);
}
export async function updateOrderItemQuantity(
  orderId: string,
  itemId: string,
  quantityData: { quantity: number }
) {
  return api.put(
    `/v1/orders/${orderId}/items/${itemId}/quantity`,
    quantityData
  );
}
export async function closeOrder(orderId: string) {
  return api.put(`/v1/orders/${orderId}/close`);
}
export async function voidOrder(orderId: string) {
  return api.put(`/v1/orders/${orderId}/void`);
}
