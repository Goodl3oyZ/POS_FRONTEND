"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  getAllUsers,
  createUser,
  updateUser,
  assignUserRoles,
} from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  UserPlus,
  Edit,
  UserX,
  UserCheck,
  Shield,
} from "lucide-react";
import AddUserDialog from "@/components/ui/AddUserDialog";
import EditUserDialog from "@/components/ui/EditUserDialog";
import AssignRoleDialog from "@/components/ui/AssignRoleDialog";

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

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [assigningRoleUser, setAssigningRoleUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData: any) => {
    try {
      await createUser({
        username: userData.username,
        password: userData.password,
        full_name: userData.fullName || undefined,
        email: userData.email || undefined,
        phone: userData.phone || undefined,
        status: "active",
      });
      toast.success("User created successfully!");
      setIsAddDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      await updateUser(userData.id, {
        full_name: userData.fullName || undefined,
        email: userData.email || undefined,
        phone: userData.phone || undefined,
      });
      toast.success("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const actionText = newStatus === "inactive" ? "deactivate" : "activate";

    if (
      confirm(`Are you sure you want to ${actionText} user "${user.username}"?`)
    ) {
      try {
        await updateUser(user.id, { status: newStatus });
        toast.success(`User ${actionText}d successfully!`);
        fetchUsers();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || `Failed to ${actionText} user`
        );
      }
    }
  };

  const handleAssignRole = async (roleId: number) => {
    if (!assigningRoleUser) return;

    try {
      await assignUserRoles(assigningRoleUser.id, { role_id: roleId });
      toast.success("Role assigned successfully!");
      setAssigningRoleUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to assign role");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold">User Management</h2>
          <p className="text-gray-600 mt-1">
            Manage user accounts and their roles
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <UserPlus size={18} />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Username
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 min-w-[200px]">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Phone
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Roles
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {user.username}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 min-w-[200px] whitespace-nowrap">
                    {user.full_name || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {user.phone || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
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
                        <span className="text-gray-400 text-xs">No roles</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        className="gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssigningRoleUser(user)}
                        className="gap-1"
                      >
                        <Shield size={14} />
                        Roles
                      </Button>
                      <Button
                        variant={
                          user.status === "active" ? "destructive" : "outline"
                        }
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        className="gap-1"
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX size={14} />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddUser}
      />

      {editingUser && (
        <EditUserDialog
          open={!!editingUser}
          onOpenChange={(open: boolean) => !open && setEditingUser(null)}
          user={editingUser}
          onSave={handleUpdateUser}
        />
      )}

      {assigningRoleUser && (
        <AssignRoleDialog
          open={!!assigningRoleUser}
          onOpenChange={(open: boolean) => !open && setAssigningRoleUser(null)}
          username={assigningRoleUser.username}
          currentRoles={assigningRoleUser.roles}
          onAssign={handleAssignRole}
        />
      )}
    </div>
  );
}
