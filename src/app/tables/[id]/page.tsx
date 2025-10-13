"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getTableById } from "@/lib/api";
import { getTableOrders } from "@/lib/api";

export default function TableDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [table, setTable] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const [t, o] = await Promise.all([
          getTableById(id),
          getTableOrders(id),
        ]);
        if (!mounted) return;
        setTable(t.data ?? null);
        setOrders(Array.isArray(o.data) ? o.data : []);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("โหลดข้อมูลโต๊ะไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (error || !table) {
    return (
      <div className="text-center min-h-[300px] flex items-center justify-center">
        <div className="space-y-3">
          <p className="text-red-600">{error ?? "ไม่พบโต๊ะ"}</p>
          <Button variant="outline" onClick={() => router.back()}>
            กลับ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Table {table.id}</h2>
        <div className="text-sm text-muted-foreground">
          Status: {table.status}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-muted-foreground">No orders.</div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Order #{o.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.status}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/orders/${o.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push("/tables")}>
          กลับ
        </Button>
        {table.status === "Available" && (
          <Button onClick={() => router.push(`/menu?tableId=${table.id}`)}>
            New Order
          </Button>
        )}
      </div>
    </div>
  );
}
