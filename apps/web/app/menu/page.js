"use client";

import { useSelector, useDispatch } from "react-redux";
import { selectFilteredMenu, selectCategories, selectSelectedCategory, setCategory } from "@/features/menu/menuSlice";
import FoodCard from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function MenuPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const filteredMenu = useSelector(selectFilteredMenu);

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-32 pb-40 relative">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Simplified Centered Header - Highly Refined */}
        <div className="text-center mb-12 sm:mb-20 md:mb-24 space-y-4 sm:space-y-6">
           <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4 opacity-40">
              <div className="h-px w-8 bg-foreground" />
              <Sparkles className="w-4 h-4" />
              <div className="h-px w-8 bg-foreground" />
           </div>
           
           <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-heading tracking-tighter uppercase leading-none">
              Explore <br />Our <span className="text-primary">Menu.</span>
           </h1>
           
           <p className="text-foreground/40 max-w-2xl mx-auto text-sm sm:text-base md:text-xl font-medium leading-relaxed">
              Curated royal delicacies prepared with modern precision.
           </p>
        </div>

        {/* Refined Simple Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-12 sm:mb-20 md:mb-24">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => dispatch(setCategory(cat))}
              className={`
                h-10 sm:h-14 px-5 sm:px-10 rounded-full font-black uppercase tracking-widest text-[8px] sm:text-[10px] transition-all duration-500
                ${selectedCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-2xl scale-105 sm:scale-110' 
                  : 'bg-transparent border-border hover:bg-foreground hover:text-background'}
              `}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Menu Grid - Standard but Polished */}
        <div className="relative min-h-[400px]">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
             <AnimatePresence>
               {filteredMenu.map((dish) => (
                 <motion.div
                   key={dish.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.3 }}
                 >
                   <FoodCard dish={dish} />
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>

           {filteredMenu.length === 0 && (
             <div className="py-40 text-center text-foreground/20 text-2xl font-black uppercase tracking-widest font-heading">
               No archive entries found.
             </div>
           )}
        </div>

      </div>

    </div>
  );
}
