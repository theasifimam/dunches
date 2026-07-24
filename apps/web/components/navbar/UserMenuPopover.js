"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  ChevronDown,
  Sun,
  Moon,
  HelpCircle,
  Lock,
  BookOpen,
  MessageSquare,
  LogOut,
  ChevronRight,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

export default function UserMenuPopover({
  user,
  avatarSrc,
  theme,
  toggleTheme,
  handleLogout,
}) {
  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2 border border-border/50 hover:border-primary/40 rounded-full p-1 pr-3.5 transition-all bg-foreground/2 hover:bg-foreground/5 group outline-none cursor-pointer active:scale-95">
        <div className="w-8 h-8 rounded-full border border-primary/50 overflow-hidden flex items-center justify-center shrink-0 bg-foreground/5">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-foreground/60 group-hover:text-primary transition-colors" />
          )}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80 group-hover:text-primary transition-colors font-heading truncate max-w-25">
          {user.name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-foreground/40 group-hover:text-primary transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-64 p-3 rounded-2xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-xl flex flex-col gap-2 z-150 animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {/* User Card Header */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-foreground/3 border border-border/15">
          <div className="w-9 h-9 rounded-full border border-primary/50 overflow-hidden shrink-0 flex items-center justify-center bg-primary/10">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold font-heading uppercase tracking-wider text-foreground truncate">
              {user.name}
            </span>
            <span className="text-[10px] text-foreground/50 truncate">
              {user.email || user.mobile || "Member"}
            </span>
          </div>
        </div>

        {/* User Specific Links */}
        <div className="flex flex-col gap-1">
          <Link href="/profile" className="w-full">
            <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold font-heading">
                  View Profile
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link href="/orders" className="w-full">
            <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold font-heading">
                  My Orders
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link href="/addresses" className="w-full">
            <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold font-heading">
                  Saved Addresses
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </div>

        <div className="h-px bg-border/20 my-1" />

        {/* Theme Switcher Row */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-foreground/5 text-foreground/80 hover:text-foreground transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </div>
            <span className="text-xs font-semibold font-heading">
              Theme Mode
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 bg-foreground/5 px-2.5 py-0.5 rounded-full border border-border/30 group-hover:border-primary/30 group-hover:text-primary transition-colors">
            {theme === "dark" ? "Dark" : "Light"}
          </span>
        </button>

        <div className="h-px bg-border/20 my-1" />

        {/* Support Links */}
        <div className="flex flex-col gap-1">
          <Link href="/about" className="w-full">
            <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold font-heading">
                  About Us
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link href="/privacy" className="w-full">
            <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold font-heading">
                  Privacy Policy
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link href="/terms" className="w-full">
            <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold font-heading">
                  Terms & Conditions
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link href="/contact" className="w-full">
            <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold font-heading">
                  Contact Us
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </div>

        <div className="h-px bg-border/20 my-1" />

        {/* Logout Row */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold font-heading uppercase tracking-wider">
              Logout
            </span>
          </div>
        </button>
      </PopoverContent>
    </Popover>
  );
}
