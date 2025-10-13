"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { calculateItemTotal } from "@/lib/utils";

interface OrderStatusProps {
  order: any;
}

// ✅ กำหนด config สำหรับสถานะให้ครอบคลุม status จริงจาก backend ด้วย
const statusConfig: Record<
  string,
  { variant: "secondary" | "destructive" | "default"; className: string }
> = {
  open: {
    variant: "secondary",
    className: "bg-yellow-100 text-yellow-800",
  },
  preparing: {
    variant: "secondary",
    className: "bg-yellow-100 text-yellow-800",
  },
  done: {
    variant: "default",
    className: "bg-green-100 text-green-800",
  },
  closed: {
    variant: "default",
    className: "bg-green-100 text-green-800",
  },
  cancelled: {
    variant: "destructive",
    className: "bg-red-100 text-red-800",
  },
  void: {
    variant: "destructive",
    className: "bg-red-100 text-red-800",
  },
};

// ✅ helper แปลง snake_case → camelCase
function normalizeOrder(order: any) {
  return {
    id: order.id,
    tableId: order.table_id,
    tableName: order.table_name,
    status: (order.status || "").toLowerCase(),
    total: order.total_baht ?? order.total ?? 0,
    createdAt: order.created_at,
    items: (order.items || []).map((i: any) => ({
      id: i.id,
      quantity: i.quantity,
      menuItem: {
        name: i.menu_item_name ?? "Unnamed Item",
        price: i.unit_price_baht ?? 0,
      },
      selectedOptions: i.options ?? {},
      selectedExtras: i.modifiers ?? [],
    })),
  };
}

export function OrderStatus({ order }: OrderStatusProps) {
  const normalized = normalizeOrder(order);
  const statusKey =
    normalized.status in statusConfig ? normalized.status : "open";
  const statusStyle = statusConfig[statusKey];

  let displayTime = "N/A";
  try {
    const date = new Date(normalized.createdAt || Date.now());
    if (!isNaN(date.getTime())) {
      displayTime = formatDistanceToNow(date, { addSuffix: true });
    }
  } catch {
    displayTime = "N/A";
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="space-y-1">
          <h3 className="font-semibold">Order #{normalized.id}</h3>
          <p className="text-sm text-gray-500">
            Table {normalized.tableName || normalized.tableId || "-"} ·{" "}
            {displayTime}
          </p>
        </div>
        <Badge variant={statusStyle.variant} className={statusStyle.className}>
          {normalized.status.charAt(0).toUpperCase() +
            normalized.status.slice(1)}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {normalized.items.length === 0 && (
            <p className="text-gray-500 text-sm">No items in this order.</p>
          )}

          {normalized.items.map((item: any, index: any) => (
            <div key={index} className="border rounded p-2">
              <div className="flex justify-between">
                <p className="font-medium">
                  {item.quantity}x {item.menuItem.name}
                </p>
                <p className="text-gray-600">
                  ฿{calculateItemTotal(item).toFixed(2)}
                </p>
              </div>

              {item.selectedOptions &&
                Object.keys(item.selectedOptions).length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Options:{" "}
                    {Object.entries(item.selectedOptions)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </p>
                )}

              {item.selectedExtras && item.selectedExtras.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Extras:{" "}
                  {item.selectedExtras
                    .map((e: any) => e.label || e.name || "Modifier")
                    .join(", ")}
                </p>
              )}
            </div>
          ))}

          <div className="border-t mt-3 pt-3 flex justify-between font-medium">
            <span>Total</span>
            <span>฿{normalized.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
