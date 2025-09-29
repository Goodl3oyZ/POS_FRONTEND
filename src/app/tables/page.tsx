"use client";

import { useState } from "react";
import { TableCard } from "@/components/TableCard";
import { tables } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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
};

import { Users } from "lucide-react";

export default function TablesPage() {
  const [activeZone, setActiveZone] = useState("Indoor");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const zones = Array.from(new Set(tables.map((t) => t.zone))).sort();
  const tablesInZone = tables.filter((t) => t.zone === activeZone);
  const selectedTableData = tablesInZone.find((t) => t.id === selectedTable);

  // Calculate zone statistics
  const zoneStats = zones.map((zone) => {
    const zoneTables = tables.filter((t) => t.zone === zone);
    return {
      zone,
      total: zoneTables.length,
      available: zoneTables.filter((t) => t.status === "Available").length,
      occupied: zoneTables.filter((t) => t.status === "Occupied").length,
      billing: zoneTables.filter((t) => ["Billing", "Paid"].includes(t.status))
        .length,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div>
          <h2 className="text-2xl font-semibold">Tables</h2>
          <p className="text-muted-foreground">
            Manage restaurant tables and orders
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:flex md:items-center">
          {zoneStats.map(({ zone, total, available, occupied }) => (
            <Button
              key={zone}
              variant={zone === activeZone ? "default" : "outline"}
              onClick={() => setActiveZone(zone)}
              className="flex-1 h-auto py-2"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">{zone}</span>
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {tablesInZone.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => setSelectedTable(table.id)}
            selected={selectedTable === table.id}
          />
        ))}
      </div>

      {selectedTableData && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Table Details</h3>
                <Badge
                  variant={statusConfig[selectedTableData.status].variant}
                  className={statusConfig[selectedTableData.status].className}
                >
                  {selectedTableData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Table Number</p>
                  <p className="font-medium">{selectedTableData.id}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Zone</p>
                  <p className="font-medium">{selectedTableData.zone}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">
                    {selectedTableData.capacity} seats
                  </p>
                </div>
                {selectedTableData.currentOrder && (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Current Order
                      </p>
                      <p className="font-medium">
                        {formatPrice(selectedTableData.currentOrder.total)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Order Time
                      </p>
                      <p className="font-medium">
                        {formatDistanceToNow(
                          new Date(selectedTableData.currentOrder.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setSelectedTable(null)}
                >
                  Close
                </Button>
                {selectedTableData.status === "Occupied" && (
                  <Button className="flex-1">View Order</Button>
                )}
                {selectedTableData.status === "Available" && (
                  <Button className="flex-1">New Order</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedTableData.status === "Occupied" &&
            selectedTableData.currentOrder && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Current Order</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedTableData.currentOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            x{item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                    <div className="pt-4 mt-4 border-t flex justify-between items-center">
                      <p className="font-semibold">Total</p>
                      <p className="font-semibold">
                        {formatPrice(selectedTableData.currentOrder.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" className="flex-1">
                      Add Items
                    </Button>
                    <Button variant="default" className="flex-1">
                      Bill Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      )}
    </div>
  );
}
