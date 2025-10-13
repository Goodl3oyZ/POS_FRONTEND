"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Order, OrderItem } from "@/lib/data";
import { calculateItemTotal } from "@/lib/utils";

interface OrderDetailDialogProps {
  order: Order & {
    items: (OrderItem & {
      options?: Record<string, string>;
      extras?: string[];
    })[];
  };
  open: boolean;
  onOpenChange: (order: Order | null) => void; // ใช้ Order | null
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
}
export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
}: OrderDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Order #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            <strong>Table:</strong> {order.tableId}
          </p>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="border rounded p-2">
                <p className="font-medium">
                  {item.menuItem.name} x{item.quantity}
                </p>
                {item.selectedOptions && (
                  <p className="text-sm text-gray-600">
                    Options:{" "}
                    {Object.entries(item.selectedOptions)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </p>
                )}
                {item.selectedExtras && item.selectedExtras.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Extras: {item.selectedExtras.map((e) => e.label).join(", ")}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Price: ฿{calculateItemTotal(item)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onUpdateStatus(order.id, "Preparing")}
          >
            Preparing
          </Button>
          <Button
            variant="secondary"
            onClick={() => onUpdateStatus(order.id, "Done")}
          >
            Done
          </Button>
          <Button
            variant="destructive"
            onClick={() => onUpdateStatus(order.id, "Cancelled")}
          >
            Cancelled
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
