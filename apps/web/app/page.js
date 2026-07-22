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
import { selectPromoBanners } from "@/features/banner/bannerSlice";
import {
  ChevronRight,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  X,
  Plus,
  Flame,
  Sparkles,
  Megaphone,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const menu = useSelector(selectMenu);
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const promoBanners = useSelector(selectPromoBanners);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);

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

  // Map API banners to promo slide format
  const promoSlides = promoBanners.map((b) => ({
    id: b.id || b._id,
    type: b.type || "offer",
    label: b.label || (b.type === "announcement" ? "announcement" : "special offer"),
    badgeIcon: b.type === "announcement" ? Megaphone : Tag,
    title: b.title,
    description: b.description,
    image: b.image,
    link: b.buttonLink || "/explore",
    buttonText: b.actionText || "view offer",
    bgClass:
      b.type === "announcement"
        ? "bg-linear-to-br from-accent/15 via-foreground/5 to-transparent border-accent/10"
        : "bg-linear-to-br from-primary/15 via-accent/5 to-transparent border-primary/10",
    glowClass: b.type === "announcement" ? "bg-accent/20" : "bg-primary/20",
  }));

  useEffect(() => {
    if (promoSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentPromoSlide((prev) => (prev + 1) % promoSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [promoSlides.length]);

  // Reset slide index when banner count changes
  useEffect(() => {
    setCurrentPromoSlide(0);
  }, [promoBanners.length]);

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
        <div className="pt-24 pb-6 px-5 flex flex-col z-10">
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
        <div className="flex items-center gap-3 px-5 pt-2 pb-5 z-10">
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

        {/* Spotlight Promo Banner / Multi-purpose Carousel — API-driven */}
        {!searchQuery && promoSlides.length > 0 && (
          <div className="px-5 pt-2 pb-6 z-10 relative select-none">
            <div className="overflow-hidden relative rounded-[32px] min-h-[170px]">
              <AnimatePresence mode="wait">
                {promoSlides.map((slide, idx) => {
                  if (idx !== currentPromoSlide) return null;
                  const BadgeIcon = slide.badgeIcon;
                  const imageSrc =
                    slide.image?.startsWith("http") || slide.image?.startsWith("/")
                      ? slide.image
                      : `/${slide.image}`;

                  return (
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, { offset, velocity }) => {
                        if (offset.x > 80 || velocity.x > 300) {
                          setCurrentPromoSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
                        } else if (offset.x < -80 || velocity.x < -300) {
                          setCurrentPromoSlide((prev) => (prev + 1) % promoSlides.length);
                        }
                      }}
                      className={`relative w-full rounded-[32px] p-5 flex items-center justify-between shadow-xs border ${slide.bgClass} cursor-grab active:cursor-grabbing`}
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none -z-10 ${slide.glowClass}`} />

                      {/* Left: Text content */}
                      <div className="flex flex-col gap-2 max-w-[58%] select-none">
                        <span className="inline-flex items-center gap-1 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest w-fit">
                          {BadgeIcon && <BadgeIcon className="w-2.5 h-2.5" />} {slide.label}
                        </span>
                        <h3 className="text-base font-extrabold text-foreground leading-tight tracking-tight lowercase font-sans">
                          {slide.title}
                        </h3>
                        <p className="text-[10px] text-foreground/45 line-clamp-2 leading-relaxed">
                          {slide.description}
                        </p>

                        {/* CTA button — always a link */}
                        <div className="flex items-center gap-3 mt-1">
                          <Link href={slide.link || "/explore"} className="pointer-events-auto">
                            <button className="h-7 px-3 bg-foreground text-background hover:bg-foreground/90 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 flex items-center gap-1">
                              {slide.buttonText}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </Link>
                        </div>
                      </div>

                      {/* Right: Image — tapping the image also navigates */}
                      <Link href={slide.link || "/explore"} className="pointer-events-auto shrink-0">
                        <div className="relative w-28 h-28 rounded-[24px] overflow-hidden bg-foreground/5 shadow-inner">
                          <motion.img
                            src={imageSrc}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{
                              repeat: Infinity,
                              duration: 6,
                              ease: "easeInOut",
                            }}
                          />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination Indicators / Dots */}
            {promoSlides.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-3 select-none">
                {promoSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPromoSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentPromoSlide === idx ? "w-6 bg-primary" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                    }`}
                    aria-label={`Go to promo slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Pills (Dribbble App Style) */}
        <div className="pt-2 pb-6 px-5 transition-all duration-300 z-10">
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
          <div className="pt-4 pb-8 z-10">
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
        <div className="px-5 pt-4 space-y-4 z-10">
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

      {/* 4. Bottom Nav Order Bar (Mobile & Desktop) */}
      {cartCount > 0 && (
        <div className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-md z-100">
          <Link href="/cart">
            <button className="w-full h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-between px-6 shadow-2xl animate-in slide-in-from-bottom-10 active:scale-98 transition-all hover:bg-primary-hover cursor-pointer">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                  {cartCount} {cartCount === 1 ? "Pack" : "Packs"} Ready to Munch
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-80">
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
