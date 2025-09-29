import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD${year}${month}${day}${random}`;
}

export function getTableStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status.toLowerCase()) {
    case "available":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      };
    case "occupied":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
      };
    case "billing":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
      };
    case "paid":
      return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
      };
  }
}
