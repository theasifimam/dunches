'use client';

import React from 'react';
import { useGetFeedbackAnalyticsQuery } from '@/store/feedbackApi';
import { Users, Star, ShoppingCart, Target, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ConsumerIntelligenceDashboard() {
  const { data: analyticsData, isLoading, error } = useGetFeedbackAnalyticsQuery({});

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading intelligence data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20">
        Failed to load analytics data.
      </div>
    );
  }

  const { totalFeedback, avgRating, purchaseIntentData, sourceData } = analyticsData?.data || {};

  // Calculate percentages
  const topSource = sourceData && sourceData.length > 0 ? sourceData[0] : null;
  const intentYes = purchaseIntentData?.find((i) => i._id === 'Yes')?.count || 0;
  const intentTotal = purchaseIntentData?.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const purchaseIntentPercent = Math.round((intentYes / intentTotal) * 100) || 0;

  const kpis = [
    {
      title: 'Total Feedback',
      value: totalFeedback || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Average Rating',
      value: `${avgRating || 0} / 10`,
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Purchase Intent (Yes)',
      value: `${purchaseIntentPercent}%`,
      icon: ShoppingCart,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Top Source',
      value: topSource ? topSource._id : 'N/A',
      icon: Target,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      subtitle: topSource ? `${topSource.count} entries` : '',
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-card border border-border/40 p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className={cn("h-16 w-16", kpi.color)} />
              </div>
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4", kpi.bg)}>
                <Icon className={cn("h-5 w-5", kpi.color)} />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{kpi.title}</h3>
              <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
              {kpi.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-card border border-border/40 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm">
           <h3 className="text-lg font-bold mb-4 font-serif">Quick Actions</h3>
           <p className="text-sm text-muted-foreground mb-6">
             Start collecting data or view detailed insights from the intelligence sub-menus.
           </p>
           <div className="flex gap-4">
             <a href="/consumer-intelligence/new" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm">
               + Capture Feedback Now
             </a>
           </div>
        </div>
        
        <div className="bg-card border border-border/40 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
             <Target className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-2">Detailed Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Head over to the Analytics tab to view detailed charts, flavor comparisons, and rating distributions.
          </p>
        </div>
      </div>
    </div>
  );
}
