"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
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
import { formatPrice } from "@/lib/utils";
import { getAllOrders, getAllPayments } from "@/lib/api";

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const [o, p] = await Promise.all([getAllOrders(), getAllPayments()]);
        if (!mounted) return;
        setOrders(Array.isArray(o.data) ? o.data : []);
        setPayments(Array.isArray(p.data) ? p.data : []);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("โหลดประวัติไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const closedOrders = useMemo(
    () => orders.filter((o) => String(o.status).toLowerCase() === "closed"),
    [orders]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">History</h2>
      </div>

      {error ? <div className="text-red-600">{error}</div> : null}

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">ประวัติออเดอร์</TabsTrigger>
          <TabsTrigger value="payments">ประวัติการชำระเงิน</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Closed Orders</CardTitle>
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
                  {(loading ? [] : closedOrders).map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">#{o.id}</TableCell>
                      <TableCell>{o.table_id || o.tableId}</TableCell>
                      <TableCell>
                        {o.closed_at
                          ? format(new Date(o.closed_at), "PPp")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(Number(o.total_baht ?? 0))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(loading ? [] : payments).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.id}</TableCell>
                      <TableCell>#{p.order_id || p.orderId}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{p.method}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(Number(p.amount ?? 0))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
