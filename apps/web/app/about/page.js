"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Star,
  Sparkles,
  Heart,
  User,
  Compass,
  MapPin,
  Volume2,
  Coffee,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const [settings, setSettings] = useState(null);
  const [expandedMembers, setExpandedMembers] = useState({});

  const toggleMemberDescription = (index) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/settings`,
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const logoUrl = settings?.logo
    ? settings.logo.startsWith("http")
      ? settings.logo
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${settings.logo}`
    : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 14,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-40 relative overflow-hidden">
      {/* Background Textures & Aura Lights */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      <div className="absolute top-[5%] right-[-15%] w-[75vw] h-[75vw] bg-primary/4 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] left-[-15%] w-[65vw] h-[65vw] bg-accent/4 rounded-full blur-[130px] pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-6 relative z-10 space-y-16"
      >
        {/* Title Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          {logoUrl ? (
            <div className="mx-auto w-20 h-20 mb-6 rounded-3xl overflow-hidden bg-foreground/2 p-2 border border-border/40 flex items-center justify-center shadow-inner hover:scale-105 transition-transform duration-300">
              <img
                src={logoUrl}
                alt="Store Logo"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-2">
              <Flame className="w-3.5 h-3.5 text-primary fill-primary/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                our legacy
              </span>
            </div>
          )}

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground font-sans lowercase leading-[0.95]">
            crave the heat. <br />
            <span className="font-serif italic font-light text-foreground/45">
              skip the guilt.
            </span>
          </h1>

          <p className="text-[11px] text-foreground/40 font-black uppercase tracking-[0.25em] leading-loose max-w-md mx-auto">
            The philosophy of healthy, slow-roasted, fiery snacking
          </p>
        </motion.div>

        {/* Spotlight Quote Card (Dynamic Website Description) */}
        {settings?.description && (
          <motion.div
            variants={itemVariants}
            className="relative p-8 rounded-[2.5rem] border border-primary/20 bg-linear-to-br from-primary/10 via-background to-transparent shadow-xs overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 fill-primary/10" /> manifest
                statement
              </span>
              <p className="text-lg font-serif italic text-foreground leading-relaxed pl-1">
                &ldquo;{settings.description}&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {/* Narrative / Context Section */}
        <motion.div
          variants={itemVariants}
          className="p-8 sm:p-10 rounded-[3rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
        >
          <h2 className="text-xl font-bold font-serif flex items-center gap-2 text-foreground">
            <Compass className="w-5 h-5 text-primary" /> The Genesis of Dunches
          </h2>
          <div className="space-y-4 text-sm text-foreground/60 leading-relaxed font-light">
            <p>
              It started during late-night coding sessions. Our founder, Ayaan,
              was tired of choosing between greasy, chemical-heavy potato chips
              that left him sluggish, or tasteless cardboard-like health bars
              that failed to satisfy his fiery cravings.
            </p>
            <p>
              He realized that snacking shouldn&apos;t be a compromise between
              flavor and wellness. His journey led him to the pristine wetlands
              of the Himalayas, where he rediscovered the ancient superfood:{" "}
              <strong>Makhana (Lotus Seeds)</strong>. Slow-roasted to lock in
              the ultimate crunch, and tossed in bold, handcrafted spice blends,
              Dunches was born.
            </p>
          </div>
        </motion.div>

        {/* Interactive Creed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, borderColor: "rgba(var(--primary), 0.3)" }}
            className="p-6 rounded-[2.5rem] border border-border/40 bg-foreground/2 space-y-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Pure Source
            </h3>
            <p className="text-xs text-foreground/50 leading-relaxed font-light">
              100% organic Himalayan Lotus Seeds, hand-harvested from natural
              wetlands. No compromises, no cheap fillers.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, borderColor: "rgba(var(--primary), 0.3)" }}
            className="p-6 rounded-[2.5rem] border border-border/40 bg-foreground/2 space-y-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Real Spices
            </h3>
            <p className="text-xs text-foreground/50 leading-relaxed font-light">
              Tossed in cold-pressed oils, natural herbs, and premium spice
              blends. No artificial powders or MSG.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, borderColor: "rgba(var(--primary), 0.3)" }}
            className="p-6 rounded-[2.5rem] border border-border/40 bg-foreground/2 space-y-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Slow Roasted
            </h3>
            <p className="text-xs text-foreground/50 leading-relaxed font-light">
              Baked through slow heat cycles to lock in maximum structural
              crunch. Never deep-fried, always airy.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Team Section */}
        {settings?.teamMembers && settings.teamMembers.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="flex items-center justify-center gap-3 mb-10">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold font-serif text-foreground">
                Meet the Team
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:border-primary/30 transition-colors"
                >
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-md group-hover:scale-110 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
                    <div className="w-20 h-20 rounded-3xl border border-primary/20 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500 relative z-10 bg-background overflow-hidden">
                      {member.image ? (
                        <img
                          src={
                            member.image.startsWith("http")
                              ? member.image
                              : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${member.image}`
                          }
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-primary/40" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                        {member.name}
                      </h3>
                      <p className="text-[9px] uppercase tracking-widest text-primary font-black mt-0.5">
                        {member.role}
                      </p>
                    </div>
                    {member.description && (
                      <div className="space-y-1">
                        <p className="text-[11px] text-foreground/60 leading-relaxed font-light italic">
                          &ldquo;{expandedMembers[index] || member.description.length <= 150
                            ? member.description
                            : `${member.description.substring(0, 150)}...`}
                          &rdquo;
                        </p>
                        {member.description.length > 150 && (
                          <button
                            onClick={() => toggleMemberDescription(index)}
                            className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline cursor-pointer"
                          >
                            {expandedMembers[index] ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Closing Call to Action */}
        <motion.div variants={itemVariants} className="text-center pt-4">
          <Link href="/menu">
            <Button className="h-14 px-10 rounded-full text-xs font-black tracking-widest uppercase hover:scale-102 active:scale-98 transition-all">
              Explore Our Flavors
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
