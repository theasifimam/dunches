"use client";

import React from "react";
import Link from "next/link";
import { User, Sun, Moon, HelpCircle, MessageSquare, Lock, BookOpen, LogOut } from "lucide-react";
import BottomSheet from "../BottomSheet";

export default function UserMenuSheet({
  isOpen,
  onClose,
  user,
  avatarSrc,
  theme,
  toggleTheme,
  handleLogout,
}) {
  if (!user) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-1.5">
        {/* User Profile Info Card */}
        <div className="flex items-center gap-3 pb-4 mb-2 border-b border-border/10">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-foreground/5 border border-border/20">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4.5 h-4.5 text-foreground/45" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black uppercase tracking-wider text-foreground truncate">
              {user.name}
            </span>
            <span className="text-[10px] font-medium text-foreground/40 mt-0.5 truncate">
              {user.email || "craver@makhana.wellness"}
            </span>
          </div>
        </div>

        {/* Profile Dashboard Link */}
        <Link href="/profile" className="w-full" onClick={onClose}>
          <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
            <User className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Profile Dashboard
            </span>
          </div>
        </Link>

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

        {/* Logout button */}
        <button
          onClick={() => {
            onClose();
            handleLogout();
          }}
          className="w-full h-12 rounded-3xl bg-red-500/10 hover:bg-red-500/15 text-red-500 font-black text-xs uppercase tracking-wider transition-all mt-4 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] duration-150 border border-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </BottomSheet>
  );
}
