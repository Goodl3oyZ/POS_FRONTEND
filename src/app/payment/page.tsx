"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Loader2, CreditCard, PocketKnife, Receipt } from "lucide-react";
import { formatPrice } from "@/lib/utils";

import { getTablesWithOpenOrders, createPayment } from "@/lib/api";
import type { TableWithOpenOrders } from "@/lib/api/tables";

type TableRowType = TableWithOpenOrders;

export default function PaymentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<TableRowType[]>([]);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);

  // เลือกออเดอร์ที่จะรวมบิล (checkbox)
  const [selectedOrderIds, setSelectedOrderIds] = useState<
    Record<string, boolean>
  >({});

  // วิธีชำระและจำนวนเงิน (จะคำนวณให้อัตโนมัติจากยอดรวมของออเดอร์ที่เลือก)
  const [method, setMethod] = useState<"cash" | "promptpay" | "card">("cash");
  const [provider, setProvider] = useState<string>(""); // optional
  const [providerRef, setProviderRef] = useState<string>(""); // optional
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const PROMPTPAY_QR_SRC = "/images/qrpromptpay.jpg";

  // โหลดตาราง + ออเดอร์เปิดอยู่
  const loadTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTablesWithOpenOrders();
      const data = Array.isArray(res?.data) ? res.data : [];
      setTables(data);
      if (!activeTableId && data.length > 0) {
        setActiveTableId(String(data[0].id));
      }
    } catch (e: any) {
      console.error(e);
      setError("โหลดข้อมูลโต๊ะ/ออเดอร์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTable = useMemo(
    () => tables.find((t) => String(t.id) === String(activeTableId)) || null,
    [tables, activeTableId]
  );

  const orders = activeTable?.orders ?? [];

  // ติ๊กออเดอร์ทั้งหมดในโต๊ะโดยค่าเริ่มต้น (ครั้งแรกที่เปลี่ยนโต๊ะ)
  useEffect(() => {
    if (!activeTable) return;
    setSelectedOrderIds((prev) => {
      const next = { ...prev };
      for (const o of orders) {
        if (next[o.id] === undefined) next[o.id] = true; // default: เลือกไว้ทั้งหมด
      }
      return next;
    });
  }, [activeTableId]); // เมื่อเปลี่ยนโต๊ะ

  const selectedOrders = orders.filter((o: any) => selectedOrderIds[o.id]);
  const tableTotal = selectedOrders.reduce(
    (sum: number, o: any) => sum + Number(o.total_baht || 0),
    0
  );

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrderIds((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // ชำระเงิน: ยิง POST /v1/payments ทีละออเดอร์
  const handleChargeSelected = async () => {
    if (!activeTable || selectedOrders.length === 0 || submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      // ยิงต่อออเดอร์ (backend รองรับ order_id เดียวต่อ 1 payment)
      for (const o of selectedOrders) {
        await createPayment({
          order_id: o.id, // required
          method, // required
          amount_baht: Number(o.total_baht || 0), // required
          // ส่ง provider/provider_ref เมื่อจำเป็น (promptpay/บัตร)
          ...(provider ? { provider } : {}),
          ...(providerRef ? { provider_ref: providerRef } : {}),
        });
      }

      // โหลดข้อมูลใหม่หลังชำระ
      await loadTables();
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "ชำระเงินไม่สำเร็จ";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Payment (By Table)</h2>
        <div className="text-sm text-muted-foreground">
          เลือกโต๊ะ → เลือกออเดอร์ → ยืนยันชำระ
        </div>
      </div>

      {/* สรุปโต๊ะฝั่งซ้าย + รายการออเดอร์โต๊ะที่เลือกฝั่งขวา */}
      <div className="grid gap-6 md:grid-cols-[360px,1fr]">
        {/* LEFT: ตารางทั้งหมดที่มีออเดอร์เปิดอยู่ */}
        <Card>
          <CardHeader>
            <CardTitle>Tables (Open Orders)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : tables.length === 0 ? (
              <div className="text-muted-foreground">
                ไม่มีโต๊ะที่มีออเดอร์เปิดอยู่
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
                {tables.map((t: TableRowType) => {
                  const total = (t.orders || []).reduce(
                    (s: number, o: any) => s + Number(o.total_baht || 0),
                    0
                  );
                  const count = (t.orders || []).length;
                  const isActive = String(t.id) === String(activeTableId);

                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTableId(String(t.id))}
                      className={`text-left rounded-xl border p-3 hover:bg-gray-50 transition ${
                        isActive ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{t.name}</div>
                        <Badge variant="secondary" className="capitalize">
                          {t.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {count} orders • {formatPrice(total)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT: ออเดอร์ของโต๊ะที่เลือก + สรุปชำระ */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {activeTable
                    ? `Table ${activeTable.name}`
                    : "เลือกโต๊ะทางซ้าย"}
                </CardTitle>
                {activeTable ? (
                  <Badge variant="secondary" className="capitalize">
                    {activeTable.status}
                  </Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!activeTable ? (
                <div className="text-muted-foreground">
                  กรุณาเลือกโต๊ะเพื่อดูออเดอร์
                </div>
              ) : orders.length === 0 ? (
                <div className="text-muted-foreground">
                  ไม่มีออเดอร์เปิดอยู่ในโต๊ะนี้
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">เลือก</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">ยอด</TableHead>
                      <TableHead>สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o: any) => (
                      <TableRow key={o.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={!!selectedOrderIds[o.id]}
                            onChange={() => handleToggleOrder(o.id)}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="font-medium">#{o.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(
                              o.created_at || Date.now()
                            ).toLocaleString("th-TH", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                          {/* แสดงรายการอาหาร (ถ้ามี) */}
                          {Array.isArray(o.items) && o.items.length > 0 && (
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              {o.items.map((it: any) => (
                                <div
                                  key={it.id}
                                  className="flex justify-between"
                                >
                                  <span>
                                    {it.menu_item_name} × {it.quantity}
                                  </span>
                                  <span>
                                    {formatPrice(
                                      Number(it.line_total_baht || 0)
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right align-top">
                          {formatPrice(Number(o.total_baht || 0))}
                        </TableCell>
                        <TableCell className="align-top capitalize">
                          {o.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Summary + Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">
                  ยอดชำระรวม (ตามออเดอร์ที่เลือก)
                </div>
                <div className="text-xl font-semibold">
                  {formatPrice(tableTotal)}
                </div>
              </div>

              {/* วิธีชำระเงิน */}
              <div className="space-y-2">
                <Label>วิธีชำระเงิน</Label>
                <RadioGroup
                  value={method}
                  onValueChange={(v) => setMethod(v as typeof method)}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <RadioGroupItem id="m-cash" value="cash" />
                    <Label htmlFor="m-cash" className="flex items-center gap-2">
                      <PocketKnife className="h-4 w-4" /> Cash
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <RadioGroupItem id="m-pp" value="promptpay" />
                    <Label htmlFor="m-pp" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> PromptPay
                    </Label>
                  </div>
                  {/* <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <RadioGroupItem id="m-card" value="card" />
                    <Label htmlFor="m-card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Card
                    </Label>
                  </div> */}
                </RadioGroup>
              </div>

              {/* ช่อง optional สำหรับ provider / provider_ref */}
              {method === "promptpay" && (
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      สแกนเพื่อชำระ
                    </div>
                    <div className="text-2xl font-semibold">
                      {formatPrice(tableTotal)}
                    </div>

                    {/* รูป QR ที่เตรียมไว้ */}
                    <div className="bg-white p-3 rounded-lg">
                      <Image
                        src={PROMPTPAY_QR_SRC}
                        alt="PromptPay QR"
                        width={220}
                        height={220}
                        className="rounded-md"
                        priority
                      />
                    </div>

                    <a
                      href={PROMPTPAY_QR_SRC}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline text-muted-foreground"
                    >
                      เปิดภาพขนาดใหญ่
                    </a>

                    <p className="text-xs text-muted-foreground text-center">
                      ลูกค้าสแกนแล้วแสดงสลิปให้แคชเชียร์ตรวจสอบ จากนั้นกด
                      “ยืนยันชำระ”
                    </p>
                  </div>
                </div>
              )}

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={
                  submitting || !activeTable || selectedOrders.length === 0
                }
                onClick={handleChargeSelected}
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    กำลังชำระเงิน...
                  </span>
                ) : (
                  <>
                    <Receipt className="h-4 w-4 mr-2" />
                    ยืนยันชำระ{" "}
                    {selectedOrders.length > 1
                      ? `(${selectedOrders.length} ออเดอร์)`
                      : ""}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
