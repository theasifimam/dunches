"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Bell,
  Image as ImageIcon,
  Brain,
  Settings,
  Plus,
  Moon,
  Sun,
  X,
  ChevronRight,
  Sparkles,
  Loader2,
  Database,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useGlobalSearchQuery } from "@/store/searchApi";
import {
  DUMMY_PRODUCTS,
  DUMMY_ORDERS,
  DUMMY_USERS,
} from "@/lib/dummyData";

const NAVIGATION_PAGES = [
  { label: "Dashboard", href: "/", category: "Pages", icon: LayoutDashboard, keywords: ["home", "analytics", "metrics", "stats"] },
  { label: "Products Catalog", href: "/products", category: "Pages", icon: Package, keywords: ["items", "inventory", "stock", "catalog"] },
  { label: "Orders Hub", href: "/orders", category: "Pages", icon: ShoppingBag, keywords: ["sales", "deliveries", "fulfillment"] },
  { label: "Customer List", href: "/customers", category: "Pages", icon: Users, keywords: ["users", "clients", "buyers"] },
  { label: "Banners & Promos", href: "/banners", category: "Pages", icon: ImageIcon, keywords: ["marketing", "slides", "hero"] },
  { label: "Consumer Intelligence", href: "/consumer-intelligence", category: "Pages", icon: Brain, keywords: ["ai", "insights", "analytics", "trends"] },
  { label: "Notifications", href: "/notifications", category: "Pages", icon: Bell, keywords: ["alerts", "broadcasts", "messages"] },
  { label: "Settings", href: "/settings", category: "Pages", icon: Settings, keywords: ["config", "admin", "account", "store"] },
];

