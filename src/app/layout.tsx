import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "POS System",
  description: "Restaurant POS / Ordering System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
        <AuthProvider>
          <CartProvider>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
              {/* Topbar */}
              <Topbar />
              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
