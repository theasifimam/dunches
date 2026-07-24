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
  LogIn,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

export default function GuestMenuPopover({ theme, toggleTheme, openAuth }) {
  return (
    <div className="hidden md:block">
      <Popover>
        <PopoverTrigger className="flex items-center gap-2 border border-border/50 hover:border-primary/40 rounded-full p-1 pr-3.5 transition-all bg-foreground/2 hover:bg-foreground/5 group outline-none cursor-pointer active:scale-95">
          <div className="w-8 h-8 rounded-full border border-border/60 bg-foreground/5 flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
            <User className="w-4 h-4 text-foreground/60 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80 group-hover:text-primary transition-colors font-heading">
            Account
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-foreground/40 group-hover:text-primary transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-64 p-3 rounded-3xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-xl flex flex-col gap-2 z-150 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* Header Title */}
          <div className="px-1 pt-0.5 pb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground/40 font-heading">
              Account & Settings
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => openAuth("login")}
              className="w-full py-2.5 px-3 rounded-3xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="w-full py-2.5 px-3 rounded-3xl border border-border/60 hover:border-primary/40 text-foreground hover:text-primary text-xs font-bold uppercase tracking-wider hover:bg-foreground/3 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              Join Dunches
            </button>
          </div>

          <div className="h-px bg-border/20 my-1" />

          {/* Theme Switcher Row */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-2 rounded-3xl hover:bg-foreground/5 text-foreground/80 hover:text-foreground transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-3xl bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
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

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            <Link href="/about" className="w-full">
              <div className="w-full flex items-center justify-between p-2 rounded-3xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-3xl bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
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
              <div className="w-full flex items-center justify-between p-2 rounded-3xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-3xl bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
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
              <div className="w-full flex items-center justify-between p-2 rounded-3xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-3xl bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
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
              <div className="w-full flex items-center justify-between p-2 rounded-3xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-3xl bg-foreground/5 group-hover:bg-primary/10 text-foreground/60 group-hover:text-primary flex items-center justify-center transition-colors">
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
