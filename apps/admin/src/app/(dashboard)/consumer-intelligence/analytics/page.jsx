'use client';

import React, { useState } from 'react';
import { useGetFeedbackAnalyticsQuery } from '@/store/feedbackApi';
import Link from 'next/link';
import { 
  Loader2, 
  TrendingUp, 
  TrendingDown,
  BarChart, 
  DollarSign, 
  ShoppingBag, 
  Activity, 
  PieChart,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CustomizableIntelChart from '../components/CustomizableIntelChart';
import AutomatedIntelReader from '../components/AutomatedIntelReader';

// Static Data from strategic analytics
const kpiStats = [
    { label: 'Annual Revenue', value: '₹14.2L', change: '+12.5%', isPositive: true, icon: DollarSign, color: 'primary' },
    { label: 'Brand Conversion', value: '4.8%', change: '+0.5%', isPositive: true, icon: Activity, color: 'blue' },
    { label: 'Basket Average', value: '₹560.00', change: '-2.1%', isPositive: false, icon: ShoppingBag, color: 'purple' },
    { label: 'Guest Frequency', value: '84.2k', change: '+3.4%', isPositive: true, icon: Activity, color: 'orange' },
];

const topProducts = [
    { name: 'Classic Himalayan Pink Salt Makhāna', category: 'Classic', sales: 1240, revenue: '₹1,48,800', growth: '+15.2%', momentum: 85 },
    { name: 'Smoked Chili & Zesty Lime Makhāna', category: 'Spicy', sales: 980, revenue: '₹1,32,300', growth: '+8.4%', momentum: 72 },
    { name: 'Toasted Sesame & Black Pepper Makhāna', category: 'Savory', sales: 856, revenue: '₹1,11,280', growth: '+22.1%', momentum: 94 },
];

export default function IntegratedAnalytics() {
  const [activeTab, setActiveTab] = useState('sales');
  const [source, setSource] = useState('All');
  
  const { data: feedbackData, isLoading: isFeedbackLoading } = useGetFeedbackAnalyticsQuery(
    { source: source !== 'All' ? source : undefined },
    { skip: activeTab !== 'feedback' }
  );

  const analytics = feedbackData?.data;
  const totalIntent = analytics?.purchaseIntentData?.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 bg-card border border-border/40 p-4 rounded-2xl shadow-sm">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 hover:scale-105 transition-all duration-300 shadow-sm shrink-0"
          title="Go to Dashboard"
        >
          <Flame className="h-4 w-4 text-primary" />
        </Link>
        <div>
          <h2 className="text-xl font-bold font-serif">Consumer Intelligence</h2>
          <p className="text-xs text-muted-foreground">Strategic and qualitative customer telemetry</p>
        </div>
      </div>

      {/* Sub-Tabs Nav */}
      <div className="flex border-b border-border/20 pb-px">
        <button
          onClick={() => setActiveTab('sales')}
          className={cn(
            "pb-4 px-6 text-sm font-bold border-b-2 transition-all uppercase tracking-wider",
            activeTab === 'sales'
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Sales & Brand Performance
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={cn(
            "pb-4 px-6 text-sm font-bold border-b-2 transition-all uppercase tracking-wider",
            activeTab === 'feedback'
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Customer Feedback Intel
        </button>
      </div>

      {activeTab === 'sales' ? (
        // RENDER SALES & BRAND PERFORMANCE
        <div className="space-y-6 md:space-y-8">
          {/* Strategic KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {kpiStats.map((stat, i) => (
              <div key={i} className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-card border border-border/40 hover:border-primary/20 transition-all relative overflow-hidden group shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-muted text-foreground")}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div className={cn("px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest flex items-center gap-1 uppercase", stat.isPositive ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-500/10 text-red-500 border border-red-500/20")}>
                    {stat.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="p-4 md:p-8 rounded-2xl md:rounded-[2rem] bg-card border border-border/40 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wide font-serif mb-1">Performance Trajectory</h3>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Global revenue lifecycle</p>
                </div>
              </div>

              <div className="flex-1 flex items-end justify-between gap-2 pt-4">
                {[45, 60, 40, 85, 55, 75, 50, 90, 65, 95, 80, 88].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar relative">
                    <div className="w-full bg-muted/20 rounded-t-lg relative overflow-hidden h-[200px] flex items-end">
                      <div className="w-full bg-primary/40 group-hover/bar:bg-primary transition-all duration-500 rounded-t-lg" style={{ height: `${val}%` }} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-8 rounded-2xl md:rounded-[2rem] bg-card border border-border/40 flex flex-col">
              <div className="mb-6">
                <h3 className="text-base font-bold uppercase tracking-wide font-serif mb-1">Catalog Shift</h3>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Market share by category</p>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="relative w-36 h-36 rounded-full border-[1rem] border-muted/20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[1rem] border-primary border-t-transparent border-r-transparent -rotate-45" />
                  <div className="absolute inset-0 rounded-full border-[1rem] border-blue-500 border-l-transparent border-t-transparent rotate-90 scale-[1.03]" />
                  <div className="text-center">
                    <PieChart className="h-6 w-6 text-primary/40 mx-auto mb-1" />
                    <h4 className="text-base font-bold">1.4M</h4>
                    <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Volume</p>
                  </div>
                </div>

                <div className="w-full mt-6 space-y-2">
                  {[
                    { label: 'Sunglasses', value: '42%', color: 'bg-primary' },
                    { label: 'Optical', value: '34%', color: 'bg-blue-500' },
                    { label: 'Blue Light', value: '24%', color: 'bg-muted' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", item.color)} />
                        <span className="font-semibold text-muted-foreground">{item.label}</span>
                      </div>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Table */}
          <div className="rounded-2xl md:rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm">
            <div className="p-4 md:p-6 border-b border-border/20 bg-muted/5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold uppercase tracking-wide font-serif mb-1">Strategic Elite</h3>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Products with highest market momentum</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-muted/10">
                    <th className="p-4 text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Product DNA</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Category</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Unit Velocity</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Gross Yield</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 w-48">Momentum Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {topProducts.map((p, i) => (
                    <tr key={i} className="group hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            {p.name.charAt(0)}
                          </div>
                          <p className="font-bold text-xs">{p.name}</p>
                        </div>
                      </td>
                      <td className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">{p.category}</td>
                      <td className="p-4 font-bold italic">{p.sales.toLocaleString()}</td>
                      <td className="p-4 font-bold text-primary">{p.revenue}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-60">
                            <span>Rank {i + 1} • {p.momentum}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${p.momentum}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // RENDER CUSTOMER FEEDBACK INTEL
        <div className="space-y-4 md:space-y-6">
          <div className="flex justify-end">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="px-4 py-2 bg-card border border-border/60 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All Sources</option>
              <option value="Sampling">Sampling</option>
              <option value="QR">QR</option>
              <option value="Retail Store">Retail Store</option>
              <option value="Website">Website</option>
            </select>
          </div>

          {isFeedbackLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !analytics ? (
            <div className="p-6 text-center text-muted-foreground bg-card border border-border/40 rounded-3xl">No data available.</div>
          ) : (
            <div className="space-y-6">
              {/* Automated AI Narrative Reader */}
              <AutomatedIntelReader analyticsData={analytics} />

              {/* Interactive & Customizable Intelligence Graph */}
              <CustomizableIntelChart analyticsData={analytics} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Rating Distribution */}
                <div className="bg-card border border-border/40 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold font-serif">Rating Distribution</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => {
                      const stat = analytics.ratingDistribution?.find(r => r._id === rating);
                      const count = stat ? stat.count : 0;
                      const maxCount = Math.max(...(analytics.ratingDistribution?.map(r => r.count) || [1]));
                      const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-4">
                          <div className="w-8 text-right font-bold text-sm">{rating}</div>
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-8 text-sm text-muted-foreground">{count}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  {/* Purchase Intent */}
                  <div className="bg-card border border-border/40 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-bold font-serif">Purchase Intent</h3>
                    </div>
                    <div className="flex gap-4 h-32">
                      {['Yes', 'Maybe', 'No'].map((intent) => {
                        const stat = analytics.purchaseIntentData?.find(i => i._id === intent);
                        const count = stat ? stat.count : 0;
                        const percentage = (count / totalIntent) * 100;
                        
                        return (
                          <div key={intent} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                            <div className="text-xs font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              {count}
                            </div>
                            <div 
                              className={`w-full rounded-t-xl transition-all duration-1000 ease-out ${intent === 'Yes' ? 'bg-green-500' : intent === 'No' ? 'bg-red-500' : 'bg-amber-500'}`}
                              style={{ height: `${Math.max(percentage, 5)}%` }}
                            />
                            <div className="text-sm font-semibold">{intent}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Top Sources */}
                  <div className="bg-card border border-border/40 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm">
                    <h3 className="text-lg font-bold font-serif mb-4">Traffic Sources</h3>
                    <div className="space-y-4">
                      {analytics.sourceData?.map((src) => (
                        <div key={src._id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{src._id}</span>
                          <span className="text-sm font-bold bg-muted px-3 py-1 rounded-full">{src.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
