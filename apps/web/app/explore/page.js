"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectMenu, setCategory } from "@/features/menu/menuSlice";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ExplorePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const menu = useSelector(selectMenu);
  
  const [activeTag, setActiveTag] = useState("All");

  // Filter tag headers
  const tags = ["All", "Recent", "Offers", "Trending"];

  // Mock collections inspired by the design
  const collections = [
    {
      id: "classic",
      category: "Classic",
      title: "Crunchy Chips",
      description: "Crispy • salty • fun",
      borderColor: "hover:border-primary/40",
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "spicy",
      category: "Spicy",
      title: "Cheese Laius Chips",
      description: "Cheesy • crunchy • bold",
      borderColor: "hover:border-primary/40",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "savory",
      category: "Savory",
      title: "Onion Rings Funyuns",
      description: "Crispy • salty • tasty",
      borderColor: "hover:border-primary/40",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "sweet",
      category: "Sweet",
      title: "Sweet Jaggery",
      description: "Sweet • warm • crunchy",
      borderColor: "hover:border-primary/40",
      image: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?q=80&w=800&auto=format&fit=crop",
    }
  ];

  const handleCollectionClick = (category) => {
    dispatch(setCategory(category));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-32 px-4 sm:px-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/70 active:scale-95 transition-all cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-3xl font-black font-heading tracking-tight uppercase leading-none">
            Explore <br />Collections
          </h1>
        </div>
        <button className="p-3 rounded-full bg-foreground/[0.03] border border-border/40 text-foreground/70 hover:bg-foreground/[0.06] active:scale-95 transition-all cursor-pointer">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Horizontal Tag Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-8 -mx-4 px-4">
        {tags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`
                flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border shrink-0 cursor-pointer
                ${
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-md"
                    : "bg-background text-foreground/50 border-border/50 hover:border-foreground/30"
                }
              `}
            >
              <span>{tag}</span>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${isActive ? 'bg-background text-foreground' : 'bg-foreground/10 text-foreground/60'}`}>
                +
              </span>
            </button>
          );
        })}
      </div>

      {/* Collection Cards List */}
      <div className="flex flex-col gap-6">
        {collections.map((col) => (
          <button
            key={col.id}
            onClick={() => handleCollectionClick(col.category)}
            className={`w-full rounded-[2.5rem] p-6 bg-secondary/30 backdrop-blur-3xl border border-border/40 text-foreground text-left flex items-center justify-between relative overflow-hidden aspect-[16/9] shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all group cursor-pointer ${col.borderColor}`}
          >
            {/* Left Content */}
            <div className="space-y-1.5 z-10 max-w-[60%]">
              <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight uppercase group-hover:text-primary transition-colors">
                {col.title}
              </h3>
              <p className="text-xs font-bold opacity-60">
                {col.description}
              </p>
            </div>

            {/* Right floating image */}
            <div className="absolute right-0 bottom-0 top-0 w-[50%] flex items-center justify-center pointer-events-none">
              <img
                src={col.image}
                alt={col.title}
                className="w-[85%] aspect-square object-cover rounded-3xl rotate-12 group-hover:rotate-6 group-hover:scale-105 transition-all duration-700 shadow-2xl border-4 border-foreground/10"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
