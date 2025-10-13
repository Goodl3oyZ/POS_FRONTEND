"use client";

import { useEffect, useState } from "react";
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
import { CreditCard, PocketKnife, Receipt } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { createPayment, getAllPayments, getPaymentMethods } from "@/lib/api";

export default function PaymentPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";

  const [methods, setMethods] = useState<{ id?: string; name: string }[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [method, setMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // โหลดข้อมูลเริ่มต้น
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const [m, p] = await Promise.all([
          getPaymentMethods(),
          getAllPayments(),
        ]);
        if (!mounted) return;

        // ✅ ป้องกัน response แปลก
        const rawMethods = Array.isArray(m.data) ? m.data : [];
        const normalizedMethods = rawMethods.map((x: any) =>
          typeof x === "string"
            ? { name: x }
            : { id: x?.id ?? x?.code ?? undefined, name: x?.name ?? "Unknown" }
        );

        setMethods(normalizedMethods);
        setPayments(Array.isArray(p.data) ? p.data : []);

        // ตั้ง default method
        if (!method && normalizedMethods.length > 0)
          setMethod(normalizedMethods[0].name);

        setError(null);
      } catch (e) {
        console.error(e);
        setError("โหลดข้อมูลการชำระเงินไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ ฟังก์ชันส่งข้อมูลการชำระเงิน
  const submitPayment = async () => {
    if (!orderId || !method || !amount || submitting) return;
    try {
      setSubmitting(true);
      await createPayment({ orderId, method, amount: Number(amount) });
      router.push("/history");
    } catch (e) {
      console.error(e);
      setError("ชำระเงินไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Payment / Billing</h2>
        {orderId ? (
          <p className="text-muted-foreground">Order #{orderId}</p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr,400px]">
        {/* LEFT: payment methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : methods.length === 0 ? (
              <div className="text-muted-foreground">
                No payment methods found
              </div>
            ) : (
              <RadioGroup value={method} onValueChange={(v) => setMethod(v)}>
                {methods.map((m) => {
                  const name = typeof m === "string" ? m : m.name;
                  const id = typeof m === "string" ? m : m.id ?? m.name;
                  const isCash =
                    name?.toLowerCase?.().includes("cash") ?? false;

                  return (
                    <div
                      key={id}
                      className="flex items-center space-x-2 border rounded-lg p-4"
                    >
                      <RadioGroupItem value={name} id={`method-${id}`} />
                      <Label
                        className="flex items-center gap-2"
                        htmlFor={`method-${id}`}
                      >
                        {isCash ? (
                          <PocketKnife className="h-4 w-4" />
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                        {name}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            )}

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <input
                id="amount"
                type="number"
                className="mt-1 w-full border rounded p-2"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Confirm */}
            <div className="pt-2">
              <Button
                onClick={submitPayment}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={submitting}
              >
                <Receipt className="w-4 h-4 mr-2" />{" "}
                {submitting ? "Processing..." : "Confirm Payment"}
              </Button>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT: history */}
        <Card>
          <CardHeader>
            <CardTitle>Previous Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell>#{p.order_id || p.orderId || "-"}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(Number(p.amount ?? 0))}
                    </TableCell>
                    <TableCell>{p.method || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {payments.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                No payment records found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
