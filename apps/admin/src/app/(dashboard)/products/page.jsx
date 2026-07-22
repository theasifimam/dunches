/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  XCircle,
  Boxes,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/store/productApi";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { DUMMY_PRODUCTS } from "@/lib/dummyData";
import ViewSwitcher from "@/components/admin/ViewSwitcher";

import ProductTable from "./components/ProductTable";
import ProductCardsGrid from "./components/ProductCardsGrid";

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

export default function ProductsPage() {
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const debouncedSearch = useDebounce(productSearchTerm, 500);
  const [page, setPage] = useState(1);

  const {
    data: productsData,
    isLoading: apiLoading,
  } = useGetProductsQuery({
    page,
    search: debouncedSearch,
    limit: 10,
    all: true,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [viewMode, setViewMode] = useState("list");
  React.useEffect(() => {
    const stored = localStorage.getItem("dunches_admin_view_products");
    if (stored === "card" || stored === "list") {
      setViewMode(stored);
    }
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("dunches_admin_view_products", mode);
  };

  const handleToggleStatus = async (product) => {
    try {
      await updateProduct({
        id: product._id,
        body: { isActive: !product.isActive },
      }).unwrap();
      toast.success(
        `Product ${!product.isActive ? "activated" : "deactivated"} successfully`,
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product status");
    }
  };

  const products = React.useMemo(() => {
    const hasProducts =
      productsData?.data?.products && productsData.data.products.length > 0;
    const rawProducts = hasProducts
      ? productsData.data.products
      : DUMMY_PRODUCTS;

    if (!hasProducts && debouncedSearch) {
      const lowSearch = debouncedSearch.toLowerCase();
      return rawProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(lowSearch) ||
          p.sku.toLowerCase().includes(lowSearch) ||
          (typeof p.category === "object" ? p.category.name : p.category)
            .toLowerCase()
            .includes(lowSearch),
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
      limit: 10,
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
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-card border border-border/40 px-5 py-3 rounded-2xl shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
            Total SKUs:
          </div>
          <div className="text-xl font-black text-primary font-serif leading-none">
            {pagination?.total || 0}
          </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-card border border-border/40 p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="h-16 w-16 text-primary" />
              </div>
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
                  stat.color === "primary"
                    ? "bg-primary/10 text-primary"
                    : stat.color === "destructive"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-orange-500/10 text-orange-500"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                {stat.label}
              </p>
              <h4 className="text-2xl font-bold text-foreground leading-none">
                {stat.value}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center w-full">
        <div className="relative group flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by product name, ID or category..."
            className="h-12 w-full pl-12 pr-4 bg-card border border-border/60 rounded-2xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
          />
        </div>
        <ViewSwitcher
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </div>

      {/* Products Table / Cards */}
      {viewMode === "list" ? (
        <div className="rounded-2xl md:rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <ProductTable
              products={products}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              handleToggleStatus={handleToggleStatus}
              openEditProductDialog={openEditProductDialog}
              handleDelete={handleDelete}
            />
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
      ) : (
        <div className="space-y-6">
          <ProductCardsGrid
            products={products}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            handleToggleStatus={handleToggleStatus}
            openEditProductDialog={openEditProductDialog}
            handleDelete={handleDelete}
          />
          {/* Pagination */}
          <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-card border border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
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
      )}

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
