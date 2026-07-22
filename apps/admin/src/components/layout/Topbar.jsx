/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { NotificationPanel } from "@/components/admin/NotificationPanel";
import { GlobalSearchDialog } from "@/components/admin/GlobalSearchDialog";

export function Topbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-4 md:px-7 pt-3.5 pb-2.5 sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/40">
        {/* Search trigger button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 flex-1 max-w-sm group relative text-left"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors z-10" />
          <div className="w-full h-10 bg-card/90 border border-border/60 rounded-xl pl-10 pr-12 text-xs font-medium text-muted-foreground flex items-center shadow-2xs group-hover:border-primary/40 transition-all select-none cursor-pointer">
            Search products, orders, customers...
          </div>
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border/80 bg-muted text-[10px] font-mono text-muted-foreground select-none pointer-events-none">
            ⌘K
          </kbd>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/80 border border-border/50 text-[11px] font-bold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>v2.4 Console</span>
          </div>
          <NotificationPanel />
        </div>
      </div>

      {/* Global Search Palette Modal */}
      <GlobalSearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}


