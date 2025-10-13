// app/history/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale/th";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { formatPrice } from "@/lib/utils";
import { getAllOrders, getAllPayments } from "@/lib/api";

// 📈 charts (recharts already allowed in project style guide)
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

/* ---------------- Types & helpers ---------------- */

type RawPayment = {
  id?: string;
  order_id?: string;
  method?: string;
  amount_baht?: number;
  currency?: string;
  provider?: string;
  provider_ref?: string;
  status?: string;
  created_at?: string;
};

type Payment = {
  id: string;
  orderId: string;
  method: string;
  amountBaht: number;
  currency: string;
  provider?: string;
  providerRef?: string;
  status: string;
  createdAtISO: string;
  createdDate: Date | null;
};

function normalizePayment(p: RawPayment): Payment {
  const iso = p.created_at ?? "";
  return {
    id: String(p.id ?? ""),
    orderId: String(p.order_id ?? ""),
    method: String(p.method ?? "-"),
    amountBaht: Number(p.amount_baht ?? 0),
    currency: String(p.currency ?? "THB"),
    provider: p.provider,
    providerRef: p.provider_ref,
    status: String(p.status ?? "unknown").toLowerCase(),
    createdAtISO: iso,
    createdDate: iso ? parseISO(iso) : null,
  };
}

function by<T, K extends string | number>(list: T[], keyFn: (t: T) => K) {
  const m = new Map<K, T[]>();
  list.forEach((item) => {
    const k = keyFn(item);
    m.set(k, [...(m.get(k) ?? []), item]);
  });
  return m;
}

