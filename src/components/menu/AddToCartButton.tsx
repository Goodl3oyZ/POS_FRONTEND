// components/menu/AddToCartButton.tsx
"use client";

import React from "react";
import { useCart } from "@/lib/cart-context";

type Props = {
  menuItem: {
    id: string | number;
    name: string;
    price: number;
    image_url?: string;
  };
  defaultModifiers?: { id: string; name: string; price: number }[];
  defaultNote?: string;
  qty?: number;
};

export default function AddToCartButton({
  menuItem,
  defaultModifiers = [],
  defaultNote = "",
  qty = 1,
}: Props) {
  const { addItem } = useCart();
  return (
    <button
      className="rounded-xl border px-3 py-2 hover:bg-gray-50"
      onClick={() =>
        addItem({
          menuItemId: String(menuItem.id),
          name: menuItem.name,
          imageUrl: menuItem.image_url,
          basePrice: Number(menuItem.price),
          modifiers: defaultModifiers,
          note: defaultNote,
          quantity: qty,
        })
      }
    >
      เพิ่มลงตะกร้า
    </button>
  );
}
