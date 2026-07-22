"use client";

import React from "react";
import Link from "next/link";
import { User, ChevronDown, Sun, Moon, HelpCircle, Lock, BookOpen, MessageSquare, LogOut } from "lucide-react";
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
      <PopoverTrigger className="flex items-center gap-2 border border-border/50 hover:border-primary/40 rounded-full p-1 pr-4 transition-all bg-foreground/2 hover:bg-foreground/4 group outline-hidden cursor-pointer">
        <div className="w-8 h-8 rounded-full border border-primary/50 overflow-hidden flex items-center justify-center shrink-0 bg-foreground/5">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-foreground/45" />
          )}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-foreground/60 group-hover:text-primary transition-all font-heading">
          {user.name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary transition-colors" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-56 p-4 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col gap-2.5 z-150"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-border/10">
          <div className="w-10 h-10 rounded-full border border-primary/50 overflow-hidden shrink-0 flex items-center justify-center bg-foreground/5">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-foreground/45" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-black font-heading uppercase tracking-widest text-foreground truncate">
              {user.name}
            </span>
            <span className="text-[9px] font-medium text-foreground/40 truncate">
              {user.email || "ayaan.ahmed@makhana.wellness"}
            </span>
          </div>
        </div>
        <Link href="/profile" className="w-full">
          <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
            <User className="w-3.5 h-3.5" />
            View Profile
          </button>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
            Theme Mode
          </span>
          <span className="text-[8px] opacity-40 font-bold">
            {theme === "dark" ? "Dark" : "Light"}
          </span>
        </button>

        <div className="h-px bg-border/10 my-1" />

        <Link href="/about" className="w-full">
          <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
            <HelpCircle className="w-3.5 h-3.5" />
            About Us
          </button>
        </Link>

        <Link href="/privacy" className="w-full">
          <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
        </Link>

        <Link href="/terms" className="w-full">
          <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
            <BookOpen className="w-3.5 h-3.5" />
            Terms & Conditions
          </button>
        </Link>

        <Link href="/contact" className="w-full">
          <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5" />
            Contact Us
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 py-2 px-1 rounded-lg hover:bg-red-500/5 transition-all font-heading border-t border-border/10 pt-3 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </PopoverContent>
    </Popover>
  );
}
