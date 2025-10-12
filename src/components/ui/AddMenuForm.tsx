"use client";
import { useState, useEffect } from "react";
import { MenuItem, MenuOption, ExtraItem } from "@/lib/data";
import CategorySelect from "@/components/ui/CategorySelect";

interface AddMenuFormProps {
  menu?: MenuItem; // ถ้ามี = edit mode
  onSave: (menu: MenuItem) => void;
  onCancel: () => void;
}

export default function AddMenuForm({
  menu,
  onSave,
  onCancel,
}: AddMenuFormProps) {
  const [name, setName] = useState(menu?.name || "");
  const [price, setPrice] = useState(menu?.price?.toString() || "");
  const [description, setDescription] = useState(menu?.description || "");
  const [category, setCategory] = useState(menu?.category || "");
  const [options, setOptions] = useState<MenuOption[]>(menu?.options || []);
  const [extras, setExtras] = useState<ExtraItem[]>(menu?.extras || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(menu?.image || "");

  // ถ้า menu เปลี่ยน รีเซ็ต state
  useEffect(() => {
    setName(menu?.name || "");
    setPrice(menu?.price?.toString() || "");
    setDescription(menu?.description || "");
    setCategory(menu?.category || "");
    setOptions(menu?.options || []);
    setExtras(menu?.extras || []);
    setImagePreview(menu?.image || "");
    setImageFile(null);
  }, [menu]);

  const handleAddOption = () =>
    setOptions([...options, { name: "", choices: [] }]);
  const handleAddChoice = (optIndex: number) => {
    const newOptions = [...options];
    newOptions[optIndex].choices.push({ label: "", price: "" as any });
    setOptions(newOptions);
  };
  const handleAddExtra = () =>
    setExtras([...extras, { label: "", price: "" as any }]);

  const handleSave = () => {
    if (!name || !price || !category) {
      alert("Please fill in menu name, price, and category!");
      return;
    }

    const newMenu: MenuItem = {
      id: menu?.id || Date.now(),
      name,
      price: Number(price),
      description,
      image: imageFile ? imageFile.name : imagePreview,
      category,
      options: options.map((opt) => ({
        ...opt,
        choices: opt.choices.map((c) => ({
          ...c,
          price: Number(c.price),
        })),
      })),
      extras: extras.map((e) => ({ ...e, price: Number(e.price) })),
    };

    onSave(newMenu);
  };

  return (
    <div className="p-4 space-y-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-semibold">
        {menu ? "Edit Menu Item" : "Add Menu Item"}
      </h2>

      <input
        type="text"
        placeholder="Menu Name"
        className="border rounded px-3 py-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Price"
        className="border rounded px-3 py-2 w-full"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description"
        className="border rounded px-3 py-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        className="border rounded px-3 py-2 w-full"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setImageFile(file);
          if (file) setImagePreview(URL.createObjectURL(file));
        }}
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mt-2 h-32 w-32 object-cover rounded"
        />
      )}

      {/* Category */}
      <CategorySelect onSelect={setCategory} />

      {/* Options */}
      <div className="space-y-2">
        <h3 className="font-semibold">Options</h3>
        {options.map((opt, i) => (
          <div key={i} className="border p-2 rounded space-y-2">
            <input
              type="text"
              placeholder="Option Name"
              className="border rounded px-3 py-1 w-full"
              value={opt.name}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i].name = e.target.value;
                setOptions(newOptions);
              }}
            />
            {opt.choices.map((choice, ci) => (
              <div key={ci} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Choice Label"
                  className="border rounded px-3 py-1 flex-1"
                  value={choice.label}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[i].choices[ci].label = e.target.value;
                    setOptions(newOptions);
                  }}
                />
                <input
                  type="text"
                  placeholder="Price"
                  className="border rounded px-3 py-1 w-24"
                  value={choice.price}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[i].choices[ci].price = e.target.value as any;
                    setOptions(newOptions);
                  }}
                />
              </div>
            ))}
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => handleAddChoice(i)}
            >
              Add Choice
            </button>
          </div>
        ))}
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={handleAddOption}
        >
          Add Option
        </button>
      </div>

      {/* Extras */}
      <div className="space-y-2">
        <h3 className="font-semibold">Extras</h3>
        {extras.map((extra, i) => (
          <div key={i} className="flex space-x-2">
            <input
              type="text"
              placeholder="Extra Label"
              className="border rounded px-3 py-1 flex-1"
              value={extra.label}
              onChange={(e) => {
                const newExtras = [...extras];
                newExtras[i].label = e.target.value;
                setExtras(newExtras);
              }}
            />
            <input
              type="text"
              placeholder="Price"
              className="border rounded px-3 py-1 w-24"
              value={extra.price}
              onChange={(e) => {
                const newExtras = [...extras];
                newExtras[i].price = e.target.value as any;
                setExtras(newExtras);
              }}
            />
          </div>
        ))}
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
          onClick={handleAddExtra}
        >
          Add Extra
        </button>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
