"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export default function SignupDetailsForm({
  name,
  setName,
  newPassword,
  setNewPassword,
  showNewPwd,
  setShowNewPwd,
  loading,
  onSubmit,
  agreedToTerms,
  setAgreedToTerms,
}) {
  return (
    <motion.form
      key="signup-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-4 pr-4 transition-all">
        <User className="w-4 h-4 text-foreground/20 shrink-0" />
        <input
          type="text"
          placeholder="YOUR NAME"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20"
        />
      </div>
      <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-4 pr-3 transition-all">
        <Lock className="w-4 h-4 text-foreground/20 shrink-0" />
        <input
          type={showNewPwd ? "text" : "password"}
          placeholder="CREATE A PASSWORD"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20"
        />
        <button
          type="button"
          onClick={() => setShowNewPwd((p) => !p)}
          className="text-foreground/30 hover:text-primary transition-colors"
        >
          {showNewPwd ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-[9px] text-foreground/30 font-medium px-1">
        Minimum 6 characters.
      </p>

      <div className="flex items-start gap-2.5 px-1 py-1">
        <input
          type="checkbox"
          id="signup-details-terms"
          checked={agreedToTerms || false}
          onChange={(e) => setAgreedToTerms && setAgreedToTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-foreground/20 text-primary focus:ring-primary/40 cursor-pointer accent-primary shrink-0"
        />
        <label
          htmlFor="signup-details-terms"
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

      <Button
        type="submit"
        disabled={!name || newPassword.length < 6 || !agreedToTerms || loading}
        className="w-full h-13 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-2"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" /> Create Account
          </>
        )}
      </Button>
    </motion.form>
  );
}
