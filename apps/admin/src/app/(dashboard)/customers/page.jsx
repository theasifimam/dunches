/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
const UserDialog = dynamic(
  () => import("@/components/admin/UserDialog").then((mod) => mod.UserDialog),
  { ssr: false },
);

const BroadcastDialog = dynamic(
  () =>
    import("@/components/admin/BroadcastDialog").then(
      (mod) => mod.BroadcastDialog,
    ),
  { ssr: false },
);
import { PageHeader } from "@/components/admin/PageHeader";
import { useGetUsersQuery, useDeleteUserMutation } from "@/store/userApi";
import {
  useGetSubscribersQuery,
  useSendNewsletterMutation,
} from "@/store/subscriberApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Pagination } from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { DUMMY_USERS, DUMMY_SUBSCRIBERS } from "@/lib/dummyData";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [page, setPage] = useState(1);
  // Subscribers Modals & state
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);
  // RTK Query
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const { data: subscribersData, isLoading: isSubLoading } =
    useGetSubscribersQuery();
  const [sendNewsletter, { isLoading: isSending }] =
    useSendNewsletterMutation();
  const users =
    usersData?.data && usersData.data.length > 0 ? usersData.data : DUMMY_USERS;
  const subscribers =
    subscribersData?.data && subscribersData.data.length > 0
      ? subscribersData.data
      : DUMMY_SUBSCRIBERS;
  const activeCount = subscribers.filter((s) => s.isActive).length;
  const filteredUsers = useMemo(() => {
    const lowSearch = debouncedSearch.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(lowSearch) ||
        user.email?.toLowerCase().includes(lowSearch) ||
        user._id.toLowerCase().includes(lowSearch);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, debouncedSearch, roleFilter]);
  const filteredSubscribers = useMemo(() => {
    const lowSearch = debouncedSearch.toLowerCase();
    return subscribers.filter((sub) => {
      return sub.email?.toLowerCase().includes(lowSearch);
    });
  }, [subscribers, debouncedSearch]);
  const pulseStats = useMemo(
    () => [
      {
        label: "Active Session Rate",
        value: "78.4%",
        icon: TrendingUp,
        color: "primary",
      },
      {
        label: "Admin Authorities",
        value: "12 Leads",
        icon: ShieldCheck,
        color: "purple",
      },
      {
        label: "Pending Verifications",
        value: "42 Guests",
        icon: ShieldAlert,
        color: "orange",
      },
    ],
    [],
  );
  const openAddDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };
  const openEditDialog = (user) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to terminate this identity?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("Identity purged from registry");
      } catch (err) {
        toast.error(err?.data?.message || "Purge failed");
      }
    }
  };
  const isLoadingCombined =
    (isUsersLoading || isSubLoading) && !usersData && !subscribersData;
  if (isLoadingCombined) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-serif font-light tracking-tight text-foreground">
            Ambassadors{" "}
            <span className="text-primary italic font-black font-sans">
              Registry
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Curate the community of snack lovers. Manage privileges, profiles,
            and active subscribers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-4 bg-card border border-border/40 px-5 py-3 rounded-2xl shadow-sm">
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Subscribers:
            </div>
            <div className="text-xl font-black text-primary font-serif leading-none">
              {activeCount}
            </div>
          </div>
          <Button
            onClick={() => setIsBroadcastDialogOpen(true)}
            variant="outline"
            className="rounded-full px-5 h-11 text-xs font-bold uppercase tracking-wider"
          >
            Broadcast
          </Button>
          <Button
            onClick={openAddDialog}
            variant="signature"
            className="rounded-full px-5 h-11 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/95"
          >
            + Enroll User
          </Button>
        </div>
      </div>

      {/* Registry Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pulseStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-card border border-border/40 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="h-16 w-16 text-primary" />
              </div>
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center mb-4",
                  stat.color === "primary"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                {stat.label}
              </p>
              <h4 className="text-2xl font-bold text-foreground leading-none">
                {stat.value}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl bg-card border border-border/40 w-full">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name, email or registry ID..."
            className="h-12 w-full pl-12 pr-4 bg-card border border-border/60 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {["all", "user", "moderator", "admin", "subscribers"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn(
                "px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                roleFilter === role
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-background border-border/60 text-muted-foreground hover:bg-muted",
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {roleFilter === "subscribers" ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-4 w-12">#</th>
                  <th className="px-4 py-4">Email Address</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 hidden sm:table-cell">
                    Subscribed On
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredSubscribers.map((sub, idx) => (
                  <tr
                    key={sub._id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-4 py-4 text-xs font-bold text-muted-foreground">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold tracking-tight">
                      {sub.email}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${sub.isActive ? "bg-primary" : "bg-muted-foreground/30"}`}
                        />
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${sub.isActive ? "text-primary" : "text-muted-foreground/50"}`}
                        >
                          {sub.isActive ? "Active" : "Unsubscribed"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs font-bold text-muted-foreground hidden sm:table-cell">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filteredSubscribers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-muted-foreground text-sm"
                    >
                      No subscribers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-4 w-16 text-center hidden xs:table-cell">
                    Avatar
                  </th>
                  <th className="px-4 py-4">Identity</th>
                  <th className="px-4 py-4 text-center">Privilege</th>
                  <th className="px-4 py-4 hidden sm:table-cell">
                    Verification
                  </th>
                  <th className="px-4 py-4 hidden md:table-cell">
                    Last Presence
                  </th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="group hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-4 py-4 hidden xs:table-cell">
                      <div className="relative h-11 w-11 mx-auto">
                        <div className="relative h-full w-full rounded-xl overflow-hidden border border-border/30 shadow-sm bg-muted flex items-center justify-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-black text-primary uppercase">
                              {user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-[150px] sm:max-w-[250px]">
                        <Link
                          href={`/customers/${user._id}`}
                          className="font-bold text-sm text-foreground mb-0.5 leading-tight truncate hover:text-primary transition-colors block"
                        >
                          {user.name}
                        </Link>
                        <p className="text-[10px] font-medium text-muted-foreground lowercase tracking-wide opacity-80 truncate">
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          user.role === "admin"
                            ? "bg-primary text-primary-foreground border-primary/20"
                            : user.role === "moderator"
                              ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                              : "bg-muted/50 text-muted-foreground border-border/20",
                        )}
                      >
                        {user.role}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {user.isEmailVerified ? (
                          <div className="flex items-center gap-1.5 text-primary">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Verified
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground/50">
                            <XCircle className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Pending
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold leading-none mb-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              user.isActive
                                ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,1)]"
                                : "bg-muted-foreground/30",
                            )}
                          />
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider",
                              user.isActive
                                ? "text-primary"
                                : "text-muted-foreground/50",
                            )}
                          >
                            {user.isActive ? "Active" : "Standby"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-1.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(user)}
                          className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isDeleting}
                          onClick={() => handleDelete(user._id)}
                          className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <UserDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          user={editingUser}
        />

        {/* Pagination */}
        <div className="p-4 md:p-6 border-t border-border/40 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            {roleFilter === "subscribers"
              ? filteredSubscribers.length
              : filteredUsers.length}{" "}
            entries
          </p>
          <Pagination
            currentPage={page}
            totalPages={1}
            onPageChange={setPage}
          />
        </div>
      </div>

      <BroadcastDialog
        isOpen={isBroadcastDialogOpen}
        onOpenChange={setIsBroadcastDialogOpen}
        activeCount={activeCount}
      />
    </div>
  );
}
