"use client";

import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectAddresses, setLogoutConfirmOpen } from "@/features/user/userSlice";
import { motion } from "framer-motion";
import {
  Crown,
  MapPin,
  ArrowRight,
  UserCircle,
  ShieldCheck,
  Flame,
  Package,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isRealEmail } from "@/lib/utils";

export default function ProfileOverviewPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const addresses = useSelector(selectAddresses);

  const handleLogout = () => {
    dispatch(setLogoutConfirmOpen(true));
  };

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const realEmail = isRealEmail(user.email) ? user.email : null;

  const quickLinks = [
    {
      label: "My Orders",
      desc: "Track live shipments & purchase history",
      badge: "Orders Archive",
      href: "/profile/orders",
      icon: Package,
    },
    {
      label: "Edit Profile",
      desc: "Update avatar, name & contact details",
      badge: "Personal Details",
      href: "/profile/edit",
      icon: UserCircle,
    },
    {
      label: "Delivery Addresses",
      desc: `${addresses.length} saved shipping location${addresses.length !== 1 ? "s" : ""}`,
      badge: "Locations",
      href: "/profile/addresses",
      icon: MapPin,
    },
    {
      label: "Account Security",
      desc: "Authentication & account protection",
      badge: "Privacy & Protection",
      href: "/profile/security",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Luxury Membership Banner Card ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[260px] sm:min-h-[300px] bg-gradient-to-br from-[#1E1816] via-[#281F1B] to-[#14100E] text-[#FAF7F2] rounded-3xl sm:rounded-[2.25rem] p-7 sm:p-12 overflow-hidden shadow-2xl border border-primary/25 group transition-all duration-300 hover:border-primary/40"
      >
        {/* Glow Overlay */}
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-primary/15 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/25 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-accent/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px] sm:min-h-[240px]">
          {/* Top Bar */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-2.5 bg-primary/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-primary/30">
              <Flame className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
                Dunches Imperial Club
              </span>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] opacity-40">
                Since
              </p>
              <p className="text-xs sm:text-sm font-bold opacity-90 font-mono">
                {memberSince}
              </p>
            </div>
          </div>

          {/* Center Title */}
          <div className="my-6">
            <h1 className="text-3xl sm:text-5xl font-light font-serif tracking-tight leading-none lowercase text-[#FAF7F2]">
              mindful <br />
              membership.
            </h1>
            <p className="text-xs text-foreground/40 mt-2 font-sans tracking-wide">
              Curated organic wellness & exclusive privileges
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 border-t border-white/10">
            <div className="space-y-0.5">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] opacity-40">
                Cardholder
              </p>
              <p className="text-lg sm:text-xl font-bold font-serif tracking-tight text-white">
                {user.name}
              </p>
              <p className="text-xs font-mono text-white/50">
                {user.mobile || realEmail || "Imperial Member"}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/35 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[10px] font-bold text-primary-foreground uppercase tracking-widest">
                Organic Wellness Active
              </p>
            </div>
          </div>
        </div>

        {/* Makhana Subtle Watermark */}
        <div className="absolute -bottom-8 -left-4 text-[7rem] sm:text-[10rem] font-bold font-serif opacity-[0.035] select-none pointer-events-none lowercase leading-none text-white tracking-tighter">
          makhāna
        </div>
      </motion.div>

      {/* ── Quick Metrics Row ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-foreground/[0.025] border border-border/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
              Account Status
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">Active & Verified</p>
          </div>
        </div>

        <div className="bg-foreground/[0.025] border border-border/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
              Saved Locations
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              {addresses.length} Address{addresses.length !== 1 ? "es" : ""}
            </p>
          </div>
        </div>

        <div className="bg-foreground/[0.025] border border-border/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
              Membership Level
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">Imperial Gold</p>
          </div>
        </div>
      </motion.div>

      {/* ── Feature Action Cards ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif tracking-tight text-foreground">
            Account Navigation
          </h2>
          <span className="text-xs text-foreground/40">Quick management options</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map(({ label, desc, badge, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <div className="flex flex-col justify-between p-6 bg-foreground/[0.025] border border-border/80 rounded-3xl hover:border-primary/40 hover:bg-foreground/[0.04] transition-all duration-200 group cursor-pointer h-full relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary/70 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/15">
                    {badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {label}
                  </h3>
                  <p className="text-xs text-foreground/50 mt-1 font-medium leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary">
                  <span className="group-hover:underline">Open section</span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── Secure Vault Container ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 sm:p-8 bg-foreground/[0.025] border border-border/80 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif text-foreground">
              Secure Imperial Vault
            </h3>
            <p className="text-xs text-foreground/50 mt-0.5 max-w-md leading-relaxed">
              Your profile data and saved delivery preferences are protected with high-standard encryption.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end shrink-0">
          <Link href="/profile/security">
            <button className="px-6 py-2.5 border border-border hover:border-primary/50 hover:text-primary rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap bg-background cursor-pointer">
              Security Vault
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 border border-red-500/30 hover:border-red-500 text-red-600 hover:bg-red-500/10 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
