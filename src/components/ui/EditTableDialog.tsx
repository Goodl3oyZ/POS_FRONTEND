"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/lib/data";
import TableZoneSelect from "@/components/ui/Selecttable";

export default function EditTableDialog({
  table,
  tables,
  onUpdate,
}: {
  table: Table;
  tables: Table[];
  onUpdate: (updatedTable: Table) => void;
}) {
  const [open, setOpen] = useState(false);
  const [zone, setZone] = useState(table.zone);
  const [newZone, setNewZone] = useState("");
  const [capacity, setCapacity] = useState(table.capacity);

  const handleSave = () => {
    if (!zone) return alert("Please select or enter a zone");

    const updatedTable: Table = {
      ...table,
      zone,
      capacity,
    };
    onUpdate(updatedTable);
    setOpen(false);
  };

  return (
    <>
      <button
        className="text-blue-600 hover:underline flex items-center"
        onClick={() => setOpen(true)}
      >
        ✏️ Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Edit Table</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Table ID
                </label>
                <input
                  type="text"
                  disabled
                  className="border px-3 py-2 rounded-md w-full bg-gray-100"
                  value={table.id}
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
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
