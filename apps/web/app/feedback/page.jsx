'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Loader2, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicFeedbackPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    favoriteProduct: '',
    overallRating: 0,
    purchaseIntent: '',
    comment: '',
    source: 'QR', // Default for public form
    type: 'public',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/v1/products?limit=100');
        const data = await res.json();
        if (data?.data?.products) {
          setProducts(data.data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const selectedProduct = products.find(p => p._id === formData.favoriteProduct);

  const handleRating = (rating) => {
    setFormData(prev => ({ ...prev, overallRating: rating }));
  };

  const handleIntent = (intent) => {
    setFormData(prev => ({ ...prev, purchaseIntent: intent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.favoriteProduct) {
      setError('Please select a product.');
      return;
    }
    if (formData.overallRating === 0) {
      setError('Please provide a rating.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        overallRating: formData.overallRating * 2, // Map 1-5 to 2-10 for unified analytics
      };
      
      const res = await fetch('/api/v1/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to submit');
      
      router.push('/feedback/thank-you');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-white border border-border/50 rounded-[2.5rem] p-8 shadow-xl">
        <div className="text-center mb-8">
           <h1 className="text-2xl font-serif font-black mb-2 text-foreground">How was it?</h1>
           <p className="text-muted-foreground text-sm">Takes less than 15 seconds.</p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Product Selection */}
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-foreground">Which product did you taste?</label>
            
            <div 
              className="w-full bg-background border border-border/80 rounded-2xl px-4 py-3.5 text-sm font-medium flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={selectedProduct ? 'text-foreground' : 'text-muted-foreground'}>
                {isLoadingProducts ? 'Loading...' : selectedProduct ? selectedProduct.name : 'Select a flavor...'}
              </span>
              <div className="w-5 h-5 flex items-center justify-center shrink-0 text-muted-foreground">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Dropdown with Search */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border/80 rounded-2xl shadow-xl z-50 overflow-hidden">
                 <div className="p-3 border-b border-border/40 relative">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <input
                     type="text"
                     placeholder="Search flavors..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-muted/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                   />
                 </div>
                 <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin">
                   {filteredProducts.length === 0 ? (
                     <div className="p-4 text-center text-sm text-muted-foreground">No flavors found.</div>
                   ) : (
                     filteredProducts.map(p => (
                       <button
                         key={p._id}
                         type="button"
                         onClick={() => {
                           setFormData(prev => ({ ...prev, favoriteProduct: p._id, productsTasted: [p._id] }));
                           setIsDropdownOpen(false);
                           setSearchQuery('');
                         }}
                         className={cn(
                           "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex justify-between items-center",
                           formData.favoriteProduct === p._id ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                         )}
                       >
                         {p.name}
                         {formData.favoriteProduct === p._id && <Check className="h-4 w-4" />}
                       </button>
                     ))
                   )}
                 </div>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-3 text-center">
             <label className="text-sm font-bold text-foreground">Rate your experience</label>
             <div className="flex justify-center gap-2">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button
                   key={star}
                   type="button"
                   onClick={() => handleRating(star)}
                   className="p-1 transition-transform hover:scale-110 active:scale-95"
                 >
                   <Star 
                     className={cn(
                       "h-10 w-10 transition-colors", 
                       formData.overallRating >= star 
                         ? "fill-amber-400 text-amber-400 drop-shadow-md" 
                         : "fill-muted text-muted"
                     )} 
                   />
                 </button>
               ))}
             </div>
          </div>

          {/* Purchase Intent */}
          <div className="space-y-3">
             <label className="text-sm font-bold text-foreground block text-center">Would you buy this?</label>
             <div className="flex justify-center gap-3">
               {['Yes', 'Maybe', 'No'].map((intent) => (
                 <button
                   key={intent}
                   type="button"
                   onClick={() => handleIntent(intent)}
                   className={cn(
                     "px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2",
                     formData.purchaseIntent === intent
                       ? "border-primary bg-primary/10 text-primary scale-105"
                       : "border-border/50 bg-background text-muted-foreground hover:bg-muted"
                   )}
                 >
                   {intent}
                 </button>
               ))}
             </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Anything else? (Optional)</label>
            <textarea
               value={formData.comment}
               onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
               className="w-full bg-background border border-border/80 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px] resize-none"
               placeholder="Tell us what you liked or hated..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit Feedback'}
          </button>

        </form>
      </div>
    </div>
  );
}