export function GlobalSearchDialog({ isOpen, onClose }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // RTK Query hook connected to Backend /api/v1/search?q=...
  const trimmedQuery = query.trim();
  const {
    data: apiResponse,
    isFetching,
    isError,
  } = useGlobalSearchQuery(trimmedQuery, {
    skip: !trimmedQuery || !isOpen,
  });

  const apiData = apiResponse?.data;

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Combined search results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Pages
    const pages = NAVIGATION_PAGES.filter(
      (p) =>
        !q ||
        p.label.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.includes(q))
    ).map((p) => ({
      type: "page",
      id: `page-${p.href}`,
      title: p.label,
      subtitle: `Navigate to ${p.label}`,
      category: "Pages",
      icon: p.icon,
      source: "System",
      action: () => {
        router.push(p.href);
        onClose();
      },
    }));

    // 2. Products (from Backend API if available, fallback to DUMMY_PRODUCTS)
    const rawProducts = (apiData?.products && apiData.products.length > 0)
      ? apiData.products
      : DUMMY_PRODUCTS;

    const products = rawProducts
      .filter(
        (p) =>
          !q ||
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      )
      .map((p) => ({
        type: "product",
        id: `prod-${p._id}`,
        title: p.name,
        subtitle: `SKU: ${p.sku || "N/A"} • ₹${p.price} • Stock: ${p.stock ?? "OK"}`,
        category: "Products",
        icon: Package,
        badge: p.category?.name || "Product",
        source: apiData?.products?.length ? "Backend DB" : "System",
        action: () => {
          router.push(`/products?search=${encodeURIComponent(p.name)}`);
          onClose();
        },
      }));

    // 3. Orders (from Backend API if available, fallback to DUMMY_ORDERS)
    const rawOrders = (apiData?.orders && apiData.orders.length > 0)
      ? apiData.orders
      : DUMMY_ORDERS;

    const orders = rawOrders
      .filter(
        (o) =>
          !q ||
          o._id?.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o.orderStatus?.toLowerCase().includes(q) ||
          o.shippingAddress?.mobile?.toLowerCase().includes(q) ||
          o.shippingAddress?.fullName?.toLowerCase().includes(q)
      )
      .map((o) => ({
        type: "order",
        id: `order-${o._id}`,
        title: `Order ${o._id?.slice(-8).toUpperCase()}`,
        subtitle: `${o.user?.name || "Customer"} • ₹${(o.finalAmount || 0).toFixed(2)} • Status: ${o.orderStatus}`,
        category: "Orders",
        icon: ShoppingBag,
        badge: o.orderStatus,
        source: apiData?.orders?.length ? "Backend DB" : "System",
        action: () => {
          router.push(`/orders?search=${encodeURIComponent(o._id)}`);
          onClose();
        },
      }));

    // 4. Customers (from Backend API if available, fallback to DUMMY_USERS)
    const rawUsers = (apiData?.users && apiData.users.length > 0)
      ? apiData.users
      : DUMMY_USERS;

    const customers = rawUsers
      .filter(
        (u) =>
          !q ||
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q) ||
          u.mobile?.toLowerCase().includes(q)
      )
      .map((u) => ({
        type: "customer",
        id: `user-${u._id}`,
        title: u.name,
        subtitle: `${u.email} • Role: ${u.role}`,
        category: "Customers",
        icon: Users,
        badge: u.role,
        source: apiData?.users?.length ? "Backend DB" : "System",
        action: () => {
          router.push(`/customers?search=${encodeURIComponent(u.name)}`);
          onClose();
        },
      }));

    // 5. Quick Actions
    const actions = [
      {
        type: "action",
        id: "action-add-product",
        title: "Add New Product",
        subtitle: "Create a new flavor in inventory",
        category: "Actions",
        icon: Plus,
        source: "Action",
        action: () => {
          router.push("/products?new=true");
          onClose();
        },
      },
      {
        type: "action",
        id: "action-toggle-theme",
        title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
        subtitle: "Toggle administrative UI color mode",
        category: "Actions",
        icon: theme === "dark" ? Sun : Moon,
        source: "Action",
        action: () => {
          setTheme(theme === "dark" ? "light" : "dark");
          onClose();
        },
      },
    ].filter((a) => !q || a.title.toLowerCase().includes(q));

    // 6. Feedbacks (from Backend API if available)
    const rawFeedbacks = (apiData?.feedbacks && apiData.feedbacks.length > 0)
      ? apiData.feedbacks
      : [];

    const feedbacks = rawFeedbacks
      .filter(
        (f) =>
          !q ||
          f.exactQuote?.toLowerCase().includes(q) ||
          f.comment?.toLowerCase().includes(q) ||
          f.executiveName?.toLowerCase().includes(q) ||
          f.phoneNumber?.toLowerCase().includes(q)
      )
      .map((f) => ({
        type: "feedback",
        id: `feedback-${f._id}`,
        title: `Feedback: ${f.executiveName || f.phoneNumber || f.source}`,
        subtitle: `${f.type} • Rating: ${f.overallRating} • ${f.comment || f.exactQuote || "No comment"}`,
        category: "Feedback",
        icon: MessageSquare,
        badge: f.source,
        source: "Backend DB",
        action: () => {
          router.push(`/consumer-intelligence/insights?search=${encodeURIComponent(f._id)}`);
          onClose();
        },
      }));

    let all = [...pages, ...products, ...orders, ...customers, ...feedbacks, ...actions];

    if (activeCategory !== "All") {
      all = all.filter((item) => item.category === activeCategory);
    }

    return all;
  }, [query, activeCategory, apiData, router, onClose, theme, setTheme]);

  // Reset keyboard index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults.length, activeCategory]);

  // Handle keyboard navigation inside search dialog
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, searchResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, searchResults.length - 1) : prev - 1
      );
    } else if (e.key === "Enter" && searchResults[selectedIndex]) {
      e.preventDefault();
      searchResults[selectedIndex].action();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  const categories = ["All", "Pages", "Products", "Orders", "Customers", "Feedback", "Actions"];

  return (
    <div className="fixed inset-0 z-[500] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Command Box */}
      <div
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border/60 gap-3">
          {isFetching ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
          ) : (
            <Search className="h-5 w-5 text-primary shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search live products, orders, customers..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded border border-border bg-secondary text-[10px] font-mono text-muted-foreground select-none">
            ESC
          </kbd>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-secondary/30 border-b border-border/40 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-border/20">
          {searchResults.length > 0 ? (
            searchResults.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-center gap-3.5 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 group",
                    isSelected
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-2xs"
                      : "hover:bg-secondary/60 text-foreground border border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-muted-foreground border-border/40 group-hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-xs sm:text-sm truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-secondary text-muted-foreground border border-border/40">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="shrink-0 text-muted-foreground/40 group-hover:text-primary">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <Search className="h-8 w-8 mx-auto text-muted-foreground/40 stroke-1" />
              <p className="text-xs font-semibold">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px]">Try searching with a different keyword or category.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-secondary/40 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-border text-[9px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-border text-[9px] font-mono">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-border text-[9px] font-mono">↵</kbd> Select
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
              <Database className="h-3 w-3 text-emerald-500" />
              <span>API Ready</span>
            </div>
            <div className="flex items-center gap-1 text-primary font-bold ml-2">
              <Sparkles className="h-3 w-3" />
              <span>Dunches Search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
