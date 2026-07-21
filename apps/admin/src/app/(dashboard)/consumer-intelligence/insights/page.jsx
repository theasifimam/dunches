import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Sparkles, AlertCircle, Flame } from 'lucide-react';

export default function AIInsights() {
  return (
    <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm relative">
      {/* Sample Badge */}
      <div className="absolute top-6 right-6 bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 z-10">
        <Sparkles className="h-3 w-3" />
        Sample
      </div>

      <div className="p-4 md:p-8 lg:p-12">
        <div className="max-w-2xl">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
            <BrainCircuit className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 hover:scale-105 transition-all duration-300 shadow-sm shrink-0"
              title="Go to Dashboard"
            >
              <Flame className="h-4 w-4 text-primary" />
            </Link>
            <h2 className="text-3xl font-serif font-bold leading-none">
              AI Consumer Insights
            </h2>
          </div>
          <p className="text-muted-foreground mb-8 text-lg">
            Our AI engine continuously analyzes qualitative feedback, exact quotes, and ratings to uncover hidden patterns and suggest actionable business strategies.
          </p>

          <div className="space-y-6 opacity-70 pointer-events-none">
             <div className="bg-background border border-border/50 p-4 md:p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <TrendingIcon className="h-5 w-5 text-green-500" />
                  Trending: Savory Preference in 25-34 Age Group
                </h3>
                <p className="text-sm text-muted-foreground">
                  Over the last 30 days, customers aged 25-34 sampling at retail locations showed a 40% higher preference for Savory profiles compared to the baseline. Consider pushing targeted social media ads for Savory variants to this demographic.
                </p>
             </div>

             <div className="bg-background border border-border/50 p-4 md:p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Pricing Sensitivity Alert
                </h3>
                <p className="text-sm text-muted-foreground">
                  Expected price inputs for "Sweet Glaze Makhana" average ₹85, which is below the current retail price of ₹120. Conversion rate (Purchase Intent) from sampling is lower for this product. Consider a promotional bundle.
                </p>
             </div>
          </div>
          
          <div className="mt-8 md:mt-12 p-4 md:p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4">
             <Sparkles className="h-6 w-6 text-primary shrink-0" />
             <p className="text-sm font-medium text-foreground">
               This feature is currently in development. Soon you will be able to generate on-demand AI reports based on your live database.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendingIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
