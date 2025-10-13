"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Minus, Plus } from "lucide-react";
import { getMenuItemById } from "@/lib/api";
import { useCart } from "@/lib/cart-context";

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

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [item, setItem] = useState<MenuItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await getMenuItemById(id);
        if (!mounted) return;
        setItem(res.data ?? null);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("ไม่สามารถโหลดเมนูได้");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [params?.id]);

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
    }).format(price);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (!item) return;
    const price = item.price_baht + extrasPrice;
    const uniqueId = `${item.id}-${JSON.stringify({
      selectedExtras,
      customText,
    })}`;
    addItem({
      id: parseInt(item.id),
      uniqueId,
      name: item.name,
      price,
      quantity,
      options: {
        Modifiers:
          item.modifiers
            ?.filter((m) => selectedExtras.includes(m.id))
            .map((m) => m.name)
            .join(", ") || "",
        Custom: customText,
      },
    });
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center min-h-[300px] flex items-center justify-center">
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
    <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-[1fr,360px]">
      <Card>
        <CardContent className="p-0">
          <div className="relative h-64 w-full bg-gray-100">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                width={800}
                height={400}
                className="object-cover w-full h-full"
                priority
              />
            ) : null}
            {item.category?.name ? (
              <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800">
                {item.category.name}
              </Badge>
            ) : null}
          </div>
          <div className="p-4 space-y-2">
            <h1 className="text-xl font-semibold">{item.name}</h1>
            <div className="text-green-700 font-medium">
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

      <Card>
        <CardContent className="p-4 space-y-6">
          {item.modifiers && item.modifiers.length > 0 ? (
            <div>
              <div className="font-medium mb-2">Modifiers</div>
              <div className="flex flex-col gap-2">
                {item.modifiers.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2 p-2 border rounded"
                  >
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedExtras.includes(m.id)}
                      onChange={() => toggleExtra(m.id)}
                    />
                    <span className="flex-1">{m.name}</span>
                    {m.price_baht > 0 ? (
                      <span className="text-sm text-green-600">
                        +{formatPrice(m.price_baht)}
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <div className="font-medium mb-2">หมายเหตุ</div>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="เพิ่มเติม..."
              rows={3}
            />
          </div>

          <div>
            <div className="font-medium mb-2">จำนวน</div>
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

          <Button className="w-full" onClick={handleAdd}>
            เพิ่มลงตะกร้า
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
