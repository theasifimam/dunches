"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Star, Sparkles, Heart, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
              Our Story
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light font-serif tracking-tighter lowercase">
            crafted for late-night cravings
          </h1>
          <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest leading-loose">
            The philosophy of healthy, fiery snacking
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
            <Sparkles className="w-5 h-5 text-primary" /> Who We Are
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed font-light">
            At Dunches, we believe that snacking shouldn&apos;t be a compromise between flavor and wellness. We specialize in premium, slow-roasted Himalayan Lotus Seeds (Makhāna) tossed in bold, fiery, and completely natural spice blends. 
          </p>
          <p className="text-sm text-foreground/60 leading-relaxed font-light">
            Our mission is simple: to save you from chemical-laden snacks and satisfy your late-night food cravings with clean, guilt-free crunch.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
        >
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> The Dunches Promise
          </h2>
          <ul className="space-y-4 text-sm text-foreground/60 font-light">
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong>100% Organic Sourcing:</strong> Every seed is sourced from pristine wetlands and hand-selected for size and quality.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong>No Artificial Preservatives:</strong> We only use cold-pressed oils, natural herbs, and premium spices.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Slow Roasted:</strong> Not fried. We lock in the maximum crunchy texture through patience and care.</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
        >
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Meet the Founder
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 rotate-6 hover:rotate-0 transition-transform">
              <Flame className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Ayaan Ahmed</h3>
              <p className="text-[10px] uppercase tracking-widest text-primary font-black">Chief Craving Officer</p>
              <p className="text-xs text-foreground/60 leading-relaxed font-light">
                Ayaan founded Dunches with a singular goal: to revolutionize late-night snacking. As a student and late-night coder, he was tired of choosing between greasy fast food and tasteless health bars. He created Dunches to bring premium, fiery, and organic Himalayan Makhana directly to creators and night owls.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Closing Action */}
        <div className="text-center pt-6">
          <Link href="/menu">
            <Button className="h-12 px-8 rounded-full text-xs font-black tracking-widest uppercase">
              Explore Our Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
