"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Lock, Eye, EyeOff, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export default function LoginForm({
  phone,
  setPhone,
  password,
  setPassword,
  showPwd,
  setShowPwd,
  loading,
  onLogin,
  onForgotPassword,
  onSignUp,
}) {
  return (
    <motion.form
      key="login"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={onLogin}
      className="space-y-4"
    >
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
      <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-4 pr-3 transition-all">
        <Lock className="w-4 h-4 text-foreground/20 shrink-0" />
        <input
          type={showPwd ? "text" : "password"}
          placeholder="YOUR PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20"
        />
        <button
          type="button"
          onClick={() => setShowPwd((p) => !p)}
          className="text-foreground/30 hover:text-primary transition-colors"
        >
          {showPwd ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      <Button
        type="submit"
        disabled={phone.length !== 10 || !password || loading}
        className="w-full h-13 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-2"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" /> Sign In
          </>
        )}
      </Button>
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-[9px] font-black text-primary/80 hover:text-primary uppercase tracking-widest transition-colors"
        >
          Forgot Password?
        </button>
        <button
          type="button"
          onClick={onSignUp}
          className="text-[9px] font-black text-foreground/60 hover:text-foreground uppercase tracking-widest transition-colors"
        >
          Sign Up
        </button>
      </div>
    </motion.form>
  );
}
