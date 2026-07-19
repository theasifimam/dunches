'use client';

import React, { useState } from 'react';
import { useGetFeedbacksQuery } from '@/store/feedbackApi';
import { Loader2, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [source, setSource] = useState('');
  
  const { data, isLoading, isFetching } = useGetFeedbacksQuery({
    page,
    limit: 10,
    source: source !== 'All' ? source : '',
  });

  const feedbacks = data?.data?.feedbacks || [];
  const pagination = data?.data?.pagination || { page: 1, pages: 1 };

  return (
    <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif">Feedback Database</h2>
          <p className="text-sm text-muted-foreground">Review all collected consumer data</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-4 py-2 bg-background border border-border/60 rounded-full text-sm font-medium appearance-none min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All Sources</option>
              <option value="Sampling">Sampling</option>
              <option value="QR">QR</option>
              <option value="Retail Store">Retail Store</option>
              <option value="Website">Website</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 text-muted-foreground font-semibold">
            <tr>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Source</th>
              <th className="px-4 py-4">Rating</th>
              <th className="px-4 py-4 hidden sm:table-cell">Favorite Product</th>
              <th className="px-4 py-4 hidden md:table-cell">Intent</th>
              <th className="px-4 py-4">Quote</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                  Loading feedback...
                </td>
              </tr>
            ) : feedbacks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No feedback entries found.
                </td>
              </tr>
            ) : (
              feedbacks.map((item) => (
                <tr key={item._id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
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
              ))
            )}
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
  );
}
