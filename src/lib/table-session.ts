// lib/table-session.ts
// เก็บ/อ่าน session โต๊ะฝั่ง client (localStorage)

export type TableSession = {
  id: string;
  name?: string;
};

const KEY = "activeTable";

export function setActiveTable(table: TableSession) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(table));
  } catch {}
}

export function getActiveTable(): TableSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj && typeof obj.id === "string") return obj;
    return null;
  } catch {
    return null;
  }
}

export function clearActiveTable() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
