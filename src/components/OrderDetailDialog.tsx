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
import { formatPrice } from "@/lib/utils";

// API Response Types (matching orders/page.tsx)
type OrderItem = {
  id: string;
  menu_item_name: string;
  quantity: number;
  unit_price_baht?: number;
  line_total_baht?: number;
  note?: string;
};

type Order = {
  id: string;
  table_id?: string;
  table_name?: string;
  source?: string;
  status?: string;
  subtotal_baht?: number;
  discount_baht?: number;
  total_baht?: number;
  note?: string;
  created_at?: string;
  closed_at?: string | null;
  items?: OrderItem[];
};

interface OrderDetailDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (order: Order | null) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Table:</strong> {order.table_name || "-"}
            </div>
            <div>
              <strong>Status:</strong> {order.status || "-"}
            </div>
            <div>
              <strong>Source:</strong> {order.source || "-"}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString("th-TH")
                : "-"}
            </div>
          </div>

          {order.note && (
            <div>
              <strong>Note:</strong> {order.note}
            </div>
          )}

          <div className="space-y-2">
            <strong>Items:</strong>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={item.id || index} className="border rounded p-2">
                  <p className="font-medium">
                    {item.menu_item_name} × {item.quantity}
                  </p>
                  {item.note && (
                    <p className="text-sm text-gray-600">Note: {item.note}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    Price: {formatPrice(Number(item.line_total_baht || 0))}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items</p>
            )}
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatPrice(Number(order.subtotal_baht || 0))}</span>
            </div>
            {order.discount_baht && order.discount_baht > 0 && (
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>-{formatPrice(Number(order.discount_baht))}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatPrice(Number(order.total_baht || 0))}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onUpdateStatus(order.id, "preparing")}
          >
            Preparing
          </Button>
          <Button
            variant="secondary"
            onClick={() => onUpdateStatus(order.id, "paid")}
          >
            Mark as Paid
          </Button>
          <Button
            variant="destructive"
            onClick={() => onUpdateStatus(order.id, "void")}
          >
            Void Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
