"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-40 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.02]" />
      <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/3 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-12">
        {/* Title Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
              Terms of Use
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light font-serif tracking-tighter lowercase">
            terms & conditions
          </h1>
          <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest leading-loose">
            The legal agreements governing your snack experience
          </p>
        </div>

        {/* Content Glass Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
        >
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> 1. Account Guidelines
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed font-light">
            By accessing or placing orders through Dunches, you guarantee that all details submitted (including phone number, shipping coordinates, and payment identifiers) are 100% accurate and up-to-date. Sharing credentials or exploiting ordering systems is strictly prohibited.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
        >
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" /> 2. Ordering & Payments
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed font-light">
            For Cash on Delivery (COD) transactions, you must pay in full upon receipt of the items. Refusal to pay without valid cause will result in immediate suspension of ordering features on your account. Online payments are secured using standard encryptions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
        >
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" /> 3. Food Disclaimers
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed font-light">
            All ingredients used in Dunches snacks (including seasonings, oils, and allergens such as sesame or nuts) are clearly outlined on the product details page. It is the customer&apos;s responsibility to verify dietary compatibilities before consuming the snacks.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
