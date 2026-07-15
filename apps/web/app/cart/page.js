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
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "@/components/AuthModal";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = React.useState(false);
  const [user, setUser] = React.useState(null);

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

  const handleLoginSuccess = (mockUser) => {
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    setIsAuthOpen(false);
    setIsCheckoutSuccess(true);
  };

  const handleCheckout = () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setIsAuthOpen(true);
    } else {
      setIsCheckoutSuccess(true);
    }
  };

  const tax = cartTotal * 0.05; // 5% GST
  const grandTotal = cartTotal + tax;

  if (isCheckoutSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-28 pb-32 px-4 text-center relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 max-w-lg mx-auto p-10 glass border border-border/50 rounded-[3rem] shadow-2xl"
        >
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 mx-auto relative">
            <CheckCircle2 className="w-12 h-12 text-green-500 animate-pulse" />
          </div>

          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 block">
            Order Confirmed
          </span>
          <h1 className="text-4xl md:text-5xl font-light font-serif mb-6 tracking-tighter text-foreground lowercase">
            wellness is on its way.
          </h1>

          <p className="text-foreground/50 mb-8 text-md font-light leading-relaxed">
            Thank you for choosing makhāna. Your organic roasted superfood packs
            are being packaged and prepared for dispatch.
          </p>

          <div className="border-t border-b border-border/50 py-6 mb-8 space-y-4 text-left text-sm font-light">
            <div className="flex justify-between">
              <span className="text-foreground/45">Amount Paid</span>
              <span className="font-serif font-bold text-primary text-lg">
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/45">Estimated Delivery</span>
              <span className="font-serif text-foreground font-bold">
                3 - 5 Business Days
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1 rounded-full h-16 text-xs font-bold tracking-widest uppercase shadow-xl"
              onClick={() => {
                dispatch(clearCart());
                window.location.href = "/menu";
              }}
            >
              Continue Snacking
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-full h-16 text-xs font-bold tracking-widest uppercase border-2 border-primary/20 hover:bg-primary/5 text-foreground"
              onClick={() => {
                dispatch(clearCart());
                window.location.href = "/profile";
              }}
            >
              View Profile
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-28 pb-32 px-4 text-center relative overflow-hidden bg-background">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.05] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[100vw] border border-primary/20 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-primary/10 rounded-full animate-pulse delay-500" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="w-40 h-40 bg-foreground/3 rounded-full flex items-center justify-center mb-10 mx-auto relative group">
            <ShoppingBag
              className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-700"
              strokeWidth={1}
            />
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter font-heading text-foreground">
            Your Cart <br /> is{" "}
            <span className="text-primary italic font-serif">Empty.</span>
          </h1>

          <p className="text-foreground/40 mb-12 max-w-sm mx-auto text-xl font-medium leading-relaxed">
            Our delicious organic superfood snacks are waiting to be explored.
          </p>

          <Link href="/menu">
            <Button
              size="lg"
              className="rounded-full px-16 h-20 text-xl font-black tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-4"
            >
              EXPLORE SHOP <ArrowLeft className="w-6 h-6 rotate-180" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-40 relative">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              className="h-14 px-8 text-foreground/40 hover:text-red-500 transition-all group font-black uppercase tracking-widest text-xs"
              onClick={() => dispatch(clearCart())}
            >
              <Trash2 className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
              <span>Clear Cart</span>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-10">
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
              className="pt-10"
            >
              <Link
                href="/menu"
                className="inline-flex items-center gap-4 text-foreground/40 hover:text-primary transition-all font-black tracking-widest text-[10px] uppercase group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                Return to menu archive
              </Link>
            </motion.div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4 mt-20 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-foreground text-background rounded-[3rem] p-10 sticky top-32 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

              <h2 className="text-4xl font-black mb-12 tracking-tighter font-heading border-b border-background/10 pb-8">
                The Balance.
              </h2>

              <div className="space-y-8 mb-16">
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-xs font-black tracking-widest uppercase">
                    Archive Total
                  </span>
                  <span className="text-2xl font-black font-heading">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-xs font-black tracking-widest uppercase">
                    Levies & Taxes
                  </span>
                  <span className="text-2xl font-black font-heading">
                    ₹{tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-black tracking-widest uppercase opacity-60">
                      Logistic Fee
                    </span>
                    <span className="text-[10px] text-primary italic font-serif mt-1">
                      Complimentary Service
                    </span>
                  </div>
                  <span className="text-primary italic font-serif text-2xl">
                    Free
                  </span>
                </div>
              </div>

              <div className="border-t border-background/10 pt-10 mb-16">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black tracking-widest uppercase opacity-30">
                    Final Invoice
                  </span>
                  <span className="text-5xl font-black text-primary tracking-tighter font-heading">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <Button
                  size="lg"
                  className="w-full h-20 text-xl rounded-4xl shadow-2xl font-black tracking-widest uppercase hover:scale-[1.02] transition-all active:scale-[0.98] group relative overflow-hidden"
                  onClick={handleCheckout}
                >
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    <CreditCard className="w-6 h-6" />
                    Checkout
                  </div>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>

                <div className="flex items-center justify-center gap-3 opacity-20 py-2">
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

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
