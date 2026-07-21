"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";

export default function ClearCartDialog({ isOpen, onClose, onConfirm }) {
  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Visible on both) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-300 backdrop-blur-xs cursor-pointer"
          />

          {/* 1. Mobile Layout: Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border/30 rounded-t-4xl p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] z-310 flex flex-col focus:outline-hidden pb-10"
          >
            {/* Drag/Visual Handle Bar */}
            <div className="w-10 h-1 bg-foreground/10 rounded-full mx-auto mb-6 shrink-0" />

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-wider">
                  Empty Cart?
                </h3>
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                  Snack checkout warning
                </p>
              </div>
            </div>

            <p className="text-xs text-foreground/60 leading-relaxed mb-6 font-medium">
              Are you sure you want to clear your cart? All items will be
              permanently removed, and you will have to add them again to buy
              them.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                variant="destructive"
                className="w-full h-12 rounded-3xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <Trash2 className="w-4 h-4" /> Yes, Empty Cart
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-3xl text-xs font-black uppercase tracking-wider"
                onClick={onClose}
              >
                Keep My Items
              </Button>
            </div>
          </motion.div>

          {/* 2. Desktop Layout: Centered Dialog Modal */}
          <div className="hidden sm:flex fixed inset-0 items-center justify-center z-310 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md bg-background border border-border/40 rounded-4xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-1 rounded-full text-foreground/35 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-wider">
                    Empty Cart?
                  </h3>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                    Warning Matrix Alert
                  </p>
                </div>
              </div>

              <p className="text-sm text-foreground/60 leading-relaxed mb-8 font-medium">
                Are you sure you want to clear your cart? All items will be
                permanently removed, and you will have to add them again to buy
                them.
              </p>

              <div className="flex justify-end gap-3.5">
                <Button
                  variant="outline"
                  className="px-6 h-12 rounded-full text-xs font-black uppercase tracking-wider"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="px-6 h-12 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Clear All Items
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
