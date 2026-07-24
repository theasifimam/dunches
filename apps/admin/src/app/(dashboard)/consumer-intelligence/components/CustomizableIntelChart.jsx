"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Layers,
  Sparkles,
  Sun,
  CloudRain,
  Flame,
  Snowflake,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SEASON_MAP = {
  12: {
    name: "Winter",
    icon: Snowflake,
    color: "text-blue-400 bg-blue-500/10",
  },
  1: { name: "Winter", icon: Snowflake, color: "text-blue-400 bg-blue-500/10" },
  2: { name: "Winter", icon: Snowflake, color: "text-blue-400 bg-blue-500/10" },
  3: { name: "Summer", icon: Sun, color: "text-amber-500 bg-amber-500/10" },
  4: { name: "Summer", icon: Sun, color: "text-amber-500 bg-amber-500/10" },
  5: { name: "Summer", icon: Sun, color: "text-amber-500 bg-amber-500/10" },
  6: {
    name: "Monsoon",
    icon: CloudRain,
    color: "text-cyan-500 bg-cyan-500/10",
  },
  7: {
    name: "Monsoon",
    icon: CloudRain,
    color: "text-cyan-500 bg-cyan-500/10",
  },
  8: {
    name: "Monsoon",
    icon: CloudRain,
    color: "text-cyan-500 bg-cyan-500/10",
  },
  9: {
    name: "Festive",
    icon: Flame,
    color: "text-orange-500 bg-orange-500/10",
  },
  10: {
    name: "Festive",
    icon: Flame,
    color: "text-orange-500 bg-orange-500/10",
  },
  11: {
    name: "Festive",
    icon: Flame,
    color: "text-orange-500 bg-orange-500/10",
  },
};

