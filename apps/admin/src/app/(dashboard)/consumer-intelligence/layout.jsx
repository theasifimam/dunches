'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, PlusCircle, List, BarChart2, BrainCircuit } from 'lucide-react';

const navItems = [
  { href: '/consumer-intelligence', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/consumer-intelligence/new', label: 'New Feedback', icon: PlusCircle },
  { href: '/consumer-intelligence/list', label: 'Feedback List', icon: List },
  { href: '/consumer-intelligence/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/consumer-intelligence/insights', label: 'AI Insights', icon: BrainCircuit },
];

export default function ConsumerIntelligenceLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-light tracking-tight text-foreground">
          Consumer <span className="text-primary italic font-black font-sans">Intelligence</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Collect, analyze, and extract insights from customer sampling and feedback.
        </p>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border/30">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all duration-200 border-b-2',
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
