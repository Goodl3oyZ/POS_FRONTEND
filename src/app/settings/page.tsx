"use client";

import { useState } from "react";
import {
  BarChart3,
  Store,
  Table,
  Users,
  Settings as SettingsIcon,
  BookOpen,
  BadgeDollarSign,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// import components ของแต่ละ setting
import StoreInformation from "./components/StoreInformation";
import UserManagement from "./components/UserManagement";
import TableManagement from "./components/TableManagement";
import MenuManagement from "./components/MenuManagement";
import PricingDiscounts from "./components/PricingDiscounts";
// import SalesReports from "./components/SalesReports";
import Preferences from "./components/Preferences";

const settingsGroups = [
  {
    title: "Business",
    items: [
      { icon: Store, title: "Store Information" },
      { icon: Users, title: "User Management" },
      { icon: Table, title: "Table Management" },
    ],
  },
  {
    title: "Menu & Orders",
    items: [
      { icon: BookOpen, title: "Menu Management" },
      { icon: BadgeDollarSign, title: "Pricing & Discounts" },
      // { icon: BarChart3, title: "Sales Reports" },
    ],
  },
  {
    title: "System",
    items: [{ icon: SettingsIcon, title: "Preferences" }],
  },
];

// map ชื่อ Setting -> Component
const settingComponents: Record<string, React.FC> = {
  "Store Information": StoreInformation,
  "User Management": UserManagement,
  "Table Management": TableManagement,
  "Menu Management": MenuManagement,
  "Pricing & Discounts": PricingDiscounts,
  // "Sales Reports": SalesReports,
  Preferences,
};

export default function SettingsPage() {
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);

  const SelectedComponent = selectedSetting
    ? settingComponents[selectedSetting]
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-muted-foreground">
          Manage your restaurant settings and preferences
        </p>
      </div>

      {settingsGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <h3 className="text-lg font-medium">{group.title}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedSetting(item.title)}
                >
                  <div className="flex items-start space-x-4">
                    <Icon className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Fullscreen Dialog */}
      <Dialog
        open={!!selectedSetting}
        onOpenChange={() => setSelectedSetting(null)}
      >
        <DialogContent className="w-full max-w-7xl h-[90vh] p-6 rounded-xl bg-white shadow-xl overflow-auto">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">{selectedSetting}</h2>
          </div>

          <div className="mt-4">
            {SelectedComponent ? (
              <SelectedComponent />
            ) : (
              <p>Select a setting to manage.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
