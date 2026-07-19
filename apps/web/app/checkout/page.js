"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectCartHydrated,
} from "@/features/cart/cartSlice";
import {
  fetchProfile,
  addAddress,
  selectUser,
} from "@/features/user/userSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import AuthStep from "./components/AuthStep";
import AddressStep from "./components/AddressStep";
import PaymentStep from "./components/PaymentStep";
import SuccessScreen from "./components/SuccessScreen";

export default function CheckoutPage() {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartHydrated = useSelector(selectCartHydrated);
  const reduxUser = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Initialise synchronously from localStorage — avoids the auth step flash
  // for users who are already logged in
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [step, setStep] = useState(() => {
    try {
      return localStorage.getItem("user") ? 2 : 1;
    } catch {
      return 1;
    }
  });

  const [address, setAddress] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  // Only redirect to cart AFTER hydration — avoids kicking user out
  // before localStorage cart items have been loaded into Redux state
  useEffect(() => {
    if (cartHydrated && !orderResult && cartItems.length === 0) {
      window.location.href = "/cart";
    }
  }, [cartHydrated, cartItems, orderResult]);

  if (orderResult) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-40 px-6 relative">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
        <SuccessScreen result={orderResult} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-40 px-4 relative">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />

      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Page Header */}
        <div className="text-center mb-10">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-foreground/30 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
          <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter mb-2">
            Check<span className="text-primary italic font-serif">out.</span>
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <CheckoutSteps currentStep={step} />
        </div>

        {/* Step Content */}
        <div className="glass border border-border/50 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AuthStep
                  onSuccess={(userData) => {
                    setUser(userData);
                    setStep(2);
                  }}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AddressStep
                  user={reduxUser || user}
                  onConfirm={async (addr) => {
                    if (addr.isNew) {
                      try {
                        const { isNew, ...addressToSave } = addr;
                        await dispatch(
                          addAddress({
                            ...addressToSave,
                            isDefault: (reduxUser || user)?.addresses?.length === 0,
                            country: "India",
                          }),
                        ).unwrap();
                      } catch (err) {
                        console.error("Failed to save address:", err);
                      }
                    }
                    const { isNew, ...finalAddress } = addr;
                    setAddress(finalAddress);
                    setStep(3);
                  }}
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PaymentStep
                  user={reduxUser || user}
                  address={address}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  onSuccess={(result) => setOrderResult(result)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
