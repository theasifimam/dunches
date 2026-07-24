"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "@/features/cart/cartSlice";
import { selectUser, setProfile, fetchProfile } from "@/features/user/userSlice";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import GuestMenuSheet from "./navbar/GuestMenuSheet";

const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

export default function BottomNav() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const user = useSelector(selectUser);

  const [isGuestSheetOpen, setIsGuestSheetOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
    } catch {}
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {}
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const tabs = [
    { name: "Home", path: "/", icon: Home },
    { name: "Order", path: "/cart", icon: ShoppingBag, count: cartCount },
    { name: "Profile", path: "/profile", icon: User },
  ];

  if (pathname?.startsWith("/book") || pathname?.startsWith("/product/"))
    return null;

  return (
    <>
      <nav className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-150 w-fit">
        <div className="bg-background backdrop-blur-3xl border border-border/50 rounded-full h-16 flex items-center justify-center gap-3 px-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] relative overflow-hidden group">
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {tabs.map((tab) => {
            const isActive =
              pathname === tab.path ||
              (tab.path === "/profile" && pathname?.startsWith("/profile"));
            const Icon = tab.icon;

            const handleTabClick = (e) => {
              if (tab.name === "Profile" && !user) {
                e.preventDefault();
                setIsGuestSheetOpen(true);
              }
            };

            return (
              <Link
                key={tab.name}
                href={tab.path}
                onClick={handleTabClick}
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

      <GuestMenuSheet
        isOpen={isGuestSheetOpen}
        onClose={() => setIsGuestSheetOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        openAuth={openAuth}
      />

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(userData) => {
            try {
              localStorage.setItem("user", JSON.stringify(userData));
            } catch {}
            dispatch(setProfile(userData));
            dispatch(fetchProfile());
          }}
        />
      )}
    </>
  );
}
