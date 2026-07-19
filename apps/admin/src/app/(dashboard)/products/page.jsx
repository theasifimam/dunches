/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  XCircle,
  Package,
  Layers,
  TrendingUp,
  Boxes,
  AlertCircle,
  ArrowRight,
  Loader2,
  FileUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const ProductDialog = dynamic(
  () =>
    import("@/components/admin/ProductDialog").then((mod) => mod.ProductDialog),
  { ssr: false },
);
const BulkImportDialog = dynamic(
  () =>
    import("@/components/admin/BulkImportDialog").then(
      (mod) => mod.BulkImportDialog,
    ),
  { ssr: false },
);
import { cn } from "@/lib/utils";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/store/productApi";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { DUMMY_PRODUCTS } from "@/lib/dummyData";

export default function ProductsPage() {
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const debouncedSearch = useDebounce(productSearchTerm, 500);
  const [page, setPage] = useState(1);

  // RTK Query
  const {
    data: productsData,
    isLoading: apiLoading,
    isError: apiError,
    error,
  } = useGetProductsQuery({
    page,
    search: debouncedSearch,
    limit: 10,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = React.useMemo(() => {
    const hasProducts = productsData?.data?.products && productsData.data.products.length > 0;
    const rawProducts = hasProducts ? productsData.data.products : DUMMY_PRODUCTS;

    if (!hasProducts && debouncedSearch) {
      const lowSearch = debouncedSearch.toLowerCase();
      return rawProducts.filter(p => 
        p.name.toLowerCase().includes(lowSearch) || 
        p.sku.toLowerCase().includes(lowSearch) ||
        (typeof p.category === 'object' ? p.category.name : p.category).toLowerCase().includes(lowSearch)
      );
    }
    return rawProducts;
  }, [productsData, debouncedSearch]);

  const pagination = React.useMemo(() => {
    if (productsData?.data?.pagination) {
      return productsData.data.pagination;
    }
    return {
      total: products.length,
      pages: 1,
      page: 1,
      limit: 10
    };
  }, [productsData, products]);

  const isLoading = apiLoading && !productsData;

  const stats = React.useMemo(
    () => [
      {
        label: "Stock Yield",
        value: "Verified",
        icon: Boxes,
        color: "primary",
      },
      {
        label: "Out of Stock SKUs",
        value: "Monitoring",
        icon: XCircle,
        color: "destructive",
      },
      {
        label: "Low Stock Alerts",
        value: "Active",
        icon: AlertCircle,
        color: "orange",
      },
    ],
    [],
  );

  // Dialog States
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const openAddProductDialog = () => {
    setEditingProduct(null);
    setIsProductDialogOpen(true);
  };

  const openEditProductDialog = (product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully");
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error(err?.data?.message || "Failed to delete product");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }



  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-card border border-border/40 px-5 py-3 rounded-2xl shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total SKUs:</div>
          <div className="text-xl font-black text-primary font-serif leading-none">{pagination?.total || 0}</div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setIsBulkImportDialogOpen(true)}
            variant="outline"
            className="rounded-full px-5 h-11 text-xs font-bold uppercase tracking-wider"
          >
            Bulk Import
          </Button>
          <Button
            onClick={openAddProductDialog}
            variant="signature"
            className="rounded-full px-5 h-11 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/95"
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* Inventory Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-card border border-border/40 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="h-16 w-16 text-primary" />
              </div>
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center mb-4", 
                stat.color === "primary" ? "bg-primary/10 text-primary" : 
                stat.color === "destructive" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">{stat.label}</p>
              <h4 className="text-2xl font-bold text-foreground leading-none">{stat.value}</h4>
            </div>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="relative group w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search by product name, ID or category..."
          className="h-12 w-full pl-12 pr-4 bg-card border border-border/60 rounded-2xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={productSearchTerm}
          onChange={(e) => setProductSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
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
                                : "text-destructive",
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
                                : "bg-destructive",
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
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        product.isActive
                          ? "bg-primary/5 text-primary border-primary/20"
                          : "bg-destructive/5 text-destructive border-destructive/20",
                      )}
                    >
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          product.isActive
                            ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,1)]"
                            : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,1)]",
                        )}
                      />
                      {product.isActive ? "Active" : "Inactive"}
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
        </div>

        {/* Pagination */}
        <div className="p-4 md:p-6 border-t border-border/40 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Showing {products.length} of {pagination?.total || 0} items
          </p>
          <Pagination
            currentPage={page}
            totalPages={pagination?.pages || 1}
            onPageChange={setPage}
          />
        </div>
      </div>

      <ProductDialog
        isOpen={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        product={editingProduct}
      />

      <BulkImportDialog
        isOpen={isBulkImportDialogOpen}
        onOpenChange={setIsBulkImportDialogOpen}
      />
    </div>
  );
}
