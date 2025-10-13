"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CartItem as CartItemType } from "@/lib/cart-context";
import { menuItems, MenuItem } from "@/lib/data";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (
    id: string,
    quantity: number,
    options?: Record<string, string | number>
  ) => void;
  onRemove: (id: string, options?: Record<string, string | number>) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  // หา menuItem ของจริง
  const menuItem = menuItems.find((m) => m.id === item.id);

  // Base price
  const basePrice = menuItem?.price || item.price;

  // แปลง options เป็น array สำหรับโชว์
  const optionEntries =
    menuItem?.options?.map((opt) => {
      const selected = item.options?.[opt.name] as string;
      const found = opt.choices.find((c) => c.label === selected);
      const price = found?.price || 0;
      return { name: opt.name, value: selected, price };
    }) || [];

  // แปลง extras
  const extrasEntries =
    item.options?.Extras && menuItem?.extras
      ? ((item.options.Extras as string)
          .split(", ")
          .map((label) => {
            const found = menuItem.extras?.find((e) => e.label === label);
            return found ? { label: found.label, price: found.price } : null;
          })
          .filter(Boolean) as { label: string; price: number }[])
      : [];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            {/* ชื่ออาหาร + Base Price */}
            <h3 className="font-medium">
              {item.name}{" "}
              <span className="text-xs text-gray-400">฿{basePrice}</span>
            </h3>

            {/* Options */}
            {optionEntries.length > 0 && (
              <div className="text-sm text-gray-500 mt-1 space-y-1">
                {optionEntries.map((opt) => (
                  <div key={opt.name} className="flex justify-between">
                    <span>
                      {opt.name}: {opt.value}
                    </span>
                    <span>+{opt.price}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Extras */}
            {extrasEntries.length > 0 && (
              <div className="text-sm text-gray-500 mt-1 space-y-1">
                <span>Extras:</span>
                {extrasEntries.map((extra) => (
                  <div key={extra.label} className="flex justify-between">
                    <span>{extra.label}</span>
                    <span>+{extra.price}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Custom */}
            {item.options?.Custom && (
              <div className="text-sm text-gray-500 mt-1">
                <span>Custom: {item.options.Custom}</span>
              </div>
            )}
          </div>

          {/* Quantity / Remove */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onUpdateQuantity(
                  item.uniqueId,
                  Math.max(0, item.quantity - 1),
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

        <div className="mt-2 text-right font-medium">
          Total: ฿{item.price * item.quantity}
        </div>
      </CardContent>
    </Card>
  );
}
