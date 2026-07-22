"use client";

import React from "react";
import Link from "next/link";
import { Menu, Sun, Moon, HelpCircle, Lock, BookOpen, MessageSquare } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

export default function GuestMenuPopover({ theme, toggleTheme }) {
  return (
    <div className="hidden md:block">
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/45 hover:text-primary bg-foreground/5 hover:bg-foreground/10 active:scale-95 transition-all cursor-pointer shrink-0">
            <Menu className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-56 p-4 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col gap-2 z-150"
        >
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 px-1 pb-1 border-b border-border/10">
            Menu
          </div>

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
        </PopoverContent>
      </Popover>
    </div>
  );
}
