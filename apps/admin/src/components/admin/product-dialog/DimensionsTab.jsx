import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';

export function DimensionsTab({ control }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary ml-1">Nutritional Values (per 100g)</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <FormField control={control} name="nutritionalValues.calories" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Energy yield per 100g." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Calories (kcal)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 rounded-2xl bg-muted/30 border-none font-bold px-4 text-center"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={control} name="nutritionalValues.protein" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Protein content in grams." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Protein (g)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 rounded-2xl bg-muted/30 border-none font-bold px-4 text-center"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={control} name="nutritionalValues.carbohydrates" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Carbohydrates content in grams." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Carbs (g)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 rounded-2xl bg-muted/30 border-none font-bold px-4 text-center"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={control} name="nutritionalValues.fat" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Total lipids/fat content in grams." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Fat (g)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 rounded-2xl bg-muted/30 border-none font-bold px-4 text-center"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={control} name="nutritionalValues.fiber" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Dietary fiber content in grams." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Fiber (g)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 rounded-2xl bg-muted/30 border-none font-bold px-4 text-center"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        </div>
    );
}
