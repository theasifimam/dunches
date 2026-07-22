"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { Plus, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function FoodCard({ dish }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(dish));
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(dish));
    router.push("/checkout");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white/2 rounded-4xl sm:rounded-[2.5rem] p-3 transition-all duration-500 hover:bg-white/4 border border-white/5 hover:border-primary/20 overflow-hidden w-full"
    >
      <Link
        href={`/product/${dish.slug}`}
        className="flex flex-col sm:flex-row gap-3 sm:gap-6 p-1 sm:p-2 w-full"
      >
        {/* Left/Top: Image Exhibit */}
        <div className="relative w-full aspect-square sm:w-[38%] sm:aspect-3/4 overflow-hidden rounded-4xl sm:rounded-4xl bg-neutral-900 shadow-2xl shrink-0 self-center">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 120px, 300px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* Status Label */}
          <div className="absolute top-2.5 left-2.5 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-lg text-[6px] sm:text-[7px] font-bold tracking-widest uppercase">
            Organic
          </div>
        </div>

        {/* Right/Bottom: Archive Identity */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0 w-full gap-2 sm:gap-0">
          <div>
            <div className="space-y-0.5 sm:space-y-1 mb-1 sm:mb-3">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                  {dish.category}
                </span>
                <div className="h-px w-4 sm:w-6 bg-primary/20" />
              </div>
              <h3 className="text-[11px] sm:text-lg md:text-xl font-bold text-foreground font-sans tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {dish.name}
              </h3>
            </div>

            <p className="hidden sm:block text-[9px] sm:text-[11px] text-foreground/40 line-clamp-2 leading-relaxed font-medium mb-2 sm:mb-6">
              {dish.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1 sm:pt-2 gap-2">
            <div className="flex flex-col shrink-0">
              <span className="text-[6px] sm:text-[8px] font-bold text-foreground/30 uppercase tracking-widest">
                Per Pack
              </span>
              <span className="text-xs sm:text-xl font-bold text-foreground tracking-tighter">
                ₹{dish.price}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Outline Add Button (+) */}
              <button
                type="button"
                onClick={handleAdd}
                title="Add to Cart"
                className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Primary Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-full font-bold text-[9px] sm:text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>Buy</span>
                <Zap className="w-3 h-3 fill-current hidden sm:inline" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Background ID Number */}
      <div className="hidden sm:block absolute bottom-[-10px] right-2 text-[4rem] sm:text-[6rem] font-black text-foreground/2 select-none pointer-events-none font-heading leading-none">
        {dish.id.toString().padStart(2, "0")}
      </div>
    </motion.div>
  );
}
