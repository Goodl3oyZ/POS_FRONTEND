"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateImage, getAllCategories } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface MenuFormData {
  id?: string;
  name: string;
  price: number;
  category: string;
  sku?: string;
  active?: boolean;
  image?: string;
}

interface Category {
  id: string;
  name: string;
}

interface AddMenuFormProps {
  menu?: MenuFormData;
  onSave: (menu: MenuFormData, imageFile?: File | null) => void;
  onCancel: () => void;
}

export default function AddMenuForm({
  menu,
  onSave,
  onCancel,
}: AddMenuFormProps) {
  const [name, setName] = useState(menu?.name || "");
  const [sku, setSku] = useState(menu?.sku || "");
  const [price, setPrice] = useState(menu?.price?.toString() || "");
  const [categoryId, setCategoryId] = useState(menu?.category || "");
  const [active, setActive] = useState(menu?.active !== false); // Default true
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(menu?.image || "");
  const [imageError, setImageError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (menu) {
      setName(menu.name || "");
      setSku(menu.sku || "");
      setPrice(menu.price?.toString() || "");
      setCategoryId(menu.category || "");
      setActive(menu.active !== false);
      setImagePreview(menu.image || "");
      setImageFile(null);
    }
  }, [menu]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");

    if (file) {
      // Validate image
      const error = validateImage(file);
      if (error) {
        setImageError(error);
        setImageFile(null);
        setImagePreview("");
        e.target.value = ""; // Reset input
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      alert("Please enter menu name");
      return;
    }
    if (!price || Number(price) <= 0) {
      alert("Please enter valid price");
      return;
    }
    if (!categoryId) {
      alert("Please select a category");
      return;
    }

    const menuData: MenuFormData = {
      id: menu?.id,
      name: name.trim(),
      price: Number(price),
      category: categoryId,
      sku: sku.trim() || undefined,
      active,
    };

    onSave(menuData, imageFile);
  };

  return (
    <div className="p-6 space-y-6 border rounded-lg shadow-md bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {menu ? "Edit Menu Item" : "Add Menu Item"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter menu name (e.g., ข้าวหมูกรอบพริกเกลือ)"
            required
          />
        </div>

        {/* SKU */}
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Enter SKU (e.g., MOU-ASD-PRI-3)"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">
            Price (฿) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price in Baht (e.g., 70)"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          {loadingCategories ? (
            <div className="flex items-center gap-2 p-2 border rounded">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500">
                Loading categories...
              </span>
            </div>
          ) : (
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <input
            id="active"
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <Label htmlFor="active" className="cursor-pointer">
            Active (available for ordering)
          </Label>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500">
            JPG, PNG, GIF, or WEBP. Max 5MB. Optional.
          </p>
          {imageError && <p className="text-xs text-red-600">{imageError}</p>}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 mb-2">Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-auto object-cover rounded border"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {menu ? "Update Menu" : "Create Menu"}
        </Button>
      </div>
    </div>
  );
}
