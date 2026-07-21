"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LogOut, AlertCircle } from "lucide-react";
import BottomSheet from "./BottomSheet";

export function LogoutConfirmDialog({ isOpen, onOpenChange, onConfirm }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClose = () => {
    onOpenChange(false);
  };

  const dialogContent = (
    <div className="flex flex-col items-center text-center p-2">
      <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-4 shrink-0">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold font-serif text-foreground mb-2">
        Sign Out
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Are you sure you want to end your active session?
      </p>

      <p className="text-sm text-muted-foreground mb-6">
        You will need to sign in again to access any administrative panels or
        metrics.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={handleClose}
          style={{ borderRadius: "9999px", height: "56px" }}
          className="flex-1 h-14 text-xs font-bold uppercase tracking-wider cursor-pointer border border-border/80 bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground active:scale-99 transition-all flex items-center justify-center py-3"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{ borderRadius: "9999px", height: "56px" }}
          className="flex-1 h-14 text-xs font-bold uppercase tracking-wider bg-destructive hover:bg-destructive/90 text-white active:scale-99 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md py-3"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={handleClose}>
        {dialogContent}
      </BottomSheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6 rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl shadow-2xl">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
