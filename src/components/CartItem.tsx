"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { CartItem as ContextCartItem } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

type OptionValue =
  | string
  | number
  | string[]
  | { label: string; price: number }
  | { label: string; price: number }[];

type OptionsMap = Record<string, OptionValue>;

/** ✅ รองรับทั้ง item จาก cart-context และจาก backend */
type CartItemUI = ContextCartItem & {
  price?: number; // จาก backend (fallback ถ้าไม่มี basePrice)
  options?: OptionsMap; // จาก backend
};

interface CartItemProps {
  item: CartItemUI;
  onUpdateQuantity: (
    id: string,
    quantity: number,
    options?: Record<string, string | number>
  ) => void;
  onRemove: (id: string, options?: Record<string, string | number>) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  // ราคาฐาน: รองรับทั้ง basePrice (จาก context) และ price (จาก backend)
  const basePrice =
    (typeof item.basePrice === "number" ? item.basePrice : item.price) ?? 0;

  /** ---------- Options (เช่น size, topping จาก backend) ---------- */
  const optionEntries =
    item.options && typeof item.options === "object"
      ? Object.entries(item.options)
          .filter(([key]) => key !== "Extras" && key !== "Custom")
          .map(([key, value]) => ({ name: key, value }))
      : [];

  /** ---------- Extras จาก options.Extras (backend) ---------- */
  const extrasFromOptions: { label: string; price: number }[] = (() => {
    const extrasRaw = (item.options as OptionsMap | undefined)?.Extras;
    if (!extrasRaw) return [];
    if (Array.isArray(extrasRaw)) {
      return extrasRaw.map((e: any) =>
        typeof e === "string"
          ? { label: e, price: 0 }
          : { label: e?.label ?? String(e), price: Number(e?.price ?? 0) }
      );
    }
    if (typeof extrasRaw === "string") {
      return extrasRaw
        .split(",")
        .map((label) => ({ label: label.trim(), price: 0 }));
    }
    if (typeof extrasRaw === "object" && extrasRaw) {
      // เผื่อกรณีเป็น object เดี่ยว
      const obj = extrasRaw as any;
      return [{ label: obj?.label ?? "Extra", price: Number(obj?.price ?? 0) }];
    }
    return [];
  })();

  /** ---------- Extras จาก modifiers (context) ---------- */
  const extrasFromModifiers = Array.isArray(item.modifiers)
    ? item.modifiers.map((m) => ({
        label: m.name,
        price: Number(m.price || 0),
      }))
    : [];

  /** รวม extras จากทั้งสองที่ */
  const extrasEntries = [...extrasFromOptions, ...extrasFromModifiers];

  /** ---------- ราคารวม ---------- */
  const totalOptionPrice = optionEntries.reduce((sum, o) => {
    const price = typeof o.value === "number" ? o.value : 0;
    return sum + price;
  }, 0);

  const totalExtrasPrice = extrasEntries.reduce(
    (sum, e) => sum + (e.price || 0),
    0
  );

  const totalPrice =
    (basePrice + totalOptionPrice + totalExtrasPrice) * item.quantity;

  /** ตัวช่วยส่ง options กลับ (parent จะใช้หรือไม่ใช้ก็ได้) */
  const safeOptionsForCallback: Record<string, string | number> | undefined =
    (() => {
      if (!item.options) return undefined;
      const out: Record<string, string | number> = {};
      for (const [k, v] of Object.entries(item.options)) {
        if (typeof v === "string" || typeof v === "number") out[k] = v;
      }
      return Object.keys(out).length ? out : undefined;
    })();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* 🔹 ชื่ออาหาร + Base Price */}
            <h3 className="font-medium">
              {item.name}
              <span className="ml-1 text-xs text-gray-400">
                {formatPrice(basePrice)}
              </span>
            </h3>

            {/* 🔸 Options (จาก backend) */}
            {optionEntries.length > 0 && (
              <div className="mt-1 space-y-1 text-sm text-gray-500">
                {optionEntries.map((opt) => (
                  <div key={opt.name} className="flex justify-between">
                    <span>
                      {opt.name}: {String(opt.value)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 🔸 Modifiers (จาก context) — แสดงชื่อเฉย ๆ เผื่อไม่มี options */}
            {extrasFromModifiers.length > 0 && optionEntries.length === 0 && (
              <div className="mt-1 space-y-1 text-sm text-gray-500">
                <span>Options:</span>
                {extrasFromModifiers.map((m) => (
                  <div key={`mod-${m.label}`} className="flex justify-between">
                    <span>{m.label}</span>
                    <span>{m.price > 0 ? `+${formatPrice(m.price)}` : ""}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 🔸 Extras รวม (options.Extras + modifiers) */}
            {extrasEntries.length > 0 && (
              <div className="mt-1 space-y-1 text-sm text-gray-500">
                <span>Extras:</span>
                {extrasEntries.map((extra, idx) => (
                  <div
                    key={`${extra.label}-${idx}`}
                    className="flex justify-between"
                  >
                    <span>{extra.label}</span>
                    <span>
                      {extra.price > 0 && `+${formatPrice(extra.price)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 🔸 Custom note (backend) หรือ note (context) */}
            {(item.options as OptionsMap | undefined)?.Custom || item.note ? (
              <div className="mt-1 text-sm text-gray-500">
                <span>
                  Custom:{" "}
                  {((item.options as OptionsMap | undefined)
                    ?.Custom as string) ?? item.note}
                </span>
              </div>
            ) : null}
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
                  safeOptionsForCallback
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
                onUpdateQuantity(
                  item.uniqueId,
                  item.quantity + 1,
                  safeOptionsForCallback
                )
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="ml-2 h-8 w-8"
              onClick={() => onRemove(item.uniqueId, safeOptionsForCallback)}
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
