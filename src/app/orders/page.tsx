"use client";

import { useState } from "react";
import { OrderStatus } from "@/components/OrderStatus";
import { OrderDetailDialog } from "@/components/OrderDetailDialog";
import type { Order } from "@/lib/data";
import { orders as initialOrders } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const ordersByStatus: Record<
    "All" | "Preparing" | "Done" | "Cancelled",
    Order[]
  > = {
    All: orders,
    Preparing: orders.filter((order) => order.status === "Preparing"),
    Done: orders.filter((order) => order.status === "Done"),
    Cancelled: orders.filter((order) => order.status === "Cancelled"),
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Orders</h2>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList>
          {Object.keys(ordersByStatus).map((status) => (
            <TabsTrigger key={status} value={status} className="min-w-[100px]">
              {status}{" "}
              <span className="ml-1 text-xs">
                ({ordersByStatus[status as keyof typeof ordersByStatus].length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(ordersByStatus).map(([status, statusOrders]) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {statusOrders.length === 0 ? (
                <p className="text-muted-foreground">No orders found.</p>
              ) : (
                statusOrders.map((order) => (
                  <div key={order.id} onClick={() => setSelectedOrder(order)}>
                    <OrderStatus order={order} />
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={setSelectedOrder}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
}
