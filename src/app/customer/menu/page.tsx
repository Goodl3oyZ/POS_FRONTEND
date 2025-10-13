"use client";

import { useState } from "react";
import { menuItems } from "@/lib/data";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Bell, ListOrdered } from "lucide-react";
import Image from "next/image";
import MenuItemCard from "@/components/customer/MenuItemCard";

function OrderButton() {
  const router = useRouter();

  const goToOrder = () => {
    // กดแล้วไปหน้า order
    router.push("/customer/order");
  };

  return (
    <button
      onClick={goToOrder}
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
    >
      <ListOrdered className="w-5 h-5" />
    </button>
  );
}

function CartButton() {
  const router = useRouter();

  const goToCart = () => {
    router.push("/customer/cart"); // เปลี่ยนเป็น path ของหน้า cart
  };

  return (
    <button
      onClick={goToCart}
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
    >
      <ShoppingCart className="w-5 h-5" />
    </button>
  );
}

export default function CustomerMenuPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // สร้างหมวดหมู่จากข้อมูล
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  // กรองข้อมูลตาม search และ category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🔹 Topbar แรก */}
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-20">
        <span className="font-semibold text-lg">Table 12</span>
        <div className="flex gap-3">
          {/* <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Bell className="w-5 h-5" />
          </button> */}
          <CartButton />
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <OrderButton />
          </button>
        </div>
      </div>

      {/* 🔹 Topbar ที่สอง (ค้นหา + หมวดหมู่) */}
      <div className="bg-white px-4 py-2 shadow-sm sticky top-[56px] z-10">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ค้นหาเมนู..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-none focus:ring-0 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              !selectedCategory ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            ทั้งหมด
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 แสดงเมนู */}
      <div className="p-4 space-y-6">
        {categories.map((category) => {
          const itemsInCategory = filteredItems.filter(
            (i) => i.category === category
          );
          if (itemsInCategory.length === 0) return null;
          return (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-2">{category}</h2>
              <div className="grid grid-cols-1 gap-3">
                {itemsInCategory.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
