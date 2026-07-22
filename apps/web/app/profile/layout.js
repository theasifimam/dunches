"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Crown,
  Flame,
  UserCircle,
  Package,
} from "lucide-react";
import {
  fetchProfile,
  setProfile,
  setLogoutConfirmOpen,
  selectUser,
  selectUserLoading,
} from "@/features/user/userSlice";
import AuthModal from "@/components/AuthModal";
import { isRealEmail } from "@/lib/utils";

const NAV = [
  {
    label: "Profile",
    sublabel: "Personal details",
    href: "/profile",
    icon: UserCircle,
  },
  {
    label: "Orders",
    sublabel: "Order history",
    href: "/profile/orders",
    icon: Package,
  },
  {
    label: "Addresses",
    sublabel: "Delivery locations",
    href: "/profile/addresses",
    icon: MapPin,
  },
  {
    label: "Security",
    sublabel: "Account protection",
    href: "/profile/security",
    icon: ShieldCheck,
  },
];

export default function ProfileLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);

  const [mounted, setMounted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        dispatch(setProfile(JSON.parse(saved)));
        dispatch(fetchProfile());
      }
    } catch {}
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(setLogoutConfirmOpen(true));
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : null;

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("/uploads")
      ? user.avatar
      : `/uploads/${user.avatar}`
    : null;

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  if (!mounted) return null;

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 pt-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/8 rounded-full blur-[140px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-foreground/2 border border-border/80 rounded-3xl p-8 sm:p-10 text-center space-y-8 backdrop-blur-xl shadow-xl"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 mx-auto shadow-inner">
            <Flame className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-light font-serif tracking-tight text-foreground lowercase">
              members only.
            </h1>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
              Sign in to access your personal profile & orders
            </p>
          </div>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="w-full h-14 bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-primary/25 cursor-pointer active:scale-[0.99]"
          >
            Authenticate Account
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary/70 hover:text-primary transition-colors"
          >
            ← Return to Grand Hall
          </Link>
        </motion.div>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(userData) => {
            localStorage.setItem("user", JSON.stringify(userData));
            dispatch(setProfile(userData));
            dispatch(fetchProfile());
          }}
        />
      </div>
    );
  }

  const isBaseProfile = pathname === "/profile";
  const subPageName = pathname.split("/").pop();

  return (
    <div className="min-h-screen bg-background pb-28 sm:pb-20 pt-24 sm:pt-28 relative overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      <div className="absolute top-10 right-0 w-[45vw] h-[45vw] bg-primary/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-0 w-[35vw] h-[35vw] bg-accent/4 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Mobile Page Header Header */}
        <div className="flex flex-col mb-6 md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-foreground font-sans lowercase leading-none">
              {isBaseProfile ? "your profile," : `${subPageName},`}
            </h1>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              {user?.role || "Member"}
            </span>
          </div>
          <p className="text-base text-foreground/50 font-serif italic lowercase mt-1">
            {isBaseProfile
              ? "account overview & preferences."
              : "settings & management."}
          </p>
        </div>

        {/* Mobile Back Button Link */}
        {!isBaseProfile && (
          <div className="md:hidden mb-5">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:underline cursor-pointer"
            >
              ← back to overview
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* ── Sidebar (Hidden on mobile to show page content first) ─── */}
          <aside className="hidden lg:block lg:w-80 shrink-0 space-y-5 sticky top-28">
            {/* Profile Summary Card */}
            <div className="bg-foreground/2.5 border border-border/80 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md shadow-xs group transition-all duration-300 hover:border-primary/30">
              <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Avatar with gradient ring */}
                <div className="relative mb-4">
                  {avatarSrc ? (
                    <div className="w-20 h-20 rounded-full border-2 border-background shadow-md overflow-hidden ring-2 ring-primary/30">
                      <img
                        src={avatarSrc}
                        alt={user?.name || "avatar"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/20 via-primary/10 to-accent/10 border-2 border-background flex items-center justify-center text-primary font-bold text-2xl shadow-md ring-2 ring-primary/30">
                      {userInitials}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full border-2 border-background shadow-xs">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Role Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                  <Crown className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    {user?.role || "Member"}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold font-serif tracking-tight truncate max-w-full text-foreground mb-0.5">
                  {user?.name}
                </h2>
                <p className="text-xs text-foreground/50 font-medium truncate max-w-full">
                  {user?.mobile ||
                    (user?.email && isRealEmail(user.email)
                      ? user.email
                      : "Verified Member")}
                </p>

                {/* Member Since Badge */}
                {memberSince && (
                  <div className="mt-4 pt-4 border-t border-border/60 w-full flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                      Member Since
                    </span>
                    <span className="font-extrabold text-foreground">
                      {memberSince}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              {NAV.map(({ label, sublabel, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link key={href} href={href}>
                    <div
                      className={`flex items-center justify-between p-4 rounded-3xl border transition-all duration-200 group cursor-pointer mb-2 ${
                        isActive
                          ? "bg-primary/10 border-primary/40 text-primary border-l-4 border-l-primary shadow-xs"
                          : "bg-foreground/2 border-border/50 hover:border-border hover:bg-foreground/4 text-foreground/80"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "bg-foreground/5 text-foreground/60 group-hover:text-primary group-hover:bg-primary/10"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold tracking-wide ${isActive ? "text-primary" : "text-foreground"}`}
                          >
                            {label}
                          </p>
                          <p className="text-[10px] text-foreground/40 mt-0.5 font-medium">
                            {sublabel}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          isActive
                            ? "opacity-100 text-primary translate-x-0.5"
                            : "opacity-30 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1"
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}

              {/* End Session Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 px-5 rounded-full border border-red-500/20 bg-red-500/2 hover:bg-red-500/8 hover:border-red-500/40 text-red-600 transition-all text-left mt-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">
                      End Session
                    </p>
                    <p className="text-[10px] text-red-500/60 mt-0.5 font-medium">
                      Sign out safely
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </nav>
          </aside>

          {/* ── Main Profile View Area ───────────────────────────────────── */}
          <main className="flex-1 min-w-0 w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
