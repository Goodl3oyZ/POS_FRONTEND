"use client";

import { useState } from "react";

export default function TableZoneSelect({
  tables,
  selectedZone,
  onSelect,
  onNewZoneChange,
}: {
  tables: { zone: string }[];
  selectedZone?: string;
  onSelect: (zone: string) => void;
  onNewZoneChange?: (zone: string) => void;
}) {
  const zones = Array.from(new Set(tables.map((t) => t.zone)));
  const [selected, setSelected] = useState(selectedZone || zones[0] || "");
  const [newZone, setNewZone] = useState("");

  const handleChange = (value: string) => {
    if (value === "Add new...") {
      setSelected(value);
      onSelect(""); // ยังไม่เลือก zone เดิม
    } else {
      setSelected(value);
      onSelect(value);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Table Zone
      </label>

      <select
        className="border w-full px-4 py-2 rounded-md"
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
      >
        {zones.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
        <option value="Add new...">➕ Add new...</option>
      </select>

      {selected === "Add new..." && (
        <input
          type="text"
          placeholder="Enter new zone name"
          className="border rounded-lg px-3 py-2 mt-3 w-full"
          value={newZone}
          onChange={(e) => {
            setNewZone(e.target.value);
            onSelect(e.target.value);
            if (onNewZoneChange) onNewZoneChange(e.target.value);
          }}
        />
      )}
    </div>
  );
}
