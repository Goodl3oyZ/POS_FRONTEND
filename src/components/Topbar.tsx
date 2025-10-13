// components/Topbar.tsx
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand → /menu */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-md text-lg font-semibold tracking-tight hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="hidden sm:inline">Restaurant POS</span>
          <span className="sm:hidden">POS</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          {/* Cart — ALWAYS visible */}
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-3 sm:py-2"
            aria-label={`Cart, ${cartQty} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">ตะกร้า</span>
            {cartQty > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white sm:-right-2">
                {cartQty}
              </span>
            )}
          </Link>

          {!user ? (
            // Not logged in → show Login button
            <Button asChild>
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
          ) : (
            // Logged in → show user info + logout
            <>
              <div className="hidden max-w-[14rem] items-center gap-2 sm:flex">
                <UserCircle className="h-6 w-6 text-gray-600" />
                <div className="truncate text-right">
                  <p className="truncate text-sm font-medium">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.role === "admin" ? "ผู้ดูแลระบบ" : "พนักงาน"}
                  </p>
                </div>
              </div>
              <div className="sm:hidden">
                <UserCircle
                  className="h-6 w-6 text-gray-600"
                  aria-hidden="true"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-gray-700 hover:text-red-600"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">ออก</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
