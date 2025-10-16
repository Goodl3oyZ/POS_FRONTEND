"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/button";

export default function Preferences() {
  const [notifications, setNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Light");

  const handleSave = () => {
    alert(`Preferences Saved!\n
Notifications: ${notifications ? "On" : "Off"}
Order Alerts: ${orderAlerts ? "On" : "Off"}
Language: ${language}
Theme: ${theme}`);
  };

  return (
    <div className="p-8 max-w-lg space-y-6">
      <h2 className="text-3xl font-semibold">System Preferences</h2>

      <div className="flex items-center justify-between">
        <Label>Enable Notifications</Label>
        <Switch checked={notifications} onCheckedChange={setNotifications} />
      </div>

      <div className="flex items-center justify-between">
        <Label>Order Alerts</Label>
        <Switch checked={orderAlerts} onCheckedChange={setOrderAlerts} />
      </div>

      <div>
        <Label className="mb-1 block">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Thai">Thai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1 block">Theme</Label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger>
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Light">Light</SelectItem>
            <SelectItem value="Dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  );
}
