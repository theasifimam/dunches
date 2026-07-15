"use client";

import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { selectMenu } from "@/features/menu/menuSlice";
import { addToCart } from "@/features/cart/cartSlice";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Flame, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HeroSection() {
  const dispatch = useDispatch();
  const menu = useSelector(selectMenu);
  const [addedId, setAddedId] = useState(null);

  // Get top 3 best sellers (e.g. Classic, Spicy, Savory flavors)
  const bestSellers = menu ? menu.filter(item => ['1', '2', '6'].includes(item.id)) : [];

  const handleQuickAdd = (e, item) => {
    e.preventDefault();
    dispatch(addToCart(item));
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const scrollToMenu = () => {
    const element = document.getElementById("menu-archive");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-background py-20 overflow-hidden border-b border-border/10">
      {/* Design System Texture & Lighting */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[140px] -z-10" />

      {/* Floating Flames decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[5%] text-primary opacity-10"
        >
          <Flame className="w-12 h-12 rotate-45" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[10%] text-primary opacity-10"
        >
          <Flame className="w-16 h-16 -rotate-45" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Instant Conversion Hook */}
          <div className="lg:col-span-7 space-y-10 text-left">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary font-heading">
                    spicy cravings • 100% fiery flavor
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent-foreground font-heading">
                    flat 15% off first order
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-light leading-[0.95] tracking-tighter font-serif text-foreground lowercase">
                late-night <span className="italic opacity-85 text-primary">cravings</span>. <br />
                spicy <span className="font-bold font-heading">satisfying</span>. <br />
                fiery crunch.
              </h1>

              <p className="text-md sm:text-lg text-foreground/50 leading-relaxed font-light max-w-xl">
                Elevate your evening snacking with Dunches. Our signature organic lotus seeds and clean chips are popped, slow-roasted, and heavily dusted with spicy chilies and exotic herbs.
              </p>
            </div>

            {/* Main Action Call */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  onClick={scrollToMenu}
                  size="lg"
                  className="w-full sm:w-auto h-16 px-10 rounded-full text-xs font-bold tracking-widest uppercase shadow-xl hover:scale-[1.02] transition-transform duration-300 group flex items-center justify-center gap-3 cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover"
                >
                  Shop the Sale
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </Button>
                <Button
                  onClick={scrollToMenu}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-16 px-10 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-3 cursor-pointer"
                >
                  View Menu
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="text-primary font-black">✓</span> Free Shipping Over ₹499
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-primary font-black">✓</span> Code: <span className="text-accent font-black">CRUNCH15</span> Applied
                </span>
              </div>
            </div>

            {/* Instant Order / Best Sellers strip */}
            {bestSellers.length > 0 && (
              <div className="pt-8 border-t border-border/10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 font-heading">
                    Instant Add Best Sellers
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {bestSellers.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-foreground/[0.02] border border-border/40 rounded-2xl hover:border-primary/20 transition-all group relative overflow-hidden"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 shrink-0 shadow-md">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform" 
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-black uppercase tracking-tight text-foreground truncate font-heading group-hover:text-primary transition-colors">
                          {item.name.replace(' Makhāna', '')}
                        </h4>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-foreground">₹{Math.round(item.price * 0.85)}</span>
                          <span className="text-[9px] text-foreground/30 line-through">₹{item.price}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleQuickAdd(e, item)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          addedId === item.id 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-border/80 hover:bg-primary hover:border-primary hover:text-primary-foreground text-foreground/40'
                        }`}
                      >
                        {addedId === item.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Hero Graphic Showcase */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Spinning Orbit Ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[320px] h-[320px] md:w-[480px] md:h-[480px] rounded-full border border-primary/5 border-dashed animate-[spin_80s_linear_infinite]" />
            </div>

            {/* Premium Multi-layered Layout for Depth */}
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[4/5] z-10 group">
              
              {/* Back Card (Depth Effect) */}
              <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] border border-primary/10 translate-x-4 translate-y-4 -rotate-3 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:rotate-0" />
              
              {/* Front Card (Main Showcase Container) */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden modern-shadow border border-white/10 bg-slate-900 transition-all duration-700 hover:scale-[1.01] hover:shadow-2xl">
                <Image
                  src="/auth_visual.png"
                  alt="Makhāna Premium Collection"
                  fill
                  priority
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                
                {/* Minimal Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 opacity-80" />
                
                {/* Floating Sale Tag */}
                <div className="absolute top-6 left-6 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-2xl z-20 animate-float">
                  15% off
                </div>

                {/* Floating Promo Code Sticker */}
                <div className="absolute top-6 right-6 glass backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 text-white z-20 shadow-2xl flex flex-col items-center">
                  <span className="text-[7px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">USE CODE</span>
                  <span className="text-[10px] font-black tracking-widest text-accent font-heading leading-none">CRUNCH15</span>
                </div>

                {/* Card Context Tag */}
                <div className="absolute bottom-6 left-6 right-6 text-left z-20">
                  <span className="text-[8px] font-black text-accent uppercase tracking-[0.25em] mb-1.5 block">Late-Night Craving Suite</span>
                  <h3 className="text-xl sm:text-2xl font-light text-white font-serif lowercase leading-tight">
                    fiery crunch, <br />
                    <span className="text-primary italic font-serif">spicy satisfaction.</span>
                  </h3>
                </div>
              </div>

              {/* Overlapping Quick Trust Badge */}
              <div className="absolute -bottom-4 -right-4 glass dark:bg-black/75 backdrop-blur-xl p-3.5 rounded-2xl border border-foreground/10 shadow-2xl z-20 flex items-center gap-3 animate-float [animation-delay:2s]">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-foreground/45 leading-none mb-1">Premium Quality</p>
                  <p className="text-[10px] font-black text-foreground uppercase tracking-wider leading-none">100% Organic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
