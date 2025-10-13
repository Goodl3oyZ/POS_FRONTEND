"use client";

import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Circle,
  UtensilsCrossed,
  Receipt,
  CheckCircle2,
  Users,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Table } from "@/lib/data";

interface TableCardProps {
  table: Table;
  onClick?: () => void;
  selected?: boolean;
}

// ✅ ใช้ lowercase key เพื่อ match กับ backend โดยตรง
export const statusConfig = {
  available: {
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-300",
    icon: Circle,
    label: "Available",
  },
  occupied: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-300",
    icon: UtensilsCrossed,
    label: "Occupied",
  },
  billing: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
    icon: Receipt,
    label: "Billing",
  },
  paid: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-300",
    icon: CheckCircle2,
    label: "Paid",
  },
} as const;

// ✅ fallback status ป้องกันไม่ให้ undefined
const defaultStatus = {
  bgColor: "bg-gray-50",
  textColor: "text-gray-500",
  borderColor: "border-gray-200",
  icon: Circle,
  label: "Unknown",
};

export function TableCard({ table, onClick, selected }: TableCardProps) {
  // ปรับชื่อสถานะเป็น lowercase เพื่อ match key
  const statusKey = (table.status || "available").toString().toLowerCase();
  const status =
    (statusConfig as Record<string, any>)[statusKey] || defaultStatus;

  // ปลอดภัยด้วย optional chaining
  const tableName =
    (table as any)?.name || (table as any)?.table_name || table.id || "Unknown";

  const capacity = table.capacity || 0;

  // คำนวณจำนวนรายการใน order
  const totalItems =
    table.currentOrder?.items?.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    ) ?? 0;

  const totalPrice = table.currentOrder?.total ?? 0;

  return (
    <Card
      onClick={onClick}
      className={`group relative overflow-hidden hover:scale-105 transition-all cursor-pointer shadow-md
        ${status.bgColor} border-0 
        ${selected ? "ring-2 ring-blue-500" : ""}`}
    >
      <CardContent className="p-4 flex flex-col items-center justify-between min-h-[140px]">
        <div className="flex flex-col items-center gap-1">
          {/* ชื่อโต๊ะ */}
          <span className="text-2xl font-semibold tracking-tight">
            {tableName}
          </span>

          {/* Badge แสดงสถานะ */}
          <Badge
            variant="secondary"
            className={`${status.textColor} ${status.bgColor} transition-colors flex items-center gap-1`}
          >
            {status.icon && <status.icon className="w-4 h-4" />} {status.label}
          </Badge>

          {/* ถ้ามี currentOrder ให้โชว์สรุป */}
          {table.currentOrder ? (
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {totalItems} items • {formatPrice(totalPrice)}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1 text-center italic">
              No current order
            </p>
          )}
        </div>

        {/* จำนวนที่นั่ง */}
        <div className="flex items-center gap-2 mt-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{capacity}</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <span className="font-medium">Select Table</span>
        </div>
      </CardContent>
    </Card>
  );
}
