"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CartItem as CartItemType } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (
    id: string,
    quantity: number,
    options?: Record<string, string | number>
  ) => void;
  onRemove: (id: string, options?: Record<string, string | number>) => void;
}

/**
 * CartItem Component
 * ✅ รองรับ item จาก backend / context
 * ✅ คำนวณราคารวมรวม extras + options
 * ✅ ปลอดภัยจาก undefined fields
 */
export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  // ราคาฐาน
  const basePrice = item.price ?? 0;

  // Option entries (เช่น size, topping)
  const optionEntries =
    item.options && typeof item.options === "object"
      ? Object.entries(item.options)
          .filter(([key]) => key !== "Extras" && key !== "Custom")
          .map(([key, value]) => ({ name: key, value }))
      : [];

  // Extras (Array หรือ string แยกด้วย comma)
  const extrasEntries: { label: string; price: number }[] = (() => {
    const extrasRaw = item.options?.Extras;
    if (!extrasRaw) return [];
    if (Array.isArray(extrasRaw)) {
      return extrasRaw.map((e: any) =>
        typeof e === "string" ? { label: e, price: 0 } : e
      );
    }
    if (typeof extrasRaw === "string") {
      return extrasRaw.split(",").map((label) => ({
        label: label.trim(),
        price: 0,
      }));
    }
    return [];
  })();

  // ราคาทั้งหมด
  const totalOptionPrice = optionEntries.reduce((sum, o) => {
    const price = typeof o.value === "number" ? o.value : 0;
    return sum + price;
  }, 0);

  const totalExtrasPrice = extrasEntries.reduce((sum, e) => sum + e.price, 0);

  const totalPrice =
    (basePrice + totalOptionPrice + totalExtrasPrice) * item.quantity;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* 🔹 ชื่ออาหาร + Base Price */}
            <h3 className="font-medium">
              {item.name}
              <span className="text-xs text-gray-400 ml-1">
                {formatPrice(basePrice)}
              </span>
            </h3>

            {/* 🔸 Options */}
            {optionEntries.length > 0 && (
              <div className="text-sm text-gray-500 mt-1 space-y-1">
                {optionEntries.map((opt) => (
                  <div key={opt.name} className="flex justify-between">
                    <span>
                      {opt.name}: {String(opt.value)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 🔸 Extras */}
            {extrasEntries.length > 0 && (
              <div className="text-sm text-gray-500 mt-1 space-y-1">
                <span>Extras:</span>
                {extrasEntries.map((extra) => (
                  <div key={extra.label} className="flex justify-between">
                    <span>{extra.label}</span>
                    <span>
                      {extra.price > 0 && `+${formatPrice(extra.price)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 🔸 Custom note */}
            {item.options?.Custom && (
              <div className="text-sm text-gray-500 mt-1">
                <span>Custom: {item.options.Custom}</span>
              </div>
            )}
          </div>

          {/* 🔹 Quantity controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onUpdateQuantity(
                  item.uniqueId,
                  Math.max(1, item.quantity - 1),
                  item.options
                )
              }
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onUpdateQuantity(item.uniqueId, item.quantity + 1, item.options)
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 ml-2"
              onClick={() => onRemove(item.uniqueId, item.options)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 🔹 Total */}
        <div className="mt-2 text-right font-medium">
          Total: {formatPrice(totalPrice)}
        </div>
      </CardContent>
    </Card>
  );
}
