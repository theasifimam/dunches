'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetProductsQuery } from '@/store/productApi';
import { useCreateFeedbackMutation } from '@/store/feedbackApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2, Check, Database, User, Smile, PlusCircle, Flame } from 'lucide-react';

import SessionSetupBanner from './components/SessionSetupBanner';
import QualitativeIntelSection from './components/QualitativeIntelSection';

const sources = ['Sampling', 'Retail Store', 'Website', 'QR', 'Amazon', 'Blinkit', 'WhatsApp', 'Instagram', 'Other'];
const ageGroups = ['< 18', '18-24', '25-34', '35-44', '45-54', '55+'];
const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
const intentOptions = ['Yes', 'Maybe', 'No'];
const booleanOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];

export default function NewFeedbackForm() {
  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({ limit: 100 });
  const [createFeedback, { isLoading: isSubmitting }] = useCreateFeedbackMutation();

  const products = productsData?.data?.products || [];
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem("dunches_feedback_draft");
      if (savedDraft) {
        try {
          return JSON.parse(savedDraft);
        } catch (e) {}
      }
      
      const savedSource = localStorage.getItem("dunches_feedback_source") || 'Sampling';
      const savedLocation = localStorage.getItem("dunches_feedback_location") || '';
      const savedEvent = localStorage.getItem("dunches_feedback_event") || '';
      const savedExecutive = localStorage.getItem("dunches_feedback_executive") || '';
      
      return {
        source: savedSource,
        samplingLocation: savedLocation,
        societyEventName: savedEvent,
        executiveName: savedExecutive,
        customerName: '',
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
        photoUrl: '',
      };
    }
    return {
      source: 'Sampling',
      samplingLocation: '',
      societyEventName: '',
      executiveName: '',
      customerName: '',
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
      photoUrl: '',
    };
  });

  // Debounced localStorage saving to prevent main thread keystroke lag
  React.useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("dunches_feedback_draft", JSON.stringify(formData));
      localStorage.setItem("dunches_feedback_source", formData.source);
      localStorage.setItem("dunches_feedback_location", formData.samplingLocation || '');
      localStorage.setItem("dunches_feedback_event", formData.societyEventName || '');
      localStorage.setItem("dunches_feedback_executive", formData.executiveName || '');
    }, 500);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductToggle = (productId) => {
    setFormData((prev) => {
      const isSelected = prev.productsTasted.includes(productId);
      const newTasted = isSelected 
        ? prev.productsTasted.filter(id => id !== productId)
        : [...prev.productsTasted, productId];
      
      let newFavorite = prev.favoriteProduct;
      if (isSelected && prev.favoriteProduct === productId) {
        newFavorite = '';
      }
      return { ...prev, productsTasted: newTasted, favoriteProduct: newFavorite };
    });
  };

  const handleResetSession = () => {
    localStorage.removeItem("dunches_feedback_source");
    localStorage.removeItem("dunches_feedback_location");
    localStorage.removeItem("dunches_feedback_event");
    localStorage.removeItem("dunches_feedback_executive");
    setFormData(prev => ({
      ...prev,
      source: 'Sampling',
      samplingLocation: '',
      societyEventName: '',
      executiveName: '',
    }));
    toast.success('Session parameters cleared.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFeedback({ ...formData, type: 'admin' }).unwrap();
      toast.success('Feedback saved successfully!');
      
      setFormData(prev => {
        const nextState = {
          ...prev,
          customerName: '',
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
          photoUrl: '',
        };
        localStorage.setItem("dunches_feedback_draft", JSON.stringify(nextState));
        return nextState;
      });
    } catch (err) {
      toast.error('Failed to save feedback.');
    }
  };

  const ChipGroup = ({ options, value, onChange, className }) => (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
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
              "px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
              isSelected 
                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
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
    <div className="max-w-2xl mx-auto bg-card border border-border/40 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 hover:scale-105 transition-all duration-300 shadow-sm shrink-0"
            title="Go to Dashboard"
          >
            <Flame className="h-4 w-4 text-primary" />
          </Link>
          <div>
            <h2 className="text-xl font-bold font-serif">Add Customer Feedback</h2>
            <p className="text-xs text-muted-foreground">Speed-optimized data entry</p>
          </div>
        </div>
        <Link
          href="/consumer-intelligence/list"
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground transition-all"
        >
          <Database className="h-3.5 w-3.5" /> Database
        </Link>
      </div>

      <SessionSetupBanner
        formData={formData}
        handleChange={handleChange}
        showSessionDetails={showSessionDetails}
        setShowSessionDetails={setShowSessionDetails}
        handleResetSession={handleResetSession}
        sources={sources}
      />
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Customer Profile */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary" /> Customer Profile
          </h3>
           
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Age Group</label>
              <ChipGroup options={ageGroups} value={formData.customerAgeGroup} onChange={(v) => handleChange('customerAgeGroup', v)} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gender</label>
              <ChipGroup options={genders} value={formData.gender} onChange={(v) => handleChange('gender', v)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customer Name</label>
              <input 
                type="text" 
                value={formData.customerName} 
                onChange={(e) => handleChange('customerName', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">First Time eating makhana?</label>
              <ChipGroup options={booleanOptions} value={formData.firstTimeMakhana} onChange={(v) => handleChange('firstTimeMakhana', v)} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phoneNumber} 
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                placeholder="+91..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Taste Matrix */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Smile className="h-3.5 w-3.5 text-primary" /> Taste Matrix & Ratings
          </h3>
           
          <div className="space-y-2">
             <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Products Tasted</label>
             {isLoadingProducts ? (
               <div className="text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin"/> Loading products...</div>
             ) : (
               <div className="flex flex-wrap gap-1.5">
                  {products.map(p => {
                    const isSelected = formData.productsTasted.includes(p._id);
                    return (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => handleProductToggle(p._id)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5",
                          isSelected 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-background border-border/60 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {p.name}
                      </button>
                    )
                  })}
               </div>
             )}
          </div>

          {formData.productsTasted.length > 0 && (
             <div className="space-y-1.5 bg-muted/20 p-3 rounded-xl border border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
               <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Favorite Flavor *</label>
               <div className="flex flex-wrap gap-1.5">
                  {products.filter(p => formData.productsTasted.includes(p._id)).map(p => (
                     <button
                        key={p._id}
                        type="button"
                        onClick={() => handleChange('favoriteProduct', p._id)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                          formData.favoriteProduct === p._id
                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                            : "bg-card border-border/60 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {p.name}
                      </button>
                  ))}
               </div>
             </div>
          )}

          <div className="space-y-2 pt-1">
             <div className="flex justify-between items-end">
               <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Overall Rating</label>
               <span className="text-xl font-black text-primary italic leading-none">{formData.overallRating} / 10</span>
             </div>
             
             <div className="grid grid-cols-10 gap-1 pt-0.5">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                 <button
                   key={num}
                   type="button"
                   onClick={() => handleChange('overallRating', num)}
                   className={cn(
                     "h-8 rounded-lg text-xs font-black transition-all border flex items-center justify-center",
                     formData.overallRating === num
                       ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                       : "bg-background border-border/60 text-muted-foreground hover:bg-muted"
                   )}
                 >
                   {num}
                 </button>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Purchase Intent</label>
              <ChipGroup options={intentOptions} value={formData.purchaseIntent} onChange={(v) => handleChange('purchaseIntent', v)} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Purchased Today?</label>
              <ChipGroup options={booleanOptions} value={formData.purchasedToday} onChange={(v) => handleChange('purchasedToday', v)} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Would Recommend?</label>
              <ChipGroup options={booleanOptions} value={formData.wouldRecommend} onChange={(v) => handleChange('wouldRecommend', v)} />
            </div>
          </div>
        </div>

        {/* Section 3: Qualitative Feedback */}
        <QualitativeIntelSection formData={formData} handleChange={handleChange} />

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            Save & Next Customer
          </button>
        </div>

      </form>
    </div>
  );
}
