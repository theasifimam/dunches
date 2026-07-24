/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Megaphone, X, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BannerFormSchema } from "@/lib/zod-schemas";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/store/bannerApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { ProductPicker } from "./banner-dialog/ProductPicker";
import { FilterBuilder, buildFilterUrl } from "./banner-dialog/FilterBuilder";
import { BannerImageUpload } from "./banner-dialog/BannerImageUpload";

// ─── Main BannerDialog ────────────────────────────────────────────────────────
export function BannerDialog({ isOpen, onOpenChange, banner }) {
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const loading = isCreating || isUpdating;
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Product picker state — stores the full product object
  const [linkedProductObj, setLinkedProductObj] = useState(null);

  // Filter builder state
  const emptyFilter = {
    productType: null,
    category: null,
    flavorProfile: null,
    minPrice: null,
    maxPrice: null,
    brand: null,
    productSlug: null,
    searchQuery: null,
  };
  const [filterConfig, setFilterConfig] = useState(emptyFilter);

  const form = useForm({
    resolver: zodResolver(BannerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      label: "",
      buttonLink: "",
      actionText: "Shop Now",
      type: "offer",
      status: "Active",
      placement: "Both",
      expiry: "",
      linkedProduct: null,
      filterConfig: emptyFilter,
    },
  });

  const currentType = form.watch("type");

  // ── Auto-rebuild buttonLink whenever filterConfig changes ──────────────────
  const rebuildUrl = useCallback(
    (cfg) => {
      const url = buildFilterUrl(cfg);
      form.setValue("buttonLink", url === "/explore" ? "" : url);
    },
    [form],
  );

  const handleFilterChange = (cfg) => {
    setFilterConfig(cfg);
    form.setValue("filterConfig", cfg);
    rebuildUrl(cfg);
  };

  // ── Product picker callback ────────────────────────────────────────────────
  const handleProductSelect = (product) => {
    setLinkedProductObj(product);
    if (!product) {
      form.setValue("linkedProduct", null);
      form.setValue("image", null);
      setImagePreview(null);
      // Remove productSlug from filter
      const newCfg = { ...filterConfig, productSlug: null };
      setFilterConfig(newCfg);
      form.setValue("filterConfig", newCfg);
      rebuildUrl(newCfg);
      return;
    }

    form.setValue("linkedProduct", product._id);

    // Auto-fill image from product's first image
    const productImage = product.images?.[0]
      ? product.images[0].startsWith("http") ||
        product.images[0].startsWith("/")
        ? product.images[0]
        : `/${product.images[0]}`
      : null;

    if (productImage) {
      setImagePreview(productImage);
      form.setValue("image", productImage);
    } else {
      setImagePreview(null);
      form.setValue("image", null);
    }

    // Set filter productSlug
    const newCfg = { ...filterConfig, productSlug: product.slug };
    setFilterConfig(newCfg);
    form.setValue("filterConfig", newCfg);
    rebuildUrl(newCfg);
  };

  // ── Populate form when editing an existing banner ──────────────────────────
  useEffect(() => {
    if (banner && isOpen) {
      const existingFilter = banner.filterConfig
        ? {
            productType: banner.filterConfig.productType || null,
            category: banner.filterConfig.category || null,
            flavorProfile: banner.filterConfig.flavorProfile || null,
            minPrice: banner.filterConfig.minPrice || null,
            maxPrice: banner.filterConfig.maxPrice || null,
            brand: banner.filterConfig.brand || null,
            productSlug: banner.filterConfig.productSlug || null,
            searchQuery: banner.filterConfig.searchQuery || null,
          }
        : emptyFilter;

      form.reset({
        title: banner.title,
        description: banner.description,
        label: banner.label || "",
        buttonLink: banner.buttonLink || "",
        actionText: banner.actionText || "Shop Now",
        type: banner.type || "offer",
        status: banner.status,
        placement: banner.placement || "Both",
        expiry: banner.expiry ? banner.expiry.split("T")[0] : "",
        linkedProduct:
          banner.linkedProduct?._id || banner.linkedProduct || null,
        filterConfig: existingFilter,
      });

      setFilterConfig(existingFilter);

      // Re-hydrate linked product object
      if (banner.linkedProduct && typeof banner.linkedProduct === "object") {
        setLinkedProductObj(banner.linkedProduct);
      } else {
        setLinkedProductObj(null);
      }

      // For demo prefill banners: don't show the external image as preview
      if (banner._isDemoPrefill) {
        setImagePreview(null);
      } else {
        setImagePreview(
          banner.image?.startsWith("http")
            ? banner.image
            : banner.image?.startsWith("/")
              ? banner.image
              : banner.image
                ? `/${banner.image}`
                : null,
        );
      }
    } else if (!banner && isOpen) {
      form.reset({
        title: "",
        description: "",
        label: "",
        buttonLink: "",
        actionText: "Shop Now",
        type: "offer",
        status: "Active",
        placement: "Both",
        expiry: "",
        linkedProduct: null,
        filterConfig: emptyFilter,
      });
      setImagePreview(null);
      setLinkedProductObj(null);
      setFilterConfig(emptyFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banner, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatedUrl = buildFilterUrl(filterConfig);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      if (values.label) formData.append("label", values.label);
      if (values.buttonLink) formData.append("buttonLink", values.buttonLink);
      if (values.actionText) formData.append("actionText", values.actionText);
      formData.append("type", values.type);
      formData.append("status", values.status);
      formData.append("placement", values.placement);
      if (values.expiry) formData.append("expiry", values.expiry);

      // Linked product
      if (values.linkedProduct) {
        formData.append("linkedProduct", values.linkedProduct);
      }

      // Filter config (JSON string)
      if (values.filterConfig) {
        formData.append("filterConfig", JSON.stringify(values.filterConfig));
      }

      // Image: upload new File, or keep existing (skip for linked product images — URLs or relative paths)
      if (values.image instanceof File) {
        formData.append("image", values.image);
      } else if (
        typeof values.image === "string" &&
        values.image.trim().length > 0
      ) {
        formData.append("imageUrl", values.image);
      } else if (!banner || banner._isDemoPrefill) {
        toast.error(
          "Please upload an image or select a product with an image for this banner.",
        );
        return;
      }

      // banner?.id is undefined for new banners AND for demo-prefill templates
      if (banner?.id) {
        await updateBanner({ id: banner.id, formData }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await createBanner(formData).unwrap();
        toast.success("New banner published");
      }
      onOpenChange(false);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(error?.data?.message || "Failed to save banner");
      console.error("Submission error:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl bg-card border shadow-2xl border-primary/10 rounded-3xl md:rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 fade-in duration-500 max-h-[90vh] flex flex-col">
        <div className="absolute top-5 right-6 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
            type="button"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Dialog Header */}
        <div className="p-6 md:p-10 pb-5 flex items-center gap-5 border-b border-primary/5 bg-primary/2">
          <div
            className={cn(
              "h-14 w-14 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-colors duration-300",
              currentType === "announcement"
                ? "bg-accent text-accent-foreground shadow-accent/20"
                : "bg-primary text-primary-foreground shadow-primary/20",
            )}
          >
            {currentType === "announcement" ? (
              <Megaphone className="h-7 w-7" />
            ) : (
              <Tag className="h-7 w-7" />
            )}
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none mb-1">
              {banner
                ? banner._isDemoPrefill
                  ? "Create from Template"
                  : banner.type === "announcement"
                    ? "Edit Announcement"
                    : "Edit Offer"
                : "Create Banner"}
            </h3>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-70">
              {banner
                ? banner._isDemoPrefill
                  ? "Upload your own image to publish · pre-filled from demo"
                  : "Update content & settings"
                : "Publish to Hero Slider · Mobile Promo"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <ScrollArea className="flex-1 h-full w-full overflow-y-auto px-8 md:px-12 py-6">
              <div className="space-y-6">
                {/* Type & Placement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Banner Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-primary/10 focus:ring-primary/20">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="offer">
                              🏷️ Special Offer
                            </SelectItem>
                            <SelectItem value="announcement">
                              📣 Announcement
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="placement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Placement
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-primary/10 focus:ring-primary/20">
                              <SelectValue placeholder="Where to show" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Both">
                              🌐 Both (Slider + Mobile)
                            </SelectItem>
                            <SelectItem value="Hero Slider">
                              🖥️ Desktop Hero Slider only
                            </SelectItem>
                            <SelectItem value="Mobile Promo">
                              📱 Mobile Promo only
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* OFFER TYPE: Product Picker & Optional Image Override */}
                {currentType === "offer" && (
                  <div className="p-4 rounded-2xl border border-primary/10 bg-primary/2 space-y-4">
                    <ProductPicker
                      selectedProduct={linkedProductObj}
                      onSelect={handleProductSelect}
                    />

                    <BannerImageUpload
                      imagePreview={imagePreview}
                      fileInputRef={fileInputRef}
                      onImageChange={handleImageChange}
                      label={
                        linkedProductObj
                          ? "Override Image (optional)"
                          : "Banner Image *"
                      }
                      sublabel={
                        linkedProductObj
                          ? "Upload a custom image to override product image"
                          : "Click to upload Banner Image"
                      }
                      heightClass="h-52"
                    />
                  </div>
                )}

                {/* ANNOUNCEMENT TYPE: Image Upload */}
                {currentType === "announcement" && (
                  <BannerImageUpload
                    imagePreview={imagePreview}
                    fileInputRef={fileInputRef}
                    onImageChange={handleImageChange}
                    label="Announcement Image *"
                    sublabel="Click to upload High-Res Image"
                    heightClass="h-64"
                  />
                )}

                {/* Title & Label */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Title / Heading
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Flat 20% on Sweet Bundles"
                            className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Badge Label (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. New Arrival · Bundle Deal"
                            className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the offer or announcement in detail..."
                          className="min-h-25 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Filter Builder */}
                <FilterBuilder
                  filterConfig={filterConfig}
                  onChange={handleFilterChange}
                  generatedUrl={
                    generatedUrl !== "/explore" ? generatedUrl : null
                  }
                />

                {/* CTA Link & Button Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="buttonLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Destination Link
                          <span className="ml-1 text-muted-foreground/50 normal-case tracking-normal font-medium">
                            (auto-set by filter builder)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="/explore?category=Spicy"
                            className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="actionText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          CTA Button Text
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Shop Now · View Deal"
                            className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status & Expiry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-primary/10 focus:ring-primary/20">
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">✅ Active</SelectItem>
                            <SelectItem value="Inactive">
                              ⏸️ Inactive
                            </SelectItem>
                            <SelectItem value="Scheduled">
                              🕐 Scheduled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Expiry Date (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="p-6 md:p-8 border-t border-primary/5 bg-primary/1 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="text-[9px] font-black uppercase tracking-widest hover:text-primary transition-colors rounded-full"
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={loading}
                variant="signature"
                size="lg"
                className="min-w-37.5 rounded-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Publish
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
