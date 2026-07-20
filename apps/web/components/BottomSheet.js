"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function BottomSheet({ isOpen, onClose, children }) {
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
          {/* Backdrop Overlay with premium blurring */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-190 cursor-pointer backdrop-blur-[2px]"
          />

          {/* Premium Bottom-Docked Drawer Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.15}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 80 || velocity.y > 400) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-border/30 rounded-t-[2.25rem] p-6 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_-15px_40px_rgba(0,0,0,0.4)] z-200 flex flex-col focus:outline-hidden pb-10 overflow-hidden select-none"
          >
            {/* Ambient Top Glow Line */}
            <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent blur-[0.5px] pointer-events-none" />

            {/* Drag Handle Bar */}
            <div className="w-10 h-1 bg-foreground/10 rounded-full mx-auto mb-6 shrink-0 cursor-grab active:cursor-grabbing hover:bg-foreground/15 transition-colors duration-200" />

            {/* Quick Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4.5 right-5 p-1 rounded-full text-foreground/35 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer z-10"
              aria-label="Close sheet"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Content wrapper */}
            <div className="flex flex-col overflow-y-auto max-h-[70vh] no-scrollbar scroll-smooth">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
