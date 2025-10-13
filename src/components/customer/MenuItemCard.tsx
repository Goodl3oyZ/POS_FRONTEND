"use client";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Button } from "./ui/button";
import { formatPrice } from "@/lib/utils";
import { MenuItem, ExtraItem } from "@/lib/data";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [request, setRequest] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedExtras, setSelectedExtras] = useState<ExtraItem[]>([]);

  const allOptionsSelected = item.options?.every(
    (opt) => selectedOptions[opt.name]
  );

  const extrasTotalPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const totalPrice = (item.price + extrasTotalPrice) * quantity;

  const handleAddToCart = () => {
    if (item.options && !allOptionsSelected) return;

    const uniqueId = `${item.id}-${Date.now()}`; // สร้าง uniqueId ใหม่ทุกครั้ง
    const options: Record<string, string | number> = {
      ...selectedOptions,
      Extras: selectedExtras.map((e) => e.label).join(", "),
      Request: request,
    };

    addItem({
      id: item.id,
      uniqueId,
      name: item.name,
      price: item.price + extrasTotalPrice, // รวม extras เข้า price
      quantity,
      totalPrice,
      options,
    });

    // รีเซ็ต state
    setOpen(false);
    setQuantity(1);
    setSelectedOptions({});
    setSelectedExtras([]);
    setRequest("");
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="border p-3 rounded-lg cursor-pointer shadow hover:shadow-lg flex gap-4"
      >
        <div className="w-20 h-20 relative">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
          <p className="font-bold mt-1 text-orange-500">
            {formatPrice(item.price)}
          </p>
        </div>
      </div>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="font-bold text-xl mb-2">{item.name}</h2>
            <p className="text-gray-500 mb-4">{item.description}</p>

            {/* Options */}
            {item.options?.map((opt) => (
              <div key={opt.name} className="mb-3">
                <h4 className="font-medium">{opt.name}</h4>
                <div className="flex gap-2 flex-wrap mt-1">
                  {opt.choices.map((choice) => (
                    <button
                      key={choice.label}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [opt.name]: choice.label,
                        }))
                      }
                      className={`px-3 py-1 rounded-full border ${
                        selectedOptions[opt.name] === choice.label
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 border-gray-300"
                      }`}
                    >
                      {choice.label}
                      {choice.price ? ` (+${choice.price})` : ""}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Extras */}
            {item.extras?.length && (
              <div className="mb-3">
                <h4 className="font-medium">Extras</h4>
                <div className="flex gap-2 flex-wrap mt-1">
                  {item.extras.map((extra) => {
                    const selected = selectedExtras.includes(extra);
                    return (
                      <button
                        key={extra.label}
                        onClick={() =>
                          selected
                            ? setSelectedExtras((prev) =>
                                prev.filter((e) => e !== extra)
                              )
                            : setSelectedExtras((prev) => [...prev, extra])
                        }
                        className={`px-3 py-1 rounded-full border ${
                          selected
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        {extra.label} (+{extra.price})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Additional Request */}
            <div className="mb-3">
              <h4 className="font-medium">Additional Request</h4>
              <textarea
                className="w-full border rounded px-2 py-1"
                rows={3}
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="เช่น ไม่เผ็ด, extra sauce..."
              />
            </div>

            {/* Quantity + Add */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={item.options && !allOptionsSelected}
              >
                Add to Cart ({formatPrice(totalPrice)})
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
