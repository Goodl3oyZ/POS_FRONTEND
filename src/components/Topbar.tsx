"use client";

import { LogOut, UserCircle } from "lucide-react";

export function Topbar() {
  const user = {
    name: "John Doe",
    role: "Cashier",
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      {/* App Name */}
      <h1 className="font-semibold text-lg">Restaurant POS</h1>

      {/* User Info + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-gray-600" />
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