export default function CustomizableIntelChart({ analyticsData }) {
  const [dimension, setDimension] = useState("flavor"); // 'flavor' | 'seasonal' | 'rating' | 'channel'
  const [metric, setMetric] = useState("count"); // 'count' | 'rating'

  const {
    flavorPerformance = [],
    monthlyTrends = [],
    ratingDistribution = [],
    sourceData = [],
  } = analyticsData || {};

  // Compute flavor data fallback if no live data yet
  const chartItems = useMemo(() => {
    if (dimension === "flavor") {
      const items =
        flavorPerformance.length > 0
          ? flavorPerformance.map((f) => ({
              label: f.name || f._id,
              value: metric === "rating" ? f.avgRating : f.count,
              subText: `Avg Rating: ${f.avgRating} / 10`,
            }))
          : [
              {
                label: "Classic Himalayan Salt",
                value: metric === "rating" ? 9.2 : 142,
                subText: "Avg Rating: 9.2 / 10",
              },
              {
                label: "Smoked Chili & Lime",
                value: metric === "rating" ? 8.8 : 98,
                subText: "Avg Rating: 8.8 / 10",
              },
              {
                label: "Toasted Sesame & Pepper",
                value: metric === "rating" ? 9.4 : 86,
                subText: "Avg Rating: 9.4 / 10",
              },
              {
                label: "Peri Peri Crunch",
                value: metric === "rating" ? 8.5 : 74,
                subText: "Avg Rating: 8.5 / 10",
              },
              {
                label: "Cheese Jalapeño",
                value: metric === "rating" ? 8.9 : 62,
                subText: "Avg Rating: 8.9 / 10",
              },
            ];
      return items;
    }

    if (dimension === "seasonal") {
      if (monthlyTrends.length > 0) {
        return monthlyTrends.map((m) => {
          const monthNum = m._id?.month || 1;
          const monthLabel = MONTH_NAMES[monthNum - 1] || `Month ${monthNum}`;
          const season = SEASON_MAP[monthNum] || { name: "General" };
          return {
            label: `${monthLabel} (${season.name})`,
            value:
              metric === "rating" ? Number(m.avgRating.toFixed(1)) : m.count,
            subText: `${m.positiveIntentCount} Positive Purchase Intents`,
          };
        });
      }
      // Demo seasonal data
      return [
        {
          label: "Jan (Winter)",
          value: metric === "rating" ? 8.1 : 45,
          subText: "Winter Sampling Campaign",
        },
        {
          label: "Feb (Winter)",
          value: metric === "rating" ? 8.3 : 52,
          subText: "Winter Sampling Campaign",
        },
        {
          label: "Mar (Summer)",
          value: metric === "rating" ? 8.6 : 78,
          subText: "Summer Refresh Kickoff",
        },
        {
          label: "Apr (Summer)",
          value: metric === "rating" ? 8.9 : 94,
          subText: "Peak Summer Demand",
        },
        {
          label: "May (Summer)",
          value: metric === "rating" ? 9.1 : 110,
          subText: "Summer Promo",
        },
        {
          label: "Jun (Monsoon)",
          value: metric === "rating" ? 8.4 : 68,
          subText: "Monsoon Snacking",
        },
        {
          label: "Jul (Monsoon)",
          value: metric === "rating" ? 8.5 : 72,
          subText: "Monsoon Snacking",
        },
        {
          label: "Aug (Festive)",
          value: metric === "rating" ? 9.3 : 135,
          subText: "Festive Season Start",
        },
        {
          label: "Sep (Festive)",
          value: metric === "rating" ? 9.5 : 160,
          subText: "Diwali Gift Boxes",
        },
      ];
    }

    if (dimension === "rating") {
      if (ratingDistribution.length > 0) {
        return ratingDistribution.map((r) => ({
          label: `Score ${r._id} / 10`,
          value: r.count,
          subText: `${r.count} customer ratings`,
        }));
      }
      return [
        { label: "Score 10 / 10", value: 145, subText: "Delighted Customers" },
        { label: "Score 9 / 10", value: 92, subText: "Very Satisfied" },
        { label: "Score 8 / 10", value: 58, subText: "Satisfied" },
        { label: "Score 7 / 10", value: 24, subText: "Neutral" },
        { label: "Score 6 / 10", value: 10, subText: "Needs Improvement" },
      ];
    }

    if (dimension === "channel") {
      if (sourceData.length > 0) {
        return sourceData.map((s) => ({
          label: s._id,
          value: s.count,
          subText: `${s.count} total submissions`,
        }));
      }
      return [
        { label: "Sampling Event", value: 184, subText: "On-ground events" },
        { label: "Retail Store", value: 96, subText: "In-store QR scan" },
        { label: "Website Direct", value: 64, subText: "Online feedback form" },
        {
          label: "Blinkit / QuickCommerce",
          value: 48,
          subText: "Pack QR code",
        },
      ];
    }

    return [];
  }, [
    dimension,
    metric,
    flavorPerformance,
    monthlyTrends,
    ratingDistribution,
    sourceData,
  ]);

  const maxVal = useMemo(() => {
    if (!chartItems.length) return 1;
    return Math.max(...chartItems.map((item) => item.value)) || 1;
  }, [chartItems]);

  return (
    <div className="bg-card border border-border/40 p-4 md:p-6 rounded-2xl md:rounded-4xl shadow-sm space-y-6">
      {/* Top Header & Customizer Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-base md:text-lg font-bold font-serif">
              Customizable Intelligence Graph
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Analyze flavor demand, seasonality, satisfaction ratings, and
            channel metrics.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dimension Selector */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40">
            {[
              { id: "flavor", label: "Flavor Performance", icon: Sparkles },
              { id: "seasonal", label: "Seasonality & Time", icon: TrendingUp },
              { id: "rating", label: "Rating Distribution", icon: BarChart3 },
              { id: "channel", label: "Channels", icon: Layers },
            ].map((dim) => {
              const Icon = dim.icon;
              const isActive = dimension === dim.id;
              return (
                <button
                  key={dim.id}
                  type="button"
                  onClick={() => setDimension(dim.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{dim.label}</span>
                </button>
              );
            })}
          </div>

          {/* Metric Selector (Volume vs Rating) */}
          {dimension !== "rating" && dimension !== "channel" && (
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40">
              <button
                type="button"
                onClick={() => setMetric("count")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                  metric === "count"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground",
                )}
              >
                Volume
              </button>
              <button
                type="button"
                onClick={() => setMetric("rating")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                  metric === "rating"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground",
                )}
              >
                Avg Rating
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Graph Render */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-bold uppercase tracking-wider text-[10px]">
            {dimension === "flavor"
              ? "Flavor / Product Breakdown"
              : dimension === "seasonal"
                ? "Monthly & Seasonal Conversion Trend"
                : dimension === "rating"
                  ? "Satisfaction Score Breakdown (1-10)"
                  : "Acquisition Channel Performance"}
          </span>
          <span className="font-semibold text-primary">
            Metric:{" "}
            {metric === "rating" ? "Average Rating" : "Total Feedback Volume"}
          </span>
        </div>

        <div className="space-y-3">
          {chartItems.map((item, idx) => {
            const percentage = Math.round((item.value / maxVal) * 100);
            return (
              <div key={idx} className="group space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground">
                      #{idx + 1}
                    </span>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {item.subText}
                    </span>
                    <span className="font-black text-primary font-serif">
                      {item.value} {metric === "rating" ? "/ 10" : "entries"}
                    </span>
                  </div>
                </div>

                <div className="h-3 w-full bg-muted/30 rounded-full overflow-hidden p-0.5 border border-border/30">
                  <div
                    className="h-full bg-linear-to-r from-primary/70 to-primary rounded-full transition-all duration-700 ease-out group-hover:from-primary group-hover:to-amber-400"
                    style={{ width: `${Math.max(percentage, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
