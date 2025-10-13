"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getAllMenuItems } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from "framer-motion";

// Types
interface MenuItem {
  id: string;
  name: string;
  price_baht: number;
  active: boolean;
  image_url?: string;
  description?: string;
  category?: {
    id: string;
    name: string;
    display_order?: number;
  };
  modifiers?: Array<{
    id: string;
    name: string;
    price_baht: number;
  }>;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const { addItem } = useCart();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading({ isLoading: true, error: null });
        const response = await getAllMenuItems();
        setMenuItems(response.data || []);
        setLoading({ isLoading: false, error: null });
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setLoading({
          isLoading: false,
          error: "Failed to load menu items. Please try again later.",
        });
      }
    };

    fetchMenuItems();
  }, []);

  // Get unique categories from menu items, sorted by display_order (dedupe by name)
  const categoryNameToOrder = new Map<string, number>();
  menuItems.forEach((item) => {
    if (!item.active || !item.category?.name) return;
    const name = item.category.name;
    const order = item.category.display_order ?? 0;
    if (!categoryNameToOrder.has(name)) {
      categoryNameToOrder.set(name, order);
    } else {
      categoryNameToOrder.set(
        name,
        Math.min(categoryNameToOrder.get(name)!, order)
      );
    }
  });
  const categories = Array.from(categoryNameToOrder.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([name]) => name);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    // Calculate modifier prices
    let modifierPrice = 0;
    selectedExtras.forEach((modifierId) => {
      const modifier = selectedItem.modifiers?.find((m) => m.id === modifierId);
      if (modifier) modifierPrice += modifier.price_baht;
    });

    const totalPrice = selectedItem.price_baht + modifierPrice;
    const uniqueId = `${selectedItem.id}-${JSON.stringify({
      selectedExtras,
      customText,
    })}`;

    addItem({
      id: parseInt(selectedItem.id), // Convert string to number for cart
      name: selectedItem.name,
      price: totalPrice,
      quantity: quantity,
      options: {
        Modifiers: selectedExtras
          .map((id) => {
            const modifier = selectedItem.modifiers?.find((m) => m.id === id);
            return modifier?.name || id;
          })
          .join(", "),
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

  const handleModifierToggle = (modifierId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(modifierId)
        ? prev.filter((id) => id !== modifierId)
        : [...prev, modifierId]
    );
  };

  // Format price in Thai Baht
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(price);
  };

  // Filter menu items based on search and active status
  const filteredItems = menuItems.filter(
    (item) =>
      item.active && // Only show active items
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Loading state
  if (loading.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loading.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{loading.error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (menuItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No menu items available</p>
        </div>
      </div>
    );
  }

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
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                onAddToCart={() => setSelectedItem(item)}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </TabsContent>

        {/* By Category */}
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems
                .filter((item) => item.category?.name === category)
                .map((item, index) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    index={index}
                    onAddToCart={() => setSelectedItem(item)}
                    formatPrice={formatPrice}
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
              {selectedItem.description && (
                <p className="text-gray-600">{selectedItem.description}</p>
              )}

              {/* Modifiers เลือกหลายอย่าง */}
              {selectedItem.modifiers && selectedItem.modifiers.length > 0 && (
                <div>
                  <label className="font-medium">Modifiers:</label>
                  <div className="flex flex-col gap-2 mt-2">
                    {selectedItem.modifiers.map((modifier) => (
                      <label
                        key={modifier.id}
                        className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes(modifier.id)}
                          onChange={() => handleModifierToggle(modifier.id)}
                          className="rounded"
                        />
                        <span className="flex-1">{modifier.name}</span>
                        {modifier.price_baht > 0 && (
                          <span className="text-sm text-green-600">
                            +{formatPrice(modifier.price_baht)}
                          </span>
                        )}
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
              <Button onClick={handleAddToCart} className="w-full">
                เพิ่มลงตะกร้า
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// MenuCard Component with Framer Motion
interface MenuCardProps {
  item: MenuItem;
  index: number;
  onAddToCart: () => void;
  formatPrice: (price: number) => string;
}

function MenuCard({ item, index, onAddToCart, formatPrice }: MenuCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              width={400}
              height={300}
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
          {item.category && (
            <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800 hover:bg-white/90">
              {item.category.name}
            </Badge>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
            <span className="font-medium text-green-600 ml-2 flex-shrink-0">
              {formatPrice(item.price_baht)}
            </span>
          </div>
          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2 flex-1">
              {item.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onAddToCart}
          >
            เพิ่มลงตะกร้า
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
