"use client";

import { useState } from "react";
import { Button } from "@/components/pos/ui/button";
import { Table } from "@/lib/data";
import TableZoneSelect from "@/components/pos/ui/Selecttable";

export default function AddTableDialog({
  tables,
  onAdd,
}: {
  tables: Table[];
  onAdd: (table: Table, newZone?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [zone, setZone] = useState("");
  const [newZone, setNewZone] = useState("");
  const [id, setId] = useState("");
  const [capacity, setCapacity] = useState<number>(2);

  const handleSubmit = () => {
    if (!id) return alert("Please enter table ID");
    if (!zone) return alert("Please select or enter a zone");

    const newTable: Table = {
      id,
      zone,
      capacity,
      status: "Available",
    };
    onAdd(newTable, zone === newZone ? newZone : undefined);

    setOpen(false);
    setId("");
    setCapacity(2);
    setZone("");
    setNewZone("");
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>➕ Add Table</Button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Add New Table</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Table ID
                </label>
                <input
                  type="text"
                  className="border px-3 py-2 rounded-md w-full"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g. T01"
                />
              </div>

              <div>
                <TableZoneSelect
                  tables={tables}
                  selectedZone={zone}
                  onSelect={(z) => setZone(z)}
                  onNewZoneChange={(nz) => setNewZone(nz)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  className="border px-3 py-2 rounded-md w-full"
                  value={capacity}
                  min={1}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
