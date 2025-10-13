"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderDetailDialog } from "@/components/OrderDetailDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllOrders, getOpenOrders } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type OrderItem = {
  id: string; // ใช้เป็น key ภายในเท่านั้น
  menu_item_name: string;
  quantity: number;
  unit_price_baht?: number;
  line_total_baht?: number;
  note?: string;
};

type Order = {
  id: string; // ใช้เป็น key/เรียก API เท่านั้น ไม่โชว์
  table_id?: string; // ไม่โชว์
  table_name?: string; // โชว์ เช่น "T2"
  source?: string; // customer/staff
  status?: string; // open/paid/void/...
  subtotal_baht?: number;
  discount_baht?: number;
  total_baht?: number;
  note?: string;
  created_at?: string;
  closed_at?: string | null;
  items?: OrderItem[];
};

function normalizeStatusLabel(raw?: string) {
  const s = (raw || "").toLowerCase();
  if (s === "open") return "Open";
  if (s === "paid" || s === "closed") return "Paid";
  if (s === "void") return "Void";
  return "Unknown";
}
function badgeClass(label: string) {
  if (label === "Open") return "bg-blue-100 text-blue-800";
  if (label === "Paid") return "bg-emerald-100 text-emerald-800";
  if (label === "Void") return "bg-rose-100 text-rose-800";
  return "bg-gray-100 text-gray-800";
}
function thaiDateTime(iso?: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "-";
  }
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState({ all: true, open: true });
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        const all = Array.isArray(allRes.data) ? (allRes.data as Order[]) : [];
        const open = Array.isArray(openRes.data)
          ? (openRes.data as Order[])
          : [];
        const idToOrder = new Map<string, Order>();
        [...all, ...open].forEach((o) => idToOrder.set(String(o.id), o));
        setOrders(Array.from(idToOrder.values()));
        setError(null);
      } catch (e) {
        console.error(e);
        // fallback local
        try {
          const raw = localStorage.getItem("recentOrders");
          const recent = raw ? JSON.parse(raw) : [];
          if (Array.isArray(recent)) setOrders(recent as Order[]);
          else setError("โหลดรายการออเดอร์ไม่สำเร็จ");
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

  // จัดกลุ่มสถานะด้วย label ที่อ่านง่าย และมี "All"
  const ordersByStatus = useMemo(() => {
    const map: Record<string, Order[]> = { All: [] };
    orders.forEach((o) => {
      const label = normalizeStatusLabel(o.status);
      if (!map[label]) map[label] = [];
      map[label].push(o);
      map.All.push(o);
    });
    return map;
  }, [orders]);

  const tabOrder = ["All", "Open", "Paid", "Void", "Unknown"].filter(
    (k) => ordersByStatus[k]?.length
  );

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
        <TabsList className="flex flex-wrap">
          {tabOrder.map((status) => (
            <TabsTrigger key={status} value={status} className="min-w-[100px]">
              {status}
              <span className="ml-1 text-xs">
                ({ordersByStatus[status].length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabOrder.map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            {loading.all && status === "All" ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading orders...
              </div>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : ordersByStatus[status].length === 0 ? (
              <p className="text-muted-foreground">No orders found.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ordersByStatus[status].map((order) => {
                  const label = normalizeStatusLabel(order.status);
                  const items = Array.isArray(order.items) ? order.items : [];
                  const chips = items.map(
                    (it) => `${it.menu_item_name} × ${it.quantity}`
                  );
                  const total =
                    typeof order.total_baht === "number"
                      ? order.total_baht
                      : items.reduce(
                          (s, it) =>
                            s +
                            Number(
                              typeof it.line_total_baht === "number"
                                ? it.line_total_baht
                                : (it.unit_price_baht ?? 0) * (it.quantity ?? 0)
                            ),
                          0
                        );

                  return (
                    <article
                      key={order.id}
                      className="rounded-xl border p-4 hover:shadow-sm transition cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                      aria-label={`Order for table ${order.table_name || "-"}`}
                      title={`โต๊ะ ${order.table_name || "-"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">
                              โต๊ะ {order.table_name || "-"}
                            </div>
                            <Badge className={badgeClass(label)}>{label}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            เวลา: {thaiDateTime(order.created_at)}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-semibold">
                            {formatPrice(Number(total || 0))}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                          >
                            ดูรายละเอียด
                          </Button>
                        </div>
                      </div>

                      {chips.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {chips.slice(0, 4).map((txt: string, idx: number) => (
                            <span
                              key={`${order.id}-chip-${idx}`}
                              className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-gray-700"
                            >
                              {txt}
                            </span>
                          ))}
                          {chips.length > 4 ? (
                            <span className="text-xs text-muted-foreground">
                              +{chips.length - 4} more
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-muted-foreground">
                          ไม่มีรายการอาหาร
                        </div>
                      )}
                    </article>
                  );
                })}
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
