"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import MenuArchive from "@/components/MenuArchive";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "@/features/cart/cartSlice";
import { selectMenu } from "@/features/menu/menuSlice";
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
  User
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const menu = useSelector(selectMenu);
  
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
  const trendingPicks = menu ? menu.filter(item => ["2", "3", "5"].includes(item.id)) : [];

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

      {/* 2. Mobile App Dashboard Header & Scrollers (Visible on mobile/tablet only) */}
      <div className="md:hidden pt-24 px-4 space-y-6 flex flex-col">
        {/* Location & Profile Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm rotate-3">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                {currentUser ? `Welcome back` : greeting}
              </p>
              <h2 className="text-base font-black tracking-tight leading-tight mt-0.5">
                {currentUser ? currentUser.name : "Imperial Muncher"}
              </h2>
            </div>
          </div>
          
          {/* Location Picker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/[0.03] border border-border/40 text-foreground/70 text-[9px] font-black uppercase tracking-widest shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{locationName}</span>
          </div>
        </div>

        {/* Dynamic Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <input
            type="text"
            placeholder="Search spicy seeds, savory chips, sweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-foreground/3 border border-border/40 rounded-full text-xs font-medium placeholder:text-foreground/20 outline-none focus:border-primary transition-all shadow-inner"
          />
        </div>

        {/* Promo Voucher Cards Scroller */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/45 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              Special Imperial Offers
            </h3>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x -mx-4 px-4">
            {/* Offer Card 1 */}
            <div className="w-[85vw] max-w-[280px] shrink-0 bg-gradient-to-br from-primary/80 to-primary/40 rounded-[1.75rem] p-4 text-primary-foreground flex items-center justify-between border border-primary/20 shadow-md snap-center">
              <div className="space-y-1">
                <span className="text-[7px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md">Code: CRUNCH15</span>
                <h4 className="text-sm font-black font-heading leading-tight mt-1">Flat 15% Off First Pack</h4>
                <p className="text-[8px] opacity-80 font-medium">Applied automatically at checkout</p>
              </div>
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
                <Percent className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Offer Card 2 */}
            <div className="w-[85vw] max-w-[280px] shrink-0 bg-gradient-to-br from-accent to-amber-500 rounded-[1.75rem] p-4 text-foreground flex items-center justify-between border border-accent/20 shadow-md snap-center">
              <div className="space-y-1">
                <span className="text-[7px] font-black uppercase tracking-widest bg-black/10 px-2 py-0.5 rounded-md">Complimentary Logistics</span>
                <h4 className="text-sm font-black font-heading leading-tight mt-1">Free Delivery Worldwide</h4>
                <p className="text-[8px] opacity-80 font-medium">For all orders exceeding ₹499</p>
              </div>
              <div className="h-10 w-10 bg-black/10 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Trending Picks Horizontal Scroller */}
        {trendingPicks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/45 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-primary" />
              Trending Spicy Picks
            </h3>
            
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
              {trendingPicks.map(item => (
                <div 
                  key={item.id}
                  className="w-[140px] shrink-0 bg-foreground/2 border border-border/30 rounded-3xl p-2.5 flex flex-col justify-between hover:border-primary/20 transition-all group"
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-900 shadow-sm mb-2.5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="120px"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-primary/95 text-primary-foreground px-1.5 py-0.5 rounded-md text-[6px] font-black tracking-widest uppercase">
                      {item.category}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-tight text-foreground line-clamp-2 leading-tight">
                        {item.name.replace(' Makhāna', '')}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/5">
                      <span className="text-xs font-black text-foreground">₹{item.price}</span>
                      <button
                        onClick={(e) => handleQuickAdd(e, item)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          addedId === item.id 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-border/80 hover:bg-primary hover:border-primary hover:text-primary-foreground text-foreground/40'
                        }`}
                      >
                        {addedId === item.id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Catalog Grid (Search Queries mapped dynamically) */}
      <MenuArchive searchQuery={searchQuery} />

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
                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">View Cart</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </Link>
        </div>
      )}

    </div>
  );
}
