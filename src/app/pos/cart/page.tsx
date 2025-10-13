"use client";

import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/components/pos/CartItem";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/pos/ui/button";
import { Card } from "@/components/pos/ui/card";
import { generateOrderId, formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { items, total } = state;

  const handleCheckout = () => {
    if (items.length === 0) return;

    const newOrder = {
      id: generateOrderId(),
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        options: item.options,
      })),
      total,
      status: "Preparing",
      createdAt: new Date().toISOString(),
    };

    console.log("New Order:", newOrder);
    clearCart();
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
            onUpdateQuantity={(id, quantity, options) =>
              updateQuantity(id, quantity, options)
            }
            onRemove={(id, options) => removeItem(id, options)}
          />
        ))}
      </div>

      <Card className="mt-6 p-4">
        <div className="flex justify-between items-center text-lg font-semibold mb-4">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </Card>
    </div>
  );
}
