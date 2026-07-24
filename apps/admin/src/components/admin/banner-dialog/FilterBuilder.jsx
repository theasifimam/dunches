"use client";
import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, Link2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoriesQuery } from "@/store/categoryApi";
import { cn } from "@/lib/utils";

// ─── Filter URL builder ───────────────────────────────────────────────────────
export function buildFilterUrl(filterConfig) {
  const params = new URLSearchParams();
  if (filterConfig.productSlug) {
    params.set("q", filterConfig.productSlug.replace(/-/g, " "));
  }
  if (filterConfig.flavorProfile) params.set("category", filterConfig.flavorProfile);
  if (filterConfig.searchQuery) params.set("q", filterConfig.searchQuery);
  const str = params.toString();
  return str ? `/explore?${str}` : "/explore";
}

const PRODUCT_TYPES = ["makhana", "chips", "nuts", "seeds", "assortments", "other"];
const FLAVOR_PROFILES = ["Classic", "Savory", "Spicy", "Sweet", "Assortments"];

export function FilterBuilder({ filterConfig, onChange, generatedUrl }) {
  const [open, setOpen] = useState(false);
  const { data: categoryData } = useGetCategoriesQuery();
  const categories = categoryData?.data || [];

  const update = (key, value) => {
    onChange({ ...filterConfig, [key]: value || null });
  };

  const reset = () =>
    onChange({
      productType: null,
      category: null,
      flavorProfile: null,
      minPrice: null,
      maxPrice: null,
      brand: null,
      productSlug: null,
      searchQuery: null,
    });

  const hasFilters = Object.values(filterConfig).some(
    (v) => v !== null && v !== "" && v !== undefined
  );

  return (
    <div className="space-y-3">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-muted/40 border border-primary/10 hover:border-primary/25 hover:bg-muted/60 transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <Filter className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Filter Builder
          </span>
          {hasFilters && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <RotateCcw className="h-2.5 w-2.5" /> Reset
            </span>
          )}
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {open && (
        <div className="space-y-4 px-4 py-4 rounded-xl bg-muted/20 border border-primary/8">
          {/* Product Type + Flavor Profile */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Product Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRODUCT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("productType", filterConfig.productType === t ? null : t)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                      filterConfig.productType === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Flavor Profile
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FLAVOR_PROFILES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => update("flavorProfile", filterConfig.flavorProfile === f ? null : f)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                      filterConfig.flavorProfile === f
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category + Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Category
              </label>
              <Select
                value={filterConfig.category || ""}
                onValueChange={(v) => update("category", v === "none" ? null : v)}
              >
                <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-primary/10 text-xs">
                  <SelectValue placeholder="Any category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Any category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Brand
              </label>
              <Input
                placeholder="e.g. Dunches"
                value={filterConfig.brand || ""}
                onChange={(e) => update("brand", e.target.value)}
                className="h-9 rounded-lg bg-muted/50 border-primary/10 text-xs"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              Price Range (₹)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filterConfig.minPrice || ""}
                onChange={(e) => update("minPrice", e.target.value ? Number(e.target.value) : null)}
                className="h-9 rounded-lg bg-muted/50 border-primary/10 text-xs"
              />
              <span className="text-muted-foreground text-xs font-bold">–</span>
              <Input
                type="number"
                placeholder="Max"
                value={filterConfig.maxPrice || ""}
                onChange={(e) => update("maxPrice", e.target.value ? Number(e.target.value) : null)}
                className="h-9 rounded-lg bg-muted/50 border-primary/10 text-xs"
              />
            </div>
          </div>

          {/* Search Query */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              Keyword / Search Query
            </label>
            <Input
              placeholder="e.g. peri peri, himalayan salt"
              value={filterConfig.searchQuery || ""}
              onChange={(e) => update("searchQuery", e.target.value)}
              className="h-9 rounded-lg bg-muted/50 border-primary/10 text-xs"
            />
          </div>
        </div>
      )}

      {/* Generated URL preview */}
      {generatedUrl && (
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/15">
          <Link2 className="h-3.5 w-3.5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
              Generated CTA URL
            </p>
            <p className="text-[10px] font-bold text-primary truncate font-mono">
              {generatedUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
