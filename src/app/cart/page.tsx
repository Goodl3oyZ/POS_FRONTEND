"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CartItem } from "@/components/CartItem";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

import {
  createOrder,
  addItemsToOrder,
  updateTableStatus,
  // createPayment, // ถ้าอยากจ่ายทันที ค่อยเปิดใช้
} from "@/lib/api";

import { getActiveTable, setActiveTable } from "@/lib/table-session";

// สำรองสุดท้ายถ้าไม่พบ tableId จาก URL/Session
const FALLBACK_TABLE_ID =
  process.env.NEXT_PUBLIC_DEFAULT_TABLE_ID || "TAKEAWAY";

export default function CartPage() {
  const router = useRouter();
  const params = useSearchParams();

  const { state, updateQty, removeItem, clearCart } = useCart();
  const { items, subtotal } = state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) resolve tableId: URL -> localStorage -> fallback
  const resolvedTableId = useMemo(() => {
    const fromUrl =
      params.get("tableId") || params.get("table") || params.get("t");
    if (fromUrl) return fromUrl;
    const fromSession = getActiveTable()?.id;
    if (fromSession) return fromSession;
    return FALLBACK_TABLE_ID;
  }, [params]);

  // ถ้า URL มี tableId ให้ cache ลง session ไว้ด้วย
  useEffect(() => {
    const fromUrl =
      params.get("tableId") || params.get("table") || params.get("t");
    if (fromUrl) {
      const name = params.get("name") || undefined;
      setActiveTable({ id: fromUrl, name });
    }
  }, [params]);

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // 2) สร้างออเดอร์ (รู้โต๊ะ)
      const orderBody = {
        table_id: resolvedTableId,
        source: "customer",
        note: "", // ถ้าจะมีช่องกรอก note ค่อยต่อยอด
      };
      const orderRes = await createOrder(orderBody);
      const orderData = (orderRes as any)?.data ?? orderRes;
      const orderId = String(orderData?.id ?? orderData?.order_id ?? "");
      if (!orderId) throw new Error("ไม่สามารถสร้างออเดอร์ได้ (orderId ว่าง)");

      // 3) เตรียม payload รายการในตะกร้าอย่างปลอดภัย
      // - กันเคสไม่มี menuItemId
      // - map modifiers ให้เป็น id array (modifier_ids)
      const validItems = items
        .map((i) => {
          const menuItemId = String(
            (i as any).menuItemId ?? (i as any).id ?? ""
          );
          const quantity = Math.max(1, Number(i.quantity ?? 1));
          if (!menuItemId) return null;

          const modifier_ids = Array.isArray(i.modifiers)
            ? i.modifiers
                .map((m: any) => (typeof m === "string" ? m : m?.id))
                .filter(Boolean)
            : [];

          return {
            menu_item_id: menuItemId,
            quantity,
            note: (i as any).note || "",
            modifier_ids,
          };
        })
        .filter(Boolean) as Array<{
        menu_item_id: string;
        quantity: number;
        note: string;
        modifier_ids: string[];
      }>;

      if (validItems.length === 0) {
        throw new Error("ไม่พบรายการอาหารที่ถูกต้องในตะกร้า");
      }

      // 4) ยิง addItemsToOrder ทีละตัว (หรือ Promise.all ก็ได้)
      for (const payload of validItems) {
        await addItemsToOrder(orderId, payload as any);
      }

      // 5) อัปเดตสถานะโต๊ะ (ถ้าระบบกำหนด เช่น occupied/billing)
      try {
        await updateTableStatus(resolvedTableId, "occupied");
      } catch (e) {
        // ไม่ให้ขั้นตอนล้ม ถ้า endpoint นี้ไม่จำเป็น/ไม่พร้อม
        console.warn("updateTableStatus failed:", e);
      }

      // 6) (ทางเลือก) สร้าง payment ตอนนี้เลย — ค่อยเปิดใช้ภายหลัง
      // const amount = Math.max(0, Math.round(subtotal));
      // const paymentRes = await createPayment({
      //   order_id: orderId,
      //   method: "cash",
      //   amount_baht: amount,
      // });
      // const paymentData = (paymentRes as any)?.data ?? paymentRes;
      // const paymentId = String(paymentData?.id ?? "");

      // 7) เก็บ recentOrders ฝั่ง client ไว้เป็น history (offline/guest)
      try {
        const now = new Date().toISOString();
        const raw = localStorage.getItem("recentOrders");
        const recent = raw ? JSON.parse(raw) : [];
        recent.unshift({
          id: orderId,
          created_at: now,
          table_id: resolvedTableId,
          total: subtotal,
          items: validItems.map((i) => ({
            menu_item_id: i.menu_item_id,
            quantity: i.quantity,
          })),
        });
        localStorage.setItem(
          "recentOrders",
          JSON.stringify(recent.slice(0, 10))
        );
      } catch {}

      // 8) ล้างตะกร้า + เปลี่ยนหน้า
      clearCart();
      toast.success("รับออเดอร์เรียบร้อย");
      // ไปหน้าชำระเงินใหม่ หรือกลับไปเลือกเมนูโต๊ะเดิม
      // router.push(`/payment/new?orderId=${orderId}`);
      router.push(`/menu?tableId=${encodeURIComponent(resolvedTableId)}`);
    } catch (err: any) {
      console.error("Checkout error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "ไม่สามารถดำเนินการได้";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some items first</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* หัวข้อ + โต๊ะปัจจุบัน + จำนวนรายการ */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-semibold">My Cart</h2>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {items.reduce((n, it) => n + Number(it.quantity || 0), 0)} รายการ
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          โต๊ะ: <span className="font-medium">{resolvedTableId}</span>
        </div>
      </div>

      {/* รายการสินค้าแบบสวยๆ */}
      <div className="space-y-3">
        {items.map((it) => {
          const mods = Array.isArray(it.modifiers) ? it.modifiers : [];
          const modsTotal =
            mods.reduce((s: number, m: any) => s + Number(m?.price ?? 0), 0) ||
            0;

          const unitBase =
            Number((it as any).basePrice ?? (it as any).price ?? 0) || 0;
          const unitPrice = unitBase + modsTotal;
          const lineTotal = unitPrice * Number(it.quantity || 0);

          return (
            <div
              key={it.uniqueId}
              className="group flex gap-3 rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              {/* รูปสินค้า */}
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {it.imageUrl ? (
                  // ใช้ <img> ธรรมดาเพื่อไม่ต้องเพิ่ม import
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              {/* รายละเอียด */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-medium">
                      {it.name}
                    </h3>
                    <div className="truncate text-sm text-gray-500">
                      ราคา/หน่วย: {formatPrice(unitPrice)}
                    </div>
                  </div>

                  {/* ราคารวมต่อบรรทัด */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500">รวม</div>
                    <div className="text-base font-semibold">
                      {formatPrice(lineTotal)}
                    </div>
                  </div>
                </div>

                {/* modifiers เป็นชิป */}
                {mods.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mods.map((m: any, idx: number) => (
                      <span
                        key={`${it.uniqueId}-mod-${idx}`}
                        className="rounded-full border bg-gray-50 px-2 py-0.5 text-xs text-gray-700"
                      >
                        {m?.name ?? "ตัวเลือก"}
                        {Number(m?.price ?? 0) > 0
                          ? ` +${formatPrice(Number(m.price))}`
                          : ""}
                      </span>
                    ))}
                  </div>
                )}

                {/* note ถ้ามี */}
                {(it as any).note ? (
                  <div className="mt-1 truncate text-xs text-gray-500">
                    หมายเหตุ: {(it as any).note}
                  </div>
                ) : null}

                {/* ตัวคุมจำนวน + ลบ */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full border px-1 py-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQty(
                          it.uniqueId,
                          Math.max(1, (it.quantity || 1) - 1)
                        )
                      }
                      className="h-8 w-8 rounded-full text-gray-700 hover:bg-gray-100"
                      aria-label="ลดจำนวน"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {it.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQty(it.uniqueId, (it.quantity || 1) + 1)
                      }
                      className="h-8 w-8 rounded-full text-gray-700 hover:bg-gray-100"
                      aria-label="เพิ่มจำนวน"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(it.uniqueId)}
                    className="rounded-full border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* สรุปยอด + ปุ่มชำระ */}
      <Card className="mt-6 p-4">
        <div className="mb-4 flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <Button
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60"
          size="lg"
          onClick={handleCheckout}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> กำลังสร้างออเดอร์...
            </span>
          ) : (
            "Checkout"
          )}
        </Button>
      </Card>
    </div>
  );
}
