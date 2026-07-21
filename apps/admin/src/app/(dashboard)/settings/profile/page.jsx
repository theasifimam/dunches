/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { Store, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/admin/PageHeader';

export default function ProfilePage() {
    return (<div className="space-y-6 md:space-y-12 pb-10">
            <PageHeader badgeIcon={Store} badgeText="Boutique Identity" titleMain="Dunches" titleAccent="Profile" description="Defining the global signature of Dunches. Manage your snack boutique's details and organic footprint." actionIcon={Save} actionLabel="Save Profile" onAction={() => console.log('Saving profile...')}/>

            <div className="mx-auto space-y-6 md:space-y-10 px-0">
                <div className="p-4 md:p-10 rounded-2xl md:rounded-[3.5rem] bg-card border shadow-sm border-primary/5 space-y-6 md:space-y-10 group/section">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner group-hover/section:scale-110 transition-transform">
                            <Store className="h-6 w-6 md:h-7 md:w-7"/>
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic leading-none mb-1">Corporate DNA</h3>
                            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Global branding parameters</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-2 md:pt-4">
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Brand Designation</label>
                            <Input defaultValue="Dunches Cravings" className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/20 border-none px-6 md:px-8 font-black italic tracking-tight text-base md:text-lg shadow-sm"/>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Archive Contact</label>
                            <Input defaultValue="care@dunches.com" className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/20 border-none px-6 md:px-8 font-black tracking-tight text-base md:text-lg shadow-sm"/>
                        </div>
                        <div className="md:col-span-2 space-y-2 md:space-y-3">
                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Vision Statement</label>
                            <textarea className="w-full h-32 md:h-40 p-4 md:p-10 rounded-xl md:rounded-[2.5rem] bg-muted/20 border-none font-black italic tracking-tight text-sm md:text-base shadow-sm outline-none resize-none leading-relaxed" defaultValue="Premium organic roasted lotus seeds and clean chips heavily dusted with hand-crafted hot spices. Bold, fiery crunch for late-night cravings."/>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}
