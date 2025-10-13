"use client";

import { useState, useEffect } from "react";

export default function EditStoreTypeSelect({
  value,
  onChange,
  types = ["Thai", "Japanese", "Coffee & Dessert", "Fast Food", "Italian"],
}: {
  value: string;
  onChange: (type: string) => void;
  types?: string[]; // list ประเภทอาหารเริ่มต้น
}) {
  const [selected, setSelected] = useState(value);
  const [newType, setNewType] = useState("");

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (val: string) => {
    if (val === "Add new...") {
      setSelected(val);
      onChange(""); // ยังไม่เลือก
    } else {
      setSelected(val);
      onChange(val);
    }
  };

  return (
    <div className="w-full">
      <select
        className="border w-full px-4 py-2 rounded-md"
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
      >
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
        <option value="Add new...">➕ Add new...</option>
      </select>

      {selected === "Add new..." && (
        <input
          type="text"
          placeholder="Enter new type"
          className="border rounded-lg px-3 py-2 mt-3 w-full"
          value={newType}
          onChange={(e) => {
            setNewType(e.target.value);
            onChange(e.target.value);
          }}
        />
      )}
    </div>
  );
}
