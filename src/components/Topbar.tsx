"use client";

import { LogOut, UserCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { user, logout } = useAuth();
  const cart = useCart();
  const router = useRouter();

  // รองรับทั้งรูปแบบ { state: { items } } และ { items }
  const cartItems = (cart as any)?.state?.items ?? (cart as any)?.items ?? [];
  const cartQty = Array.isArray(cartItems)
    ? cartItems.reduce((sum: number, i: any) => sum + (i?.quantity || 0), 0)
    : 0;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand → คลิกแล้วไป /menu */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 font-semibold text-lg tracking-tight rounded-md hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="hidden sm:inline">Restaurant POS</span>
          <span className="sm:hidden">POS</span>
        </Link>

        {/* Right – ขึ้นกับสถานะผู้ใช้ */}
        {!user ? (
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 rounded-md text-sm text-gray-700 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 px-2 py-2 sm:px-3 sm:py-2"
              aria-label={`Cart, ${cartQty} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">ตะกร้า</span>
              {cartQty > 0 && (
                <span
                  className="absolute -top-1 -right-1 sm:-right-2 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium"
                  aria-hidden="true"
                >
                  {cartQty}
                </span>
              )}
            </Link>

            {/* User info (ย่อบนจอเล็ก) */}
            <div className="hidden sm:flex items-center gap-2 max-w-[14rem]">
              <UserCircle className="w-6 h-6 text-gray-600" />
              <div className="text-right truncate">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs text-gray-500">
                  {user.role === "admin" ? "ผู้ดูแลระบบ" : "พนักงาน"}
                </p>
              </div>
            </div>
            <div className="sm:hidden">
              <UserCircle
                className="w-6 h-6 text-gray-600"
                aria-hidden="true"
              />
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-gray-700 hover:text-red-600"
              aria-label="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">ออก</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
