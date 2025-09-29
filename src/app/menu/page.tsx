"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { menuItems } from "@/lib/data";
import { MenuCard } from "@/components/MenuCard";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).sort();

  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
    });
  };

  return (
    <div className="space-y-6">
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

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="w-full justify-start mb-4 overflow-x-auto">
          <TabsTrigger value="All">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

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
                  onAddToCart={() => handleAddToCart(item)}
                />
              ))}
          </div>
        </TabsContent>

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
                    onAddToCart={() => handleAddToCart(item)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
