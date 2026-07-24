"use client";

import React from "react";
import { Palette, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BrandIdentityCard({
  formData,
  handleChange,
  previewUrl,
  handleImageChange,
  logoUrl,
  handleLogoChange,
}) {
  return (
    <div className="p-4 md:p-6 rounded-2xl md:rounded-4xl bg-card border border-border/40 shadow-sm space-y-4 md:space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border/20">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
            Brand Identity & Assets
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Store logo, headings & hero metadata
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-2">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
            Home Page Heading
          </label>
          <Input
            name="homePageHeadingTitle"
            value={formData.homePageHeadingTitle}
            onChange={handleChange}
            placeholder="e.g. See The World Clearly"
            className="h-12 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs font-bold focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
            Website Description (SEO & Hero)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of your store..."
            className="w-full h-32 p-4 rounded-xl bg-muted/40 border border-border/40 text-xs font-medium focus:ring-primary/20 focus:border-primary outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
              Website Preview / Hero Image
            </label>
            <label className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border hover:border-primary/50 rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all overflow-hidden relative">
              {previewUrl ? (
                <div className="absolute inset-0">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                    Change Image
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Upload Hero Image
                  </p>
                  <p className="text-[10px] font-medium opacity-60 mt-1">
                    PNG, JPG or WEBP
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
              Storefront Logo
            </label>
            <label className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border hover:border-primary/50 rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all overflow-hidden relative">
              {logoUrl ? (
                <div className="absolute inset-0 p-4 flex items-center justify-center bg-muted/50">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                    Change Logo
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Upload Logo
                  </p>
                  <p className="text-[10px] font-medium opacity-60 mt-1">
                    PNG or SVG (Transparent)
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
