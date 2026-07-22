"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { selectMenu } from "@/features/menu/menuSlice";
import { addToCart } from "@/features/cart/cartSlice";
import { selectHeroBanners, selectBannersLoading } from "@/features/banner/bannerSlice";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Flame, Plus, Check, ChevronLeft, ChevronRight, Megaphone, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const dispatch = useDispatch();
  const router = useRouter();
  const menu = useSelector(selectMenu);
  const heroBanners = useSelector(selectHeroBanners);
  const isLoading = useSelector(selectBannersLoading);
  const [addedId, setAddedId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-sliding interval: change every 6 seconds
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  // Reset slide index when banner count changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [heroBanners.length]);

  // Get top 3 best sellers
  const bestSellers = menu ? menu.filter((item) => ["1", "2", "6"].includes(item.id)) : [];

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

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const handleBannerClick = (banner) => {
    if (banner.buttonLink) {
      router.push(banner.buttonLink);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="relative min-h-screen flex flex-col justify-center bg-background py-20 overflow-hidden border-b border-border/10">
        <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="h-6 w-48 bg-muted animate-pulse rounded-full" />
              <div className="space-y-3">
                <div className="h-16 w-full bg-muted animate-pulse rounded-2xl" />
                <div className="h-16 w-4/5 bg-muted animate-pulse rounded-2xl" />
              </div>
              <div className="h-20 w-full bg-muted animate-pulse rounded-2xl" />
              <div className="flex gap-4">
                <div className="h-14 w-40 bg-muted animate-pulse rounded-full" />
                <div className="h-14 w-40 bg-muted animate-pulse rounded-full" />
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[320px] aspect-[4/5] bg-muted animate-pulse rounded-[2.5rem]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!heroBanners.length) return null;

  const activeSlide = heroBanners[currentSlide];

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

        {/* Slides Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Column: Slide Text Hook */}
          <div className="lg:col-span-7 space-y-8 text-left min-h-[480px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Badge row */}
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    {activeSlide.type === "announcement" ? (
                      <Megaphone className="w-3 h-3 text-primary animate-pulse" />
                    ) : (
                      <Tag className="w-3 h-3 text-primary animate-pulse" />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary font-heading">
                      {activeSlide.label || (activeSlide.type === "announcement" ? "Announcement" : "Special Offer")}
                    </span>
                  </div>
                  {activeSlide.discountText && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent-foreground font-heading">
                        {activeSlide.discountText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title — clickable to navigate */}
                <div
                  onClick={() => handleBannerClick(activeSlide)}
                  className={activeSlide.buttonLink ? "cursor-pointer group/title" : ""}
                >
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-light leading-[0.95] tracking-tighter font-serif text-foreground lowercase group-hover/title:text-primary transition-colors duration-300">
                    {activeSlide.title}
                  </h1>
                </div>

                <p className="text-md sm:text-lg text-foreground/50 leading-relaxed font-light max-w-xl">
                  {activeSlide.description}
                </p>

                {/* Main Action Buttons */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {activeSlide.buttonLink ? (
                      <Button asChild size="lg" className="w-full sm:w-auto text-[10px] rounded-full">
                        <Link href={activeSlide.buttonLink}>
                          {activeSlide.actionText || "Shop Now"}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/button:translate-x-1.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Button onClick={scrollToMenu} size="lg" className="w-full sm:w-auto text-[10px] rounded-full">
                        {activeSlide.actionText || "View Menu"}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/button:translate-x-1.5" />
                      </Button>
                    )}

                    <Button
                      onClick={scrollToMenu}
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto text-[10px] rounded-full"
                    >
                      View Full Menu
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <span className="text-primary font-black">✓</span> Free Shipping Over ₹499
                    </span>
                    {activeSlide.code && (
                      <span className="flex items-center gap-1.5">
                        <span className="text-primary font-black">✓</span> Code:{" "}
                        <span className="text-accent font-black">{activeSlide.code}</span> Applied
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Instant Order / Best Sellers strip */}
            {bestSellers.length > 0 && (
              <div className="pt-6 border-t border-border/10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 font-heading">
                    Instant Add Best Sellers
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {bestSellers.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 bg-foreground/[0.02] border border-border/40 rounded-2xl hover:border-primary/20 transition-all group relative overflow-hidden"
                    >
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 shrink-0 shadow-md">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[9px] font-black uppercase tracking-tight text-foreground truncate font-heading group-hover:text-primary transition-colors">
                          {item.name.replace(" Makhāna", "")}
                        </h4>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xs font-black text-foreground">₹{Math.round(item.price * 0.85)}</span>
                          <span className="text-[8px] text-foreground/30 line-through font-medium">₹{item.price}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleQuickAdd(e, item)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          addedId === item.id
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-border/80 hover:bg-primary hover:border-primary hover:text-primary-foreground text-foreground/40"
                        }`}
                      >
                        {addedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Hero Graphic Showcase Carousel — clickable */}
          <div className="lg:col-span-5 relative flex flex-col justify-center items-center">
            {/* Spinning Orbit Ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[320px] h-[320px] md:w-[480px] md:h-[480px] rounded-full border border-primary/5 border-dashed animate-[spin_80s_linear_infinite]" />
            </div>

            {/* Showcase Container — entire card is a link */}
            <Link
              href={activeSlide.buttonLink || "/#menu-archive"}
              className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[4/5] z-10 group cursor-pointer block"
              aria-label={`Go to: ${activeSlide.title}`}
            >
              {/* Back Card (Depth Effect) */}
              <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] border border-primary/10 translate-x-4 translate-y-4 -rotate-3 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:rotate-0" />

              {/* Front Card (Active Image Container) */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden modern-shadow border border-white/10 bg-slate-900 transition-all duration-700 hover:scale-[1.01] hover:shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={
                        activeSlide.image?.startsWith("http") ||
                        activeSlide.image?.startsWith("/")
                          ? activeSlide.image
                          : `/${activeSlide.image}`
                      }
                      alt={activeSlide.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />

                    {/* Minimal Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 opacity-80" />

                    {/* Overlay CTA badge */}
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <ArrowRight className="w-3 h-3" />
                        {activeSlide.actionText || "Shop Now"}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Link>
          </div>
        </div>

        {/* Carousel Pagination & Manual Arrow Controls */}
        {heroBanners.length > 1 && (
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/10 z-20 relative">

            {/* Navigation Bullet Dots */}
            <div className="flex gap-2">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? "w-8 bg-primary" : "w-2 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next Manual Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-border/60 bg-card hover:bg-muted text-foreground/60 hover:text-primary transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 select-none min-w-[70px] text-center">
                {currentSlide + 1} / {heroBanners.length}
              </span>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-border/60 bg-card hover:bg-muted text-foreground/60 hover:text-primary transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
