"use client";

import React from "react";
import { Package, Layers, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductTable({
  products,
  isUpdating,
  isDeleting,
  handleToggleStatus,
  openEditProductDialog,
  handleDelete,
}) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/30 text-muted-foreground font-semibold">
        <tr>
          <th className="px-4 py-4 w-16 text-center">Preview</th>
          <th className="px-4 py-4">Product DNA</th>
          <th className="px-4 py-4 hidden sm:table-cell">Category</th>
          <th className="px-4 py-4">Stock Status</th>
          <th className="px-4 py-4">MSRP</th>
          <th className="px-4 py-4 hidden md:table-cell">Visibility</th>
          <th className="px-4 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/20">
        {products.map((product) => (
          <tr
            key={product._id}
            className="group hover:bg-muted/10 transition-colors"
          >
            <td className="px-4 py-4">
              <div className="relative h-12 w-12 mx-auto">
                <div className="relative h-full w-full rounded-xl overflow-hidden border border-border/30 shadow-sm bg-muted shrink-0 z-10">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="max-w-[150px] sm:max-w-[200px]">
                <p className="font-bold text-sm text-foreground mb-1 leading-tight truncate">
                  {product.name}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1 opacity-70">
                  <Layers className="h-3 w-3" /> {product.sku}
                </p>
              </div>
            </td>
            <td className="px-4 py-4 hidden sm:table-cell">
              <span className="px-2.5 py-1 rounded-full bg-muted text-xs font-bold uppercase tracking-wider">
                {typeof product.category === "object"
                  ? product.category.name
                  : product.category}
              </span>
            </td>
            <td className="px-4 py-4">
              <div className="flex flex-col gap-1.5 min-w-[80px] sm:min-w-[120px]">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
            </td>
            <td className="px-4 py-4">
              <span className="font-bold text-primary font-serif">
                ₹{product.price.toFixed(2)}
              </span>
            </td>
            <td className="px-4 py-4 hidden md:table-cell">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-12">
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
            </td>
            <td className="px-4 py-4 text-right">
              <div className="flex items-center justify-end gap-1 sm:gap-1.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditProductDialog(product)}
                  className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  onClick={() => handleDelete(product._id)}
                  className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
