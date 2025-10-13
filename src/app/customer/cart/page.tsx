"use client";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/pos/ui/button";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { items, total } = state;
  const router = useRouter();

  const handleCheckout = () => {
    if (!items.length) return;
    localStorage.setItem("orderData", JSON.stringify({ items, total, status: "Preparing", createdAt: new Date().toISOString() }));
    clearCart();
    router.push("/order");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow sticky top-0 z-20">
        <h2 className="font-semibold text-lg">My Cart</h2>
        <button onClick={() => router.back()} className="p-2"><X className="w-6 h-6 text-gray-600"/></button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">Your cart is empty</p>
        ) : items.map(item => (
          <div key={item.uniqueId} className="bg-white p-3 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-500">{Object.entries(item.options || {}).map(([k,v]) => `${k}: ${v}`).join(" | ")}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => updateQuantity(item.uniqueId, Math.max(1, item.quantity - 1))}>-</button>
              <span className="font-medium">{item.quantity}</span>
              <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}>+</button>
              <span className="ml-2 font-semibold">{formatPrice(item.price * item.quantity)}</span>
              <Button variant="destructive" size="sm" onClick={() => removeItem(item.uniqueId)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="p-4 bg-white shadow-t">
          <div className="flex justify-between items-center font-semibold text-lg mb-2">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleCheckout}>Checkout</Button>
        </div>
      )}
    </div>
  );
}
