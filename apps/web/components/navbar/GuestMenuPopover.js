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
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

export default function GuestMenuPopover({ theme, toggleTheme, openAuth }) {
  return (
    <div className="hidden md:block">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 border border-border/50 hover:border-primary/40 rounded-full p-1 pr-3.5 transition-all bg-foreground/2 hover:bg-foreground/5 group outline-hidden cursor-pointer">
            <div className="w-8 h-8 rounded-full border border-border/60 bg-foreground/5 flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
              <User className="w-4 h-4 text-foreground/50 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground/70 group-hover:text-primary transition-colors font-heading">
              Account
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary transition-colors" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-60 p-4 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col gap-2 z-150"
        >
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 px-1 pb-1 border-b border-border/10">
            Account & Settings
          </div>

          {/* Login & Signup Actions */}
          <div className="flex flex-col gap-1.5 py-1">
            <button
              onClick={() => openAuth("login")}
              className="w-full py-2.5 px-3 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
            >
              <LogIn className="w-3.5 h-3.5" />
              Login
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="w-full py-2 px-3 rounded-xl border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Join Dunches
            </button>
          </div>

          <div className="h-px bg-border/10 my-0.5" />

          {/* Theme Mode Toggle */}
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
            <span className="text-[8px] opacity-40 font-bold uppercase">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>

          <div className="h-px bg-border/10 my-0.5" />

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
        </PopoverContent>
      </Popover>
    </div>
  );
}
