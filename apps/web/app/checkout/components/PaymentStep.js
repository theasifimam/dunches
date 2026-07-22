"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  CreditCard,
  Truck,
  Check,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const API_BASE = "";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentStep({ user, address, cartItems, cartTotal, onSuccess }) {
  const dispatch = useDispatch();
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + tax;

  const placeOrder = async () => {
    setLoading(true);
    setError("");
    try {
      // Build items array from Redux cart
      const items = cartItems.map((item) => ({
        productId: item.id || item._id,
        name: item.name,
        qty: item.quantity,
      }));

      const shippingAddress = {
        fullName: address.fullName,
        line1: address.line1,
        line2: address.line2 || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: "India",
        mobile: address.mobile,
      };

      const res = await fetch(
        `${API_BASE}/api/v1/orders`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shippingAddress,
            paymentMethod: method,
            items,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      if (method === "cod") {
        dispatch(clearCart());
        onSuccess({
          orderId: data.data.order._id,
          amount: grandTotal,
          method: "cod",
        });
        return;
      }

      // Online — open Razorpay
      const loaded = await loadRazorpay();
      if (!loaded)
        throw new Error("Payment gateway failed to load. Please try again.");

      const { order: dbOrder, razorpayOrder, key } = data.data;

      const rzp = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Dunches",
        description: "Crunchy Snacks Order",
        order_id: razorpayOrder.id,
        prefill: {
          name: user?.name || "",
          contact: `+91${address.mobile}`,
        },
        theme: { color: "#f97316" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              `${API_BASE}/api/v1/orders/verify-payment`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok)
              throw new Error(
                verifyData.message || "Payment verification failed",
              );
            dispatch(clearCart());
            onSuccess({
              orderId: dbOrder._id,
              amount: grandTotal,
              method: "online",
            });
          } catch (verifyErr) {
            setError(verifyErr.message);
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-4">
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
            Payment
          </span>
        </div>
        <h2 className="text-3xl font-light font-serif tracking-tighter mb-1 lowercase">
          almost there.
        </h2>
        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
          Choose how you want to pay
        </p>
      </div>

      {/* Address Recap */}
      <div className="p-5 rounded-2xl bg-foreground/3 border border-border/50 mb-6 flex items-start gap-3">
        <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-1">
            Delivering to
          </p>
          <p className="text-sm font-bold">{address.fullName}</p>
          <p className="text-[11px] text-foreground/50 leading-relaxed">
            {address.line1}
            {address.line2 && `, ${address.line2}`}
            <br />
            {address.city}, {address.state} — {address.pincode}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-6 rounded-2xl bg-foreground/2 border border-border/50 mb-6 space-y-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
          Order Summary
        </p>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-[11px]">
              <Link
                href={`/product/${item.slug || item.id}`}
                className="font-medium text-foreground/70 hover:text-primary transition-colors truncate flex-1 pr-4"
              >
                {item.name} × {item.quantity}
              </Link>
              <span className="font-bold shrink-0">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border/50 pt-4 space-y-2">
          <div className="flex justify-between text-[11px] text-foreground/50">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[11px] text-foreground/50">
            <span>GST (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-foreground/50">
            <span>Delivery</span>
            <span className="text-primary italic font-serif">Free</span>
          </div>
          <div className="flex justify-between font-black text-base">
            <span>Total</span>
            <span className="text-primary">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3 mb-6">
        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
          Payment Method
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod("cod")}
            className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
              method === "cod"
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/40"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === "cod" ? "bg-primary/15 text-primary" : "bg-foreground/5 text-foreground/30"}`}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p
                className={`text-[10px] font-black uppercase tracking-widest ${method === "cod" ? "text-primary" : "text-foreground/50"}`}
              >
                Cash on Delivery
              </p>
              <p className="text-[8px] text-foreground/30 font-medium mt-0.5">
                Pay when delivered
              </p>
            </div>
            {method === "cod" && <Check className="w-4 h-4 text-primary" />}
          </button>

          <button
            onClick={() => setMethod("online")}
            className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
              method === "online"
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/40"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === "online" ? "bg-primary/15 text-primary" : "bg-foreground/5 text-foreground/30"}`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p
                className={`text-[10px] font-black uppercase tracking-widest ${method === "online" ? "text-primary" : "text-foreground/50"}`}
              >
                Pay Online
              </p>
              <p className="text-[8px] text-foreground/30 font-medium mt-0.5">
                UPI · Cards · Net Banking
              </p>
            </div>
            {method === "online" && <Check className="w-4 h-4 text-primary" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-[10px] font-black text-red-500 bg-red-500/5 border border-red-500/10 p-4 rounded-xl tracking-widest uppercase mb-4 text-center">
          {error}
        </div>
      )}

      <Button
        onClick={placeOrder}
        disabled={loading}
        className="w-full h-16 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group"
      >
        <div className="relative z-10 flex items-center gap-3">
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
            </>
          ) : method === "cod" ? (
            <>
              <Truck className="w-5 h-5" /> Place Order — COD
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" /> Pay ₹
              {grandTotal.toLocaleString()}
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Button>

      <div className="flex items-center justify-center gap-2 mt-4 opacity-30">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-[9px] font-black tracking-[0.3em] uppercase">
          256-bit encrypted &amp; secure
        </span>
      </div>
    </motion.div>
  );
}
