"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectDishBySlug, selectMenu } from "@/features/menu/menuSlice";
import { addToCart } from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ArrowLeft, CheckCircle2, ShoppingBag, Sparkles, Flame, ArrowRight, Zap } from "lucide-react";
import FoodCard from "@/components/FoodCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const dispatch = useDispatch();
  const router = useRouter();
  const dish = useSelector((state) => selectDishBySlug(state, slug));
  const menu = useSelector(selectMenu);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-black font-heading opacity-20">ENTRY NOT FOUND</h1>
          <Link href="/menu">
            <Button variant="outline" className="rounded-full px-10 h-14 font-black uppercase tracking-widest text-xs">Return Archive</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic image stack utilizing product images or falling back to primary image
  const images = dish.images && dish.images.length > 0
    ? dish.images
    : [dish.image].filter(Boolean);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...dish, quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...dish, quantity }));
    router.push("/checkout");
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/menu");
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const relatedItems = menu.filter(item => item.category === dish.category && item.id !== dish.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background pt-28 sm:pt-32 pb-48 sm:pb-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />

      {/* Dynamic Background Blur */}
      <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">

        {/* Go Backward Navigation Button */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full glass border border-border/80 text-xs font-bold uppercase tracking-widest text-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-1 transition-transform" />
            <span>Go Backward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">

          {/* Stacked Image UI - Astonishing & Interactive */}
          <div className="relative aspect-square w-full max-w-lg mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {images.map((img, idx) => {
                  const isCenter = idx === activeImageIndex;
                  const offset = (idx - activeImageIndex + images.length) % images.length;

                  return (
                    <motion.div
                      key={idx}
                      initial={false}
                      animate={{
                        scale: isCenter ? 1 : 0.8 + (1 - offset / images.length) * 0.1,
                        z: isCenter ? 100 : -offset * 10,
                        x: isCenter ? 0 : offset * 20,
                        y: isCenter ? 0 : offset * 10,
                        opacity: isCenter ? 1 : 0.2,
                        rotate: isCenter ? 0 : (offset * 4),
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={`absolute inset-0 rounded-[3rem] overflow-hidden modern-shadow border-8 border-background bg-slate-100 dark:bg-slate-900 ${images.length > 1 ? 'cursor-pointer' : 'cursor-default'} ${isCenter ? 'z-50' : 'z-0 pointer-events-none'}`}
                      onClick={images.length > 1 ? nextImage : undefined}
                    >
                      <Image
                        src={img}
                        alt={`${dish.name} ${idx}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Interaction Prompt */}
            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 group"
              >
                <div className="flex gap-1">
                  {images.map((_, i) => (
                    <div key={i} className={`h-1 transition-all duration-500 rounded-full ${i === activeImageIndex ? 'w-8 bg-primary' : 'w-2 bg-foreground/10'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Slide to explore</span>
                <ArrowRight className="w-4 h-4 text-primary animate-bounce-x" />
              </button>
            )}
          </div>

          {/* Narrative Details */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-border mb-4">
                <Flame className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Late-Night Spicy Snacking</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-light font-serif tracking-tighter leading-none lowercase text-foreground">{dish.name}</h1>

              <div className="flex items-center gap-6">
                <p className="text-4xl font-light text-primary tracking-tighter">₹{dish.price}</p>
                <div className="h-px w-12 bg-border" />
                <span className="text-xs uppercase font-bold opacity-30 tracking-widest">Eco-Friendly Pack</span>
              </div>
            </div>

            <p className="text-xl text-foreground/50 leading-relaxed font-light font-serif italic">
              "{dish.description}"
            </p>

            {/* Feature Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-8 glass rounded-4xl space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Flame className="w-5 h-5" strokeWidth={2} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Ingredients</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients.map(ing => (
                    <span key={ing} className="px-4 py-2 bg-foreground/5 rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:bg-primary/10 transition-all cursor-default">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 glass rounded-4xl flex flex-col items-center justify-center text-center space-y-2">
                <Sparkles className="w-8 h-8 text-primary mb-2 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Sourcing</span>
                <span className="text-xl font-light text-foreground font-serif tracking-tighter uppercase">100% ORGANIC</span>
              </div>
            </div>

            {/* Product Specifications & Nutrition Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Specifications */}
              <div className="p-8 glass rounded-4xl space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Specifications</span>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-foreground/5 text-xs">
                    <span className="opacity-40 uppercase font-bold tracking-wider">Brand</span>
                    <span className="font-semibold uppercase tracking-wider">{dish.brand || 'makhāna'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-foreground/5 text-xs">
                    <span className="opacity-40 uppercase font-bold tracking-wider">Net Weight</span>
                    <span className="font-semibold">{dish.netWeight ? `${dish.netWeight}g` : '80g'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-foreground/5 text-xs">
                    <span className="opacity-40 uppercase font-bold tracking-wider">Shelf Life</span>
                    <span className="font-semibold">{dish.shelfLife || '6 Months'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-foreground/5 text-xs">
                    <span className="opacity-40 uppercase font-bold tracking-wider">SKU</span>
                    <span className="font-mono opacity-75">{dish.sku || `MKH-0${dish.id}`}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 text-xs">
                    <span className="opacity-40 uppercase font-bold tracking-wider">Stock Status</span>
                    <span className={`font-semibold ${dish.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {dish.stock > 0 ? `In Stock (${dish.stock} left)` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nutrition Facts */}
              <div className="p-8 glass rounded-4xl space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Flame className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Nutrition Facts (Per 100g)</span>
                </div>
                {dish.nutritionalValues ? (
                  <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                    <div className="p-3 bg-foreground/5 rounded-2xl">
                      <div className="text-[8px] font-bold opacity-45 uppercase tracking-widest mb-0.5">Calories</div>
                      <div className="text-base font-bold font-serif">{dish.nutritionalValues.calories} kcal</div>
                    </div>
                    <div className="p-3 bg-foreground/5 rounded-2xl">
                      <div className="text-[8px] font-bold opacity-45 uppercase tracking-widest mb-0.5">Protein</div>
                      <div className="text-base font-bold font-serif">{dish.nutritionalValues.protein}g</div>
                    </div>
                    <div className="p-3 bg-foreground/5 rounded-2xl">
                      <div className="text-[8px] font-bold opacity-45 uppercase tracking-widest mb-0.5">Carbs</div>
                      <div className="text-base font-bold font-serif">{dish.nutritionalValues.carbohydrates}g</div>
                    </div>
                    <div className="p-3 bg-foreground/5 rounded-2xl">
                      <div className="text-[8px] font-bold opacity-45 uppercase tracking-widest mb-0.5">Fat</div>
                      <div className="text-base font-bold font-serif">{dish.nutritionalValues.fat}g</div>
                    </div>
                    <div className="p-3 bg-foreground/5 rounded-2xl col-span-2">
                      <div className="text-[8px] font-bold opacity-45 uppercase tracking-widest mb-0.5">Dietary Fiber</div>
                      <div className="text-base font-bold font-serif">{dish.nutritionalValues.fiber}g</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs opacity-50 italic pt-4">Nutritional values are not available.</p>
                )}
              </div>
            </div>

            {/* Desktop Action Zone - Both Add to Cart & Buy Now */}
            <div className="pt-8 hidden sm:flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center glass border border-border/60 rounded-full h-16 p-1.5 shrink-0">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-full flex items-center justify-center text-foreground/40 hover:text-primary transition-all disabled:opacity-10 cursor-pointer"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="min-w-10 text-center font-bold text-xl font-serif">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-full flex items-center justify-center text-foreground/40 hover:text-primary transition-all cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  size="lg"
                  className={`h-16 flex-1 text-xs font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-300 shadow-md relative overflow-hidden cursor-pointer ${
                    added ? 'bg-green-600 border-green-600 text-white' : 'bg-foreground/5 border border-border text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary'
                  }`}
                  onClick={handleAddToCart}
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {added ? (
                      <>Added to Cart <CheckCircle2 className="w-5 h-5" /></>
                    ) : (
                      <>Add to Cart <ShoppingBag className="w-5 h-5" /></>
                    )}
                  </div>
                </Button>

                {/* Buy Now Button */}
                <Button
                  size="lg"
                  className="h-16 flex-1 text-xs font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-300 shadow-xl bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer"
                  onClick={handleBuyNow}
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    Buy Now <Zap className="w-5 h-5 fill-current" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Discovery Feed */}
        {relatedItems.length > 0 && (
          <div className="mt-60 pt-24 border-t border-border/10">
            <div className="flex items-center justify-between mb-20">
              <div className="space-y-4">
                <span className="text-primary font-black uppercase tracking-widest text-xs">Similiar Flavors</span>
                <h2 className="text-5xl md:text-8xl font-black font-heading tracking-tighter">The <span className="text-foreground/20 italic font-serif">Anthology.</span></h2>
              </div>
              <Link href="/menu" className="flex items-center gap-3 px-8 h-16 rounded-full glass border-border hover:bg-foreground hover:text-background transition-all font-black uppercase tracking-widest text-[10px]">
                View Entire Archive <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedItems.map(item => (
                <FoodCard key={item.id} dish={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Action Bar - Both Add to Cart & Buy Now */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/45 px-4 py-3 pb-7 flex flex-col gap-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          {/* Mobile Quantity selector */}
          <div className="flex items-center glass border border-border/50 rounded-full h-11 p-1 shrink-0">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-full flex items-center justify-center text-foreground/40 hover:text-primary transition-all disabled:opacity-10"
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="min-w-6 text-center font-bold text-base font-serif">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-full flex items-center justify-center text-foreground/40 hover:text-primary transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1">
            {/* Mobile Add to Cart */}
            <Button
              size="lg"
              className={`h-11 flex-1 text-[9px] font-bold tracking-[0.15em] uppercase rounded-full transition-all border ${
                added ? 'bg-green-600 border-green-600 text-white' : 'bg-foreground/5 border-border text-foreground'
              }`}
              onClick={handleAddToCart}
            >
              <div className="flex items-center justify-center gap-1.5">
                {added ? (
                  <>Added <CheckCircle2 className="w-3.5 h-3.5" /></>
                ) : (
                  <>Cart <ShoppingBag className="w-3.5 h-3.5" /></>
                )}
              </div>
            </Button>

            {/* Mobile Buy Now */}
            <Button
              size="lg"
              className="h-11 flex-1 text-[9px] font-bold tracking-[0.15em] uppercase rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-md"
              onClick={handleBuyNow}
            >
              <div className="flex items-center justify-center gap-1.5">
                Buy Now <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
