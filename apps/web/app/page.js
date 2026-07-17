"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import dynamic from "next/dynamic";
const MenuArchive = dynamic(() => import("@/components/MenuArchive"));
import FoodCard from "@/components/FoodCard";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount, addToCart } from "@/features/cart/cartSlice";
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
  Plus,
  Flame,
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

  const spotlightSnack = menu?.find((item) => item.id === "2");

  const categoryEmojis = {
    All: "🔥 all",
    Classic: "🧂 classic",
    Savory: "🧀 savory",
    Spicy: "🌶️ spicy",
    Sweet: "🍯 sweet",
    Assortments: "📦 bundles",
  };

  const filteredMenu = menu
    ? menu.filter(
        (item) =>
          (selectedCategory === "All" || item.category === selectedCategory) &&
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : [];

  const trendingSnacks = menu ? menu.slice(0, 4) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-32 sm:pb-12 gap-6 md:gap-16">
      {/* 1. Desktop Website Hero Section */}
      <div className="hidden md:block">
        <HeroSection />
      </div>

      {/* 2. Mobile App Dashboard (Visible on mobile/tablet only) */}
      <div className="md:hidden flex flex-col pb-32 relative overflow-x-hidden">
        {/* Background Design System Texture & Lighting */}
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
        <div className="absolute top-[5%] right-[-10%] w-[70vw] h-[70vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-[40%] left-[-15%] w-[60vw] h-[60vw] bg-accent/5 rounded-full blur-[90px] pointer-events-none -z-10" />

        {/* Main Brand Typography Slogan */}
        <div className="pt-24 pb-4 px-5 flex flex-col z-10">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80 mb-1">
            DUNCHES PREMIUM
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground font-sans lowercase leading-[0.9]">
            fiery crunch, <br />
            <span className="font-serif italic font-normal text-foreground/45">
              guilt-free.
            </span>
          </h1>
        </div>

        {/* Search Bar & Custom Filter Row */}
        <div className="flex items-center gap-3 px-5 py-2 z-10">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="search flavor profile, snacks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-10 rounded-full border border-border/50 bg-foreground/3 text-[13px] tracking-wide focus:outline-none focus:border-primary/60 focus:bg-primary/4 focus:shadow-md transition-all font-medium text-foreground"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
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
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-foreground/5 border border-border/50 text-foreground/60 hover:text-primary hover:bg-foreground/10 hover:border-primary/30 transition-all shrink-0 cursor-pointer active:scale-95">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Spotlight Promo Banner */}
        {spotlightSnack && !searchQuery && (
          <div className="px-5 py-3 z-10">
            <div className="relative rounded-[32px] overflow-hidden bg-linear-to-br from-primary/15 via-accent/5 to-transparent border border-primary/10 p-5 flex items-center justify-between shadow-xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none -z-10" />

              <div className="flex flex-col gap-2 max-w-[58%]">
                <span className="inline-flex items-center gap-1 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest w-fit">
                  <Flame className="w-2.5 h-2.5 fill-primary" /> Daily Crave
                </span>
                <h3 className="text-base font-extrabold text-foreground leading-tight tracking-tight lowercase font-sans">
                  {spotlightSnack.name}
                </h3>
                <p className="text-[10px] text-foreground/45 line-clamp-2 leading-relaxed">
                  {spotlightSnack.description}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-extrabold text-foreground">
                    ₹{spotlightSnack.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(addToCart(spotlightSnack));
                    }}
                    className="h-7 px-3 bg-primary text-primary-foreground hover:bg-primary-hover rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="relative w-28 h-28 shrink-0 rounded-[24px] overflow-hidden bg-foreground/5 shadow-inner">
                <motion.img
                  src={spotlightSnack.image}
                  alt={spotlightSnack.name}
                  className="w-full h-full object-cover"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category Pills (Dribbble App Style) */}
        <div className="py-2 px-5 transition-all duration-300 z-10">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => dispatch(setCategory(cat))}
                  className={`
                    relative px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 cursor-pointer border
                    ${
                      isSelected
                        ? "bg-foreground text-background border-foreground/10 shadow-sm scale-102"
                        : "bg-foreground/3 text-foreground/45 border-transparent hover:border-border/60 hover:text-foreground"
                    }
                  `}
                >
                  {categoryEmojis[cat] || cat.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trending Snacks (Horizontal Carousel) */}
        {!searchQuery && (
          <div className="pt-2 z-10">
            <div className="px-5 flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-black tracking-widest text-foreground/40 uppercase font-heading">
                Trending Cravings
              </h3>
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                Swipe &rarr;
              </span>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-4 -mx-5">
              {trendingSnacks.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="group relative w-[210px] bg-foreground/1 border border-foreground/4 rounded-[32px] p-3 flex flex-col justify-between shrink-0 hover:border-primary/25 transition-all cursor-pointer active:scale-[0.99] h-[250px]"
                >
                  <div className="relative w-full h-[130px] rounded-[24px] bg-foreground/2 overflow-hidden mb-3">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute top-2.5 left-2.5 bg-primary/95 text-primary-foreground px-2 py-0.5 rounded-lg text-[6px] font-bold tracking-widest uppercase z-10">
                      {item.category}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-foreground line-clamp-1 lowercase tracking-tight leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[9px] text-foreground/40 line-clamp-2 leading-tight mt-1 font-medium">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-foreground/2">
                      <div className="flex flex-col">
                        <span className="text-[6px] font-bold text-foreground/30 uppercase tracking-widest">
                          Price
                        </span>
                        <span className="text-xs font-black text-foreground">
                          ₹{item.price}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(addToCart(item));
                        }}
                        className="w-7 h-7 rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center text-primary-foreground shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Product List ─────────────────────────────────────── */}
        <div className="px-5 pt-3 space-y-4 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-black tracking-widest text-foreground/40 uppercase font-heading">
              {selectedCategory === "All"
                ? "Full Collection"
                : `${selectedCategory} Collection`}
            </h3>
            <span className="text-[8px] font-black text-foreground/35 uppercase tracking-widest">
              {filteredMenu.length} items
            </span>
          </div>

          {/* Cards Vertical List */}
          <div className="flex flex-col gap-3.5 pb-6">
            {filteredMenu.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="group relative flex items-center gap-4 bg-foreground/1 border border-foreground/3 rounded-[30px] p-3 hover:bg-foreground/2 hover:border-primary/20 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="relative w-20 h-20 rounded-[20px] bg-foreground/2 overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[7px] font-black uppercase tracking-widest text-primary">
                      {item.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-foreground/20" />
                    <span className="text-[7px] font-bold uppercase tracking-widest text-foreground/45">
                      Organic
                    </span>
                  </div>
                  <h4 className="text-[12px] font-extrabold text-foreground line-clamp-1 lowercase tracking-tight leading-none mb-1 font-sans">
                    {item.name}
                  </h4>
                  <p className="text-[9px] text-foreground/40 line-clamp-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1 px-1">
                  <span className="text-xs font-black text-foreground">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(addToCart(item));
                    }}
                    className="w-7 h-7 rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center text-primary-foreground shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Link>
            ))}

            {filteredMenu.length === 0 && (
              <div className="py-20 text-center text-foreground/30 text-sm font-black uppercase tracking-widest font-heading">
                No items match your search
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
