/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";
import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "@/store/userApi";
import { useGetSubscribersQuery } from "@/store/subscriberApi";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { DUMMY_USERS, DUMMY_SUBSCRIBERS } from "@/lib/dummyData";
import ViewSwitcher from "@/components/admin/ViewSwitcher";

import CustomerStatsCards from "./components/CustomerStatsCards";
import CustomerTable from "./components/CustomerTable";
import CustomerCardsGrid from "./components/CustomerCardsGrid";

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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [page, setPage] = useState(1);
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);

  const {
    data: usersData,
    isLoading: isUsersLoading,
  } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [viewMode, setViewMode] = useState("list");
  React.useEffect(() => {
    const stored = localStorage.getItem("dunches_admin_view_customers");
    if (stored === "card" || stored === "list") {
      setViewMode(stored);
    }
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("dunches_admin_view_customers", mode);
  };

  const handleToggleStatus = async (user) => {
    try {
      await updateUser({
        id: user._id,
        body: { isActive: !user.isActive },
      }).unwrap();
      toast.success(
        `User ${!user.isActive ? "activated" : "deactivated"} successfully`,
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user status");
    }
  };

  const { data: subscribersData, isLoading: isSubLoading } =
    useGetSubscribersQuery();

  const users =
    usersData?.data && usersData.data.length > 0
      ? usersData.data
      : DUMMY_USERS;
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
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
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
      <CustomerStatsCards pulseStats={pulseStats} />

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 p-3.5 md:p-4 rounded-2xl bg-card border border-border/40 w-full">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name, email or registry ID..."
            className="h-12 w-full pl-12 pr-4 bg-card border border-border/60 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none justify-between">
            {["all", "user", "moderator", "admin", "subscribers"].map(
              (role) => (
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
              ),
            )}
          </div>
          <ViewSwitcher
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </div>
      </div>

      {/* Users Table / Cards */}
      {viewMode === "list" ? (
        <div className="rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <CustomerTable
              roleFilter={roleFilter}
              filteredSubscribers={filteredSubscribers}
              filteredUsers={filteredUsers}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              handleToggleStatus={handleToggleStatus}
              openEditDialog={openEditDialog}
              handleDelete={handleDelete}
            />
          </div>
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
      ) : (
        <div className="space-y-6">
          <CustomerCardsGrid
            roleFilter={roleFilter}
            filteredSubscribers={filteredSubscribers}
            filteredUsers={filteredUsers}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            handleToggleStatus={handleToggleStatus}
            openEditDialog={openEditDialog}
            handleDelete={handleDelete}
          />
          {/* Pagination */}
          <div className="p-4 md:p-6 rounded-[2rem] bg-card border border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
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
      )}

      <UserDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={editingUser}
      />

      <BroadcastDialog
        isOpen={isBroadcastDialogOpen}
        onOpenChange={setIsBroadcastDialogOpen}
        activeCount={activeCount}
      />
    </div>
  );
}
