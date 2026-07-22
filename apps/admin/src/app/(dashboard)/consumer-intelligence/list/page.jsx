'use client';

import React, { useState } from 'react';
import { useGetFeedbacksQuery } from '@/store/feedbackApi';
import Link from 'next/link';
import { Loader2, Calendar, Filter, ChevronLeft, ChevronRight, LayoutGrid, List, Flame } from 'lucide-react';
import ViewSwitcher from '@/components/admin/ViewSwitcher';

export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [source, setSource] = useState('');
  const [viewMode, setViewMode] = useState("list");
  React.useEffect(() => {
    const stored = localStorage.getItem("dunches_admin_view_feedback");
    if (stored === "card" || stored === "list") {
      setViewMode(stored);
    }
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("dunches_admin_view_feedback", mode);
  };
  
  const { data, isLoading, isFetching } = useGetFeedbacksQuery({
    page,
    limit: 10,
    source: source !== 'All' ? source : '',
  });

  const feedbacks = data?.data?.feedbacks || [];
  const pagination = data?.data?.pagination || { page: 1, pages: 1 };

  return (
    <div className="space-y-6">
      {/* Header Filter Bar */}
      <div className="bg-card border border-border/40 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 hover:scale-105 transition-all duration-300 shadow-sm shrink-0"
            title="Go to Dashboard"
          >
            <Flame className="h-4 w-4 text-primary" />
          </Link>
          <div>
            <h2 className="text-xl font-bold font-serif">Feedback Database</h2>
            <p className="text-sm text-muted-foreground">Review all collected consumer data</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-8 py-2 bg-background border border-border/60 rounded-full text-sm font-medium appearance-none min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All Sources</option>
              <option value="Sampling">Sampling</option>
              <option value="QR">QR</option>
              <option value="Retail Store">Retail Store</option>
              <option value="Website">Website</option>
            </select>
          </div>
          <ViewSwitcher viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="bg-card border border-border/40 rounded-3xl p-20 text-center text-muted-foreground shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary animate-pulse" />
          <p className="font-bold uppercase tracking-widest text-[10px]">Loading feedback...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-card border border-border/40 rounded-3xl p-20 text-center text-muted-foreground shadow-sm">
          <p className="font-bold uppercase tracking-widest text-[10px]">No feedback entries found.</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Source</th>
                  <th className="px-4 py-4">Rating</th>
                  <th className="px-4 py-4 hidden sm:table-cell">Favorite Product</th>
                  <th className="px-4 py-4 hidden md:table-cell">Intent</th>
                  <th className="px-4 py-4">Quote</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {feedbacks.map((item) => (
                  <tr key={item._id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-foreground">
                      {item.customerName || item.phoneNumber || 'Anonymous'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-muted rounded-full text-xs font-bold uppercase tracking-wider">
                        {item.source}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-black text-primary">{item.overallRating} <span className="text-muted-foreground font-medium text-xs">/ 10</span></div>
                    </td>
                    <td className="px-4 py-4 font-medium hidden sm:table-cell">
                      {item.favoriteProduct ? item.favoriteProduct.name : '-'}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.purchaseIntent === 'Yes' ? 'bg-green-500/10 text-green-600' : item.purchaseIntent === 'No' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}`}>
                         {item.purchaseIntent || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground max-w-[150px] truncate" title={item.exactQuote || item.comment}>
                      {item.exactQuote || item.comment || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 border-t border-border/40 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Page <span className="font-bold text-foreground">{pagination.page}</span> of <span className="font-bold text-foreground">{pagination.pages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-muted/50 rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="p-2 bg-muted/50 rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {feedbacks.map((item) => (
              <div
                key={item._id}
                className="group rounded-2xl md:rounded-[2rem] bg-card border border-border/40 p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
              >
                <div className="space-y-4">
                  {/* Top line: rating, customer & source */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-foreground block">
                        {item.customerName || item.phoneNumber || 'Anonymous'}
                      </span>
                      <div className="font-black text-primary text-base">
                        {item.overallRating} <span className="text-muted-foreground font-medium text-xs">/ 10</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-muted rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {item.source}
                    </span>
                  </div>

                  {/* Comment Quote */}
                  <blockquote className="text-sm italic text-muted-foreground leading-relaxed line-clamp-4">
                    "{item.exactQuote || item.comment || 'No comment provided'}"
                  </blockquote>

                  {/* Details section */}
                  <div className="space-y-2 pt-2 border-t border-border/10">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Favorite Product</span>
                      <span className="font-bold text-foreground text-right max-w-[120px] truncate">
                        {item.favoriteProduct ? item.favoriteProduct.name : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Purchase Intent</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.purchaseIntent === 'Yes' ? 'bg-green-500/10 text-green-600' : item.purchaseIntent === 'No' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {item.purchaseIntent || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: Date */}
                <div className="pt-2 border-t border-border/10 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-card border border-border/40 rounded-3xl p-4 flex items-center justify-between shadow-sm">
            <span className="text-sm text-muted-foreground">
              Page <span className="font-bold text-foreground">{pagination.page}</span> of <span className="font-bold text-foreground">{pagination.pages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-muted/50 rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="p-2 bg-muted/50 rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
