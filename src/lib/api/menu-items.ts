import { api } from "./config";

/** ===== Server shapes (จาก API) ===== */
export interface RawMenuItem {
  id: string;
  name: string;
  price_baht: number;
  image_url?: string;
  description?: string;
  active?: boolean;
  category_id?: string;
  modifiers?: string[]; // หรือ object แล้วแต่ backend ของคุณ
}

/** ===== UI shapes (ใช้ในฝั่ง client/หน้าเว็บ) ===== */
export interface MenuItem {
  id: string;
  name: string;
  price: number; // <- mapped from price_baht
  image_url?: string;
  description?: string;
  active?: boolean;
  categoryId?: string;
  modifiers?: string[];
}

/** ตัวช่วยแปลง Raw → UI */
export function mapRawToUI(m: RawMenuItem): MenuItem {
  return {
    id: String(m.id),
    name: m.name,
    price: Number(m.price_baht ?? 0),
    image_url: m.image_url,
    description: m.description,
    active: m.active ?? true,
    categoryId: m.category_id,
    modifiers: m.modifiers ?? [],
  };
}

/** ====== Request types ที่ฝั่ง UI เรียกใช้ ======
 * ยังคงใช้ชื่อ field เป็น price (บาท) ให้เรียกง่าย
 * แล้วค่อยแปลงเป็น price_baht ตอนส่งเข้า API
 */
export interface CreateMenuItemRequest {
  name: string;
  price: number; // UI field
  categoryId: string;
  description?: string;
  modifiers?: string[];
}

export interface UpdateMenuItemRequest {
  name?: string;
  price?: number; // UI field
  description?: string;
  modifiers?: string[];
}

/** ===== Raw endpoints (คืนค่ารูปแบบของ server) =====
 * ถ้าบางจุดในระบบคุณอยากใช้ raw data ก็ยังใช้ได้
 */
export async function getAllMenuItemsRaw(): Promise<RawMenuItem[]> {
  const res = await api.get("/v1/menu-items");
  return res.data as RawMenuItem[];
}
export async function getMenuItemByIdRaw(id: string): Promise<RawMenuItem> {
  const res = await api.get(`/v1/menu-items/${id}`);
  return res.data as RawMenuItem;
}
export async function getMenuItemsModifiers() {
  const res = await api.get("/v1/menu-items/modifiers");
  return res.data;
}

/** ===== UI-friendly helpers (แนะนำให้หน้าเว็บเรียกอันนี้) =====
 * - แปลง price_baht → price ให้พร้อมใช้ใน UI
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  const raw = await getAllMenuItemsRaw();
  return (raw || []).filter(Boolean).map(mapRawToUI);
}
export async function getMenuItemById(id: string): Promise<MenuItem> {
  const raw = await getMenuItemByIdRaw(id);
  return mapRawToUI(raw);
}

/** ===== Mutations (create/update/delete) =====
 * - แปลง price (UI) → price_baht (API)
 * - โยน categoryId → category_id
 */
export async function createMenuItem(menuItemData: CreateMenuItemRequest) {
  const payload = {
    name: menuItemData.name,
    price_baht: Number(menuItemData.price ?? 0), // map -> server
    category_id: menuItemData.categoryId,
    description: menuItemData.description,
    modifiers: menuItemData.modifiers ?? [],
  };
  const res = await api.post("/v1/menu-items", payload);
  return res.data as RawMenuItem;
}

export async function updateMenuItem(
  id: string,
  menuItemData: UpdateMenuItemRequest
) {
  const payload: Record<string, any> = {};
  if (typeof menuItemData.name !== "undefined")
    payload.name = menuItemData.name;
  if (typeof menuItemData.price !== "undefined")
    payload.price_baht = Number(menuItemData.price ?? 0); // map -> server
  if (typeof menuItemData.description !== "undefined")
    payload.description = menuItemData.description;
  if (typeof menuItemData.modifiers !== "undefined")
    payload.modifiers = menuItemData.modifiers ?? [];

  const res = await api.put(`/v1/menu-items/${id}`, payload);
  return res.data as RawMenuItem;
}

export async function deleteMenuItem(id: string) {
  const res = await api.delete(`/v1/menu-items/${id}`);
  return res.data;
}

/** ===== คำแนะนำการใช้งานในหน้า Menu =====
 * import { getMenuItems } from "@/lib/menu-items";
 * const items = await getMenuItems(); // ได้ { id, name, price, image_url, ... } พร้อมใช้กับ Add to Cart
 */
