"use client";

import React from "react";
import { MapPin, Mail, Phone, MessageCircle, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ContactSocialCard({ formData, handleChange }) {
  return (
    <>
      {/* Store Information Card */}
      <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-card border border-border/40 shadow-sm space-y-4 md:space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/20">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              Store Information
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Contact methods & physical location
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
              Contact Email
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-muted-foreground">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="hello@example.com"
                className="pl-12 h-12 rounded-xl bg-muted/40 border border-border/40 text-xs font-bold focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
              Contact Phone
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-muted-foreground">
                <Phone className="w-4 h-4" />
              </div>
              <Input
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className="pl-12 h-12 rounded-xl bg-muted/40 border border-border/40 text-xs font-bold focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
              WhatsApp Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
              </div>
              <Input
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className="pl-12 h-12 rounded-xl bg-muted/40 border border-border/40 text-xs font-bold focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
              Store Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Street Name, City, Country"
              className="w-full h-24 p-4 rounded-xl bg-muted/40 border border-border/40 text-xs font-medium focus:ring-primary/20 focus:border-primary outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Social Links Card */}
      <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-card border border-border/40 shadow-sm space-y-4 md:space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/20">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              Social Links
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Connect channels for user navigation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
              Instagram URL
            </label>
            <Input
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
              className="h-12 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs font-bold focus-visible:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
              Facebook URL
            </label>
            <Input
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
              className="h-12 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs font-bold focus-visible:ring-primary/20"
            />
          </div>
        </div>
      </div>
    </>
  );
}
