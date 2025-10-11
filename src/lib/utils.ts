import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderItem, Bill, BillMenuItem, Order } from "@/lib/data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateItemTotal(item: OrderItem) {
  let total = item.menuItem.price;

  // รวมราคาของ selectedOptions
  if (item.selectedOptions) {
    for (const [optionName, choiceLabel] of Object.entries(
      item.selectedOptions
    )) {
      const option = item.menuItem.options?.find((o) => o.name === optionName);
      const choice = option?.choices.find((c) => c.label === choiceLabel);
      if (choice) total += choice.price;
    }
  }

  // รวมราคาของ selectedExtras
  if (item.selectedExtras) {
    total += item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  }

  return total * item.quantity;
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

const SERVICE_CHARGE_RATE = 0.1;
const VAT_RATE = 0.07;

export const generateBillFromOrder = (
  order: Order,
  method: "Cash" | "QR"
): Bill => {
  const items: BillMenuItem[] = order.items.map((item) => ({
    menuItem: item.menuItem,
    quantity: item.quantity,
    selectedOptions: item.selectedOptions,
    selectedExtras: item.selectedExtras,
  }));

  let subTotal = 0;
  items.forEach((item) => {
    let itemPrice = item.menuItem.price;

    if (item.selectedExtras) {
      item.selectedExtras.forEach((extra) => {
        itemPrice += extra.price;
      });
    }

    subTotal += itemPrice * item.quantity;
  });

  const serviceCharge = parseFloat((subTotal * SERVICE_CHARGE_RATE).toFixed(2));
  const vat = parseFloat((subTotal * VAT_RATE).toFixed(2));
  const total = parseFloat((subTotal + serviceCharge + vat).toFixed(2));

  return {
    id: `B-${order.id}`,
    time: new Date().toISOString(),
    tableId: order.tableId,
    method,
    items,
    subTotal,
    serviceCharge,
    vat,
    total,
  };
};

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

export const getItemTotal = (item: BillMenuItem) => {
  const optionsTotal = item.selectedOptions
    ? Object.entries(item.selectedOptions).reduce((sum, [, value]) => {
        // สมมติว่า value คือราคาที่เก็บใน selectedOptions (ถ้าเก็บแค่ label ต้อง map กับ menuItem.options)
        return sum; // ถ้าคุณเก็บราคาจริงใน selectedOptions ให้รวมตรงนี้
      }, 0)
    : 0;

  const extrasTotal =
    item.selectedExtras?.reduce((sum, e) => sum + e.price, 0) ?? 0;

  return (item.menuItem.price + optionsTotal + extrasTotal) * item.quantity;
};

export const getItemUnitPrice = (item: BillMenuItem) => {
  const optionsTotal = 0; // เช่นเดียวกับด้านบน
  const extrasTotal =
    item.selectedExtras?.reduce((sum, e) => sum + e.price, 0) ?? 0;
  return item.menuItem.price + optionsTotal + extrasTotal;
};
