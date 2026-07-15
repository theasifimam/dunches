import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';

export function SpecsTab({ control }) {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={control} name="type" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The category archetype of this snack." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Archetype</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                                <SelectTrigger className="h-11 w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs">
                                    <SelectValue placeholder="Select type"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10">
                                <SelectItem value="makhana">Makhāna</SelectItem>
                                <SelectItem value="chips">Healthy Chips</SelectItem>
                                <SelectItem value="nuts">Nuts & Berries</SelectItem>
                                <SelectItem value="seeds">Roasted Seeds</SelectItem>
                                <SelectItem value="assortments">Assortments / Gifts</SelectItem>
                                <SelectItem value="other">Other Snacks</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={control} name="flavorProfile" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Flavor profiles catalog classifications." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Flavor Profile</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                                <SelectTrigger className="h-11 w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs">
                                    <SelectValue placeholder="Select flavor"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10">
                                <SelectItem value="Classic">Classic</SelectItem>
                                <SelectItem value="Savory">Savory</SelectItem>
                                <SelectItem value="Spicy">Spicy</SelectItem>
                                <SelectItem value="Sweet">Sweet</SelectItem>
                                <SelectItem value="Assortments">Assortments</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={control} name="netWeight" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Net quantity of product inside each packet (in grams)." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Net Weight (g)</FormLabel>
                        <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="e.g. 80" 
                              className="w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs h-11"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={control} name="shelfLife" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Product freshness guarantee duration." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Shelf Life</FormLabel>
                        <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g. 6 Months" 
                              className="w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs h-11"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={control} name="ingredients" render={({ field }) => (
                    <FormItem className="space-y-3 md:col-span-2">
                        <FormLabel tooltip="Ingredients list of this product, separated by commas." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Ingredients (Comma-separated)</FormLabel>
                        <FormControl>
                            <Input 
                              value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''} 
                              onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} 
                              placeholder="e.g. Organic Lotus Seeds, Pink Salt, Olive Oil" 
                              className="w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs h-11"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        </div>
    );
}
