"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { closeOrder, getOrderById, voidOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"close" | "void" | null>(null);

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);
        if (!mounted) return;
        setOrder(res.data ?? null);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("โหลดข้อมูลออเดอร์ไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [params?.id]);

  const doClose = async () => {
    if (!order?.id || submitting) return;
    try {
      setSubmitting("close");
      await closeOrder(String(order.id));
      router.push("/orders");
    } catch (e) {
      console.error(e);
      alert("ปิดบิลไม่สำเร็จ");
    } finally {
      setSubmitting(null);
    }
  };

  const doVoid = async () => {
    if (!order?.id || submitting) return;
    try {
      setSubmitting("void");
      await voidOrder(String(order.id));
      router.push("/orders");
    } catch (e) {
      console.error(e);
      alert("ยกเลิกออเดอร์ไม่สำเร็จ");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center min-h-[300px] flex items-center justify-center">
        <div className="space-y-3">
          <p className="text-red-600">{error ?? "ไม่พบข้อมูลออเดอร์"}</p>
          <Button variant="outline" onClick={() => router.back()}>
            กลับ
          </Button>
        </div>
      </div>
    );
  }

  const total = order.items?.reduce(
    (sum: number, it: any) =>
      sum + Number(it.price_baht ?? 0) * Number(it.quantity ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Order #{order.id}</h2>
        <div className="text-sm text-muted-foreground">
          Status: {order.status}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items?.map((it: any) => (
              <div key={it.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {it.name || it.menu_item_name || it.menuItem?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    x{it.quantity}
                  </div>
                </div>
                <div className="font-medium">
                  {formatPrice(
                    Number(it.price_baht ?? 0) * Number(it.quantity ?? 0)
                  )}
                </div>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>{formatPrice(total || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={doClose}
          disabled={submitting === "close"}
          className="bg-green-600 hover:bg-green-700"
        >
          {submitting === "close" ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          ปิดบิล
        </Button>
        <Button
          variant="destructive"
          onClick={doVoid}
          disabled={submitting === "void"}
        >
          {submitting === "void" ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          ยกเลิก
        </Button>
        <Button variant="outline" onClick={() => router.push("/orders")}>
          กลับ
        </Button>
      </div>
    </div>
  );
}
