"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export default function PhoneRequestForm({
  step,
  phone,
  setPhone,
  loading,
  onSubmit,
  onBackToLogin,
  agreedToTerms,
  setAgreedToTerms,
}) {
  return (
    <motion.form
      key={step}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mb-5">
        {step === "signup"
          ? "Enter your mobile to get started"
          : "Enter mobile to reset password"}
      </p>
      <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-4 pr-4 transition-all">
        <Phone className="w-4 h-4 text-foreground/20 shrink-0" />
        <span className="text-[10px] font-black tracking-widest text-foreground/60 shrink-0">
          +91
        </span>
        <div className="w-px h-5 bg-border shrink-0" />
        <input
          type="tel"
          maxLength={10}
          placeholder="MOBILE NUMBER"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
          className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20"
        />
      </div>

      {step === "signup" && (
        <div className="flex items-start gap-2.5 px-1 py-1">
          <input
            type="checkbox"
            id="phone-req-terms"
            checked={agreedToTerms || false}
            onChange={(e) => setAgreedToTerms && setAgreedToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-foreground/20 text-primary focus:ring-primary/40 cursor-pointer accent-primary shrink-0"
          />
          <label
            htmlFor="phone-req-terms"
            className="text-[10px] text-foreground/60 leading-relaxed cursor-pointer select-none"
          >
            I agree to the{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="text-primary font-bold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              target="_blank"
              className="text-primary font-bold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Terms &amp; Conditions
            </Link>
          </label>
        </div>
      )}

      <Button
        type="submit"
        disabled={
          phone.length !== 10 || (step === "signup" && !agreedToTerms) || loading
        }
        className="w-full h-13 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-2"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Send OTP <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full text-center text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Login
      </button>
    </motion.form>
  );
}
