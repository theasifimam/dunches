"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  ChevronRight,
  BarChart3,
  Image as ImageIcon,
  ChevronLeft,
  HelpCircle,
  LogOut,
  Flame,
  Sparkles,
  LifeBuoy,
  Calendar,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useConfigStore } from "@/store/useConfigStore";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: ShoppingBag, label: "Orders", href: "/orders" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: ImageIcon, label: "Banners", href: "/banners" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
    subItems: [
      { label: "Web App Setup", href: "/settings" },
      { label: "Boutique Profile", href: "/settings/profile" },
      { label: "Administrative ID", href: "/settings/admin-id" },
      { label: "Security Fortress", href: "/settings/security" },
      { label: "Alert Protocols", href: "/settings/alerts" },
      { label: "Payment Engines", href: "/settings/payments" },
      { label: "Global Localization", href: "/settings/localization" },
    ],
  },
];
export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useConfigStore();
  const [expandedMenus, setExpandedMenus] = useState([]);
  const toggleMenu = (label) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isSidebarCollapsed ? 88 : 260 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex h-full bg-transparent flex-col sticky top-4 z-50 group/sidebar"
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-4 top-20 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(107,142,110,0.3)] border-4 border-background z-100 hover:scale-110 active:scale-90 transition-all duration-300 group/toggle cursor-pointer",
            isSidebarCollapsed
              ? "opacity-100"
              : "opacity-0 group-hover/sidebar:opacity-100",
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-500",
              isSidebarCollapsed && "rotate-180",
            )}
          />
        </button>

        {/* Floating Card Wrapper */}
        <div className="flex flex-col h-full bg-card border border-border/30 rounded-[2rem] shadow-sm overflow-hidden relative">
          {/* Glow Effect Background */}
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

          {/* Logo Section */}
          <div
            className={cn(
              "p-5 mb-2 transition-all duration-500 relative",
              isSidebarCollapsed ? "px-4" : "px-6",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
                <div className="h-11 w-11 rounded-2xl bg-primary/10 border-2 border-primary/20 relative z-10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-primary" />
                </div>
              </div>
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <h1 className="text-xl font-light font-serif tracking-tighter leading-none text-foreground lowercase">
                    Dunches
                    <span className="text-primary italic font-sans font-black">
                      .
                    </span>
                  </h1>
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="h-2.5 w-2.5 text-primary" />
                    <p className="text-[8px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-60 font-heading">
                      mindful admin
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation - Scrollable Area */}
          <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto scrollbar-none relative z-10 transition-all duration-500">
            {menuItems.map((item) => {
              const isExpanded = expandedMenus.includes(item.label);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isActive =
                pathname === item.href ||
                (hasSubItems && pathname.startsWith(item.href));
              return (
                <div key={item.label} className="space-y-1">
                  <Link
                    href={hasSubItems ? "#" : item.href}
                    onClick={(e) => {
                      if (hasSubItems) {
                        e.preventDefault();
                        toggleMenu(item.label);
                      }
                    }}
                    className={cn(
                      "group flex items-center py-2.5 px-4 rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-primary/6 text-primary"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                      isSidebarCollapsed &&
                        "justify-center px-0 w-12 h-12 mx-auto",
                    )}
                  >
                    {/* Highlight Background for Inactive */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-muted/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-xl" />
                    )}

                    <div
                      className={cn(
                        "flex items-center justify-center gap-4 relative z-10 w-full",
                        isSidebarCollapsed && "gap-0",
                      )}
                    >
                      <div
                        className={cn(
                          "p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            isActive ? "scale-110" : "group-hover:scale-110",
                          )}
                        />
                      </div>

                      <AnimatePresence>
                        {!isSidebarCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between flex-1"
                          >
                            <span className="text-[12.5px] font-medium tracking-tight whitespace-nowrap">
                              {item.label}
                            </span>
                            {hasSubItems && (
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 transition-transform duration-300 opacity-60",
                                  isExpanded && "rotate-90",
                                )}
                              />
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {!isSidebarCollapsed && isActive && !hasSubItems && (
                      <motion.div
                        layoutId="sidebarActiveIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    {isSidebarCollapsed && (
                      <div className="fixed left-[100px] px-4 py-2.5 bg-card backdrop-blur-md text-foreground rounded-xl text-[11px] font-medium opacity-0 group-hover:opacity-100 translate-x-[-15px] group-hover:translate-x-0 transition-all pointer-events-none shadow-md border border-border z-200 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {item.label}
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Submenu Items */}
                  <AnimatePresence>
                    {hasSubItems && isExpanded && !isSidebarCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden bg-primary/2 rounded-[1.25rem] border border-primary/5 ml-4"
                      >
                        <div className="py-1 px-2 space-y-1">
                          {item.subItems.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "flex items-center gap-3 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                  isSubActive
                                    ? "text-primary bg-primary/10 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full transition-all duration-500",
                                    isSubActive
                                      ? "bg-primary scale-125 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                      : "bg-muted-foreground/30",
                                  )}
                                />
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Help / Support Replacement for Logout */}
          <div className="p-4 mt-auto relative z-10 border-t border-border/30">
            <Link
              href="/support"
              className={cn(
                "group flex items-center py-2.5 px-4 rounded-xl transition-all duration-300 relative overflow-hidden",
                pathname === "/support"
                  ? "bg-primary/6 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                isSidebarCollapsed && "justify-center px-0 w-12 h-12 mx-auto",
              )}
            >
              {pathname !== "/support" && (
                <div className="absolute inset-0 bg-muted/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-xl" />
              )}

              <div
                className={cn(
                  "flex items-center gap-4 relative z-10 w-full",
                  isSidebarCollapsed && "gap-0",
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center",
                    pathname === "/support"
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <LifeBuoy
                    className={cn(
                      "h-5 w-5 shrink-0 transition-all duration-500",
                      pathname === "/support"
                        ? "scale-110"
                        : "group-hover:rotate-12",
                    )}
                  />
                </div>

                <AnimatePresence>
                  {!isSidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col"
                    >
                      <span className="text-[12.5px] font-medium tracking-tight whitespace-nowrap">
                        Help Center
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                        System Support
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isSidebarCollapsed && (
                <div className="fixed left-[100px] px-4 py-2.5 bg-card backdrop-blur-md text-foreground rounded-xl text-[11px] font-medium opacity-0 group-hover:opacity-100 translate-x-[-15px] group-hover:translate-x-0 transition-all pointer-events-none shadow-md border border-border z-200 whitespace-nowrap">
                  Support Center
                </div>
              )}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation - Floating Pill */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl z-100 flex items-center overflow-x-auto scrollbar-hide px-4 gap-2 shadow-2xl">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] py-2 rounded-xl transition-all duration-300 relative shrink-0",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-primary/20 scale-110 shadow-lg shadow-primary/10"
                    : "hover:bg-muted",
                )}
              >
                <item.icon
                  className={cn("h-5 w-5", isActive && "text-primary")}
                />
              </div>
              <span
                className={cn(
                  "text-[9px] font-black uppercase tracking-widest mt-1.5 transition-all duration-300",
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-60 translate-y-0.5",
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobileNavActive"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-4 bg-primary rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
