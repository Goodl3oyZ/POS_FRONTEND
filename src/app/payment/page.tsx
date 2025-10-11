"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CreditCard,
  PocketKnife,
  Printer,
  Receipt,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type MenuItem = {
  name: string;
  price: number;
  options?: { [key: string]: string[] }; // ex: Protein: ["Chicken", "Shrimp"]
  extras?: { label: string; price: number }[]; // optional extras
};

type OrderItem = {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: { [key: string]: string };
  selectedExtras?: { label: string; price: number }[];
};

type Bill = {
  tableId: string;
  items: OrderItem[];
  subTotal: number;
  serviceCharge: number;
  vat: number;
  total: number;
  method: "Cash" | "QR";
};

// เมนูตัวอย่าง
const menu: MenuItem[] = [
  {
    name: "Pad Thai",
    price: 130,
    options: {
      Protein: ["Chicken", "Shrimp", "Tofu"],
      Spiciness: ["Mild", "Medium", "Hot"],
    },
    extras: [
      { label: "Cheese", price: 20 },
      { label: "Extra Noodles", price: 30 },
    ],
  },
  {
    name: "Green Curry",
    price: 150,
    options: { Protein: ["Chicken", "Beef"], Spiciness: ["Mild", "Hot"] },
    extras: [{ label: "Extra Coconut Milk", price: 25 }],
  },
  {
    name: "Thai Ice Tea",
    price: 50,
    extras: [{ label: "Boba", price: 15 }],
  },
];

// สุ่ม order พร้อม option & extra
function generateRandomOrder(tableId: string): Bill {
  const numItems = Math.floor(Math.random() * 3) + 2;
  const items: OrderItem[] = [];

  for (let i = 0; i < numItems; i++) {
    const menuItem = menu[Math.floor(Math.random() * menu.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;

    // เลือก option แบบสุ่ม
    const selectedOptions: { [key: string]: string } = {};
    if (menuItem.options) {
      for (const key in menuItem.options) {
        const choices = menuItem.options[key];
        selectedOptions[key] =
          choices[Math.floor(Math.random() * choices.length)];
      }
    }

    // เลือก extras แบบสุ่ม
    let selectedExtras: { label: string; price: number }[] = [];
    if (menuItem.extras && menuItem.extras.length > 0) {
      selectedExtras = menuItem.extras.filter(() => Math.random() > 0.5);
    }

    items.push({ menuItem, quantity, selectedOptions, selectedExtras });
  }

  const subTotal = items.reduce((sum, item) => {
    const extrasTotal =
      item.selectedExtras?.reduce((s, e) => s + e.price, 0) || 0;
    return sum + (item.menuItem.price + extrasTotal) * item.quantity;
  }, 0);

  const serviceCharge = subTotal * 0.1;
  const vat = (subTotal + serviceCharge) * 0.07;
  const total = subTotal + serviceCharge + vat;

  const method = Math.random() > 0.5 ? "Cash" : "QR";

  return { tableId, items, subTotal, serviceCharge, vat, total, method };
}

export default function PaymentPage({ tableId }: { tableId: string }) {
  const bill = generateRandomOrder(tableId);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "QR">(
    bill.method
  );
  const router = useRouter();

  const handlePayment = () => {
    alert(`Payment successful via ${paymentMethod}!`);
    router.push("/history");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Payment / Billing</h2>
        <p className="text-muted-foreground">Table {bill.tableId}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr,400px]">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bill.items.map((item, idx) => {
                  const extrasTotal =
                    item.selectedExtras?.reduce((sum, e) => sum + e.price, 0) ||
                    0;
                  const itemTotal =
                    (item.menuItem.price + extrasTotal) * item.quantity;

                  return (
                    <TableRow key={idx}>
                      <TableCell>
                        {item.menuItem.name}
                        <div className="text-xs text-muted-foreground space-y-1">
                          {item.selectedOptions &&
                            Object.entries(item.selectedOptions).map(
                              ([key, value]) => (
                                <div key={key}>
                                  {key}: {value}
                                </div>
                              )
                            )}
                          {item.selectedExtras?.length ? (
                            <div>
                              Extras:{" "}
                              {item.selectedExtras
                                .map((e) => e.label)
                                .join(", ")}
                            </div>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.menuItem.price + extrasTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(itemTotal)}
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(bill.subTotal)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-right text-muted-foreground"
                  >
                    Service Charge (10%)
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatPrice(bill.serviceCharge)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-right text-muted-foreground"
                  >
                    VAT (7%)
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatPrice(bill.vat)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-right font-semibold text-lg"
                  >
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold text-lg">
                    {formatPrice(bill.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              defaultValue={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "Cash" | "QR")
              }
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="Cash" id="cash" />
                <Label className="flex items-center gap-2" htmlFor="cash">
                  <PocketKnife className="h-4 w-4" /> Cash
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="QR" id="qr" />
                <Label className="flex items-center gap-2" htmlFor="qr">
                  <CreditCard className="h-4 w-4" /> QR PromptPay
                </Label>
              </div>
            </RadioGroup>

            <div className="pt-6 space-y-3">
              <Button
                onClick={handlePayment}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Receipt className="w-4 h-4 mr-2" /> Confirm Payment
              </Button>
              <Button variant="outline" className="w-full">
                <Printer className="w-4 h-4 mr-2" /> Print Receipt
              </Button>
              <Button variant="destructive" className="w-full">
                <XCircle className="w-4 h-4 mr-2" /> Cancel Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
