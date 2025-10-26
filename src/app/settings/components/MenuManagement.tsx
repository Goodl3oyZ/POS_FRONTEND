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
import { transformImageUrl } from "@/lib/utils/image-url";

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

      {/* Menu Table */}
      {!addingMenu && !editingMenu && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMenuItems.map((menu) => (
                  <tr
                    key={menu.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={
                          transformImageUrl(menu.image_url) ||
                          "/images/foodImageHolder.jpg"
                        }
                        alt={menu.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {menu.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {(menu as any).sku || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {(menu as any).categoryName || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">
                        ฿{menu.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          menu.active !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {menu.active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          onClick={() => setEditingMenu(menu)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          onClick={() => handleDeleteMenu(menu.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No menu items in this category</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
