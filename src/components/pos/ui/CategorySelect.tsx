"use client";
import { useState } from "react";
import { menuItems } from "@/lib/data";

export default function CategorySelect({
  onSelect,
}: {
  onSelect: (cat: string) => void;
}) {
  // ดึง categories จาก menuItems
  const categories = Array.from(new Set(menuItems.map((m) => m.category)));
  const [selected, setSelected] = useState(categories[0] || "");
  const [newCategory, setNewCategory] = useState("");

  const handleChange = (value: string) => {
    if (value === "Add new...") {
      setSelected(value);
      onSelect(""); // ยังไม่เลือก category
    } else {
      setSelected(value);
      onSelect(value);
    }
  };

  return (
    <div className="w-64">
      <select
        className="border w-full px-4 py-2 rounded-md"
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
        <option value="Add new...">Add new...</option>
      </select>

      {selected === "Add new..." && (
        <input
          type="text"
          placeholder="Enter new category"
          className="border rounded-lg px-3 py-2 mt-3 w-full"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value);
            onSelect(e.target.value);
          }}
        />
      )}
    </div>
  );
}
