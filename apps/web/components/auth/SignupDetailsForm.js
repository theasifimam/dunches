"use client";

import React from "react";
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
      <Button
        type="submit"
        disabled={!name || newPassword.length < 6 || loading}
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
