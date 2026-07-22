"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function CustomerStatsCards({ pulseStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {pulseStats.map((stat, i) => {
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
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center mb-4",
                stat.color === "primary"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-foreground"
              )}
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
  );
}
