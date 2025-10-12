"use client";
import { useState } from "react";

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder,
}: SelectProps) {
  const [selected, setSelected] = useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    onValueChange(e.target.value);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="h-11 w-full px-4 py-2 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200 bg-white"
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
