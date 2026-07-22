"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_BEST = [
  "Fiery Spice",
  "Super Crunchy",
  "Premium Quality",
  "Unique Flavor",
  "Healthy Snacking",
  "Fresh Pack",
];
const QUICK_WORST = [
  "A bit too salty",
  "Some hard seeds",
  "Price is high",
  "Too spicy",
  "Less flavor",
  "Not sweet enough",
];
const QUICK_FLAVORS = [
  "Cheese Jalapeño",
  "Tangy Tomato",
  "Sour Cream & Onion",
  "Caramel",
  "Butter Garlic",
  "Peri Peri",
];

const QuickSuggestions = ({ options, onSelect, currentValue }) => (
  <div className="flex flex-wrap gap-1 mt-1.5">
    {options.map((opt) => {
      const isSelected = currentValue === opt;
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          className={cn(
            "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border transition-all",
            isSelected
              ? "bg-primary/20 text-primary border-primary"
              : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted"
          )}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

export default function QualitativeIntelSection({ formData, handleChange }) {
  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
        <MessageSquare className="h-3.5 w-3.5 text-primary" /> Qualitative Intel
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Best Feature
          </label>
          <input
            type="text"
            value={formData.bestThing}
            onChange={(e) => handleChange("bestThing", e.target.value)}
            className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium"
            placeholder="e.g. crunchy, packaging"
          />
          <QuickSuggestions
            options={QUICK_BEST}
            onSelect={(val) => handleChange("bestThing", val)}
            currentValue={formData.bestThing}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Worst Feature
          </label>
          <input
            type="text"
            value={formData.worstThing}
            onChange={(e) => handleChange("worstThing", e.target.value)}
            className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium"
            placeholder="e.g. price, spicy"
          />
          <QuickSuggestions
            options={QUICK_WORST}
            onSelect={(val) => handleChange("worstThing", val)}
            currentValue={formData.worstThing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Suggested Flavor
          </label>
          <input
            type="text"
            value={formData.suggestedNewFlavor}
            onChange={(e) => handleChange("suggestedNewFlavor", e.target.value)}
            className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium"
            placeholder="e.g. cheese, peri peri"
          />
          <QuickSuggestions
            options={QUICK_FLAVORS}
            onSelect={(val) => handleChange("suggestedNewFlavor", val)}
            currentValue={formData.suggestedNewFlavor}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Expected Price (₹)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={formData.expectedPrice}
            onChange={(e) => handleChange("expectedPrice", e.target.value)}
            className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium"
            placeholder="e.g. 99"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Exact Customer Quote
        </label>
        <textarea
          value={formData.exactQuote}
          onChange={(e) => handleChange("exactQuote", e.target.value)}
          className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none min-h-[50px] resize-y font-medium"
          placeholder='"Highly spiced, loved the texture!"'
        />
      </div>
    </div>
  );
}
