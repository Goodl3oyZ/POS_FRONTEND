import { api } from "./config";

/** ===== Server shapes (จาก API) ===== */
export interface RawMenuItem {
  id: string;
  name: string;
  sku?: string;
  price_baht: number;
  image_url?: string;
  description?: string;
  active?: boolean;
  category?: {
    id: string;
    name: string;
    display_order?: number;
  };
  modifiers?: string[];
}

/** ===== UI shapes (ใช้ในฝั่ง client/หน้าเว็บ) ===== */
export interface MenuItem {
  id: string;
  name: string;
  sku?: string;
  price: number; // <- mapped from price_baht
  image_url?: string;
  description?: string;
  active?: boolean;
  categoryId?: string;
  categoryName?: string; // Added for display
  modifiers?: string[];
}

/** ตัวช่วยแปลง Raw → UI */
export function mapRawToUI(m: RawMenuItem): MenuItem {
  return {
    id: String(m.id),
    name: m.name,
    sku: m.sku,
    price: Number(m.price_baht ?? 0),
    image_url: m.image_url,
    description: m.description,
    active: m.active ?? true,
    categoryId: m.category?.id,
    categoryName: m.category?.name,
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
  sku?: string;
  description?: string;
  modifiers?: string[];
  active?: boolean;
  image?: File; // Image file for upload
}

export interface UpdateMenuItemRequest {
  name?: string;
  price?: number; // UI field
  sku?: string;
  description?: string;
  modifiers?: string[];
  active?: boolean;
  image?: File; // Image file for upload (optional - omit to keep existing)
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

/** ===== Helper: Validate Image File ===== */
export function validateImage(file: File): string | null {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return "Only JPG, PNG, GIF, and WEBP images are allowed";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "Image must be less than 5MB";
  }

  return null;
}

/** ===== Mutations (create/update/delete) =====
 * - แปลง price (UI) → price_baht (API)
 * - โยน categoryId → category_id
 * - ใช้ multipart/form-data สำหรับ image upload
 */
export async function createMenuItem(menuItemData: CreateMenuItemRequest) {
  // Validate image if provided
  if (menuItemData.image) {
    const error = validateImage(menuItemData.image);
    if (error) {
      throw new Error(error);
    }
  }

  // Create FormData
  const formData = new FormData();
  formData.append("name", menuItemData.name);
  formData.append("price_baht", String(menuItemData.price ?? 0));
  formData.append("category_id", menuItemData.categoryId);

  if (menuItemData.sku) {
    formData.append("sku", menuItemData.sku);
  }

  if (menuItemData.description) {
    formData.append("description", menuItemData.description);
  }

  if (menuItemData.active !== undefined) {
    formData.append("active", String(menuItemData.active));
  }

  if (menuItemData.modifiers && menuItemData.modifiers.length > 0) {
    formData.append("modifiers", JSON.stringify(menuItemData.modifiers));
  }

  // Add image file if provided
  if (menuItemData.image) {
    formData.append("image", menuItemData.image);
  }

  const res = await api.post("/v1/menu-items", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data as RawMenuItem;
}

export async function updateMenuItem(
  id: string,
  menuItemData: UpdateMenuItemRequest
) {
  // Validate image if provided
  if (menuItemData.image) {
    const error = validateImage(menuItemData.image);
    if (error) {
      throw new Error(error);
    }
  }

  // Create FormData
  const formData = new FormData();

  if (typeof menuItemData.name !== "undefined") {
    formData.append("name", menuItemData.name);
  }

  if (typeof menuItemData.price !== "undefined") {
    formData.append("price_baht", String(menuItemData.price ?? 0));
  }

  if (typeof menuItemData.sku !== "undefined") {
    formData.append("sku", menuItemData.sku);
  }

  if (typeof menuItemData.description !== "undefined") {
    formData.append("description", menuItemData.description);
  }

  if (typeof menuItemData.active !== "undefined") {
    formData.append("active", String(menuItemData.active));
  }

  if (typeof menuItemData.modifiers !== "undefined") {
    formData.append("modifiers", JSON.stringify(menuItemData.modifiers ?? []));
  }

  // Add image file if provided (omit to keep existing image)
  if (menuItemData.image) {
    formData.append("image", menuItemData.image);
  }

  const res = await api.put(`/v1/menu-items/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
