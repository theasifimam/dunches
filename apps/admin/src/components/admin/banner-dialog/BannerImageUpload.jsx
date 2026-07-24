/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export function BannerImageUpload({
  imagePreview,
  fileInputRef,
  onImageChange,
  label = "Banner Image *",
  sublabel = "Click to upload High-Res Image",
  heightClass = "h-64",
}) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed border-primary/20 bg-muted/30 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group",
          heightClass
        )}
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Upload className="h-4 w-4" /> Change Image
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-12 w-12 rounded-xl bg-background shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:text-primary transition-all">
              <Upload className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {sublabel}
            </span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={onImageChange}
        />
      </div>
    </div>
  );
}
