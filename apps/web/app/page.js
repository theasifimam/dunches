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
import { addToCart } from "@/features/cart/cartSlice";
import {
  ChevronRight,
  ShoppingBag,
  Search,
  MapPin,
  Flame,
  Sparkles,
  Percent,
  Truck,
  Plus,
  Check,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const menu = useSelector(selectMenu);
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);

  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState(null);
  const [greeting, setGreeting] = useState("Hey there!");
  const [locationName, setLocationName] = useState("Mithila Hub");
  const [currentUser, setCurrentUser] = useState(null);

  // Set greeting based on time of day and load username if logged in
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning!");
    else if (hours < 17) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");

    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn("localStorage is not accessible:", e);
    }
  }, []);

  // Filter 3 popular products for trending scroller
  const trendingPicks = menu
    ? menu.filter((item) => ["2", "3", "5"].includes(item.id))
    : [];

  const handleQuickAdd = (e, item) => {
    e.preventDefault();
    dispatch(addToCart(item));
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-32 sm:pb-12 gap-6 md:gap-16">
      {/* 1. Desktop Website Hero Section */}
      <div className="hidden md:block">
        <HeroSection />
      </div>

      {/* 2. Mobile App Dashboard (Visible on mobile/tablet only) */}
      <div className="md:hidden pt-24 px-4 space-y-6 flex flex-col pb-32">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black tracking-tight text-foreground font-heading">
              Hi, {currentUser ? currentUser.name.split(" ")[0] : "Jack.L"}
            </h2>
            <p className="text-xs text-foreground/40 font-medium">
              Best Snacks For you
            </p>
          </div>
          {/* Avatar circle */}
          <Link
            href="/profile"
            className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 shadow-md"
          >
            <img
              src="https://i.pravatar.cc/100"
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </Link>
        </div>

        {/* Interactive Search Option -> Redirects to Explore */}
        <Link href="/explore" className="block w-full">
          <div className="flex items-center gap-3 w-full h-12 px-4 bg-foreground/3 border border-border/40 rounded-full text-xs text-foreground/35 font-medium transition-all hover:bg-foreground/5 shadow-sm">
            <Search className="w-4 h-4 text-foreground/30" />
            <span>Search chips, chocolates, savory bites...</span>
          </div>
        </Link>

        {/* Categories Slider */}
        <div className="space-y-2">
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {/* Map over categories */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => dispatch(setCategory(cat))}
                  className={`
                    px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border shrink-0
                    ${
                      isSelected
                        ? "bg-foreground text-background border-foreground shadow-md"
                        : "bg-background text-foreground/50 border-border/50 hover:border-foreground/30"
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Collection Header & Vertical List of Large Premium Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/80 font-heading">
              {selectedCategory === "All" ? "Chips" : selectedCategory}{" "}
              Collections
            </h3>
            <Link
              href="/explore"
              className="text-xs font-black text-primary hover:underline tracking-wider uppercase"
            >
              See all
            </Link>
          </div>

          {/* Cards List */}
          <div className="flex flex-col gap-6">
            {(menu
              ? menu.filter(
                  (item) =>
                    selectedCategory === "All" ||
                    item.category === selectedCategory,
                )
              : []
            ).map((item) => (
              <FoodCard key={item.id} dish={item} />
            ))}

            {(menu
              ? menu.filter(
                  (item) =>
                    selectedCategory === "All" ||
                    item.category === selectedCategory,
                )
              : []
            ).length === 0 && (
              <div className="py-20 text-center text-foreground/30 text-sm font-black uppercase tracking-widest font-heading">
                No items available in this category
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
