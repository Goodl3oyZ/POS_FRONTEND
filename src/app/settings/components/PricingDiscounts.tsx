"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PricingDiscounts() {
  const [vat, setVat] = useState(7); // default 7%
  const [specialPrice, setSpecialPrice] = useState(99.99);
  const [editMode, setEditMode] = useState(false);

  const handleSave = () => {
    setEditMode(false);
    alert(`✅ Settings saved!\nVAT: ${vat}%\nSpecial Price: $${specialPrice}`);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold">Pricing & VAT Settings</h2>
      <p className="text-muted-foreground mb-4">
        Manage VAT rates and special promotional pricing.
      </p>

      <Card className="p-6 space-y-6">
        {/* VAT Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">VAT Settings</h3>
          {editMode ? (
            <div className="flex items-center space-x-3">
              <Label htmlFor="vat" className="w-24">
                VAT (%)
              </Label>
              <Input
                id="vat"
                type="number"
                min={0}
                max={100}
                value={vat}
                onChange={(e) => setVat(Number(e.target.value))}
                className="w-24"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-700">
              Current VAT: <b>{vat}%</b>
            </p>
          )}
        </div>

        {/* Special Price Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Special Promotions</h3>
          {editMode ? (
            <div className="flex items-center space-x-3">
              <Label htmlFor="special-price" className="w-32">
                Special Price ($)
              </Label>
              <Input
                id="special-price"
                type="number"
                min={0}
                value={specialPrice}
                onChange={(e) => setSpecialPrice(Number(e.target.value))}
                className="w-32"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-700">
              Current Special Price: <b>${specialPrice.toFixed(2)}</b>
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          {editMode ? (
            <>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                Save
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>Edit</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
