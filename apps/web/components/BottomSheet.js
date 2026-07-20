"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-190 cursor-pointer backdrop-blur-md"
          />

          {/* Bottom Sheet Drawer with glassmorphic style */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.25}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 120 || velocity.y > 600) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-background/85 backdrop-blur-3xl border-t border-x border-border/20 rounded-t-[3rem] p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.35)] z-200 flex flex-col focus:outline-hidden pb-12 overflow-hidden"
          >
            {/* Ambient Top Glow / Glass Shine Line */}
            <div className="absolute top-0 left-12 right-12 h-[1.5px] bg-linear-to-r from-transparent via-primary/45 to-transparent blur-[0.5px] pointer-events-none" />

            {/* Drag Handle Bar */}
            <div className="w-16 h-1.5 bg-foreground/10 rounded-full mx-auto mb-8 shrink-0 cursor-grab active:cursor-grabbing hover:bg-foreground/20 active:bg-foreground/30 transition-colors duration-200" />

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
