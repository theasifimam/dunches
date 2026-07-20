"use client";
import React from "react";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewSwitcher({ viewMode, onViewModeChange, className }) {
  return (
    <div className={cn("flex bg-muted/60 border border-border/40 p-1 rounded-2xl shrink-0 h-12 items-center", className)}>
      <button
        onClick={() => onViewModeChange("list")}
        className={cn(
          "px-3 h-10 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-black uppercase tracking-wider",
          viewMode === "list"
            ? "bg-card text-primary shadow-md border border-border/20"
            : "text-muted-foreground hover:text-foreground hover:bg-card/20"
        )}
      >
        <List className="h-4 w-4" />
        <span className="hidden xs:inline">List</span>
      </button>
      <button
        onClick={() => onViewModeChange("card")}
        className={cn(
          "px-3 h-10 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-black uppercase tracking-wider",
          viewMode === "card"
            ? "bg-card text-primary shadow-md border border-border/20"
            : "text-muted-foreground hover:text-foreground hover:bg-card/20"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden xs:inline">Card</span>
      </button>
    </div>
  );
}
export default ViewSwitcher;
