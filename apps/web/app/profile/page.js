"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  ShoppingBag,
  MapPin,
  Crown,
  CreditCard,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Star,
  Clock,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";
import Link from "next/link";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.warn("localStorage is not accessible:", error);
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    // Reload navbar state by dispatching event or simply reloading page
    window.location.reload();
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Reload to sync Navbar
    window.location.reload();
  };

  if (!mounted) return null;

  const userStats = [
    {
      label: "Orders",
      value: currentUser?.ordersCount || "24",
      icon: ShoppingBag,
    },
    {
      label: "Points",
      value: currentUser?.points?.toLocaleString() || "1,200",
      icon: Star,
    },
    { label: "Saves", value: "12", icon: Crown },
  ];

  const orderHistory = [
    {
      id: "ORD-9283",
      date: "Today",
      items: "Classic Pink Salt Makhāna, Chili Lime Makhāna",
      status: "In Transit",
      total: "₹255",
    },
    {
      id: "ORD-9120",
      date: "Yesterday",
      items: "Organic Jaggery & Fennel Makhāna",
      status: "Delivered",
      total: "₹150",
    },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-foreground/2 border border-primary/20 rounded-[2.5rem] p-8 sm:p-10 text-center space-y-6 sm:space-y-8 relative backdrop-blur-md"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 mx-auto">
            <Lock className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tighter text-foreground">
              Imperial Archive
            </h2>
            <p className="text-[10px] sm:text-xs text-foreground/50 leading-relaxed max-w-[320px] mx-auto">
              Authentication is required to enter the secure vault. Sign in to
              view your orders, VIP status, and reward history.
            </p>
          </div>

          <Button
            onClick={() => setIsAuthOpen(true)}
            className="w-full h-16 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase shadow-xl group flex items-center justify-center gap-3"
          >
            Authenticate Phone
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Link href="/">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-amber-500 cursor-pointer block mt-4 text-center">
              Return to Grand Hall
            </span>
          </Link>

          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-20 pt-28">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          {/* Sidebar - Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="bg-foreground/3 border border-border/50 rounded-[2.5rem] p-6 sm:p-10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />

              <div className="relative z-10">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center p-1 border-4 border-background shadow-2xl">
                  <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
                    <User className="w-12 h-12 text-foreground/20" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-4 animate-pulse">
                  <Crown className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {currentUser.tier}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight mb-2">
                  {currentUser.name}
                </h1>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-6 sm:mb-8">
                  {currentUser.phone || currentUser.email}
                </p>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-border/50">
                  {userStats.map((stat, i) => (
                    <div key={i}>
                      <p className="text-lg sm:text-xl font-black">
                        {stat.value}
                      </p>
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-30">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {[
                { label: "Imperial Settings", icon: Settings },
                { label: "Payment Archives", icon: CreditCard },
                { label: "Delivery Points", icon: MapPin },
                { label: "Security Keys", icon: ShieldCheck },
              ].map((item, i) => (
                <button
                  key={i}
                  className="flex items-center justify-between p-4 sm:p-6 bg-foreground/2 border border-transparent hover:border-border hover:bg-foreground/4 rounded-4xl transition-all group"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <item.icon className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 transition-all" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 text-red-500 hover:bg-red-500/5 rounded-4xl transition-all group mt-2 sm:mt-4 text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">
                  End Session
                </span>
              </button>
            </nav>
          </motion.div>

          {/* Main Content - Bento Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-10"
          >
            {/* Active Membership Artifact */}
            <div className="relative h-56 sm:h-80 bg-foreground text-background rounded-[2.5rem] p-6 sm:p-14 overflow-hidden shadow-2xl transition-all hover:scale-[1.01] group">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--color-primary),transparent_60%)] opacity-20" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-1000" />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 sm:space-y-4">
                    <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    <h2 className="text-3xl sm:text-6xl font-light font-serif tracking-tighter leading-none lowercase">
                      mindful <br />
                      membership.
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.3em] opacity-30">
                      Member Since
                    </p>
                    <p className="text-lg sm:text-xl font-bold">April 2026</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="bg-primary/10 rounded-full px-6 py-2 border border-primary/20">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                      Organic Wellness Active
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Watermark */}
              <div className="absolute -bottom-10 -left-10 text-9xl font-black font-heading opacity-[0.03] select-none pointer-events-none lowercase">
                makhāna
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1 sm:px-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    Recent Orders
                  </h3>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-all">
                  View History
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {orderHistory.map((order, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-6 sm:p-8 bg-foreground/2 border border-border/50 rounded-4xl hover:bg-foreground/4 transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {order.id}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">
                          {order.date}
                        </span>
                      </div>
                      <h4 className="text-lg font-black font-heading tracking-tight">
                        {order.items}
                      </h4>
                      <div className="inline-flex items-center gap-2 text-xs font-bold">
                        <div
                          className={`w-2 h-2 rounded-full ${order.status === "Delivered" ? "bg-green-500" : "bg-primary animate-pulse"}`}
                        />
                        <span className="opacity-60">{order.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <p className="text-xl sm:text-2xl font-black text-foreground tracking-tighter">
                        {order.total}
                      </p>
                      <button className="px-6 py-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-full text-[9px] font-black uppercase tracking-widest transition-all">
                        Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Protection Card */}
            <div className="p-6 sm:p-10 glass border border-primary/20 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shrink-0">
                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="text-center sm:text-left space-y-2 flex-1">
                <h3 className="text-xl font-black font-heading">
                  Secure Imperial Vault
                </h3>
                <p className="text-xs font-medium opacity-40 leading-relaxed">
                  Your data is protected by high-standard imperial encryption.
                  Every interaction is strictly private.
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-full px-8 h-12 uppercase text-[10px] font-black tracking-widest"
              >
                Verify ID
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
