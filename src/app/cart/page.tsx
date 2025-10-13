"use client";

import { ShoppingCart, Loader2 } from "lucide-react";
import { CartItem } from "@/components/CartItem";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { items, total } = state;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    console.log("Checkout clicked", { items, total, isSubmitting });

    if (items.length === 0 || isSubmitting) {
      console.warn("Cart empty or already submitting");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Build payload with snake_case keys and safe id conversion
    const payload = {
      table_id: "TAKEAWAY",
      items: items.map((i) => {
        const rawId = i.id as unknown;
        const parsedNum = Number.parseInt(String(rawId), 10);
        const menu_item_id = Number.isFinite(parsedNum)
          ? String(parsedNum)
          : String(rawId);
        const quantity = Math.max(
          1,
          Number.parseInt(String(i.quantity), 10) || 1
        );
        return {
          menu_item_id,
          quantity,
          modifiers: [] as string[],
        };
      }),
    };

    console.log("Payload sent to backend:", payload);

    try {
      const res = await createOrder(payload as any);
      console.log("createOrder response:", res);
      clearCart();
      router.push("/orders");
    } catch (e: any) {
      console.error("API error:", e);
      const apiMessage = e?.response?.data?.message || e?.message;
      setError(apiMessage || "ไม่สามารถสร้างออเดอร์ได้ ลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some delicious items to your cart</p>
      </div>
    );
  }

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
            onUpdateQuantity={(id, quantity) => updateQuantity(id, quantity)}
            onRemove={(id) => removeItem(id)}
          />
        ))}
      </div>

      <Card className="mt-6 p-4">
        <div className="flex justify-between items-center text-lg font-semibold mb-4">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
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
