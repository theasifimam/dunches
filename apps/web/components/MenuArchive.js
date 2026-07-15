"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  selectCategories,
  selectSelectedCategory,
  setCategory,
  selectFilteredMenu,
} from "@/features/menu/menuSlice";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FoodCard from "@/components/FoodCard";

export default function MenuArchive({ searchQuery = "" }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const baseFilteredMenu = useSelector(selectFilteredMenu);

  const filteredMenu = baseFilteredMenu.filter(dish => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      dish.name.toLowerCase().includes(query) ||
      dish.description.toLowerCase().includes(query) ||
      dish.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
      dish.category.toLowerCase().includes(query)
    );
  });

  return (
    <section
      id="menu-archive"
      className="py-16 md:py-24 container mx-auto px-4 sm:px-6"
    >
      {/* Category Archive Index */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-8 border-b border-border/10 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Flavor Categories
            </p>
            <h2 className="text-lg sm:text-xl font-light font-serif tracking-tighter lowercase">
              shop flavors
            </h2>
          </div>
        </div>
      </div>

      {/* Sticky Category List */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-8 sticky top-12 lg:top-20 z-50 bg-background/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-border/5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => dispatch(setCategory(cat))}
            className={`
              px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
              ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-foreground/5 text-foreground/40 border-transparent hover:border-border hover:text-foreground"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Master Grid: Order Primary Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[600px]">
        <AnimatePresence>
          {filteredMenu.map((dish) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <FoodCard dish={dish} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredMenu.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-2xl font-black font-heading opacity-20 uppercase tracking-widest">
            No menu items found
          </p>
        </div>
      )}
    </section>
  );
}
