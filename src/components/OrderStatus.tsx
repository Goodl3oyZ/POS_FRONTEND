"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";

import { Order } from "@/lib/data";

interface OrderStatusProps {
  order: Order;
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
    <Card className="hover:shadow-md transition-shadow">
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
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="text-gray-600">
                ฿{item.price * item.quantity}
              </span>
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
