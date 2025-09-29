"use client";

import { Bill, currentBill } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
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
import { useState } from "react";
import {
  CreditCard,
  PocketKnife,
  Printer,
  Receipt,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<Bill["method"]>("Cash");
  const router = useRouter();

  const handlePayment = () => {
    alert("Payment successful!");
    router.push("/history");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Payment / Billing</h2>
        <p className="text-muted-foreground">Table {currentBill.tableId}</p>
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
                {currentBill.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.price * item.qty)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(currentBill.subTotal)}
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
                    {formatPrice(currentBill.serviceCharge)}
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
                    {formatPrice(currentBill.vat)}
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
                    {formatPrice(currentBill.total)}
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
                setPaymentMethod(value as Bill["method"])
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
