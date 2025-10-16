"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/auth-context";
import { Mail, Phone, Shield, User as UserIcon, Key } from "lucide-react";

interface UserInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export default function UserInfoDialog({
  open,
  onOpenChange,
  user,
}: UserInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <UserIcon size={16} />
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Username
                </label>
                <p className="font-medium text-gray-900">
                  {user.user.username}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Full Name
                </label>
                <p className="font-medium text-gray-900">
                  {user.user.full_name || "-"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1">
                  <Mail size={12} />
                  Email
                </label>
                <p className="font-medium text-gray-900">{user.user.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1">
                  <Phone size={12} />
                  Phone
                </label>
                <p className="font-medium text-gray-900">
                  {user.user.phone || "-"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Shield size={16} />
              Roles
            </h3>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border">
              {user.user.roles && user.user.roles.length > 0 ? (
                user.user.roles.map((role) => (
                  <span
                    key={role.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
                ))
              ) : (
                <span className="text-gray-400 text-sm">No roles assigned</span>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Key size={16} />
              Permissions ({user.permissions.length})
            </h3>
            <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg border max-h-48 overflow-y-auto">
              {user.permissions.length > 0 ? (
                user.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700 font-mono text-xs">
                      {permission}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-sm col-span-2">
                  No permissions assigned
                </span>
              )}
            </div>
          </div>

          {/* User ID */}
          <div className="pt-4 border-t">
            <label className="text-xs text-gray-500 block mb-1">User ID</label>
            <p className="font-mono text-xs text-gray-600">{user.user.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
