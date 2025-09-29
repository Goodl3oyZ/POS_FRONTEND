"use client";

import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Circle, UtensilsCrossed, Receipt, CheckCircle2 } from "lucide-react";

interface TableCardProps {
  table: {
    id: string;
    zone: string;
    status: "Available" | "Occupied" | "Billing" | "Paid";
    capacity: number;
  };
  onClick?: () => void;
  selected?: boolean;
}

export const statusConfig = {
  Available: {
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-300",
    icon: Circle, // วงกลมเปล่า
    label: "Available",
  },
  Occupied: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-300",
    icon: UtensilsCrossed, // 🍽️
    label: "Occupied",
  },
  Billing: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
    icon: Receipt, // ใบเสร็จ 💵
    label: "Billing",
  },
  Paid: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-300",
    icon: CheckCircle2, // วงกลมมีติ๊ก ✅
    label: "Paid",
  },
} as const;

import { Users } from "lucide-react";

export function TableCard({ table, onClick, selected }: TableCardProps) {
  const status = statusConfig[table.status];

  return (
    <Card
      onClick={onClick}
      className={`group relative overflow-hidden hover:scale-105 transition-all cursor-pointer shadow-md
        ${status.bgColor} border-0 
        ${selected ? "ring-2 ring-blue-500" : ""}`}
    >
      <CardContent className="p-4 flex flex-col items-center justify-between min-h-[140px]">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-semibold tracking-tight">
            {table.id}
          </span>
          <Badge
            variant="secondary"
            className={`${status.textColor} ${status.bgColor} transition-colors flex items-center gap-1`}
          >
            {status.icon && <status.icon className="w-4 h-4" />} {status.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{table.capacity}</span>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <span className="font-medium">Select Table</span>
        </div>
      </CardContent>
    </Card>
  );
}
