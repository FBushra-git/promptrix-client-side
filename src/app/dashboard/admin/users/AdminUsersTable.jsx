"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { changeUserRole, deleteUserByEmail } from "@/lib/actions/admin";
import { Shield, Trash2 } from "lucide-react";

export default function AdminUsersTable({ users = [] }) {
  const [loading, setLoading] = useState("");

  const handleRole = async (email, role) => {
    setLoading(email);
    try {
      await changeUserRole(email, role);
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    } finally {
      setLoading("");
    }
  };

  const handleDelete = async (email) => {
    if (!confirm("Delete this user?")) return;

    setLoading(email);
    try {
      await deleteUserByEmail(email);
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-white/10 bg-[#121322] text-xs uppercase tracking-widest text-white/40">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Premium</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user._id || user.email} className="transition hover:bg-white/[0.04]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} alt={user.name || "User"} className="h-11 w-11 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#967bb6]/20">
                        <Shield size={18} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{user.name || "Unnamed User"}</p>
                      <p className="text-sm text-white/40">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <select
                    defaultValue={user.role || "user"}
                    disabled={loading === user.email}
                    onChange={(e) => handleRole(user.email, e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#121322] px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="user">user</option>
                    <option value="creator">creator</option>
                    <option value="admin">admin</option>
                  </select>
                </td>

                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    user.isPremium ? "bg-[#967bb6]/20 text-[#dfcff4]" : "bg-white/5 text-white/45"
                  }`}>
                    {user.isPremium ? "Premium" : "Free"}
                  </span>
                </td>

                <td className="p-4 text-sm text-white/50">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(user.email)}
                    disabled={loading === user.email}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}