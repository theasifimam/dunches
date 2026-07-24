"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SidebarMobileDrawer({
  isMobileMoreOpen,
  setIsMobileMoreOpen,
  moreItems,
  mobileMenuItems,
  pathname,
  theme,
  setTheme,
  setIsLogoutDialogOpen,
}) {
  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMoreOpen && (
          <>
            {/* Backdrop overlay — clicking outside closes the bottom tabs menu dialog */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMoreOpen(false)}
              className="md:hidden fixed inset-0 bg-background/60 backdrop-blur-xs z-40 cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ duration: 0.25 }}
              className="md:hidden fixed bottom-20 left-4 right-4 bg-card border border-border/80 rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-3 max-h-[60vh] overflow-y-auto"
            >
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Navigation
              </h3>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="text-xs font-extrabold text-primary"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold transition-all",
                      isActive
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-secondary/40 border-border/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-border/40 pt-2 space-y-1">
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setIsMobileMoreOpen(false);
                }}
                className="flex items-center gap-2.5 w-full p-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span>
                  {theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  setIsLogoutDialogOpen(true);
                }}
                className="flex items-center gap-2.5 w-full p-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 h-14 bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl z-50 flex items-center justify-around px-2 shadow-lg">
        {mobileMenuItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMoreOpen(false)}
              className={cn(
                "flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors relative flex-1",
                isActive ? "text-primary font-bold" : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[9px] mt-0.5 uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
          className={cn(
            "flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors relative flex-1",
            isMobileMoreOpen
              ? "text-primary font-bold"
              : "text-muted-foreground",
          )}
        >
          <Menu className="h-4 w-4" />
          <span className="text-[9px] mt-0.5 uppercase tracking-wider">
            More
          </span>
        </button>
      </div>
    </>
  );
}
