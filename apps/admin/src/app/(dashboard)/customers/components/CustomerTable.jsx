"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CustomerTable({
  roleFilter,
  filteredSubscribers,
  filteredUsers,
  isUpdating,
  isDeleting,
  handleToggleStatus,
  openEditDialog,
  handleDelete,
}) {
  if (roleFilter === "subscribers") {
    return (
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/30 text-muted-foreground font-semibold">
          <tr>
            <th className="px-4 py-4 w-12">#</th>
            <th className="px-4 py-4">Email Address</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4 hidden sm:table-cell">Subscribed On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {filteredSubscribers.map((sub, idx) => (
            <tr key={sub._id} className="hover:bg-muted/10 transition-colors">
              <td className="px-4 py-4 text-xs font-bold text-muted-foreground">
                {idx + 1}
              </td>
              <td className="px-4 py-4 text-sm font-bold tracking-tight">
                {sub.email}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      sub.isActive ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      sub.isActive ? "text-primary" : "text-muted-foreground/50"
                    }`}
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
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/30 text-muted-foreground font-semibold">
        <tr>
          <th className="px-4 py-4 w-16 text-center hidden xs:table-cell">
            Avatar
          </th>
          <th className="px-4 py-4">Identity</th>
          <th className="px-4 py-4 text-center">Privilege</th>
          <th className="px-4 py-4 hidden sm:table-cell">Verification</th>
          <th className="px-4 py-4 hidden md:table-cell">Last Presence</th>
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
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold leading-none">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-12">
                    {user.isActive ? "Active" : "Standby"}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    disabled={isUpdating}
                    className={cn(
                      "h-5 w-9 rounded-full relative transition-all duration-300 p-0.5 shrink-0",
                      user.isActive
                        ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                        : "bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 transform",
                        user.isActive ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>
            </td>
            <td className="px-4 py-4 text-right">
              <div className="flex items-center justify-end gap-1 sm:gap-1.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                >
                  <Link href={`/customers/${user._id}`}>
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </Button>
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
  );
}
