'use client';

import React from 'react';
import Link from 'next/link';
import { PartyPopper } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white border border-border/50 rounded-[2.5rem] p-10 shadow-xl text-center">
        
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="h-12 w-12 text-green-500" />
        </div>

        <h1 className="text-3xl font-serif font-black mb-4 text-foreground">
          You're Awesome!
        </h1>
        
        <p className="text-muted-foreground mb-8 text-lg">
          Thanks for tasting Dunches. Your feedback helps us make the boldest, crunchiest snacks ever.
        </p>

        <Link
          href="/"
          className="inline-block w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          Explore Our Snacks
        </Link>
      </div>
    </div>
  );
}
