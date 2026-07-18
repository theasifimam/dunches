"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCartCount } from "@/features/cart/cartSlice";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();
  const cartCount = useSelector(selectCartCount);

  const tabs = [
    { name: "Home", path: "/", icon: Home },
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "Order", path: "/cart", icon: ShoppingBag, count: cartCount },
  ];

  if (pathname?.startsWith("/book") || pathname?.startsWith("/product/"))
    return null;

  return (
    <nav className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-150 w-fit">
      <div className="bg-background backdrop-blur-3xl border border-border/50 rounded-full h-16 flex items-center justify-center gap-3 px-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] relative overflow-hidden group">
        {/* Subtle Glow Background */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.path}
              className="relative flex flex-col items-center justify-center w-16 h-12 rounded-full transition-all active:scale-95 shrink-0"
            >
              {/* Active Sliding Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="active-pill-bg"
                  className="absolute inset-0 bg-linear-to-tr from-primary to-accent rounded-full -z-10 shadow-lg shadow-primary/30"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <div
                className={`
                  relative flex flex-col items-center justify-center rounded-full transition-all duration-300 shrink-0
                  ${isActive ? "text-primary-foreground" : "text-foreground/35 hover:text-foreground/60"}
                `}
              >
                <Icon className="w-5 h-5 stroke-[2.5px] shrink-0" />

                <span className="text-[7px] font-black uppercase tracking-widest mt-1 leading-none">
                  {tab.name}
                </span>

                {tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-black text-accent-foreground shadow-lg border border-background animate-pulse shrink-0">
                    {tab.count}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
