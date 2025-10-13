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
import { Table } from "@/lib/data"; // import interface Table

interface TableCardProps {
  table: Table; // ใช้ interface Table ที่มี currentOrder
  onClick?: () => void;
  selected?: boolean;
}

export const statusConfig = {
  Available: {
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-300",
    icon: Circle,
    label: "Available",
  },
  Occupied: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-300",
    icon: UtensilsCrossed,
    label: "Occupied",
  },
  Billing: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
    icon: Receipt,
    label: "Billing",
  },
  Paid: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-300",
    icon: CheckCircle2,
    label: "Paid",
  },
} as const;

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

          {/* แสดง current order summary ถ้ามี */}
          {table.currentOrder ? (
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {table.currentOrder.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              )}{" "}
              items • {formatPrice(table.currentOrder.total)}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{table.capacity}</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <span className="font-medium">Select Table</span>
        </div>
      </CardContent>
    </Card>
  );
}
