/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  Loader2,
  Flame,
  Sparkles,
  Zap,
  Truck,
  Star,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { useGetDashboardMetricsQuery } from "@/store/dashboardApi";
import { DUMMY_DASHBOARD_METRICS } from "@/lib/dummyData";

export default function DashboardPage() {
  const { data, isLoading: apiLoading, error } = useGetDashboardMetricsQuery();
  const dashboardData = data?.data || DUMMY_DASHBOARD_METRICS;
  const [timeframe, setTimeframe] = useState("Monthly");
  const [hoveredBar, setHoveredBar] = useState(null);

  const stats = React.useMemo(
    () => [
      {
        label: "Total Revenue",
        value: `₹${(dashboardData?.totalRevenue || 0).toLocaleString()}`,
        change: `${(dashboardData?.growth || 0) > 0 ? "+" : ""}${(dashboardData?.growth || 0).toFixed(1)}%`,
        isPositive: (dashboardData?.growth || 0) >= 0,
        icon: DollarSign,
        theme: {
          bg: "bg-red-500/10 dark:bg-red-500/20",
          text: "text-red-600 dark:text-red-400",
          border: "hover:border-red-500/30",
          gradient: "from-red-500/10 via-red-500/5 to-transparent",
          badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        },
        description: "vs. last month",
      },
      {
        label: "Active Orders",
        value: (dashboardData?.activeOrders || 0).toLocaleString(),
        change: "Live",
        isPositive: true,
        icon: ShoppingBag,
        theme: {
          bg: "bg-sky-500/10 dark:bg-sky-500/20",
          text: "text-sky-600 dark:text-sky-400",
          border: "hover:border-sky-500/30",
          gradient: "from-sky-500/10 via-sky-500/5 to-transparent",
          badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        },
        description: "In fulfillment queue",
      },
      {
        label: "New Customers",
        value: (dashboardData?.newCustomers || 0).toLocaleString(),
        change: `${(dashboardData?.customerGrowth || 0) > 0 ? "+" : ""}${(dashboardData?.customerGrowth || 0).toFixed(1)}%`,
        isPositive: (dashboardData?.customerGrowth || 0) >= 0,
        icon: Users,
        theme: {
          bg: "bg-violet-500/10 dark:bg-violet-500/20",
          text: "text-violet-600 dark:text-violet-400",
          border: "hover:border-violet-500/30",
          gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
          badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
        },
        description: "Joined last 30 days",
      },
      {
        label: "Stock & Logistics",
        value: "Optimal",
        change: "99.4%",
        isPositive: true,
        icon: TrendingUp,
        theme: {
          bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "hover:border-emerald-500/30",
          gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
          badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        },
        description: "Flavor stock yield OK",
      },
    ],
    [dashboardData],
  );

  const isLoading = apiLoading && !dashboardData;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-semibold text-muted-foreground animate-pulse">Loading dashboard telemetry...</p>
        </div>
      </div>
    );
  }

  const { monthlyRevenue, monthLabels, recentOrders } = dashboardData;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <PageHeader
        badgeIcon={Flame}
        badgeText="System Status: Optimal"
        titleMain="Dunches"
        titleAccent="Console"
        description="Snack Administration & Logistics Hub. Monitor flavor inventory, shipping queues, and local sales performance."
        showAction={false}
      >
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-3 rounded-2xl bg-background/80 backdrop-blur-md border border-border/60 shadow-2xs flex flex-col justify-center min-w-[130px]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Session
              </p>
            </div>
            <h4 className="text-base font-extrabold text-foreground">Online</h4>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-background/80 backdrop-blur-md border border-border/60 shadow-2xs flex flex-col justify-center min-w-[150px]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Target Growth
              </p>
              <span className="text-[10px] font-extrabold text-primary">84%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[84%] bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000" />
            </div>
          </div>
        </div>
      </PageHeader>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={cn(
                "group relative p-5 rounded-2xl bg-card border border-border/60 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between",
                stat.theme.border
              )}
            >
              {/* Background radial highlight on hover */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                  stat.theme.gradient
                )}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-2xs",
                      stat.theme.bg,
                      stat.theme.text
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 border",
                      stat.theme.badge
                    )}
                  >
                    {stat.isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </div>

                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-heading">
                  {stat.value}
                </h3>
              </div>

              <div className="relative z-10 pt-3 mt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                <span>{stat.description}</span>
                <Sparkles className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid: Trajectory Chart & Quick Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-card border border-border/60 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-foreground font-heading uppercase">
                  Order Trajectory
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-extrabold uppercase">
                  Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Monthly order velocity & revenue trends
              </p>
            </div>

            <div className="flex gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border/40">
              {["Weekly", "Monthly", "Quarterly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200",
                    timeframe === t
                      ? "bg-card text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="flex-1 min-h-[240px] flex items-end gap-2 sm:gap-3 justify-between pt-6 px-1 border-b border-border/40 pb-2">
            {monthlyRevenue.map((h, i) => {
              const isHovered = hoveredBar === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col items-center gap-2 group/bar relative h-full justify-end cursor-pointer"
                >
                  {/* Tooltip */}
                  <div
                    className={cn(
                      "absolute bottom-full mb-2 px-2.5 py-1 bg-foreground text-background rounded-lg text-[10px] font-bold transition-all duration-200 pointer-events-none shadow-md whitespace-nowrap z-20",
                      isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                    )}
                  >
                    {monthLabels[i]}: {h}% growth
                  </div>

                  {/* Bar */}
                  <div className="w-full flex-1 flex items-end">
                    <div className="w-full bg-muted/40 rounded-t-xl relative overflow-hidden h-full transition-colors duration-300 group-hover/bar:bg-muted/60">
                      <div
                        className={cn(
                          "absolute inset-x-0 bottom-0 rounded-t-xl transition-all duration-500 shadow-2xs",
                          isHovered
                            ? "bg-gradient-to-t from-primary via-primary to-accent"
                            : "bg-gradient-to-t from-primary/40 via-primary/70 to-primary/90"
                        )}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider transition-colors",
                      isHovered ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {monthLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Footer Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 mt-2 text-center sm:text-left">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Peak Velocity
              </p>
              <p className="text-sm font-extrabold text-foreground">92% (DEC)</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Avg Yield / Mo
              </p>
              <p className="text-sm font-extrabold text-foreground">67.5%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Fulfillment Speed
              </p>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">99.8%</p>
            </div>
          </div>
        </div>

        {/* Quick Feed */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-card border border-border/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground font-heading uppercase">
                  Quick Feed
                </h3>
                <p className="text-xs text-muted-foreground font-medium">Real-time order activity</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-secondary"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3.5">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order, i) => {
                  const isDelivered = order.status === "delivered";
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-secondary/40 hover:bg-secondary border border-border/30 transition-all duration-200 flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform group-hover:scale-105",
                          isDelivered
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        )}
                      >
                        {isDelivered ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-bold text-xs text-foreground truncate">
                            {order.customer}
                          </p>
                          <p className="font-extrabold text-xs text-primary">
                            ₹{order.amount.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                          <span>
                            {order.id} • {order.time}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                              isDelivered
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            )}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8 font-medium">
                  No recent orders available.
                </p>
              )}
            </div>
          </div>

          <Button className="w-full h-11 rounded-xl mt-6 font-bold uppercase tracking-wider text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 flex items-center justify-center gap-2">
            <span>Audit Full History</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Insights Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-xs">
        <div className="flex items-center gap-3 p-2">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Couriers</p>
            <p className="text-xs font-extrabold text-foreground">14 On Route</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dispatch Speed</p>
            <p className="text-xs font-extrabold text-foreground">14.2 Mins Avg</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Flavor Rating</p>
            <p className="text-xs font-extrabold text-foreground">4.9 / 5.0 (2.4k)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="h-9 w-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quality Check</p>
            <p className="text-xs font-extrabold text-foreground">100% Passed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

