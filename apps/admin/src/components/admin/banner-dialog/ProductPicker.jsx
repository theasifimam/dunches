/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { Package, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetProductsQuery } from "@/store/productApi";
import { cn } from "@/lib/utils";

export function ProductPicker({ selectedProduct, onSelect }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data: productData } = useGetProductsQuery(
    { search: search || undefined, limit: 20, all: true },
    { skip: false }
  );
  const products = productData?.data?.products || [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3" ref={ref}>
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Package className="h-3 w-3" />
        Link a Product
        <span className="text-muted-foreground/50 font-medium normal-case tracking-normal">
          — image &amp; link will be sourced automatically
        </span>
      </div>

      {/* Selected product display */}
      {selectedProduct ? (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
          <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/30">
            {selectedProduct.images?.[0] ? (
              <img
                src={
                  selectedProduct.images[0].startsWith("http")
                    ? selectedProduct.images[0]
                    : selectedProduct.images[0].startsWith("/")
                      ? selectedProduct.images[0]
                      : `/${selectedProduct.images[0]}`
                }
                alt={selectedProduct.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <Package className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black tracking-tight truncate">
              {selectedProduct.name}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
              ₹{selectedProduct.price}{" "}
              {selectedProduct.discount > 0 && (
                <span className="text-primary">{selectedProduct.discount}% off</span>
              )}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelect(null)}
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null}

      {/* Search + dropdown */}
      <div className="relative">
        <div
          className="flex items-center h-12 rounded-xl bg-muted/50 border border-primary/10 px-3 gap-2 cursor-text"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder={selectedProduct ? "Change product…" : "Search products to link…"}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
          />
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-card border border-border shadow-xl overflow-hidden">
            <div className="max-h-56 overflow-y-auto">
              {products.length === 0 ? (
                <div className="px-4 py-6 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  No products found
                </div>
              ) : (
                products.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => {
                      onSelect(p);
                      setSearch("");
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left border-b border-border/10 last:border-0",
                      selectedProduct?._id === p._id && "bg-primary/8"
                    )}
                  >
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/20">
                      {p.images?.[0] ? (
                        <img
                          src={
                            p.images[0].startsWith("http")
                              ? p.images[0]
                              : p.images[0].startsWith("/")
                                ? p.images[0]
                                : `/${p.images[0]}`
                          }
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black tracking-tight truncate">
                        {p.name}
                      </p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        {p.type} · ₹{p.price}
                      </p>
                    </div>
                    {selectedProduct?._id === p._id && (
                      <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
