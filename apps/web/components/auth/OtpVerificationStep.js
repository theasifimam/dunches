"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function OtpVerificationStep({
  step,
  fullMobile,
  otp,
  otpRefs,
  timer,
  handleOtpKey,
  handleOtpChange,
  onResend,
  onChangeNumber,
}) {
  return (
    <motion.div
      key="otp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
        OTP sent to <span className="text-foreground/70">{fullMobile}</span>
      </p>
      <div className="flex justify-between gap-3">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={otpRefs[idx]}
            type="text"
            maxLength={1}
            value={digit}
            onKeyDown={(e) => handleOtpKey(e, idx)}
            onChange={(e) => handleOtpChange(e.target.value, idx)}
            className={`w-14 h-16 text-center text-xl font-bold bg-foreground/3 border-2 rounded-2xl outline-none focus:bg-background transition-all ${
              digit
                ? "border-primary text-foreground"
                : "border-transparent text-foreground/40"
            }`}
          />
        ))}
      </div>
      <div className="text-center">
        {timer > 0 ? (
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/20">
            Resend in <span className="text-primary">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={onResend}
            className="text-[10px] font-black text-primary hover:text-amber-500 transition-colors uppercase tracking-widest"
          >
            Resend OTP
          </button>
        )}
      </div>
      <button
        onClick={onChangeNumber}
        className="w-full text-center text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
      >
        <ArrowLeft className="w-3 h-3" /> Change number
      </button>
    </motion.div>
  );
}
