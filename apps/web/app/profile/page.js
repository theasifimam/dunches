"use client";

import { useSelector } from "react-redux";
import { selectUser, selectAddresses } from "@/features/user/userSlice";
import { motion } from "framer-motion";
import { Crown, MapPin, ArrowRight, UserCircle, ShieldCheck, Flame, Package } from "lucide-react";
import Link from "next/link";
import { isRealEmail } from "@/lib/utils";

export default function ProfileOverviewPage() {
  const user = useSelector(selectUser);
  const addresses = useSelector(selectAddresses);

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Recently";

  const realEmail = isRealEmail(user.email) ? user.email : null;

  const quickLinks = [
    {
      label: "My Orders",
      desc: "Track & view order history",
      href: "/profile/orders",
      icon: Package,
    },
    {
      label: "Edit Profile",
      desc: "Name, avatar, date of birth",
      href: "/profile/edit",
      icon: UserCircle,
    },
    {
      label: "Addresses",
      desc: `${addresses.length} saved location${addresses.length !== 1 ? "s" : ""}`,
      href: "/profile/addresses",
      icon: MapPin,
    },
    {
      label: "Account Security",
      desc: "Verification & deletion",
      href: "/profile/security",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Membership Artifact ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 sm:h-80 bg-foreground text-background rounded-[2.5rem] p-8 sm:p-14 overflow-hidden shadow-2xl group transition-all hover:scale-[1.005]"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary),transparent_55%)] opacity-25" />
        {/* Animated glow */}
        <div className="absolute bottom-[-30%] right-[-10%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] group-hover:bg-primary/20 transition-all duration-1000" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">
                  Dunches Member
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-light font-serif tracking-tighter leading-none lowercase">
                mindful <br />
                membership.
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] opacity-30">Since</p>
              <p className="text-base sm:text-lg font-bold opacity-80">{memberSince}</p>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-30">Member</p>
              <p className="text-lg font-black font-heading tracking-tight">{user.name}</p>
              {user.mobile && (
                <p className="text-[10px] font-bold opacity-40">{user.mobile}</p>
              )}
            </div>
            <div className="bg-primary/15 rounded-full px-5 py-2 border border-primary/25">
              <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">
                Organic Wellness Active
              </p>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute -bottom-6 -left-4 text-[8rem] sm:text-[10rem] font-black font-heading opacity-[0.035] select-none pointer-events-none lowercase leading-none">
          makhāna
        </div>
      </motion.div>

      {/* ── Quick Nav Cards ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {quickLinks.map(({ label, desc, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <div className="flex items-center justify-between p-5 bg-foreground/[0.02] border border-border/50 rounded-[1.5rem] hover:border-primary/30 hover:bg-primary/[0.03] transition-all group cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider">{label}</p>
                  <p className="text-[9px] text-foreground/40 mt-0.5">{desc}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </motion.div>

      {/* ── Account Info Card ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="p-6 sm:p-8 bg-foreground/[0.02] border border-border/50 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6"
      >
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
          <Crown className="w-7 h-7" />
        </div>
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-base font-black font-heading mb-1">Secure Imperial Vault</h3>
          <p className="text-[10px] text-foreground/40 leading-relaxed">
            Your data is protected with high-standard encryption.
            {realEmail && (
              <> Linked email: <span className="text-foreground/60 font-bold">{realEmail}</span></>
            )}
          </p>
        </div>
        <Link href="/profile/security">
          <button className="px-6 py-2.5 border border-border hover:border-primary/40 hover:text-primary rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap">
            Manage
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
