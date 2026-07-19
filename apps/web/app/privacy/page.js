"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-40 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.02]" />
      <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/3 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-12">
        {/* Title Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-2">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
              Security & Trust
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light font-serif tracking-tighter lowercase">
            privacy policy
          </h1>
          <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest leading-loose">
            Your data security is our prime objective
          </p>
        </div>

        {/* Content Glass Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
        >
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" /> 1. Information Collection
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed font-light">
            We collect personal information that you provide directly to us when creating an account, making a purchase, updating your delivery address, or filling out a customer feedback form. This includes your name, email address, physical address, mobile number, and payment preferences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
        >
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> 2. How We Use Data
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed font-light">
            We use your data to facilitate order checkouts, coordinate food delivery logistics, compile unified consumer intelligence feedback, and customize your experience with Dunches. Your personal information is encrypted and will never be shared or sold to third-party brokers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
        >
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" /> 3. Cookies & Tracking
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed font-light">
            Dunches uses standard browser cookies and local storage tokens to persist your authentication state, shopping cart selections, and dark mode configuration preferences. You can disable cookies in your browser settings, but it may affect certain interactive checkout operations.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
