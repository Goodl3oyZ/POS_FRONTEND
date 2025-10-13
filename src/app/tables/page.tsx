"use client";

import { useEffect, useMemo, useState } from "react";
import { TableCard } from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getAllTables, getTableOrders } from "@/lib/api";
import type { Table as UiTable } from "@/lib/data";
import { Loader2 } from "lucide-react";

/** แปลงสถานะจาก backend -> ป้ายที่ใช้ใน UI */
function normalizeStatusLabel(raw?: string) {
  const s = (raw || "").toLowerCase();
  if (s === "free" || s === "available") return "Available";
  if (s === "occupied") return "Occupied";
  if (s === "billing") return "Billing";
  if (s === "paid" || s === "succeeded") return "Paid";
  // fallback: title-case
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "Unknown";
}

const statusConfig = {
  Available: {
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800",
  },
  Occupied: {
    variant: "secondary" as const,
    className: "bg-green-100 text-green-800",
  },
  Billing: {
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800",
  },
  Paid: {
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800",
  },
  Unknown: {
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800",
  },
} as const;

type BackendTable = {
  id: string;
  name: string; // เช่น "T2"
  seats: number; // ความจุ
  status: string; // เช่น "free" | "occupied"
  qr_code?: string;
  area?: { id: string; name: string }; // เช่น { name: "Main Hall" }
};

export default function TablesPage() {
  const router = useRouter();
  const [tables, setTables] = useState<BackendTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeZone, setActiveZone] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const [tableOrders, setTableOrders] = useState<any[] | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getAllTables();
        if (!mounted) return;

        const data: BackendTable[] = Array.isArray(res?.data) ? res.data : [];
        setTables(data);

        // ตั้งค่า zone เริ่มต้นจาก area.name
        const zoneList = Array.from(
          new Set(data.map((t) => t.area?.name || "Unknown"))
        );
        setActiveZone(zoneList[0] || "Unknown");

        setError(null);
      } catch (e) {
        console.error(e);
        setError("โหลดข้อมูลโต๊ะไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /** รายชื่อโซน (ใช้ area.name จาก backend) */
  const zones = useMemo(
    () =>
      Array.from(new Set(tables.map((t) => t.area?.name || "Unknown"))).sort(),
    [tables]
  );

  /** โต๊ะในโซนที่เลือก */
  const tablesInZone = useMemo(
    () => tables.filter((t) => (t.area?.name || "Unknown") === activeZone),
    [tables, activeZone]
  );

  /** โต๊ะที่เลือก */
  const selectedTableData = useMemo(
    () => tables.find((t) => String(t.id) === String(selectedTable)),
    [tables, selectedTable]
  );

  /** ตัวเลขสถิติบนปุ่มโซน */
  const zoneStats = zones.map((zone) => {
    const zoneTables = tables.filter(
      (t) => (t.area?.name || "Unknown") === zone
    );
    const statusLabels = zoneTables.map((t) => normalizeStatusLabel(t.status));
    return {
      zone,
      total: zoneTables.length,
      available: statusLabels.filter((s) => s === "Available").length,
      occupied: statusLabels.filter((s) => s === "Occupied").length,
      billing: statusLabels.filter((s) => s === "Billing" || s === "Paid")
        .length,
    };
  });

  const loadTableOrders = async (tableId: string) => {
    try {
      setLoadingOrders(true);
      const res = await getTableOrders(tableId);
      setTableOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setTableOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone Tabs */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div>
          <h2 className="text-2xl font-semibold">Tables</h2>
          <p className="text-muted-foreground">
            Manage restaurant tables and orders
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:flex md:items-center">
          {zoneStats.map(({ zone, available, occupied }) => (
            <Button
              key={zone}
              variant={zone === activeZone ? "default" : "outline"}
              onClick={() => setActiveZone(zone)}
              className="flex-1 h-auto py-2"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">{zone || "Unknown"}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={
                      zone === activeZone ? "text-white" : "text-green-600"
                    }
                  >
                    {available} free
                  </span>
                  <span className="opacity-50">|</span>
                  <span
                    className={
                      zone === activeZone ? "text-white" : "text-blue-600"
                    }
                  >
                    {occupied} busy
                  </span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Table Cards */}
      {loading ? (
        <div className="flex items-center text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading tables...
        </div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {tablesInZone.map((table) => {
            const statusLabel = normalizeStatusLabel(table.status);
            // สร้างอ็อบเจ็กต์ให้ตรงกับชนิด UiTable อย่างชัดเจน
            const tableForCard: UiTable = {
              id: String(table.id),
              zone: table.area?.name || "Unknown",
              status: statusLabel as UiTable["status"],
              capacity: Number(table.seats ?? 0),
              // currentOrder: undefined (optional)
            };
            return (
              <TableCard
                key={table.id}
                table={tableForCard}
                onClick={() => {
                  const id = String(table.id);
                  setSelectedTable(id);
                  setTableOrders(null);
                  loadTableOrders(id);
                }}
                selected={String(selectedTable) === String(table.id)}
              />
            );
          })}
        </div>
      )}

      {/* Selected Table Details */}
      {selectedTableData && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Table Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Table Details</h3>
                {(() => {
                  const label = normalizeStatusLabel(selectedTableData.status);
                  const cfg =
                    statusConfig[label as keyof typeof statusConfig] ??
                    statusConfig.Unknown;
                  return (
                    <Badge variant={cfg.variant} className={cfg.className}>
                      {label}
                    </Badge>
                  );
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Table</p>
                  {/* ใช้ชื่อโต๊ะจาก response เช่น "T2" */}
                  <p className="font-medium">{selectedTableData.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Zone</p>
                  <p className="font-medium">
                    {selectedTableData.area?.name || "Unknown"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">{selectedTableData.seats} seats</p>
                </div>
                {selectedTableData.qr_code ? (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">QR Code</p>
                    <p className="font-medium">{selectedTableData.qr_code}</p>
                  </div>
                ) : null}
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setSelectedTable(null)}
                >
                  Close
                </Button>

                {normalizeStatusLabel(selectedTableData.status) ===
                  "Occupied" && (
                  <Button
                    className="flex-1"
                    onClick={() =>
                      router.push(`/tables/${selectedTableData.id}`)
                    }
                  >
                    View Orders
                  </Button>
                )}

                {normalizeStatusLabel(selectedTableData.status) ===
                  "Available" && (
                  <Button
                    className="flex-1"
                    onClick={() =>
                      router.push(`/menu?tableId=${selectedTableData.id}`)
                    }
                  >
                    New Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Orders for selected table */}
          {selectedTable && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Table Orders</h3>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading
                    orders...
                  </div>
                ) : !tableOrders || tableOrders.length === 0 ? (
                  <div className="text-muted-foreground">
                    No orders for this table.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tableOrders.map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">Order #{order.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {normalizeStatusLabel(order.status)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
