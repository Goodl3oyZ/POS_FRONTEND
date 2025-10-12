"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditStoreTypeSelect from "@/components/ui/EditStoreTypeSelect";

interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  vat: number;
  type: string;
}

export default function StoreInformation() {
  const [store, setStore] = useState<StoreInfo>({
    name: "My Restaurant",
    address: "123 Main Street, Bangkok",
    phone: "081-234-5678",
    vat: 7,
    type: "Thai",
  });

  const [open, setOpen] = useState(false);

  const handleSave = () => {
    alert(
      `Store Information Saved!\n\nName: ${store.name}\nAddress: ${store.address}\nPhone: ${store.phone}\nVAT: ${store.vat}%\nType: ${store.type}`
    );
    setOpen(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-6">Store Information</h2>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Store Name</label>
          <input
            type="text"
            className="border px-3 py-2 rounded-md w-full"
            value={store.name}
            onChange={(e) => setStore({ ...store, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            className="border px-3 py-2 rounded-md w-full"
            rows={3}
            value={store.address}
            onChange={(e) => setStore({ ...store, address: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            className="border px-3 py-2 rounded-md w-full"
            value={store.phone}
            onChange={(e) => setStore({ ...store, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">VAT (%)</label>
          <input
            type="number"
            className="border px-3 py-2 rounded-md w-full"
            value={store.vat}
            onChange={(e) =>
              setStore({ ...store, vat: Number(e.target.value) })
            }
            min={0}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Store Type</label>
          <EditStoreTypeSelect
            value={store.type}
            onChange={(type) => setStore({ ...store, type })}
          />
        </div>

        <Button className="mt-4" onClick={() => setOpen(true)}>
          Edit Store Info
        </Button>
      </div>

      {/* Edit Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">
              Edit Store Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  className="border px-3 py-2 rounded-md w-full"
                  value={store.name}
                  onChange={(e) => setStore({ ...store, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <textarea
                  className="border px-3 py-2 rounded-md w-full"
                  rows={3}
                  value={store.address}
                  onChange={(e) =>
                    setStore({ ...store, address: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  className="border px-3 py-2 rounded-md w-full"
                  value={store.phone}
                  onChange={(e) =>
                    setStore({ ...store, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  VAT (%)
                </label>
                <input
                  type="number"
                  className="border px-3 py-2 rounded-md w-full"
                  value={store.vat}
                  onChange={(e) =>
                    setStore({ ...store, vat: Number(e.target.value) })
                  }
                  min={0}
                  max={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Store Type
                </label>
                <EditStoreTypeSelect
                  value={store.type}
                  onChange={(type) => setStore({ ...store, type })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
