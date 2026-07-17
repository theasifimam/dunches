"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, Package } from "lucide-react";

export default function SuccessScreen({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="max-w-md mx-auto text-center"
    >
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 mx-auto relative">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <span className="absolute inset-0 rounded-full border border-green-500/30 animate-ping opacity-40" />
      </div>

      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 block">
        Order Confirmed 🎉
      </span>
      <h1 className="text-4xl md:text-5xl font-light font-serif mb-4 tracking-tighter text-foreground lowercase">
        your snacks are on their way.
      </h1>
      <p className="text-foreground/50 mb-8 text-sm font-light leading-relaxed max-w-xs mx-auto">
        {result?.method === "cod"
          ? "Your order has been placed. Pay when your snacks arrive!"
          : "Payment confirmed. Your crunchy order is being packed!"}
      </p>

      <div className="border-t border-b border-border/50 py-6 mb-8 space-y-3 text-sm font-light">
        <div className="flex justify-between">
          <span className="text-foreground/45">
            Amount {result?.method === "cod" ? "Payable" : "Paid"}
          </span>
          <span className="font-bold text-primary">
            ₹{result?.amount?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/45">Payment</span>
          <span className="font-bold">
            {result?.method === "cod" ? "Cash on Delivery" : "Paid Online"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/45">Estimated Delivery</span>
          <span className="font-bold">3 – 5 Business Days</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/menu" className="flex-1">
          <Button className="w-full h-14 rounded-full font-black tracking-widest uppercase text-xs shadow-xl">
            <ShoppingBag className="w-4 h-4 mr-2" /> Continue Snacking
          </Button>
        </Link>
        <Link href="/profile" className="flex-1">
          <Button
            variant="outline"
            className="w-full h-14 rounded-full font-black tracking-widest uppercase text-xs border-2 border-primary/20 hover:bg-primary/5"
          >
            <Package className="w-4 h-4 mr-2" /> My Orders
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