/* ---------------- Page ---------------- */

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [rawPayments, setRawPayments] = useState<RawPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [granularity, setGranularity] = useState<"daily" | "monthly">("daily");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [o, p] = await Promise.all([getAllOrders(), getAllPayments()]);
        if (!mounted) return;
        setOrders(Array.isArray(o?.data) ? o.data : []);
        setRawPayments(Array.isArray(p?.data) ? (p.data as RawPayment[]) : []);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("โหลดประวัติไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Normalize & filter to succeeded/paid only
  const payments: Payment[] = useMemo(() => {
    return rawPayments
      .map(normalizePayment)
      .filter((p) => ["succeeded", "paid"].includes(p.status));
  }, [rawPayments]);

  // Kpis
  const totalRevenue = useMemo(
    () => payments.reduce((s, x) => s + (x.amountBaht || 0), 0),
    [payments]
  );
  const byMethod = useMemo(() => {
    const m = new Map<string, number>();
    payments.forEach((p) => {
      m.set(p.method, (m.get(p.method) ?? 0) + (p.amountBaht || 0));
    });
    return Array.from(m.entries()).map(([method, amount]) => ({
      method,
      amount,
    }));
  }, [payments]);

  // Group for table Orders tab
  const closedOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          String(o.status || "").toLowerCase() === "closed" ||
          String(o.status || "").toLowerCase() === "paid"
      ),
    [orders]
  );

  // Build chart dataset
  const chartData = useMemo(() => {
    const fmtKey =
      granularity === "daily"
        ? (d: Date) => format(d, "yyyy-MM-dd")
        : (d: Date) => format(d, "yyyy-MM");

    const grouped = by(
      payments.filter((p) => !!p.createdDate),
      (p) => fmtKey(p.createdDate as Date)
    );

    const rows = Array.from(grouped.entries())
      .map(([k, list]) => {
        const sum = list.reduce((s, x) => s + (x.amountBaht || 0), 0);
        const count = list.length;
        return { period: k, revenue: sum, count };
      })
      .sort((a, b) => a.period.localeCompare(b.period)); // chronological

    // Beautify x-axis labels
    return rows.map((r) => ({
      ...r,
      label:
        granularity === "daily"
          ? format(parseISO(r.period), "d MMM", { locale: th })
          : format(parseISO(r.period + "-01"), "MMM yyyy", { locale: th }),
    }));
  }, [payments, granularity]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold">History & Analytics</h2>

        <div className="flex gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Granularity</Label>
            <Select
              value={granularity}
              onValueChange={(v: "daily" | "monthly") => setGranularity(v)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="เลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">รายวัน</SelectItem>
                <SelectItem value="monthly">รายเดือน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Chart</Label>
            <Select
              value={chartType}
              onValueChange={(v: "bar" | "line") => setChartType(v)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="ชนิดกราฟ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="line">Line</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {error ? <div className="text-red-600">{error}</div> : null}

      {/* -------- Overview / Chart -------- */}
      <Card>
        <CardHeader>
          <CardTitle>รายได้รวม & กราฟสรุป</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* KPI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">รายได้รวม</div>
              <div className="text-lg font-semibold">
                {formatPrice(totalRevenue)}
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">จำนวนการชำระ</div>
              <div className="text-lg font-semibold">{payments.length}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">เฉลี่ย/ครั้ง</div>
              <div className="text-lg font-semibold">
                {formatPrice(
                  payments.length ? totalRevenue / payments.length : 0
                )}
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">วิธีที่นิยม</div>
              <div className="text-lg font-semibold">
                {byMethod.sort((a, b) => b.amount - a.amount)[0]?.method ?? "—"}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer>
              {chartType === "bar" ? (
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => formatPrice(v)} />
                  <Legend />
                  <Bar dataKey="revenue" name="รายได้ (฿)" />
                </BarChart>
              ) : (
                <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => formatPrice(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="รายได้ (฿)" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Breakdown by method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {byMethod.map((m) => (
              <div
                key={m.method}
                className="rounded-lg border p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {m.method}
                  </Badge>
                </div>
                <div className="font-medium">{formatPrice(m.amount)}</div>
              </div>
            ))}
            {byMethod.length === 0 && (
              <div className="text-sm text-muted-foreground">
                ไม่พบข้อมูลการชำระเงิน
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* -------- Tabs: Orders & Payments raw lists -------- */}
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">ประวัติออเดอร์</TabsTrigger>
          <TabsTrigger value="payments">ประวัติการชำระเงิน</TabsTrigger>
        </TabsList>

        {/* Orders table (closed/paid) */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Closed / Paid Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {closedOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">#{o.id}</TableCell>
                      <TableCell>
                        {o.table_name || o.table_id || o.tableId || "-"}
                      </TableCell>
                      <TableCell>
                        {o.closed_at
                          ? format(parseISO(o.closed_at), "Pp", { locale: th })
                          : o.created_at
                          ? format(parseISO(o.created_at), "Pp", { locale: th })
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(
                          Number(o.total_baht ?? o.subtotal_baht ?? 0)
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {closedOrders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-sm text-muted-foreground"
                      >
                        ไม่พบบันทึกออเดอร์ที่ปิดแล้ว
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments table */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments
                    .slice() // copy
                    .sort((a, b) =>
                      (b.createdAtISO || "").localeCompare(a.createdAtISO || "")
                    )
                    .map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.id}</TableCell>
                        <TableCell>#{p.orderId || "-"}</TableCell>
                        <TableCell className="capitalize">
                          <Badge variant="secondary">{p.method}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              p.status === "succeeded" || p.status === "paid"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : p.status === "pending"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                            }
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {p.provider ? (
                            <>
                              <span className="font-medium">{p.provider}</span>
                              {p.providerRef ? (
                                <span className="text-muted-foreground ml-1">
                                  · {p.providerRef}
                                </span>
                              ) : null}
                            </>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {p.createdAtISO
                            ? format(parseISO(p.createdAtISO), "Pp", {
                                locale: th,
                              })
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(p.amountBaht)}
                        </TableCell>
                      </TableRow>
                    ))}

                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-sm text-muted-foreground"
                      >
                        ไม่พบบันทึกการชำระเงิน
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
