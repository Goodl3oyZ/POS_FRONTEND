"use client";

import { ShoppingCart, Loader2 } from "lucide-react";
import { CartItem } from "@/components/CartItem";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  createOrder,
  addItemsToOrder,
  updateTableStatus,
  createPayment,
} from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DEFAULT_TABLE_ID =
  process.env.NEXT_PUBLIC_DEFAULT_TABLE_ID ||
  "4fe752c9-d7ed-4e87-8303-dfcabbd2bfd7"; // ← ใช้ตัวอย่างของคุณ

export default function CartPage() {
  const { state, updateQty, removeItem, clearCart } = useCart();
  const { items, subtotal } = state;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      /* 1) Create order: { table_id, source, note } */
      const orderBody = {
        table_id: DEFAULT_TABLE_ID,
        source: "customer",
        note: "", // จะทำช่องกรอกจาก UI ภายหลังก็ได้
      };
      console.log("== createOrder body ==", orderBody);
      const orderRes = await createOrder(orderBody);
      const orderData = (orderRes as any)?.data ?? orderRes;
      const orderId = String(orderData?.id ?? orderData?.order_id ?? "");
      if (!orderId) throw new Error("ไม่สามารถสร้างออเดอร์ได้ (orderId ว่าง)");

      /* 2) Loop add items: { menu_item_id, quantity, note, modifier_ids } */
      for (const i of items) {
        const payload = {
          menu_item_id: String(i.menuItemId ?? ""),
          quantity: Number(i.quantity ?? 1),
          note: i.note || "",
          modifier_ids: Array.isArray(i.modifiers)
            ? i.modifiers.map((m: any) => (typeof m === "string" ? m : m.id))
            : [],
        };
        console.log(`== addItemsToOrder body (order:${orderId}) ==`, payload);
        await addItemsToOrder(orderId, payload as any);
      }

      /* 3) Update table status -> "occupied" (หรือ "billing" แล้วแต่ backend) */
      await updateTableStatus(DEFAULT_TABLE_ID, "occupied");

      /* 4) Create payment (PENDING) — ส่ง payload ให้ครบ */
      // const amount = Math.max(0, Math.round(subtotal)); // จำนวนเต็มบาท
      // const provider = "SCB";
      // const providerRef = `PP-${new Date()
      //   .toISOString()
      //   .slice(0, 10)
      //   .replace(/-/g, "")}-${orderId.slice(0, 6)}`;

      // const paymentRes = await createPayment({
      //   order_id: orderId,
      //   method: "promptpay",
      //   amount_baht: amount,
      //   provider,
      //   provider_ref: providerRef,
      // });
      // const paymentData = (paymentRes as any)?.data ?? paymentRes;
      // const paymentId = String(paymentData?.id ?? "");

      /* 5) Save to local history */
      try {
        const now = new Date().toISOString();
        const recentRaw = localStorage.getItem("recentOrders");
        const recent = recentRaw ? JSON.parse(recentRaw) : [];
        recent.unshift({
          id: orderId,
          created_at: now,
          table_id: DEFAULT_TABLE_ID,
          total: subtotal,
          items: items.map((i) => ({
            menu_item_id: String(i.menuItemId ?? ""),
            quantity: Number(i.quantity ?? 1),
          })),
        });
        localStorage.setItem(
          "recentOrders",
          JSON.stringify(recent.slice(0, 10))
        );
      } catch (e) {
        console.warn("save recentOrders failed:", e);
      }

      /* 6) Clear cart & redirect */
      clearCart();
      // if (paymentId) router.push(`/payments/${paymentId}`);
      // else router.push(`/orders/${orderId}`);
      toast.success("รับออเดอร์เรียบร้อย");
      router.push("/menu");
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

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some items first</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Cart</h2>
        <Button variant="ghost" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.uniqueId}
            item={item}
            onUpdateQuantity={(id, quantity) => updateQty(id, quantity)}
            onRemove={(id) => removeItem(id)}
          />
        ))}
      </div>

      <Card className="mt-6 p-4">
        <div className="flex justify-between items-center text-lg font-semibold mb-4">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

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
