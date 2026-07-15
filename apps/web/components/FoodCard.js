"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { Plus, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FoodCard({ dish }) {
  const dispatch = useDispatch();

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart(dish));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white/[0.02] rounded-[2.5rem] p-3 transition-all duration-500 hover:bg-white/[0.04] border border-white/5 hover:border-primary/20 overflow-hidden"
    >
      <Link 
        href={`/product/${dish.id}`} 
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-2 w-full"
      >
        {/* Left/Top: Image Exhibit */}
        <div 
          className="relative w-full sm:w-[38%] aspect-square sm:aspect-[3/4] overflow-hidden rounded-[2rem] bg-neutral-900 shadow-2xl shrink-0 self-center"
        >
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 300px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
          
          {/* Status Label */}
          <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-lg text-[7px] font-bold tracking-widest uppercase">
            Organic
          </div>

        </div>

        {/* Right/Bottom: Archive Identity */}
        <div className="flex-1 flex flex-col justify-between py-2 min-w-0 w-full">
          <div>
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2">
                 <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-primary">{dish.category}</span>
                 <div className="h-px w-6 bg-primary/20" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground font-heading tracking-tight leading-tight group-hover:text-primary transition-colors">
                {dish.name}
              </h3>
            </div>

            <p className="text-[10px] sm:text-[11px] text-foreground/40 line-clamp-2 leading-relaxed font-medium mb-6">
              {dish.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
             <div className="flex flex-col">
                <span className="text-[7px] sm:text-[8px] font-bold text-foreground/30 uppercase tracking-widest">Per Pack</span>
                <span className="text-lg sm:text-xl font-bold text-foreground tracking-tighter">₹{dish.price}</span>
             </div>
             <button 
               onClick={handleAdd}
               className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3.5 py-2 sm:px-4 sm:py-2 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
             >
                <Plus className="w-3.5 h-3.5" /> Add
             </button>
          </div>
        </div>
      </Link>

      {/* Background ID Number */}
      <div className="absolute bottom-[-10px] right-2 text-[4rem] sm:text-[6rem] font-black text-foreground/[0.02] select-none pointer-events-none font-heading leading-none">
         {dish.id.toString().padStart(2, '0')}
      </div>
    </motion.div>
  );
}
