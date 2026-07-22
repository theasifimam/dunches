"use client";
import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({
  badgeIcon: BadgeIcon,
  badgeText,
  titleMain,
  titleAccent,
  description,
  actionIcon: ActionIcon,
  actionLabel,
  onAction,
  showAction = true,
  children,
}) {
  return (
    <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-r from-card via-card to-card/90 border border-border/60 shadow-sm overflow-hidden group">
      {/* Subtle background glow spots */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none -translate-y-12" />
      <div className="absolute bottom-0 left-10 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:scale-105 hover:bg-primary hover:text-white transition-all duration-300 shadow-xs"
              title="Go to Dashboard"
            >
              <Flame className="h-4 w-4" />
            </Link>
            {badgeText && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider border border-border/40">
                {BadgeIcon && <BadgeIcon className="h-3 w-3 text-primary animate-pulse" />}
                <span>{badgeText}</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
              {titleMain}{" "}
              {titleAccent && (
                <span className="text-muted-foreground font-normal italic font-serif opacity-80">
                  {titleAccent}
                </span>
              )}
            </h1>
          </div>

          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Header Right Content & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {children}
          {showAction && ActionIcon && actionLabel && (
            <Button
              variant="default"
              size="lg"
              className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-300"
              onClick={onAction}
            >
              <ActionIcon className="h-4 w-4 mr-2" />
              <span>{actionLabel}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

