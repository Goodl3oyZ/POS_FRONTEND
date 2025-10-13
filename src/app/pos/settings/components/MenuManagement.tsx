"use client";
import { useState } from "react";
import { MenuItem, menuItems as initialMenuItems } from "@/lib/data";
import AddMenuForm from "@/components/pos/ui/AddMenuForm";

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [addingMenu, setAddingMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((m) => m.category))),
  ];

  const handleSaveMenu = (menu: MenuItem) => {
    if (editingMenu) {
      setMenuItems((prev) => prev.map((m) => (m.id === menu.id ? menu : m)));
      setEditingMenu(null);
    } else {
      setMenuItems((prev) => [...prev, menu]);
      setAddingMenu(false);
    }
  };

  const handleDeleteMenu = (id: number) => {
    if (confirm("Are you sure to delete this menu?")) {
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const filteredMenuItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((m) => m.category === selectedCategory);

  return (
    <div className="p-6">
      {/* Category Tabs */}
      <div className="flex space-x-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Menu Button */}
      {!addingMenu && !editingMenu && (
        <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setAddingMenu(true)}
        >
          Add Menu
        </button>
      )}

      {/* Add Menu Form */}
      {addingMenu && (
        <AddMenuForm
          onSave={handleSaveMenu}
          onCancel={() => setAddingMenu(false)}
        />
      )}

      {/* Edit Menu Form */}
      {editingMenu && (
        <AddMenuForm
          menu={editingMenu}
          onSave={handleSaveMenu}
          onCancel={() => setEditingMenu(null)}
        />
      )}

      {/* Menu Grid */}
      {!addingMenu && !editingMenu && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMenuItems.map((menu) => (
            <div key={menu.id} className="border p-4 rounded shadow relative">
              <img
                src={menu.image}
                alt={menu.name}
                className="h-32 w-full object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-lg">{menu.name}</h3>
              <p>Price: ${menu.price}</p>
              <p>Category: {menu.category}</p>

              <div className="flex space-x-2 mt-2">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => setEditingMenu(menu)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDeleteMenu(menu.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredMenuItems.length === 0 && (
            <p className="text-gray-500 col-span-full">
              No menus in this category
            </p>
          )}
        </div>
      )}
    </div>
  );
}
