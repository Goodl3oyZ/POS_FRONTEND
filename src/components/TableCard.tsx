// components/TableCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "Available" | "Occupied" | "Billing" | "Paid" | "Unknown";

export type UiTable = {
  id: string; // เก็บ UUID ไว้ใช้ภายใน (navigation/compare)
  zone: string;
  status: Status;
  capacity?: number;
  currentOrderTotalBaht?: number;
};

export function TableCard({
  table,
  selected,
  onClick,
  label, // NEW: ชื่อที่จะแสดงแทน UUID (เช่น "T2")
  subtitle, // NEW: ข้อความรอง (เช่น "Main Hall • 4 seats")
}: {
  table: UiTable;
  selected?: boolean;
  onClick?: () => void;
  label?: string;
  subtitle?: string;
}) {
  const statusColors: Record<Status, string> = {
    Available: "bg-gray-100 text-gray-800",
    Occupied: "bg-green-100 text-green-800",
    Billing: "bg-blue-100 text-blue-800",
    Paid: "bg-yellow-100 text-yellow-800",
    Unknown: "bg-gray-100 text-gray-800",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border p-4 text-left shadow-sm transition hover:shadow-md",
        selected && "ring-2 ring-blue-500"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          {/* แสดงชื่อโต๊ะแทน UUID */}
          <div className="text-base font-semibold">{label ?? table.id}</div>
          {subtitle ? (
            <div className="mt-0.5 text-xs text-muted-foreground">
              {subtitle}
            </div>
          ) : null}
        </div>
        <Badge className={cn("rounded-full", statusColors[table.status])}>
          {table.status}
        </Badge>
      </div>

      {typeof table.currentOrderTotalBaht === "number" ? (
        <div className="mt-3 text-sm text-muted-foreground">
          ยอดปัจจุบัน ~ ฿{table.currentOrderTotalBaht.toLocaleString("th-TH")}
        </div>
      ) : null}
    </button>
  );
}
