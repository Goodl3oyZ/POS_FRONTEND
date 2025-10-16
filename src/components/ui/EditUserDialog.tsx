"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Permission {
  id: number;
  code: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface User {
  id: string;
  username: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  status: "active" | "inactive" | string;
  roles: Role[];
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSave: (userData: any) => Promise<void>;
}

export default function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        id: user.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Update user information for <strong>{user.username}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Username (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={user.username}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Username cannot be changed</p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter full name"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="user@example.com"
              disabled={loading}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="081-234-5678"
              disabled={loading}
            />
          </div>

          {/* Current Roles (Read-only display) */}
          <div className="space-y-2">
            <Label>Current Roles</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border">
              {user.roles.map((role) => (
                <span
                  key={role.id}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    role.name === "owner"
                      ? "bg-red-100 text-red-800"
                      : role.name === "manager"
                      ? "bg-blue-100 text-blue-800"
                      : role.name === "cashier"
                      ? "bg-purple-100 text-purple-800"
                      : role.name === "kitchen"
                      ? "bg-orange-100 text-orange-800"
                      : role.name === "waiter"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {role.name}
                </span>
              ))}
              {user.roles.length === 0 && (
                <span className="text-gray-400 text-xs">No roles assigned</span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Role management will be available soon
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
