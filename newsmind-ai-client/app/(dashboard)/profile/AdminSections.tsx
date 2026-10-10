"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, PlusCircle, SlidersHorizontal, BarChart3, ChevronRight, Users, ChevronLeft, ShieldCheck, Loader2, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllUsers, updateUserRole } from "@/lib/actions/user";
import { toast } from "sonner";

export function AdminQuickActions() {
  const actions = [
    {
      title: "Manage Articles",
      description: "Review, edit, publish or delete articles across all categories",
      href: "/profile",
      icon: FileText,
      badge: "Content",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Create New Article",
      description: "Write and publish breaking stories or save draft editorials",
      href: "/profile",
      icon: PlusCircle,
      badge: "Publish",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      title: "Editorial Analytics",
      description: "View aggregate engagement, reader activity, and sentiment trends",
      href: "/dashboard",
      icon: BarChart3,
      badge: "Reports",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  ];

  return (
    <Card className="border border-[#E2E8F0] shadow-sm rounded-2xl bg-white overflow-hidden">
      <CardHeader className="border-b border-[#E2E8F0] bg-slate-50/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <SlidersHorizontal className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-[#14213D]">
              Management Shortcuts
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Direct administrative workflows and publication controls.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="group flex items-center justify-between p-3.5 rounded-xl border border-[#E2E8F0] hover:border-blue-200 hover:bg-slate-50/80 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="size-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#14213D] group-hover:text-blue-600 transition-colors">
                      {act.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {act.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          );
        })}

      </CardContent>
    </Card>
  );
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt?: string;
  wantsJournalist?: boolean;
}

export function AdminUserTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async (p: number) => {
    setLoading(true);
    try {
      const res = await getAllUsers(p, 8);
      if (res?.users) {
        setUsers(res.users);
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, role: newRole, wantsJournalist: newRole === "journalist" ? false : u.wantsJournalist }
              : u
          )
        );
        toast.success(`Role updated to ${newRole}`);
      } else {
        toast.error(res.error || "Failed to update role");
      }
    } catch {
      toast.error("Error updating role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className="border border-[#E2E8F0] shadow-sm rounded-2xl bg-white overflow-hidden">
      <CardHeader className="border-b border-[#E2E8F0] bg-slate-50/50 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="size-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#14213D] flex items-center gap-2">
                User Directory
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {total}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Registered platform accounts and member permissions.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="size-7 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#64748B]">Loading registered accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">
            No user accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F7F9FC] text-[#64748B] font-semibold">
                  <th className="py-3 px-4 sm:px-6">User</th>
                  <th className="py-3 px-4 sm:px-6">Email</th>
                  <th className="py-3 px-4 sm:px-6">Role</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Role Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {users.map((u) => {
                  const isAdminUser = u.role === "admin";
                  const isUpdating = updatingId === u.id;
                  const initials = u.name
                    ? u.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                    : "U";

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 sm:size-9 rounded-full border border-slate-200">
                            <AvatarImage src={u.avatar} alt={u.name} />
                            <AvatarFallback className="text-xs font-bold bg-blue-50 text-blue-600">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-[#14213D] truncate">{u.name}</p>
                              {u.wantsJournalist && (
                                <span title="Wants to become a Journalist" className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-300 px-1.5 py-0.5 rounded-full">
                                  <BellRing className="size-2.5" />
                                  Journalist Request
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#64748B] sm:hidden truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-[#64748B] hidden sm:table-cell">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        {isAdminUser ? (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-semibold gap-1 text-[11px]">
                            <ShieldCheck className="size-3" />
                            Admin
                          </Badge>
                        ) : u.role === "journalist" ? (
                          <Badge className="bg-teal-50 text-teal-700 border-teal-200 font-semibold text-[11px]">
                            Journalist
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-semibold text-[11px]">
                            Reader
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        {isAdminUser ? (
                          <span className="text-[11px] text-[#64748B] italic">Locked</span>
                        ) : isUpdating ? (
                          <Loader2 className="size-4 text-blue-600 animate-spin inline-block" />
                        ) : (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="text-xs bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-[#14213D] focus:ring-1 focus:ring-blue-500 outline-none"
                            >
                              <option value="user">Reader</option>
                              <option value="journalist">Journalist</option>
                            </select>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E2E8F0] bg-[#F7F9FC]">
            <span className="text-xs text-[#64748B]">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 text-xs border-[#E2E8F0]"
              >
                <ChevronLeft className="size-3.5 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 text-xs border-[#E2E8F0]"
              >
                Next
                <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
