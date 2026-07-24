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
  Image as ImageIcon,
  Flame,
  LifeBuoy,
  Bell,
  User,
  Sun,
  Moon,
  ChevronLeft,
  Sparkles,
  LogOut,
  Shield,
  ChevronUp,
  Brain,
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

import SidebarMobileDrawer from "./SidebarMobileDrawer";

const LogoutConfirmDialog = dynamic(
  () =>
    import("@/components/admin/LogoutConfirmDialog").then(
      (mod) => mod.LogoutConfirmDialog,
    ),
  { ssr: false },
);

const NAV_GROUPS = [
  {
    group: "Overview",
    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/" }],
  },
  {
    group: "Commerce",
    items: [
      { icon: Package, label: "Products", href: "/products" },
      { icon: ShoppingBag, label: "Orders", href: "/orders" },
      { icon: Users, label: "Customers", href: "/customers" },
    ],
  },
  {
    group: "Growth & Intel",
    items: [
      { icon: Brain, label: "Consumer Intel", href: "/consumer-intelligence" },
      { icon: ImageIcon, label: "Banners", href: "/banners" },
      {
        icon: Bell,
        label: "Notifications",
        href: "/notifications",
        badge: true,
      },
    ],
  },
  {
    group: "System",
    items: [{ icon: Settings, label: "Settings", href: "/settings" }],
  },
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
    {
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
      badge: true,
    },
    { icon: ImageIcon, label: "Banners", href: "/banners" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
    } catch {}
    dispatch(clearCredentials());
    toast.info("Session terminated.");
    router.push("/login");
  };

  const collapsed = isSidebarCollapsed;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex h-full shrink-0 flex-col bg-card border border-border/60 rounded-2xl shadow-xs relative z-10 overflow-visible"
      >
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

        {/* Brand Header */}
        <div
          onClick={toggleSidebar}
          className={cn(
            "flex items-center gap-3 relative z-10 shrink-0 border-b border-border/40 cursor-pointer select-none hover:bg-secondary/40 transition-colors duration-200 rounded-t-2xl",
            collapsed ? "px-4 py-4 justify-center" : "px-4 py-4",
          )}
        >
          <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Flame className="h-5 w-5" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden flex-1 min-w-0"
              >
                <div className="flex items-center gap-1">
                  <h1 className="text-base font-extrabold font-heading tracking-tight leading-none text-foreground">
                    Dunches
                  </h1>
                  <span className="text-primary font-bold">.</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-2.5 w-2.5 text-primary shrink-0" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                    Admin Console
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && (
            <ChevronLeft className="h-4 w-4 text-muted-foreground/60 hover:text-foreground transition-colors shrink-0" />
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-none relative z-10 p-3">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!collapsed && (
                <p className="px-2 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/70 mb-1">
                  {group.group}
                </p>
              )}

              {group.items.map((item) => {
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
                        "relative flex items-center gap-3 rounded-xl font-medium transition-all duration-200 overflow-hidden",
                        collapsed
                          ? "w-11 h-11 justify-center mx-auto"
                          : "px-3 py-2.5 text-xs sm:text-xs",
                        isActive
                          ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                      )}
                    >
                      {isActive && !collapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full" />
                      )}

                      <div className="relative z-10 flex items-center justify-center shrink-0">
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200",
                            isActive && "scale-110 text-primary",
                          )}
                        />
                        {item.badge && unreadCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 h-3.5 min-w-3.5 px-1 rounded-full bg-red-500 text-white text-[8px] font-extrabold flex items-center justify-center leading-none shadow-2xs">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </div>

                      {!collapsed && (
                        <span className="truncate flex-1 tracking-tight">
                          {item.label}
                        </span>
                      )}

                      {!collapsed && item.badge && unreadCount > 0 && (
                        <span className="text-[9px] font-extrabold bg-red-500 text-white px-1.5 py-0.5 rounded-full shadow-2xs">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>

                    {collapsed && (
                      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-foreground text-background rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 shadow-md z-200">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Actions & User Card */}
        <div
          className={cn(
            "flex flex-col gap-1 relative z-10 p-3 border-t border-border/40",
            collapsed && "items-center",
          )}
        >
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "flex items-center gap-3 rounded-xl text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all duration-200 w-full",
              collapsed ? "w-11 h-11 justify-center" : "px-3 py-2",
            )}
            title="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4 shrink-0 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400" />
            )}
            {!collapsed && (
              <span className="truncate">
                {mounted && theme === "dark" ? "Light Theme" : "Dark Theme"}
              </span>
            )}
          </button>

          <Link
            href="/support"
            className={cn(
              "flex items-center gap-3 rounded-xl text-xs font-medium transition-all duration-200 w-full",
              collapsed ? "w-11 h-11 justify-center" : "px-3 py-2",
              pathname === "/support"
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <LifeBuoy className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">Help Center</span>}
          </Link>

          <div ref={profileRef} className="relative mt-1">
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border border-border/40 p-2 hover:bg-secondary/60 transition-all duration-200 w-full text-left",
                profileOpen && "bg-secondary/80 border-primary/30",
              )}
            >
              <div className="relative shrink-0">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || "Admin"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate leading-tight">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold truncate leading-tight mt-0.5">
                    {user?.role || "Administrator"}
                  </p>
                </div>
              )}

              {!collapsed && (
                <ChevronUp
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200",
                    profileOpen ? "rotate-0" : "rotate-180",
                  )}
                />
              )}
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 mb-2 w-56 bg-card border border-border/80 rounded-2xl shadow-xl p-2 z-300 space-y-1"
                >
                  <div className="px-3 py-2 border-b border-border/40 mb-1">
                    <p className="text-xs font-extrabold text-foreground truncate">
                      {user?.name || "Administrator"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {user?.email || "admin@dunches.com"}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <User className="h-4 w-4 text-primary" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Store Settings</span>
                  </button>

                  <div className="my-1 border-t border-border/40" />

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setIsLogoutDialogOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <SidebarMobileDrawer
        isMobileMoreOpen={isMobileMoreOpen}
        setIsMobileMoreOpen={setIsMobileMoreOpen}
        moreItems={moreItems}
        mobileMenuItems={mobileMenuItems}
        pathname={pathname}
        theme={theme}
        setTheme={setTheme}
        setIsLogoutDialogOpen={setIsLogoutDialogOpen}
      />

      <LogoutConfirmDialog
        isOpen={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}
