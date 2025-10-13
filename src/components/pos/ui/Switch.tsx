"use client";
import { useState } from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const toggle = () => {
    setIsChecked(!isChecked);
    onCheckedChange(!isChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={toggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        isChecked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          isChecked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
