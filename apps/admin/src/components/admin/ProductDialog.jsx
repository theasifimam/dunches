"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProductFormSchema } from "@/lib/zod-schemas";
import { AssetsTab } from "./product-dialog/AssetsTab";
import { GeneralTab } from "./product-dialog/GeneralTab";
import { SpecsTab } from "./product-dialog/SpecsTab";
import { DimensionsTab } from "./product-dialog/DimensionsTab";
import { PricingTab } from "./product-dialog/PricingTab";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/store/productApi";
import { toast } from "sonner";
import { useGetCategoriesQuery } from "@/store/categoryApi";

const PRODUCT_FORM_DRAFT_KEY = "product_form_draft_v2";

export function ProductDialog({ isOpen, onOpenChange, product }) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: categoriesData } = useGetCategoriesQuery({ all: true });
  const categories = categoriesData?.data || [];
  const loading = isCreating || isUpdating;
  const [lastLoadedProductId, setLastLoadedProductId] = useState(null);

  const form = useForm({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      brand: "makhāna",
      sku: "",
      category: "",
      type: "makhana",
      netWeight: 0,
      shelfLife: "6 Months",
      flavorProfile: "Classic",
      ingredients: [],
      nutritionalValues: {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
      },
      images: [],
      price: 0,
      discount: 0,
      stock: 0,
      tags: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setLastLoadedProductId(null);
      return;
    }

    if (product && lastLoadedProductId !== product._id) {
      // Deep clone to avoid Proxy-related issues and ensure clean state
      const baseProduct = JSON.parse(JSON.stringify(product));

      // Strictly extract the category string ID from the populated object
      let categoryId = "";
      const rawCategory = product.category;

      if (rawCategory) {
        if (typeof rawCategory === "string") {
          categoryId = rawCategory;
        } else if (typeof rawCategory === "object" && rawCategory !== null) {
          categoryId = rawCategory._id || rawCategory.id || "";
        }
      }

      // Ensure result is a trimmed string
      categoryId = categoryId ? String(categoryId).trim() : "";

      // Remove the populated category object from the clone so it can't leak
      // through the spread — we'll set it explicitly as a string below
      delete baseProduct.category;

      form.reset({
        ...baseProduct,
        category: categoryId,
        brand: product.brand || "makhāna",
        netWeight: product.netWeight || 0,
        shelfLife: product.shelfLife || "6 Months",
        flavorProfile: product.flavorProfile || "Classic",
        ingredients: product.ingredients || [],
        nutritionalValues: product.nutritionalValues || {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
        },
        images: product.images || [],
        tags: product.tags || [],
      });
      setLastLoadedProductId(product._id);
    } else if (!product && lastLoadedProductId !== "new") {
      const draft = localStorage.getItem(PRODUCT_FORM_DRAFT_KEY);
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft);
          form.reset(parsedDraft);
        } catch (error) {
          console.error("Failed to load product draft:", error);
        }
      } else {
        form.reset({
          name: "",
          slug: "",
          description: "",
          brand: "makhāna",
          sku: "",
          category: "",
          type: "makhana",
          netWeight: 0,
          shelfLife: "6 Months",
          flavorProfile: "Classic",
          ingredients: [],
          nutritionalValues: {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
            fiber: 0,
          },
          price: 0,
          discount: 0,
          stock: 0,
          isActive: true,
          images: [],
          tags: [],
        });
      }
      setLastLoadedProductId("new");
    } else if (product && lastLoadedProductId === product._id) {
      // Update ONLY images if the server payload changes (due to AddProductImages update)
      const currentFormImages = form.getValues("images") || [];
      const serverImages = product.images || [];
      if (JSON.stringify(currentFormImages) !== JSON.stringify(serverImages)) {
        form.setValue("images", serverImages, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [product, form, isOpen, lastLoadedProductId]);

  // Persist draft changes for new products
  useEffect(() => {
    if (!product && isOpen) {
      const subscription = form.watch((value) => {
        localStorage.setItem(PRODUCT_FORM_DRAFT_KEY, JSON.stringify(value));
      });
      return () => subscription.unsubscribe();
    }
  }, [form, product, isOpen]);

  const onSubmit = async (values) => {
    try {
      if (product?._id) {
        await updateProduct({ id: product._id, body: values }).unwrap();
        toast.success("Product blueprint refined");
      } else {
        await createProduct(values).unwrap();
        toast.success("Signature snack cataloged");
        localStorage.removeItem(PRODUCT_FORM_DRAFT_KEY);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.data?.message || "Archive sync failure");
      console.error("Submission error:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* ModalContent */}
      <TooltipProvider delayDuration={200}>
        <div className="relative w-full max-w-3xl bg-card border shadow-2xl border-primary/10 rounded-3xl md:rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 fade-in duration-500 max-h-[95vh] flex flex-col">
          <div className="absolute top-5 right-6 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 md:p-10 pb-5 flex items-center gap-5 border-b border-primary/5 bg-primary/2">
            <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <Package className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none mb-1">
                {product ? "Refine Snack" : "Draft Snack"}
              </h3>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-70">
                {product
                  ? `Editing snack blueprint: ${product._id || "N/A"}`
                  : "Cataloging a new healthy snack"}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <ScrollArea className="flex-1 h-full w-full overflow-y-auto px-8 md:px-12 py-6">
                <Tabs defaultValue="general" className="w-full p-1">
                  <TabsList className="bg-muted/30 p-1 rounded-2xl mb-8 w-fit border border-primary/5">
                    <TabsTrigger
                      value="general"
                      className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      General
                    </TabsTrigger>
                    <TabsTrigger
                      value="assets"
                      className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      Assets
                    </TabsTrigger>
                    <TabsTrigger
                      value="specs"
                      className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      Specs
                    </TabsTrigger>
                    <TabsTrigger
                      value="nutrition"
                      className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      Nutrition
                    </TabsTrigger>
                    <TabsTrigger
                      value="inventory"
                      className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      Inventory
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-2">
                    <TabsContent value="general">
                      <GeneralTab
                        categories={categories}
                        control={form.control}
                      />
                    </TabsContent>
                    <TabsContent value="assets">
                      <AssetsTab
                        control={form.control}
                        productId={product?._id}
                      />
                    </TabsContent>
                    <TabsContent value="specs">
                      <SpecsTab control={form.control} />
                    </TabsContent>
                    <TabsContent value="nutrition">
                      <DimensionsTab control={form.control} />
                    </TabsContent>
                    <TabsContent value="inventory">
                      <PricingTab control={form.control} />
                    </TabsContent>
                  </div>
                </Tabs>
              </ScrollArea>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-primary/5 bg-primary/1 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-[9px] font-black uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Discard Changes
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="signature"
                  size="lg"
                  className="min-w-[200px]"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center h-4 w-4 rounded-full border-2 border-primary-foreground/30">
                        <div className="h-1 w-1 rounded-full bg-primary-foreground animate-pulse" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Save Snack
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </TooltipProvider>
    </div>
  );
}
