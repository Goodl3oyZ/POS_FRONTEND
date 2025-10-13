"use client";

import { LogOut, UserCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { user, logout } = useAuth();
  const { state: cartState } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // If user is not logged in, show login button
  if (!user) {
    return (
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
        {/* App Name */}
        <h1 className="font-semibold text-lg">Restaurant POS</h1>

        {/* Login Button */}
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/login">เข้าสู่ระบบ</Link>
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      {/* App Name */}
      <h1 className="font-semibold text-lg">Restaurant POS</h1>

      {/* Cart + User Info + Logout */}
      <div className="flex items-center gap-4">
        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <ShoppingCart size={20} />
          <span>ตะกร้า</span>
          {cartState.items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-gray-600" />
          <div className="text-right">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-gray-500">
              {user.role === "admin" ? "ผู้ดูแลระบบ" : "พนักงาน"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}
