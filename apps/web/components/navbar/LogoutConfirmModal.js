"use client";

import React from "react";
import { LogOut } from "lucide-react";
import BottomSheet from "../BottomSheet";

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirmLogout,
}) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-4">
          <LogOut className="w-6 h-6 text-red-500 animate-pulse" />
        </div>
        <h3 className="text-lg font-black font-heading uppercase tracking-tight text-foreground mb-2">
          Pause the Munch?
        </h3>
        <p className="text-xs text-foreground/45 max-w-sm leading-relaxed mb-6 font-medium">
          Are you sure you want to log out? Your delicious cart items will remain
          safe, but we'll miss your spicy presence!
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onConfirmLogout}
            className="w-full h-12 rounded-3xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:bg-primary-hover transition-all cursor-pointer active:scale-99 shadow-md flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Yes, Log Out
          </button>
          <button
            onClick={onClose}
            className="w-full h-12 rounded-3xl border border-border bg-foreground/2 hover:bg-foreground/5 hover:border-foreground/20 text-foreground/60 hover:text-foreground font-black text-xs uppercase tracking-widest transition-all cursor-pointer active:scale-99"
          >
            No, Keep Munching
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
