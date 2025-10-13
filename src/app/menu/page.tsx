"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getAllMenuItemsRaw, getMenuItemsModifiers } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Modifier {
  id: string;
  name: string;
  price_baht: number;
  category_id?: string;
}

interface MenuItem {
  id: string;
  name: string;
  price_baht: number;
  image_url?: string;
  category?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

export default function MenuPage() {
  const { addItem } = useCart();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // popup state
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuItem | null>(null);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resMenu = await getAllMenuItemsRaw();
        const resMods = await getMenuItemsModifiers();
        setMenu(resMenu || []);
        setModifiers(resMods.data || resMods || []);

        // mock categories (หรือดึงจาก /v1/categories ก็ได้)
        setCategories([
          {
            id: "c6b6a38b-9020-4294-b54e-d3d53006e29c",
            name: "จานเดียว",
            display_order: 1,
          },
          {
            id: "6b8bdda8-a0ce-4e3e-8e9f-245715ac4c69",
            name: "เส้น",
            display_order: 2,
          },
          {
            id: "841f2aa9-9181-4384-9f03-106f7c09bef4",
            name: "กับข้าว",
            display_order: 3,
          },
          {
            id: "49aa55fd-e17a-494c-b752-63c5d53801ed",
            name: "เครื่องดื่ม",
            display_order: 4,
          },
        ]);
      } catch (e: any) {
        console.error(e);
        setErr(e?.message || "โหลดเมนูไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** Filter menu ตาม category */
  const filteredMenu = useMemo(() => {
    if (!selectedCategory) return menu;
    return menu.filter((m) => m.category?.id === selectedCategory);
  }, [menu, selectedCategory]);

  /** Modifier ตาม category */
  const getModsForCategory = (categoryId?: string) =>
    modifiers.filter((x) => x.category_id === categoryId);

  const toggleMod = (id: string) => {
    setSelectedMods((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddClick = (m: MenuItem) => {
    setActiveMenu(m);
    setSelectedMods([]);
    setNote("");
    setQuantity(1);
    setOpen(true);
  };

  const totalPrice = useMemo(() => {
    if (!activeMenu) return 0;
    const selected = modifiers.filter((m) => selectedMods.includes(m.id));
    const extraPrice = selected.reduce((s, m) => s + m.price_baht, 0);
    return (activeMenu.price_baht + extraPrice) * quantity;
  }, [activeMenu, selectedMods, modifiers, quantity]);

  const handleConfirmAdd = () => {
    if (!activeMenu) return;
    const selected = modifiers.filter((m) => selectedMods.includes(m.id));
    const selectedForCart = selected.map((m) => ({
      id: m.id,
      name: m.name,
      price: m.price_baht,
    }));
    addItem({
      menuItemId: String(activeMenu.id),
      name: activeMenu.name,
      imageUrl: activeMenu.image_url,
      basePrice: activeMenu.price_baht,
      modifiers: selectedForCart,
      note,
      quantity,
    });
    setOpen(false);
  };

  if (loading) return <div className="p-6">กำลังโหลดเมนู…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Category filter */}
      {/* Category Segmented Pills */}
      <div
        role="tablist"
        aria-label="Filter categories"
        className="flex items-center gap-2 overflow-x-auto py-1"
      >
        <button
          type="button"
          role="tab"
          aria-pressed={selectedCategory === null}
          data-active={selectedCategory === null}
          onClick={() => setSelectedCategory(null)}
          className={[
            "relative rounded-full border px-4 py-2 text-sm font-medium",
            "bg-white text-gray-700 border-gray-200",
            "shadow-sm hover:shadow transition-all hover:-translate-y-0.5",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500",
            // state styles
            "data-[active=true]:bg-gray-600 data-[active=true]:text-white data-[active=true]:border-gray-600",
            "data-[active=true]:shadow-md data-[active=true]:shadow-gray-200",
          ].join(" ")}
        >
          ทั้งหมด
          {/* underline */}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-gray-600 opacity-0 transition-opacity data-[active=true]:opacity-100"
            data-active={selectedCategory === null}
          />
        </button>

        {categories.map((c) => {
          const isActive = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-pressed={isActive}
              data-active={isActive}
              onClick={() => setSelectedCategory(c.id)}
              className={[
                "relative rounded-full border px-4 py-2 text-sm font-medium",
                "bg-white text-gray-700 border-gray-200",
                "shadow-sm hover:shadow transition-all hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500",
                // state styles
                "data-[active=true]:bg-gray-600 data-[active=true]:text-white data-[active=true]:border-gray-600",
                "data-[active=true]:shadow-md data-[active=true]:shadow-gray-200",
              ].join(" ")}
            >
              {c.name}
              {/* underline */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-gray-600 opacity-0 transition-opacity data-[active=true]:opacity-100"
                data-active={isActive}
              />
            </button>
          );
        })}
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMenu.map((m) => (
          <Card
            key={m.id}
            className="overflow-hidden shadow-sm hover:shadow-md"
          >
            <CardContent className="p-4 space-y-3">
              {m.image_url ? (
                <img
                  src={m.image_url}
                  alt={m.name}
                  className="h-40 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="h-40 w-full rounded-xl bg-gray-100" />
              )}
              <div className="flex justify-between items-center">
                <h2 className="font-medium">{m.name}</h2>
                <span className="text-sm text-gray-600">
                  ฿{m.price_baht.toFixed(0)}
                </span>
              </div>
              {m.category?.name && (
                <div className="text-xs text-gray-400">{m.category.name}</div>
              )}

              <Button className="w-full" onClick={() => handleAddClick(m)}>
                เพิ่ม
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popup modal for modifiers */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่ม {activeMenu?.name}</DialogTitle>
          </DialogHeader>

          {activeMenu && (
            <div className="space-y-4">
              {/* Modifiers */}
              <div>
                <div className="font-medium mb-1">ตัวเลือกเพิ่มเติม</div>
                {getModsForCategory(activeMenu.category?.id).length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {getModsForCategory(activeMenu.category?.id).map((mod) => (
                      <label
                        key={mod.id}
                        className="flex items-center gap-2 border rounded px-2 py-1 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMods.includes(mod.id)}
                          onChange={() => toggleMod(mod.id)}
                        />
                        <span className="flex-1">{mod.name}</span>
                        {mod.price_baht > 0 && (
                          <span className="text-green-600 text-xs">
                            +฿{mod.price_baht}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    ไม่มีตัวเลือกเพิ่มเติม
                  </div>
                )}
              </div>

              {/* Note */}
              <div>
                <div className="font-medium mb-1">หมายเหตุ</div>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เพิ่มเติม..."
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="font-semibold text-green-700">
                  ฿{totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleConfirmAdd} className="w-full">
              ยืนยันเพิ่มลงตะกร้า
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
