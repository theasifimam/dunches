import React from "react";
import { Sparkles, Flame } from "lucide-react";
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Left Section - Hero Branding (md+ only) */}
      <div className="hidden md:flex relative w-1/2 lg:w-[60%] bg-[#080808] p-12 lg:p-20 flex-col justify-between overflow-hidden group">
        {/* Visual Backdrop */}
        <div className="absolute inset-0 opacity-100 transition-opacity duration-1000">
          <Image
            src="/auth_visual.png"
            alt="Dunches Visual Branding"
            fill
            priority
            className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]"
          />
        </div>

        {/* Top Brand Logo Overlay */}
        <div className="relative z-10 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="h-12 w-12 rounded-2xl bg-primary/20 border-2 border-primary/20 flex items-center justify-center relative z-10 shadow-lg">
            <Flame className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-light font-serif tracking-tighter leading-none text-white lowercase">
              Dunches
              <span className="text-primary italic font-sans font-black">
                .
              </span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-1 font-heading">
              Craving Suite
            </p>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary font-heading">
              Popped Cravings
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light font-serif text-white leading-tight lowercase">
            fresh crunch, <br />
            <span className="text-primary italic font-serif">
              spiciest flavor.
            </span>
          </h2>
          <p className="text-xs text-white/50 mt-4 leading-relaxed">
            Manage your global snack distribution network, monitor real-time
            order processing pipelines, and organize seasonal marketing
            campaigns.
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-20 relative bg-background">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.02] z-0" />

        {/* Mobile Header Branding (visible on mobile only) */}
        <div className="flex md:hidden items-center gap-3 mb-10 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-primary/20 border-2 border-primary/20 flex items-center justify-center shadow-md">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-light font-serif tracking-tighter leading-none text-foreground lowercase">
              Dunches
              <span className="text-primary italic font-sans font-black">
                .
              </span>
            </h1>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mt-0.5 font-heading">
              Craving Suite
            </p>
          </div>
        </div>

        {/* Centered Login Content Container */}
        <div className="my-auto max-w-[420px] w-full mx-auto relative z-10">
          {children}
        </div>

        {/* Footer legal text */}
        <div className="pt-10 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 relative z-10 font-heading">
          <span>Dunches console v2.0.0</span>
          <span>© 2026. All Rights Reserved.</span>
        </div>
      </div>
    </div>
  );
}
