"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderStatus } from "@/components/OrderStatus";
import { OrderDetailDialog } from "@/components/OrderDetailDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllOrders, getOpenOrders } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState({ all: true, open: true });
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      try {
        setLoading({ all: true, open: true });
        const [allRes, openRes] = await Promise.all([
          getAllOrders(),
          getOpenOrders(),
        ]);
        if (!isMounted) return;
        // Prefer backend-provided statuses; combine lists to ensure we have everything
        const all = Array.isArray(allRes.data) ? allRes.data : [];
        const open = Array.isArray(openRes.data) ? openRes.data : [];
        // Merge by id to include status from all
        const idToOrder = new Map<string, any>();
        [...all, ...open].forEach((o: any) => idToOrder.set(String(o.id), o));
        setOrders(Array.from(idToOrder.values()));
        setError(null);
      } catch (e) {
        console.error(e);
        // Fallback: unauthenticated or API failed → use localStorage recent
        try {
          const raw = localStorage.getItem("recentOrders");
          const recent = raw ? JSON.parse(raw) : [];
          if (Array.isArray(recent)) {
            setOrders(recent);
            setError(null);
          } else {
            setError("โหลดรายการออเดอร์ไม่สำเร็จ");
          }
        } catch {
          setError("โหลดรายการออเดอร์ไม่สำเร็จ");
        }
      } finally {
        if (isMounted) setLoading({ all: false, open: false });
      }
    };
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const ordersByStatus = useMemo(() => {
    const map: Record<string, any[]> = {};
    map["All"] = orders;
    orders.forEach((o) => {
      const status = o.status || "Unknown";
      if (!map[status]) map[status] = [];
      map[status].push(o);
    });
    return map;
  }, [orders]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        String(order.id) === String(orderId)
          ? { ...order, status: newStatus }
          : order
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
            {loading.all && status === "All" ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading orders...
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statusOrders.length === 0 ? (
                  <p className="text-muted-foreground">No orders found.</p>
                ) : (
                  statusOrders.map((order: any) => (
                    <div key={order.id} onClick={() => setSelectedOrder(order)}>
                      <OrderStatus order={order} />
                    </div>
                  ))
                )}
              </div>
            )}
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
