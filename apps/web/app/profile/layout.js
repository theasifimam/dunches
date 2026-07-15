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
import { fetchProfile, setProfile, logoutUser, selectUser, selectUserLoading } from "@/features/user/userSlice";
import AuthModal from "@/components/AuthModal";
import { isRealEmail } from "@/lib/utils";

const NAV = [
  { label: "Profile", sublabel: "Personal details", href: "/profile", icon: UserCircle },
  { label: "Orders", sublabel: "Order history", href: "/profile/orders", icon: Package },
  { label: "Addresses", sublabel: "Delivery locations", href: "/profile/addresses", icon: MapPin },
  { label: "Security", sublabel: "Account protection", href: "/profile/security", icon: ShieldCheck },
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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/");
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : null;

  const avatarSrc = user?.avatar
    ? `${user.avatar.startsWith("/uploads") ? "" : "/uploads/"}${user.avatar.replace(/^\/uploads\//, "")}`
    : null;

  if (!mounted) return null;

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 pt-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 mx-auto">
            <Flame className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-light font-serif tracking-tighter lowercase mb-3">
              members only.
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
              Sign in to access your imperial archive
            </p>
          </div>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="w-full h-14 bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-xl"
          >
            Authenticate
          </button>
          <Link href="/" className="block text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
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

  return (
    <div className="min-h-screen bg-background pb-28 sm:pb-16 pt-24 sm:pt-28">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] bg-primary/4 rounded-full blur-[160px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="lg:w-72 shrink-0 space-y-4">

            {/* Profile Card */}
            <div className="bg-foreground/[0.03] border border-border/50 rounded-[2rem] p-6 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-foreground/5 border-4 border-background shadow-2xl overflow-hidden flex items-center justify-center mb-4 ring-2 ring-primary/20">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-foreground/20" />
                  )}
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 mb-3">
                  <Crown className="w-3 h-3 text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                    {user?.role || "member"}
                  </span>
                </div>

                <h2 className="text-lg font-black font-heading tracking-tight truncate max-w-full mb-0.5">
                  {user?.name}
                </h2>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/30">
                  {user?.mobile || (user?.email && isRealEmail(user.email) ? user.email : null) || "Phone member"}
                </p>

                {/* Stats */}
                {memberSince && (
                  <div className="mt-4 pt-4 border-t border-border/50 w-full">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-1">Member Since</p>
                    <p className="text-sm font-black">{memberSince}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1.5">
              {NAV.map(({ label, sublabel, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link key={href} href={href}>
                    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all group cursor-pointer ${
                      isActive
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-foreground/[0.02] border-transparent hover:border-border hover:bg-foreground/[0.04]"
                    }`}>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-foreground/30 group-hover:text-primary/60"} transition-colors`} />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</p>
                          <p className="text-[8px] text-foreground/30 mt-0.5 font-medium">{sublabel}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 transition-all ${isActive ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5"}`} />
                    </div>
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-all text-left mt-2"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">End Session</p>
                  <p className="text-[8px] text-red-400/50 mt-0.5 font-medium">Sign out of your account</p>
                </div>
              </button>
            </nav>
          </aside>

          {/* ── Page Content ─────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
