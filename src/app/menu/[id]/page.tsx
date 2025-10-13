"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Minus, Plus } from "lucide-react";
import { getMenuItemById } from "@/lib/api"; // API ของคุณ (ต้องคืนรูปแบบเหมือนตัวอย่าง JSON)
import { useCart } from "@/lib/cart-context";

/** ===== Types ===== */
interface Modifier {
  id: string;
  name: string;
  price_baht: number;
}

interface MenuItemDetail {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price_baht: number;
  category?: { id: string; name: string };
  modifiers?: Modifier[];
}

/** ===== Page ===== */
export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [item, setItem] = useState<MenuItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");

  /** โหลดข้อมูลเมนูจาก API */
  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getMenuItemById(id);
        // ถ้า API คืน res.data หรือ res โดยตรง → ปรับตรงนี้ได้
        const data = (res as any)?.data ?? res;
        if (mounted) setItem(data);
      } catch (e) {
        console.error(e);
        if (mounted) setError("ไม่สามารถโหลดเมนูได้");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [params?.id]);

  /** คำนวณราคาเพิ่มจาก modifiers */
  const extrasPrice = useMemo(() => {
    if (!item?.modifiers) return 0;
    return selectedExtras.reduce((sum, id) => {
      const m = item.modifiers!.find((x) => x.id === id);
      return sum + (m?.price_baht ?? 0);
    }, 0);
  }, [item, selectedExtras]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(price);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /** เพิ่มลงตะกร้า */
  const handleAddToCart = () => {
    if (!item) return;

    // สร้าง modifiers ที่เลือกไว้
    const selectedMods =
      item.modifiers
        ?.filter((m) => selectedExtras.includes(m.id))
        .map((m) => ({ id: m.id, name: m.name, price: m.price_baht })) ?? [];

    // ใช้ cart-context structure
    addItem({
      menuItemId: String(item.id),
      name: item.name,
      imageUrl: item.image_url,
      basePrice: item.price_baht,
      modifiers: selectedMods,
      note: customNote,
      quantity,
    });

    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-center">
        <div className="space-y-3">
          <p className="text-red-600">{error ?? "ไม่พบเมนู"}</p>
          <Button variant="outline" onClick={() => router.back()}>
            กลับ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl grid gap-6 md:grid-cols-[1fr,360px]">
      {/* ==== Image & Description ==== */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-64 w-full bg-gray-100">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                width={800}
                height={400}
                className="h-full w-full object-cover"
                priority
              />
            ) : null}
            {item.category?.name ? (
              <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800">
                {item.category.name}
              </Badge>
            ) : null}
          </div>

          <div className="space-y-2 p-4">
            <h1 className="text-xl font-semibold">{item.name}</h1>
            <div className="font-medium text-green-700">
              {formatPrice(item.price_baht + extrasPrice)}
            </div>
            {item.description ? (
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* ==== Options & Add ==== */}
      <Card>
        <CardContent className="space-y-6 p-4">
          {/* Modifiers */}
          {item.modifiers && item.modifiers.length > 0 && (
            <div>
              <div className="mb-2 font-medium">ตัวเลือกเพิ่มเติม</div>
              <div className="flex flex-col gap-2">
                {item.modifiers.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2 rounded border p-2"
                  >
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedExtras.includes(m.id)}
                      onChange={() => toggleExtra(m.id)}
                    />
                    <span className="flex-1">{m.name}</span>
                    {m.price_baht > 0 && (
                      <span className="text-sm text-green-600">
                        +{formatPrice(m.price_baht)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Custom Note */}
          <div>
            <div className="mb-2 font-medium">หมายเหตุ</div>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="เพิ่มเติม..."
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div>
            <div className="mb-2 font-medium">จำนวน</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to cart */}
          <Button className="w-full" onClick={handleAddToCart}>
            เพิ่มลงตะกร้า
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
