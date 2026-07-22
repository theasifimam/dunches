/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Megaphone, X, Loader2, Upload, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BannerFormSchema } from '@/lib/zod-schemas';
import { useCreateBannerMutation, useUpdateBannerMutation } from '@/store/bannerApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function BannerDialog({ isOpen, onOpenChange, banner }) {
    const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
    const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
    const loading = isCreating || isUpdating;
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const form = useForm({
        resolver: zodResolver(BannerFormSchema),
        defaultValues: {
            title: '',
            description: '',
            label: '',
            buttonLink: '',
            actionText: 'Shop Now',
            type: 'offer',
            status: 'Active',
            placement: 'Both',
            expiry: '',
        }
    });

    useEffect(() => {
        if (banner && isOpen) {
            form.reset({
                title: banner.title,
                description: banner.description,
                label: banner.label || '',
                buttonLink: banner.buttonLink || '',
                actionText: banner.actionText || 'Shop Now',
                type: banner.type || 'offer',
                status: banner.status,
                placement: banner.placement || 'Both',
                expiry: banner.expiry ? banner.expiry.split('T')[0] : '',
            });
            setImagePreview(banner.image.startsWith('http') ? banner.image : banner.image.startsWith('/') ? banner.image : `/${banner.image}`);
        } else if (!banner && isOpen) {
            form.reset({
                title: '',
                description: '',
                label: '',
                buttonLink: '',
                actionText: 'Shop Now',
                type: 'offer',
                status: 'Active',
                placement: 'Both',
                expiry: '',
            });
            setImagePreview(null);
        }
    }, [banner, form, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => { setImagePreview(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            if (values.label) formData.append('label', values.label);
            if (values.buttonLink) formData.append('buttonLink', values.buttonLink);
            if (values.actionText) formData.append('actionText', values.actionText);
            formData.append('type', values.type);
            formData.append('status', values.status);
            formData.append('placement', values.placement);
            if (values.expiry) formData.append('expiry', values.expiry);
            if (values.image instanceof File) {
                formData.append('image', values.image);
            } else if (!banner) {
                toast.error('Please upload an image for the new announcement.');
                return;
            }
            if (banner?.id) {
                await updateBanner({ id: banner.id, formData }).unwrap();
                toast.success('Announcement updated successfully');
            } else {
                await createBanner(formData).unwrap();
                toast.success('New announcement published');
            }
            onOpenChange(false);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.error(error?.data?.message || 'Failed to save announcement');
            console.error('Submission error:', error);
        }
    };

    const handleClose = () => { onOpenChange(false); };
    if (!isOpen) return null;

    const currentType = form.watch('type');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleClose} />

            <div className="relative w-full max-w-2xl bg-card border shadow-2xl border-primary/10 rounded-3xl md:rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 fade-in duration-500 max-h-[95vh] flex flex-col">
                <div className="absolute top-5 right-6 z-50">
                    <Button variant="ghost" size="icon" onClick={handleClose} className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all" type="button">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Dialog Header */}
                <div className="p-6 md:p-10 pb-5 flex items-center gap-5 border-b border-primary/5 bg-primary/[0.02]">
                    <div className={cn(
                        "h-14 w-14 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-colors duration-300",
                        currentType === 'announcement'
                            ? "bg-accent text-accent-foreground shadow-accent/20"
                            : "bg-primary text-primary-foreground shadow-primary/20"
                    )}>
                        {currentType === 'announcement'
                            ? <Megaphone className="h-7 w-7" />
                            : <Tag className="h-7 w-7" />
                        }
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none mb-1">
                            {banner
                                ? (banner.type === 'announcement' ? 'Edit Announcement' : 'Edit Offer')
                                : 'Create Announcement / Offer'
                            }
                        </h3>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-70">
                            {banner ? 'Update content & settings' : 'Publish to Hero Slider · Mobile Promo'}
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
                        <ScrollArea className="flex-1 h-full w-full overflow-y-auto px-8 md:px-12 py-6">
                            <div className="space-y-6">

                                {/* Image Upload */}
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cover Image</div>
                                    <div onClick={() => fileInputRef.current?.click()} className="relative h-64 rounded-2xl border-2 border-dashed border-primary/20 bg-muted/30 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
                                        {imagePreview ? (<>
                                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                    <Upload className="h-4 w-4" /> Change Image
                                                </span>
                                            </div>
                                        </>) : (
                                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                                <div className="h-12 w-12 rounded-xl bg-background shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:text-primary transition-all">
                                                    <Upload className="h-5 w-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Click to upload High-Res Image</span>
                                            </div>
                                        )}
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                                    </div>
                                </div>

                                {/* Type & Placement */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="type" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-primary/10 focus:ring-primary/20">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="offer">🏷️ Special Offer</SelectItem>
                                                    <SelectItem value="announcement">📣 Announcement</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="placement" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Placement</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-primary/10 focus:ring-primary/20">
                                                        <SelectValue placeholder="Where to show" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Both">🌐 Both (Slider + Mobile)</SelectItem>
                                                    <SelectItem value="Hero Slider">🖥️ Desktop Hero Slider only</SelectItem>
                                                    <SelectItem value="Mobile Promo">📱 Mobile Promo only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                {/* Title & Label */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="title" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title / Heading</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Flat 20% on Sweet Bundles" className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="label" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Badge Label (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. New Arrival · Bundle Deal" className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                {/* Description */}
                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe the offer or announcement in detail..." className="min-h-[100px] rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20 resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Link & CTA Text */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="buttonLink" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Destination Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="/explore?category=Spicy" className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="actionText" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">CTA Button Text</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Shop Now · View Deal" className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                {/* Status & Expiry */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="status" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-primary/10 focus:ring-primary/20">
                                                        <SelectValue placeholder="Select a status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Active">✅ Active</SelectItem>
                                                    <SelectItem value="Inactive">⏸️ Inactive</SelectItem>
                                                    <SelectItem value="Scheduled">🕐 Scheduled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="expiry" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expiry Date (Optional)</FormLabel>
                                            <FormControl>
                                                <Input type="date" className="h-12 rounded-xl bg-muted/50 border-primary/10 focus-visible:ring-primary/20" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                            </div>
                        </ScrollArea>

                        <div className="p-6 md:p-8 border-t border-primary/5 bg-primary/[0.01] flex items-center justify-between">
                            <Button type="button" variant="ghost" onClick={handleClose} className="text-[9px] font-black uppercase tracking-widest hover:text-primary transition-colors rounded-full">
                                Discard
                            </Button>
                            <Button type="submit" disabled={loading} variant="signature" size="lg" className="min-w-[150px] rounded-full">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-[10px] font-black uppercase tracking-[0.2em]">Publish</span>}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
