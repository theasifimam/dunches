"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import dynamic from "next/dynamic";
const MenuArchive = dynamic(() => import("@/components/MenuArchive"));
import FoodCard from "@/components/FoodCard";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "@/features/cart/cartSlice";
import {
  selectMenu,
  selectCategories,
  selectSelectedCategory,
  setCategory,
} from "@/features/menu/menuSlice";
import {
  ChevronRight,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Sun,
  Moon,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const menu = useSelector(selectMenu);
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
    } catch (e) {
      console.warn("localStorage is not accessible:", e);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-32 sm:pb-12 gap-6 md:gap-16">
      {/* 1. Desktop Website Hero Section */}
      <div className="hidden md:block">
        <HeroSection />
      </div>

      {/* 2. Mobile App Dashboard (Visible on mobile/tablet only) */}
      <div className="md:hidden flex flex-col pb-32 relative">
        {/* Background Design System Texture & Lighting */}
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
        <div className="absolute top-[5%] right-[-10%] w-[70vw] h-[70vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-[40%] left-[-15%] w-[60vw] h-[60vw] bg-accent/5 rounded-full blur-[90px] pointer-events-none -z-10" />

        {/* Main Brand Typography Slogan */}
        <div className="pt-24 pb-2 px-5 flex flex-col z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans lowercase leading-none">
            spicy cravings,
          </h1>
          <p className="text-[19px] text-foreground/45 font-serif italic lowercase leading-tight mt-1">
            handpicked for you.
          </p>
        </div>

        {/* Search Bar & Custom Filter Row */}
        <div className="flex items-center gap-3 px-5 py-2 z-10">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="search makhana, chips…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-full border border-border/50 bg-foreground/3 text-[13px] tracking-wide focus:outline-none focus:border-primary/60 focus:bg-primary/4 focus:shadow-md transition-all font-medium text-foreground"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-foreground/10 text-foreground/45 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Link href="/explore">
            <button className="w-11 h-11 rounded-full flex items-center justify-center bg-foreground/5 border border-border/50 text-foreground/60 hover:text-primary hover:bg-foreground/10 hover:border-primary/30 transition-all shrink-0 cursor-pointer active:scale-95">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Category Pills (Tailored Trends Style) */}
        <div className="py-3 px-5 transition-all duration-300 z-10">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => dispatch(setCategory(cat))}
                  className={`
                    px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer border
                    ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-[1.04]"
                        : "bg-foreground/5 text-foreground/40 border-transparent hover:border-border/60 hover:text-foreground"
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Product List ─────────────────────────────────────── */}
        <div className="px-5 pt-3 space-y-4 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold tracking-tight text-foreground/80 font-sans">
              {selectedCategory === "All" ? "Chips" : selectedCategory}{" "}
              Collections
            </h3>
            <Link
              href="/explore"
              className="text-[10px] font-black text-primary hover:underline tracking-wider uppercase"
            >
              See all
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-3.5 pb-6">
            {(menu
              ? menu.filter(
                  (item) =>
                    (selectedCategory === "All" ||
                      item.category === selectedCategory) &&
                    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchQuery.toLowerCase())),
                )
              : []
            ).map((item) => (
              <FoodCard key={item.id} dish={item} />
            ))}

            {(menu
              ? menu.filter(
                  (item) =>
                    (selectedCategory === "All" ||
                      item.category === selectedCategory) &&
                    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchQuery.toLowerCase())),
                )
              : []
            ).length === 0 && (
              <div className="py-20 text-center text-foreground/30 text-sm font-black uppercase tracking-widest font-heading">
                No items in this category
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Catalog Grid (Search Queries mapped dynamically) */}
      <div className="hidden md:block">
        <MenuArchive searchQuery={searchQuery} />
      </div>

      {/* 4. Bottom Nav Order Bar (Mobile Only) */}
      {cartCount > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-100 md:hidden">
          <Link href="/cart">
            <button className="w-full h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-between px-6 shadow-2xl animate-in slide-in-from-bottom-10 active:scale-98 transition-all">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {cartCount} Packs Ready to Munch
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">
                  View Cart
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
