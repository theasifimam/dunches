"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClearCartDialog from "@/components/ClearCartDialog";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [isClearCartOpen, setIsClearCartOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.warn("localStorage is not accessible:", error);
    }
  }, []);

  const handleCheckout = () => {
    // Navigate to /checkout — handles auth + address + payment steps
    window.location.href = "/checkout";
  };

  const tax = cartTotal * 0.05; // 5% GST
  const grandTotal = cartTotal + tax;



  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-32 px-5 text-center relative overflow-hidden bg-background">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.05] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[100vw] border border-primary/20 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-primary/10 rounded-full animate-pulse delay-500" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="w-28 h-28 md:w-40 md:h-40 bg-foreground/3 rounded-full flex items-center justify-center mb-6 md:mb-10 mx-auto relative group">
            <ShoppingBag
              className="w-12 h-12 md:w-16 md:h-16 text-primary group-hover:scale-110 transition-transform duration-700"
              strokeWidth={1}
            />
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-8xl font-extrabold mb-4 md:mb-6 tracking-tight text-foreground font-sans lowercase leading-tight">
            Your Cart <br className="hidden md:inline" /> is{" "}
            <span className="text-primary italic font-serif">Empty.</span>
          </h1>

          <p className="text-foreground/40 mb-8 md:mb-12 max-w-xs sm:max-w-sm mx-auto text-xs sm:text-sm md:text-xl font-medium leading-relaxed">
            Our delicious organic superfood snacks are waiting to be explored.
          </p>

          <Link href="/menu">
            <Button
              className="rounded-full px-8 md:px-16 h-12 md:h-20 text-xs md:text-xl font-bold tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg md:shadow-2xl flex items-center gap-3 justify-center mx-auto uppercase"
            >
              EXPLORE SHOP <ArrowLeft className="w-4 h-4 md:w-6 md:h-6 rotate-180" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-40 relative">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-20 gap-8">
          {/* Mobile App Title Slogan (Tailored Trends Style) */}
          <div className="flex flex-col mb-4 md:hidden">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans lowercase leading-none">
              shopping cart,
            </h1>
            <p className="text-[19px] text-foreground/45 font-serif italic lowercase leading-tight mt-1">
              your selection.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 hidden md:block"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-border">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                Checkout Summary
              </span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black font-heading tracking-tighter leading-none">
              Your <br />
              <span className="text-foreground/30 italic font-serif opacity-30">
                Cart Selection.
              </span>
            </h1>
          </motion.div>


        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="group relative flex flex-row gap-4 md:gap-10 p-4 md:p-8 rounded-3xl md:rounded-[2.5rem] glass border-border/50 hover:bg-foreground/2 transition-all duration-700 modern-shadow items-center md:items-stretch"
                >
                  {/* Item Image */}
                  <div className="relative w-20 h-20 md:w-56 md:h-56 rounded-2xl md:rounded-4xl overflow-hidden shadow-lg md:shadow-2xl shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between py-1 md:py-2 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5 md:space-y-1 min-w-0 pr-2">
                        <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-widest text-primary opacity-60">
                          Culinary Piece
                        </span>
                        <h3 className="text-sm md:text-4xl font-black tracking-tight text-foreground font-heading truncate md:normal-case">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs md:text-sm font-bold text-primary">₹{item.price}</span>
                          <span className="text-[10px] md:text-xs line-through text-foreground/30">₹{Math.round(item.price * 1.15)}</span>
                          <span className="text-[8px] md:text-[10px] text-green-500 font-bold tracking-wider uppercase bg-green-500/10 px-1.5 py-0.5 rounded-md">15% OFF</span>
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="w-8 h-8 md:w-12 md:h-12 rounded-full glass border border-border flex items-center justify-center text-foreground/20 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 md:mt-8">
                      <div className="flex items-center gap-3 md:gap-6 glass p-1 md:p-2 rounded-full border border-border shrink-0">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: Math.max(1, item.quantity - 1),
                              }),
                            )
                          }
                          className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <Minus className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <span className="w-4 md:w-6 text-center text-xs md:text-xl font-black font-heading">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                          className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>

                      <div className="text-right hidden md:block">
                        <span className="text-xs font-black uppercase tracking-widest opacity-30 mb-1 block">
                          Total Value
                        </span>
                        <span className="text-3xl font-black text-primary tracking-tighter">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="text-right md:hidden flex flex-col items-end">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Total</span>
                        <span className="text-sm font-black text-primary">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              {/* Mobile Summary Breakdown (Visible only on mobile) */}
              <div className="lg:hidden mt-10 pt-8 border-t border-border/20 space-y-4">
                <div className="flex justify-between items-center text-foreground/50">
                  <span className="text-[10px] font-black uppercase tracking-wider">Subtotal</span>
                  <span className="text-sm font-bold">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-foreground/50">
                  <span className="text-[10px] font-black uppercase tracking-wider">Taxes (5% GST)</span>
                  <span className="text-sm font-bold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-foreground/50">
                  <span className="text-[10px] font-black uppercase tracking-wider">Delivery Fee</span>
                  <span className="text-primary italic font-serif text-sm">Free</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-border/10">
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Grand Total</span>
                  <span className="text-xl font-black text-primary">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-10 flex flex-col md:flex-row gap-6 items-center justify-between border-t border-border/30 mt-10 w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-3 text-foreground/50 hover:text-primary transition-all font-black tracking-widest text-[10px] uppercase group py-4 px-8 rounded-full border border-border/60 bg-foreground/2 hover:bg-foreground/5 justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                    Back to Menu
                  </Link>

                  <Button
                    variant="outline"
                    className="h-14 px-6 text-foreground/45 hover:text-red-500 hover:bg-red-500/5 transition-all group font-black uppercase tracking-widest text-[10px] rounded-full border-border/60 justify-center w-full sm:w-auto"
                    onClick={() => setIsClearCartOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Clear Cart
                  </Button>
                </div>

                <Button
                  className="w-full md:w-auto h-14 px-8 text-xs rounded-full shadow-lg font-bold tracking-widest uppercase hover:scale-[1.02] transition-all active:scale-[0.98] group relative overflow-hidden"
                  onClick={handleCheckout}
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Checkout • ₹{grandTotal.toLocaleString()}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Checkout Summary (Visible only on desktop) */}
          <div className="hidden lg:block lg:col-span-4 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-foreground text-background rounded-3xl md:rounded-[3rem] p-6 md:p-10 sticky top-32 shadow-xl md:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

              <h2 className="text-2xl md:text-4xl font-extrabold mb-8 md:mb-12 tracking-tight border-b border-background/10 pb-4 md:pb-8">
                The Balance.
              </h2>

              <div className="space-y-4 md:space-y-8 mb-8 md:mb-16">
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase">
                    Archive Total
                  </span>
                  <span className="text-lg md:text-2xl font-bold">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase">
                    Levies & Taxes
                  </span>
                  <span className="text-lg md:text-2xl font-bold">
                    ₹{tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase opacity-60">
                      Logistic Fee
                    </span>
                    <span className="text-[8px] md:text-[10px] text-primary italic font-serif mt-0.5">
                      Complimentary Service
                    </span>
                  </div>
                  <span className="text-primary italic font-serif text-lg md:text-2xl">
                    Free
                  </span>
                </div>
              </div>

              <div className="border-t border-background/10 pt-6 md:pt-10 mb-8 md:mb-16">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase opacity-30">
                    Final Invoice
                  </span>
                  <span className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-center gap-3 opacity-20 py-2 border-t border-background/10 pt-6">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                    256-BIT ENCRYPTED
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>



      <ClearCartDialog
        isOpen={isClearCartOpen}
        onClose={() => setIsClearCartOpen(false)}
        onConfirm={() => dispatch(clearCart())}
      />
    </div>
  );
}
