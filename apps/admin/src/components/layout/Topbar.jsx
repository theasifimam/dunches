/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationPanel } from "@/components/admin/NotificationPanel";

export function Topbar() {
  return (
    <div className="flex items-center gap-3 px-4 md:px-7 pt-3.5 pb-2 sticky top-0 z-30 bg-[#FAF6F0]/80 dark:bg-[#10140F]/80 backdrop-blur-md">
      {/* Search bar */}
      <div className="flex items-center gap-2 flex-1 max-w-xs group relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" />
        <Input
          type="text"
          placeholder="Search..."
          className="w-full h-9 bg-card/80 border border-border/40 rounded-full pl-10 pr-4 text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:bg-card transition-all outline-none shadow-sm"
        />
      </div>

      {/* Right: Notifications */}
      <div className="flex items-center gap-2 ml-auto">
        <NotificationPanel />
      </div>
    </div>
  );
}
