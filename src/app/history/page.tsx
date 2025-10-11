"use client";

import { useState } from "react";
import { Bill, bills } from "@/lib/data";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Eye, Receipt } from "lucide-react";

export default function HistoryPage() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Billing History</h2>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.tableId}</TableCell>
                  <TableCell>{format(new Date(bill.time), "PPp")}</TableCell>
                  <TableCell>{formatPrice(bill.total)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        bill.method === "Cash"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {bill.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBill(bill)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Bill Details - {selectedBill?.id}</span>
              <Badge
                variant="secondary"
                className={
                  selectedBill?.method === "Cash"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }
              >
                {selectedBill?.method}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedBill ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Table {selectedBill.tableId}</span>
                <span>{format(new Date(selectedBill.time), "PPp")}</span>
              </div>

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
                  {selectedBill.items.map((item, index) => {
                    // รวมราคาของ extras
                    const extrasTotal =
                      item.selectedExtras?.reduce(
                        (sum, e) => sum + e.price,
                        0
                      ) || 0;

                    // รวมราคาของ options (ถ้ามีราคา)
                    const optionsTotal = Object.values(
                      item.selectedOptions || {}
                    ).reduce(
                      (sum, value) =>
                        sum + (typeof value === "number" ? value : 0),
                      0
                    );

                    const unitPrice =
                      item.menuItem.price + extrasTotal + optionsTotal;
                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <TableRow key={index}>
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
                          {formatPrice(unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(itemTotal)}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Subtotal / Service / VAT / Total */}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(selectedBill.subTotal)}
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
                      {formatPrice(selectedBill.serviceCharge)}
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
                      {formatPrice(selectedBill.vat)}
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
                      {formatPrice(selectedBill.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  <Receipt className="w-4 h-4 mr-2" /> Print Receipt
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-10 text-gray-500 italic">
              No bill selected.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
