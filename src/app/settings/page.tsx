"use client";

import {
  BarChart3,
  Store,
  Table,
  Users,
  Settings as SettingsIcon,
  BookOpen,
  BadgeDollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const settingsGroups = [
  {
    title: "Business",
    items: [
      {
        icon: Store,
        title: "Store Information",
        description: "Update your restaurant details and contact information",
      },
      {
        icon: Users,
        title: "Staff Management",
        description: "Manage staff accounts and permissions",
      },
      {
        icon: Table,
        title: "Table Management",
        description: "Configure table layouts and zones",
      },
    ],
  },
  {
    title: "Menu & Orders",
    items: [
      {
        icon: BookOpen,
        title: "Menu Management",
        description: "Add, edit, or remove menu items and categories",
      },
      {
        icon: BadgeDollarSign,
        title: "Pricing & Discounts",
        description: "Set prices, happy hours, and special promotions",
      },
      {
        icon: BarChart3,
        title: "Sales Reports",
        description: "View sales analytics and reports",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        icon: SettingsIcon,
        title: "Preferences",
        description: "Customize system behavior and notifications",
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <Icon className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.description}
                      </p>
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
    </div>
  );
}
