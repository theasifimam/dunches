/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  BarChart3,
  Image as ImageIcon,
  Flame,
  LifeBuoy,
  Bell,
  User,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  Shield,
  ChevronUp,
  Brain,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useGetUnreadCountQuery } from "@/store/notificationApi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectCurrentUser, clearCredentials } from "@/store/authSlice";
import { useLogoutMutation } from "@/store/authApi";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useConfigStore } from "@/store/useConfigStore";

const LogoutConfirmDialog = dynamic(
  () =>
    import("@/components/admin/LogoutConfirmDialog").then(
      (mod) => mod.LogoutConfirmDialog,
    ),
  { ssr: false },
);

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: ShoppingBag, label: "Orders", href: "/orders" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: true },
  { icon: ImageIcon, label: "Banners", href: "/banners" },
  { icon: Brain, label: "Consumer Intel", href: "/consumer-intelligence" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useConfigStore();
  const { data: countData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  });
  const unreadCount = countData?.data?.count || 0;

  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const mobileMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Package, label: "Products", href: "/products" },
    { icon: ShoppingBag, label: "Orders", href: "/orders" },
    { icon: Brain, label: "Intel", href: "/consumer-intelligence" },
  ];

  const moreItems = [
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: Bell, label: "Notifications", href: "/notifications", badge: true },
    { icon: ImageIcon, label: "Banners", href: "/banners" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* ignore */
    }
    dispatch(clearCredentials());
    toast.info("Session terminated.");
    router.push("/login");
  };

  const collapsed = isSidebarCollapsed;

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <motion.div
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex h-full shrink-0 flex-col bg-card border border-border/30 rounded-[2rem] shadow-sm relative z-50 overflow-visible"
      >
        {/* Subtle glow top */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        {/* ── Header: Logo + Toggle ──────────────────────── */}
        <div
          onClick={toggleSidebar}
          className={cn(
            "flex items-center gap-3 relative z-10 shrink-0 border-b border-border/20 cursor-pointer select-none hover:bg-muted/30 transition-colors duration-200 rounded-t-[2rem]",
            collapsed ? "px-4 py-4 justify-center" : "px-5 py-4",
          )}
        >
          <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20">
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-150 opacity-60" />
            <Flame className="h-5 w-5 text-primary relative z-10" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <h1 className="text-base font-light font-serif tracking-tight leading-none text-foreground lowercase whitespace-nowrap">
                  Dunches
                  <span className="text-primary italic font-sans font-black">
                    .
                  </span>
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-2 w-2 text-primary" />
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap">
                    admin panel
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse chevron inside header */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-auto shrink-0"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Navigation ───────────────────────────────────── */}
        <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto scrollbar-none relative z-10 px-2.5 py-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl transition-all duration-300 overflow-hidden",
                    collapsed
                      ? "w-12 h-12 justify-center mx-auto"
                      : "px-3 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {/* Active left bar (expanded only) */}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="sidebarActiveBar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-primary rounded-r-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Active background dot (collapsed) */}
                  {isActive && collapsed && (
                    <motion.div
                      layoutId="sidebarActiveBg"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative z-10 flex items-center justify-center shrink-0">
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-all duration-300",
                        isActive && "scale-110",
                      )}
                    />
                    {item.badge && unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-0.5 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-[13px] font-medium tracking-tight whitespace-nowrap relative z-10 flex-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Unread count label (expanded) */}
                  {!collapsed && item.badge && unreadCount > 0 && (
                    <AnimatePresence>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="ml-auto text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </Link>

                {/* Collapsed tooltip */}
                {collapsed && (
                  <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-foreground text-background rounded-xl text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-200 shadow-xl z-200">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Bottom actions ────────────────────────────────── */}
        <div
          className={cn(
            "flex flex-col gap-0.5 relative z-10 px-2.5 py-3 border-t border-border/20",
            collapsed && "items-center",
          )}
        >
          {/* Theme toggle */}
          <div className="group relative">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300",
                collapsed ? "w-12 h-12 justify-center" : "px-3 py-2.5",
              )}
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun className="h-[18px] w-[18px] shrink-0 group-hover:rotate-45 transition-transform duration-500" />
                ) : (
                  <Moon className="h-[18px] w-[18px] shrink-0 group-hover:-rotate-12 transition-transform duration-500" />
                ))}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-[13px] font-medium tracking-tight whitespace-nowrap"
                  >
                    {mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {collapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-foreground text-background rounded-xl text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-200 shadow-xl z-200">
                {mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </div>
            )}
          </div>

          {/* Help */}
          <div className="group relative">
            <Link
              href="/support"
              className={cn(
                "flex items-center gap-3 rounded-xl transition-all duration-300",
                collapsed ? "w-12 h-12 justify-center" : "px-3 py-2.5 w-full",
                pathname === "/support"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <LifeBuoy className="h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:rotate-12" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-[13px] font-medium tracking-tight whitespace-nowrap"
                  >
                    Help Center
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            {collapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-foreground text-background rounded-xl text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-200 shadow-xl z-200">
                Help Center
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </div>
            )}
          </div>

          {/* Profile button with dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className={cn(
                "flex items-center gap-3 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300 w-full",
                collapsed ? "w-12 h-12 justify-center" : "px-3 py-2",
                profileOpen && "bg-muted/50 text-foreground",
              )}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary/50 transition-all duration-300 shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || "Admin"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-left overflow-hidden flex-1 min-w-0"
                  >
                    <p className="text-[12px] font-semibold text-foreground whitespace-nowrap truncate">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                      {user?.role || "Administrator"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!collapsed && (
                <ChevronUp
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-300",
                    profileOpen ? "rotate-0" : "rotate-180",
                  )}
                />
              )}
            </button>

            {/* Profile Dropdown — pops upward */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-0 mb-2 w-64 bg-card border border-border/40 rounded-2xl shadow-2xl shadow-black/15 overflow-hidden z-300"
                >
                  {/* Profile Header */}
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-border/20 bg-muted/20">
                    <div className="h-12 w-12 rounded-2xl overflow-hidden ring-2 ring-primary/20 shrink-0">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-foreground truncate">
                        {user?.name || "Admin User"}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 truncate">
                        {user?.email || ""}
                      </p>
                      <span className="inline-block mt-1 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {user?.role || "Administrator"}
                      </span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                    >
                      <User className="h-4 w-4 shrink-0" />
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/settings");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                    >
                      <Shield className="h-4 w-4 shrink-0" />
                      Account Settings
                    </button>
                    <div className="mx-3 my-1.5 h-px bg-border/40" />
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setIsLogoutDialogOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsed tooltip */}
            {collapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-foreground text-background rounded-xl text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-200 shadow-xl z-200">
                <div className="font-bold">{user?.name || "Admin"}</div>
                <div className="text-background/60 text-[9px] uppercase tracking-wider">
                  Profile & settings
                </div>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Mobile More Overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMoreOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed bottom-24 left-4 right-4 bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl z-50 flex flex-col gap-4 max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-border/20 pb-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">More Menu</h3>
              <button 
                onClick={() => setIsMobileMoreOpen(false)}
                className="text-xs font-bold uppercase tracking-wider text-primary"
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border",
                      isActive 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-muted/10 border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-medium tracking-tight whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <hr className="border-border/20" />
            
            {/* Theme Toggle, Help & Logout */}
            <div className="flex flex-col gap-2">
              <Link
                href="/profile"
                onClick={() => setIsMobileMoreOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 text-muted-foreground hover:text-foreground"
              >
                <User className="h-4 w-4" />
                <span className="text-xs font-medium tracking-tight ml-2">My Profile</span>
              </Link>
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setIsMobileMoreOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 text-muted-foreground hover:text-foreground w-full text-left"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="text-xs font-medium tracking-tight ml-2">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
              <Link
                href="/support"
                onClick={() => setIsMobileMoreOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 text-muted-foreground hover:text-foreground"
              >
                <LifeBuoy className="h-4 w-4" />
                <span className="text-xs font-medium tracking-tight ml-2">Help Center</span>
              </Link>
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  setIsLogoutDialogOpen(true);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 text-destructive w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-xs font-medium tracking-tight ml-2">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Navigation ─────────────────────────────── */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl z-50 flex items-center justify-between px-4 gap-2 shadow-2xl">
        {mobileMenuItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 relative shrink-0 flex-1",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-300 relative",
                  isActive ? "bg-primary/15 scale-110" : "hover:bg-muted",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              </div>
              <span
                className={cn(
                  "text-[8px] font-black uppercase tracking-widest mt-1",
                  isActive ? "opacity-100" : "opacity-50",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
          className={cn(
            "flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 relative shrink-0 flex-1",
            isMobileMoreOpen ? "text-primary" : "text-muted-foreground",
          )}
        >
          <div
            className={cn(
              "p-2 rounded-xl transition-all duration-300 relative",
              isMobileMoreOpen ? "bg-primary/15 scale-110" : "hover:bg-muted",
            )}
          >
            <Menu className="h-5 w-5" />
          </div>
          <span
            className={cn(
              "text-[8px] font-black uppercase tracking-widest mt-1",
              isMobileMoreOpen ? "opacity-100" : "opacity-50",
            )}
          >
            More
          </span>
        </button>
      </div>

      <LogoutConfirmDialog
        isOpen={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}
