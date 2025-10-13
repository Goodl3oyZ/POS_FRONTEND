"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface OrderItem {
  id: number;
  uniqueId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  options?: Record<string, string | number>;
}

interface OrderData {
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function OrderPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("orderData");
    if (stored) setOrder(JSON.parse(stored));
  }, []);

  if (!order) return <p className="p-4 text-center">ไม่มีคำสั่งซื้อ</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow sticky top-0 z-20">
        <h2 className="font-semibold text-lg">My Order</h2>
        <button onClick={() => router.back()} className="p-2">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {order.items.map((item) => (
          <div
            key={item.uniqueId}
            className="bg-white p-3 rounded shadow flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <h4 className="font-semibold">{item.name}</h4>
              <span className="font-semibold">
                {formatPrice(item.totalPrice)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Quantity: {item.quantity}
            </div>
            {item.options && (
              <div className="text-sm text-gray-500">
                {Object.entries(item.options)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" | ")}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white shadow-t">
        <div className="flex justify-between font-semibold text-lg mb-2">
          <span>Total:</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <div className="text-sm text-gray-500">Status: {order.status}</div>
        <div className="text-sm text-gray-500">
          Created at: {new Date(order.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
