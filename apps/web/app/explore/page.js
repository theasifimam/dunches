"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectMenu, setCategory } from "@/features/menu/menuSlice";
import { Search, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import FoodCard from "@/components/FoodCard";

export default function ExplorePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const menu = useSelector(selectMenu);
  const searchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Classic",
    "Savory",
    "Spicy",
    "Sweet",
    "Assortments",
  ];

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleCategoryClick = (category) => {
    dispatch(setCategory(category));
    router.push("/");
  };

  // Filter products by search and category
  const filteredProducts = (menu || []).filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-32 px-5 max-w-2xl mx-auto relative overflow-x-hidden">
      {/* Background design accents */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.02]" />
      <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Mobile App Title Slogan (Tailored Trends Style) */}
      <div className="flex flex-col mb-5 md:hidden">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans lowercase leading-none">
          explore flavors,
        </h1>
        <p className="text-[19px] text-foreground/45 font-serif italic lowercase leading-tight mt-1">
          search anything.
        </p>
      </div>

      {/* Sleek Search Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/">
          <div className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/70 active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </div>
        </Link>

        <div className="relative flex-1">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="search spicy snacks, makhana…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-full border border-border/50 bg-foreground/3 text-[13px] tracking-wide focus:outline-none focus:border-primary/60 focus:bg-primary/4 focus:shadow-md transition-all font-medium"
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
      </div>

      {/* Category Selection Row */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 border-b border-border/10 mb-6">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 cursor-pointer
                ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.04]"
                    : "bg-foreground/5 text-foreground/40 border border-transparent hover:border-border/60 hover:text-foreground"
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredProducts.map((item) => (
              <FoodCard key={item.id} dish={item} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-foreground/30 text-xs font-black uppercase tracking-widest font-heading">
              no snacks found
            </p>
            <p className="text-foreground/40 text-[11px] mt-1 font-medium">
              try searching for "spicy", "salt", or "jaggery"
            </p>
          </div>
        )}
      </div>

      {/* Quick Navigation Links */}
      {searchQuery === "" && (
        <div className="mt-12 pt-8 border-t border-border/10 space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 font-heading">
            browse by flavor profile
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {categories
              .filter((c) => c !== "All")
              .map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="flex items-center justify-between p-4 bg-foreground/2 border border-border/40 hover:border-primary/25 rounded-2xl text-[11px] font-black uppercase tracking-wider text-foreground/70 hover:text-primary transition-all text-left cursor-pointer group"
                >
                  <span>{cat} Collection</span>
                  <span className="text-primary font-serif font-light italic group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
