"use client";
import { useState, useEffect } from "react";
import {
  MenuItem,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  CreateMenuItemRequest,
} from "@/lib/api/menu-items";
import AddMenuForm from "@/components/ui/AddMenuForm";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [addingMenu, setAddingMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...Array.from(
      new Set(
        menuItems
          .map((m) => (m as any).categoryName)
          .filter((c): c is string => !!c)
      )
    ),
  ];

  const handleSaveMenu = async (menu: any, imageFile?: File | null) => {
    try {
      if (editingMenu) {
        // Update existing menu
        await updateMenuItem(editingMenu.id, {
          name: menu.name,
          price: menu.price,
          sku: menu.sku,
          active: menu.active,
          image: imageFile || undefined, // Only include if provided
        });
        toast.success("Menu updated successfully!");
        setEditingMenu(null);
      } else {
        // Create new menu
        if (!menu.category) {
          toast.error("Please select a category");
          return;
        }
        await createMenuItem({
          name: menu.name,
          price: menu.price,
          categoryId: menu.category,
          sku: menu.sku,
          active: menu.active !== false, // Default to true
          image: imageFile || undefined, // Optional image
        });
        toast.success("Menu created successfully!");
        setAddingMenu(false);
      }
      fetchMenuItems();
    } catch (error: any) {
      const errorMessage =
        error.message || error.response?.data?.message || "Failed to save menu";
      toast.error(errorMessage);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (confirm("Are you sure to delete this menu?")) {
      try {
        await deleteMenuItem(id);
        toast.success("Menu deleted successfully!");
        fetchMenuItems();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete menu");
      }
    }
  };

  const filteredMenuItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((m) => (m as any).categoryName === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
          menu={{
            id: editingMenu.id,
            name: editingMenu.name,
            price: editingMenu.price,
            category: editingMenu.categoryId || "",
            sku: (editingMenu as any).sku,
            active: editingMenu.active !== false,
            image: editingMenu.image_url || "",
          }}
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
                src={menu.image_url || "/images/foodImageHolder.jpg"}
                alt={menu.name}
                className="h-32 w-full object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-lg">{menu.name}</h3>
              <p className="text-sm text-gray-600">
                SKU: {(menu as any).sku || "-"}
              </p>
              <p className="font-semibold text-green-600">฿{menu.price}</p>
              <p className="text-xs text-gray-500">
                Category: {(menu as any).categoryName || "-"}
              </p>
              <span
                className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${
                  menu.active !== false
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {menu.active !== false ? "Active" : "Inactive"}
              </span>

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
