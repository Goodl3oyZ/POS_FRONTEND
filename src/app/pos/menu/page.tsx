"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { menuItems, MenuItem } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { MenuCard } from "@/components/pos/MenuCard";
import { Button } from "@/components/pos/ui/button";
import { Input } from "@/components/pos/ui/input";
import { Minus, Plus } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/pos/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/pos/ui/dialog";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");
  const [quantity, setQuantity] = useState(1);

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).sort();

  const handleAddToCart = () => {
    if (!selectedItem) return;

    // รวมราคา option
    let optionPrice = 0;
    selectedItem.options?.forEach((opt) => {
      const val = selectedOptions[opt.name];
      const choice = opt.choices.find((c) => c.label === val);
      if (choice) optionPrice += choice.price;
    });

    // รวมราคา extras ตามจริง
    let extraPrice = 0;
    selectedExtras.forEach((extraLabel) => {
      const extra = selectedItem.extras?.find((e) => e.label === extraLabel);
      if (extra) extraPrice += extra.price;
    });

    const totalPrice = selectedItem.price + optionPrice + extraPrice;
    const uniqueId = `${selectedItem.id}-${JSON.stringify({
      selectedOptions,
      selectedExtras,
      customText,
    })}`;

    addItem({
      id: selectedItem.id,
      name: selectedItem.name,
      price: totalPrice,
      quantity: quantity,
      options: {
        ...selectedOptions,
        Extras: selectedExtras.join(", "),
        Custom: customText,
      },
      uniqueId,
    });

    // Reset dialog state
    setSelectedItem(null);
    setSelectedOptions({});
    setSelectedExtras([]);
    setCustomText("");
    setQuantity(1);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleExtraToggle = (extraLabel: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraLabel)
        ? prev.filter((e) => e !== extraLabel)
        : [...prev, extraLabel]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <h2 className="text-2xl font-semibold">Menu</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="All" className="w-full">
        <TabsList className="w-full justify-start mb-4 overflow-x-auto">
          <TabsTrigger value="All">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Menu */}
        <TabsContent value="All">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems
              .filter(
                (item) =>
                  item.name.toLowerCase().includes(search.toLowerCase()) ||
                  item.description.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={() => setSelectedItem(item)}
                />
              ))}
          </div>
        </TabsContent>

        {/* By Category */}
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems
                .filter(
                  (item) =>
                    item.category === category &&
                    (item.name.toLowerCase().includes(search.toLowerCase()) ||
                      item.description
                        .toLowerCase()
                        .includes(search.toLowerCase()))
                )
                .map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={() => setSelectedItem(item)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog สำหรับเลือก option */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-gray-600">{selectedItem.description}</p>

              {/* Option เลือก 1 อย่าง */}
              {selectedItem.options?.map((opt) => (
                <div key={opt.name}>
                  <label className="font-medium">{opt.name}:</label>
                  <select
                    className="w-full border rounded p-2 mt-1"
                    value={selectedOptions[opt.name] || opt.choices[0].label}
                    onChange={(e) =>
                      handleOptionChange(opt.name, e.target.value)
                    }
                  >
                    {opt.choices.map((choice) => (
                      <option key={choice.label} value={choice.label}>
                        {choice.label}{" "}
                        {choice.price !== 0 ? `(+฿${choice.price})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Extra เลือกหลายอย่าง */}
              {selectedItem.extras && (
                <div>
                  <label className="font-medium">Extras:</label>
                  <div className="flex flex-col gap-1 mt-2">
                    {selectedItem.extras.map((extra) => (
                      <label
                        key={extra.label}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes(extra.label)}
                          onChange={() => handleExtraToggle(extra.label)}
                        />
                        {extra.label} (+฿{extra.price})
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              {/* Quantity / Add-Remove */}
              <div>
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Custom input */}
              <div>
                <label className="font-medium">Custom:</label>
                <textarea
                  placeholder="Type something..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="mt-1 w-full border rounded p-2 resize-none overflow-hidden"
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleAddToCart}>Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
