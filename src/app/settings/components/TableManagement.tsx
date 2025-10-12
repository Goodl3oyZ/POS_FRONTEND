"use client";

import { useState } from "react";
import { Table as TableType, tables as initialTables } from "@/lib/data";
import AddTableDialog from "@/components/ui/AddTableDialog";
import EditTableDialog from "@/components/ui/EditTableDialog";

export default function TableManagement() {
  const [tables, setTables] = useState<TableType[]>(initialTables);

  // ดึง zones ทั้งหมดจาก tables
  const zones = Array.from(new Set(tables.map((t) => t.zone)));

  const handleAddTable = (newTable: TableType, newZone?: string) => {
    setTables([...tables, newTable]);
    if (newZone && !zones.includes(newZone)) {
      zones.push(newZone); // เพิ่ม zone ใหม่
    }
  };

  const handleUpdateTable = (updatedTable: TableType) => {
    setTables(tables.map((t) => (t.id === updatedTable.id ? updatedTable : t)));
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header + Add Table */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Table Management</h2>
        <AddTableDialog tables={tables} onAdd={handleAddTable} />
      </div>

      {/* Tables grouped by zone */}
      {zones.map((zone) => (
        <div key={zone} className="space-y-2">
          <h3 className="text-xl font-medium">{zone} Zone</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-700">
                    Table ID
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-700">
                    Capacity
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {tables
                  .filter((t) => t.zone === zone)
                  .map((t) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{t.id}</td>
                      <td className="px-4 py-2">{t.capacity}</td>
                      <td className="px-4 py-2 text-right">
                        <EditTableDialog
                          table={t}
                          tables={tables}
                          onUpdate={handleUpdateTable}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
