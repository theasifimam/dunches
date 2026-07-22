"use client";

import React from "react";
import Link from "next/link";
import { Sun, Moon, HelpCircle, MessageSquare, Lock, BookOpen, User } from "lucide-react";
import BottomSheet from "../BottomSheet";

export default function GuestMenuSheet({
  isOpen,
  onClose,
  theme,
  toggleTheme,
  openAuth,
}) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-1.5">
        <div className="pb-3 mb-2 border-b border-border/10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/35">
            Menu
          </h3>
        </div>

        {/* Theme Mode */}
        <button
          onClick={() => {
            toggleTheme();
            onClose();
          }}
          className="w-full flex items-center justify-between py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3.5">
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
              Theme Mode
            </span>
          </div>
          <span className="text-[9px] uppercase font-black tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
            {theme === "dark" ? "Dark" : "Light"}
          </span>
        </button>

        {/* About Us */}
        <Link href="/about" className="w-full" onClick={onClose}>
          <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
            <HelpCircle className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              About Us
            </span>
          </div>
        </Link>

        {/* Contact Us */}
        <Link href="/contact" className="w-full" onClick={onClose}>
          <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
            <MessageSquare className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Contact Support
            </span>
          </div>
        </Link>

        {/* Privacy Policy */}
        <Link href="/privacy" className="w-full" onClick={onClose}>
          <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
            <Lock className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Privacy Policy
            </span>
          </div>
        </Link>

        {/* Terms & Conditions */}
        <Link href="/terms" className="w-full" onClick={onClose}>
          <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
            <BookOpen className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Terms of Use
            </span>
          </div>
        </Link>

        {/* Login Actions */}
        <div className="flex flex-col gap-2 border-t border-border/10 pt-4 mt-2">
          <button
            onClick={() => {
              onClose();
              openAuth("login");
            }}
            className="w-full h-12 rounded-3xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] duration-150"
          >
            <User className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => {
              onClose();
              openAuth("signup");
            }}
            className="w-full h-12 rounded-3xl border border-primary/20 text-primary font-black text-xs uppercase tracking-wider hover:bg-primary/5 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] duration-150"
          >
            Join Dunches
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
