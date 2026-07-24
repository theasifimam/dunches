"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CustomerCardsGrid({
  roleFilter,
  filteredSubscribers,
  filteredUsers,
  isUpdating,
  isDeleting,
  handleToggleStatus,
  openEditDialog,
  handleDelete,
}) {
  return (
    <>
      {roleFilter === "subscribers" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubscribers.map((sub, idx) => (
            <div
              key={sub._id}
              className="group rounded-2xl md:rounded-4xl bg-card border border-border/40 p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        sub.isActive ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider ${
                        sub.isActive
                          ? "text-primary"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {sub.isActive ? "Active" : "Unsubscribed"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                    Email Address
                  </p>
                  <h4 className="font-bold text-sm text-foreground leading-tight break-all">
                    {sub.email}
                  </h4>
                </div>
              </div>
              <div className="pt-2 border-t border-border/10 flex justify-between items-center text-[10px] font-medium text-muted-foreground">
                <span>Subscribed On</span>
                <span className="font-bold text-foreground">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {filteredSubscribers.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
              No subscribers found.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="group rounded-2xl md:rounded-4xl bg-card border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-4 space-y-3 md:p-5 md:space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/30 shadow-sm bg-muted flex items-center justify-center shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-black text-primary uppercase">
                          {user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/customers/${user._id}`}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors block leading-tight truncate"
                      >
                        {user.name}
                      </Link>
                      <p className="text-[10px] font-medium text-muted-foreground lowercase tracking-wide opacity-80 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0",
                      user.role === "admin"
                        ? "bg-primary text-primary-foreground border-primary/20"
                        : user.role === "moderator"
                          ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                          : "bg-muted/50 text-muted-foreground border-border/20",
                    )}
                  >
                    {user.role}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/10">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                      Verification
                    </p>
                    {user.isEmailVerified ? (
                      <div className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground/50">
                        <XCircle className="h-3.5 w-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">
                          Pending
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                      Joined On
                    </p>
                    <span className="text-xs font-bold text-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 border-t border-border/10 flex items-center justify-between bg-muted/5 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {user.isActive ? "Active" : "Standby"}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    disabled={isUpdating}
                    className={cn(
                      "h-5 w-9 rounded-full relative transition-all duration-300 p-0.5 shrink-0",
                      user.isActive
                        ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                        : "bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 transform",
                        user.isActive ? "translate-x-4" : "translate-x-0",
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-1 shrink-0">
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
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
              No users found.
            </div>
          )}
        </div>
      )}
    </>
  );
}
