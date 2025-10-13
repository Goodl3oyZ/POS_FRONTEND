"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Order } from "@/lib/data";
import { calculateItemTotal } from "@/lib/utils";

interface OrderStatusProps {
  order: Order & {
    items: (Order["items"][number] & {
      options?: Record<string, string>;
      extras?: string[];
    })[];
  };
}

const statusConfig = {
  Preparing: {
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800",
  },
  Done: {
    variant: "secondary" as const,
    className: "bg-green-100 text-green-800",
  },
  Cancelled: {
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800",
  },
};
export function OrderStatus({ order }: OrderStatusProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="space-y-1">
          <h3 className="font-semibold">{order.id}</h3>
          <p className="text-sm text-gray-500">
            Table {order.tableId} ·{" "}
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <Badge
          variant={statusConfig[order.status].variant}
          className={statusConfig[order.status].className}
        >
          {order.status}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="border rounded p-2">
              <div className="flex justify-between">
                <p className="font-medium">
                  {item.quantity}x {item.menuItem.name}
                </p>
                <p className="text-gray-600">฿{calculateItemTotal(item)}</p>
              </div>
              {item.selectedOptions && (
                <p className="text-sm text-gray-600 mt-1">
                  Options:{" "}
                  {Object.entries(item.selectedOptions)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")}
                </p>
              )}
              {item.selectedExtras && item.selectedExtras.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Extras: {item.selectedExtras.map((e) => e.label).join(", ")}
                </p>
              )}
            </div>
          ))}
          <div className="border-t mt-3 pt-3 flex justify-between font-medium">
            <span>Total</span>
            <span>฿{order.total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
