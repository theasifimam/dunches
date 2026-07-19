'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProductsQuery } from '@/store/productApi';
import { useCreateFeedbackMutation } from '@/store/feedbackApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2, Check } from 'lucide-react';

const sources = ['Sampling', 'Retail Store', 'Website', 'QR', 'Amazon', 'Blinkit', 'WhatsApp', 'Instagram', 'Other'];
const ageGroups = ['< 18', '18-24', '25-34', '35-44', '45-54', '55+'];
const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
const intentOptions = ['Yes', 'Maybe', 'No'];
const booleanOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];

export default function NewFeedbackForm() {
  const router = useRouter();
  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({ limit: 100 });
  const [createFeedback, { isLoading: isSubmitting }] = useCreateFeedbackMutation();
// ... (rest is same, but let's replace exact handleSubmit next or do it in the same block. Wait, let's keep the block localized, we'll replace lines 3-19 and then lines 66-89)

  const products = productsData?.data?.products || [];

  const [formData, setFormData] = useState({
    source: 'Sampling',
    samplingLocation: '',
    societyEventName: '',
    executiveName: '',
    customerAgeGroup: '25-34',
    gender: '',
    firstTimeMakhana: null,
    productsTasted: [],
    favoriteProduct: '',
    overallRating: 8,
    purchaseIntent: '',
    purchasedToday: null,
    purchasedSKU: '',
    expectedPrice: '',
    bestThing: '',
    worstThing: '',
    exactQuote: '',
    suggestedNewFlavor: '',
    wouldRecommend: null,
    phoneNumber: '',
    photoUrl: '', // Optional for now
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductToggle = (productId) => {
    setFormData((prev) => {
      const isSelected = prev.productsTasted.includes(productId);
      const newTasted = isSelected 
        ? prev.productsTasted.filter(id => id !== productId)
        : [...prev.productsTasted, productId];
      
      // Reset favorite product if it was unselected
      let newFavorite = prev.favoriteProduct;
      if (isSelected && prev.favoriteProduct === productId) {
        newFavorite = '';
      }
      return { ...prev, productsTasted: newTasted, favoriteProduct: newFavorite };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFeedback({ ...formData, type: 'admin' }).unwrap();
      toast.success('Feedback saved successfully!');
      router.push('/consumer-intelligence/list');
    } catch (err) {
      toast.error('Failed to save feedback.');
    }
  };

  const ChipGroup = ({ options, value, onChange, className }) => (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const isSelected = value === (opt.value !== undefined ? opt.value : opt);
        const label = opt.label || opt;
        const val = opt.value !== undefined ? opt.value : opt;
        
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(val)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-colors border",
              isSelected 
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" 
                : "bg-card border-border/60 text-muted-foreground hover:bg-muted"
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-card border border-border/40 rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
      <h2 className="text-2xl font-serif font-bold mb-6">New Feedback Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Source & Location */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">1. Context</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Source *</label>
            <ChipGroup options={sources} value={formData.source} onChange={(v) => handleChange('source', v)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Location</label>
              <input 
                type="text" 
                value={formData.samplingLocation} 
                onChange={(e) => handleChange('samplingLocation', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Select Citywalk"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Event / Society Name</label>
              <input 
                type="text" 
                value={formData.societyEventName} 
                onChange={(e) => handleChange('societyEventName', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. DLF Phase 1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Executive Name</label>
              <input 
                type="text" 
                value={formData.executiveName} 
                onChange={(e) => handleChange('executiveName', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Your Name"
              />
            </div>
          </div>
        </section>

        <hr className="border-border/40" />

        {/* Customer Details */}
        <section className="space-y-4">
           <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">2. Customer Details</h3>
           
           <div className="space-y-2">
            <label className="text-sm font-medium">Age Group</label>
            <ChipGroup options={ageGroups} value={formData.customerAgeGroup} onChange={(v) => handleChange('customerAgeGroup', v)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <ChipGroup options={genders} value={formData.gender} onChange={(v) => handleChange('gender', v)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">First Time Eating Makhana?</label>
            <ChipGroup options={booleanOptions} value={formData.firstTimeMakhana} onChange={(v) => handleChange('firstTimeMakhana', v)} />
          </div>

          <div className="space-y-1 max-w-sm">
            <label className="text-xs font-medium">Phone Number (Optional)</label>
            <input 
              type="tel" 
              value={formData.phoneNumber} 
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className="w-full bg-background border border-border/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="+91..."
            />
          </div>
        </section>

        <hr className="border-border/40" />

        {/* Products & Rating */}
        <section className="space-y-4">
           <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">3. Product Feedback</h3>
           
           <div className="space-y-2">
             <label className="text-sm font-medium">Products Tasted (Multi-select)</label>
             {isLoadingProducts ? (
               <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Loading products...</div>
             ) : (
               <div className="flex flex-wrap gap-2">
                  {products.map(p => {
                    const isSelected = formData.productsTasted.includes(p._id);
                    return (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => handleProductToggle(p._id)}
                        className={cn(
                          "px-4 py-2 rounded-2xl text-sm font-semibold transition-all border flex items-center gap-2",
                          isSelected 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-background border-border/60 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {isSelected && <Check className="h-4 w-4" />}
                        {p.name}
                      </button>
                    )
                  })}
               </div>
             )}
           </div>

           {formData.productsTasted.length > 0 && (
             <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border/40">
               <label className="text-sm font-medium">Favorite Product</label>
               <div className="flex flex-wrap gap-2">
                  {products.filter(p => formData.productsTasted.includes(p._id)).map(p => (
                     <button
                        key={p._id}
                        type="button"
                        onClick={() => handleChange('favoriteProduct', p._id)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-semibold transition-colors border",
                          formData.favoriteProduct === p._id
                            ? "bg-primary text-primary-foreground border-primary shadow-md" 
                            : "bg-card border-border/60 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {p.name}
                      </button>
                  ))}
               </div>
             </div>
           )}

           <div className="space-y-3">
             <div className="flex justify-between items-end">
               <label className="text-sm font-medium">Overall Rating (1-10)</label>
               <span className="text-2xl font-black text-primary">{formData.overallRating}</span>
             </div>
             <input 
               type="range" 
               min="1" 
               max="10" 
               value={formData.overallRating}
               onChange={(e) => handleChange('overallRating', parseInt(e.target.value))}
               className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
             />
             <div className="flex justify-between text-xs text-muted-foreground font-bold">
                <span>1 - Terrible</span>
                <span>10 - Amazing</span>
             </div>
           </div>

           <div className="space-y-2">
            <label className="text-sm font-medium">Purchase Intent</label>
            <ChipGroup options={intentOptions} value={formData.purchaseIntent} onChange={(v) => handleChange('purchaseIntent', v)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Purchased Today?</label>
            <ChipGroup options={booleanOptions} value={formData.purchasedToday} onChange={(v) => handleChange('purchasedToday', v)} />
          </div>
        </section>

        <hr className="border-border/40" />

        {/* Qualitative */}
        <section className="space-y-4">
           <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">4. Qualitative Feedback</h3>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Best Thing (Short text)</label>
                <input 
                  type="text" 
                  value={formData.bestThing} 
                  onChange={(e) => handleChange('bestThing', e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Worst Thing (Short text)</label>
                <input 
                  type="text" 
                  value={formData.worstThing} 
                  onChange={(e) => handleChange('worstThing', e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
           </div>

           <div className="space-y-1">
              <label className="text-xs font-medium">Exact Customer Quote</label>
              <textarea 
                value={formData.exactQuote} 
                onChange={(e) => handleChange('exactQuote', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px] resize-y"
                placeholder='"It is so crunchy!"'
              />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Suggested New Flavor</label>
                <input 
                  type="text" 
                  value={formData.suggestedNewFlavor} 
                  onChange={(e) => handleChange('suggestedNewFlavor', e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Expected Price (₹)</label>
                <input 
                  type="number" 
                  value={formData.expectedPrice} 
                  onChange={(e) => handleChange('expectedPrice', e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
           </div>

           <div className="space-y-2">
            <label className="text-sm font-medium">Would Recommend?</label>
            <ChipGroup options={booleanOptions} value={formData.wouldRecommend} onChange={(v) => handleChange('wouldRecommend', v)} />
          </div>
        </section>

        {/* Submit */}
        <div className="pt-4 pb-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-4 rounded-full font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
            Save Feedback
          </button>
        </div>

      </form>
    </div>
  );
}
