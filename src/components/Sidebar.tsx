"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  ListOrdered,
  Settings,
  Table,
  Receipt,
  History,
} from "lucide-react";

const navItems = [
  { href: "/menu", label: "Menu", icon: Utensils },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/orders", label: "Orders", icon: ListOrdered },
  { href: "/tables", label: "Tables", icon: Table },
  { href: "/payment", label: "Payment", icon: Receipt },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
        POS System
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${
                  active
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100"
                }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
