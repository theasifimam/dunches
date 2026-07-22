"use client";

import React from "react";
import { Package, Layers, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductCardsGrid({
  products,
  isUpdating,
  isDeleting,
  handleToggleStatus,
  openEditProductDialog,
  handleDelete,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:gap-6 md:p-6 bg-muted/5">
      {products.map((product) => (
        <div
          key={product._id}
          className="group rounded-2xl md:rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
        >
          {/* Product Image */}
          <div className="relative aspect-video w-full bg-muted overflow-hidden border-b border-border/20">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
            {/* Status Toggle Switch */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/40 shadow-sm">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                {product.isActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => handleToggleStatus(product)}
                disabled={isUpdating}
                className={cn(
                  "h-5 w-9 rounded-full relative transition-all duration-300 p-0.5 shrink-0",
                  product.isActive
                    ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                    : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 transform",
                    product.isActive ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-5 flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full bg-muted text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {typeof product.category === "object"
                    ? product.category.name
                    : product.category}
                </span>
                <span className="font-serif font-bold text-primary text-base">
                  ₹{product.price.toFixed(2)}
                </span>
              </div>
              <h4
                className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1 mb-1"
                title={product.name}
              >
                {product.name}
              </h4>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1 opacity-70">
                <Layers className="h-3 w-3" /> {product.sku}
              </p>
            </div>

            {/* Stock info */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Stock Status</span>
                <span
                  className={cn(
                    product.stock > 10
                      ? "text-primary font-black"
                      : product.stock > 0
                        ? "text-orange-500"
                        : "text-destructive"
                  )}
                >
                  {product.stock} units
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    product.stock > 10
                      ? "bg-primary"
                      : product.stock > 0
                        ? "bg-orange-500"
                        : "bg-destructive"
                  )}
                  style={{
                    width: `${Math.min((product.stock / 50) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditProductDialog(product)}
                className="h-8 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all font-bold uppercase text-[9px] tracking-wider px-3 flex items-center gap-1"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => handleDelete(product._id)}
                className="h-8 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all font-bold uppercase text-[9px] tracking-wider px-3 flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
