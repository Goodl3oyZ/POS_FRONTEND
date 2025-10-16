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
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getAllRoles } from "@/lib/api";

interface Role {
  id: number;
  name: string;
}

interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  currentRoles: Role[];
  onAssign: (roleId: number) => Promise<void>;
}

export default function AssignRoleDialog({
  open,
  onOpenChange,
  username,
  currentRoles,
  onAssign,
}: AssignRoleDialogProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingRoles, setFetchingRoles] = useState(true);

  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  const fetchRoles = async () => {
    setFetchingRoles(true);
    try {
      const response = await getAllRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setFetchingRoles(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) return;

    setLoading(true);
    try {
      await onAssign(selectedRoleId);
      setSelectedRoleId(null);
    } finally {
      setLoading(false);
    }
  };

  const currentRoleIds = currentRoles.map((r) => r.id);
  const availableRoles = roles.filter((r) => !currentRoleIds.includes(r.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Add a role to <strong>{username}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Current Roles */}
          <div className="space-y-2">
            <Label>Current Roles</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border min-h-[50px]">
              {currentRoles.map((role) => (
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
              {currentRoles.length === 0 && (
                <span className="text-gray-400 text-xs">No roles assigned</span>
              )}
            </div>
          </div>

          {/* Select Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Select Role to Assign <span className="text-red-500">*</span>
            </Label>
            {fetchingRoles ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : availableRoles.length > 0 ? (
              <select
                id="role"
                value={selectedRoleId || ""}
                onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="">Choose a role...</option>
                {availableRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md border">
                All available roles have been assigned to this user.
              </p>
            )}
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
            <Button
              type="submit"
              disabled={
                loading || !selectedRoleId || availableRoles.length === 0
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Role"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
