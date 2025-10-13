"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { closeOrder, getOrderById, voidOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

type OrderItem = {
  id: string;
  menu_item_name: string;
  quantity: number;
  unit_price_baht?: number;
  line_total_baht?: number;
  note?: string;
};

type Order = {
  id: string; // ใช้ภายในเท่านั้น ไม่โชว์
  table_name?: string; // เช่น "T2"
  status?: string; // open | paid | void | closed | ...
  source?: string; // customer | staff
  created_at?: string;
  closed_at?: string | null;
  subtotal_baht?: number;
  discount_baht?: number;
  total_baht?: number;
  note?: string;
  items?: OrderItem[] | null;
};

function statusBadge(status?: string) {
  const s = (status || "").toLowerCase();
  if (s === "open")
    return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
  if (s === "paid" || s === "closed")
    return <Badge className="bg-emerald-100 text-emerald-800">Paid</Badge>;
  if (s === "void")
    return <Badge className="bg-rose-100 text-rose-800">Void</Badge>;
  return <Badge variant="outline">{status || "Unknown"}</Badge>;
}

function humanSource(src?: string) {
  const s = (src || "").toLowerCase();
  if (s === "customer") return "ลูกค้า";
  if (s === "staff") return "พนักงาน";
  return "-";
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"close" | "void" | null>(null);

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);
        if (!mounted) return;
        setOrder((res.data ?? null) as Order);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("โหลดข้อมูลออเดอร์ไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
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

  const items = Array.isArray(order.items) ? order.items : [];
  const computedTotal =
    typeof order.total_baht === "number"
      ? order.total_baht
      : items.reduce(
          (sum, it) =>
            sum +
            Number(
              typeof it.line_total_baht === "number"
                ? it.line_total_baht
                : (it.unit_price_baht ?? 0) * (it.quantity ?? 0)
            ),
          0
        );

  return (
    <div className="space-y-6">
      {/* หัวข้อ: แสดงโต๊ะ + สถานะ (ไม่โชว์ UUID) */}
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-semibold">
            Order · โต๊ะ {order.table_name || "-"}
          </h2>
          <p className="text-sm text-muted-foreground">
            แหล่งที่มา: {humanSource(order.source)} · เวลาสร้าง:{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleString("th-TH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "-"}
          </p>
        </div>
        {statusBadge(order.status)}
      </div>

      {/* รายการอาหาร */}
      <Card>
        <CardHeader>
          <CardTitle>รายการอาหาร</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              ไม่มีรายการอาหาร
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => {
                const unit = Number(it.unit_price_baht ?? 0);
                const qty = Number(it.quantity ?? 0);
                const line =
                  typeof it.line_total_baht === "number"
                    ? it.line_total_baht
                    : unit * qty;

                return (
                  <div
                    key={it.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{it.menu_item_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(unit)} × {qty}
                      </div>
                    </div>
                    <div className="font-medium">{formatPrice(line)}</div>
                  </div>
                );
              })}

              {/* หมายเหตุ (ถ้ามี) */}
              {order.note ? (
                <div className="text-sm text-muted-foreground pt-2">
                  หมายเหตุ: {order.note}
                </div>
              ) : null}

              <div className="pt-3 mt-3 border-t flex justify-between items-center font-semibold">
                <span>รวม</span>
                <span>{formatPrice(computedTotal || 0)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ปุ่มจัดการ */}
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
