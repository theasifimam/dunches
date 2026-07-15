"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // Reset state when modal closes/opens
  useEffect(() => {
    if (!isOpen) {
      setStep("phone");
      setPhoneNumber("");
      setOtp(["", "", "", ""]);
      setTimer(30);
      setLoading(false);
      setSuccess(false);
      setError("");
    }
  }, [isOpen]);

  // OTP Timer countdown
  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0 && !success) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer, success]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/v1/auth/phone-login-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: `${countryCode}${phoneNumber}` }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to request OTP. Please try again.");
      }

      setLoading(false);
      setStep("otp");
      setTimer(30);
      // Focus first input box
      setTimeout(() => {
        if (otpRefs[0].current) otpRefs[0].current.focus();
      }, 100);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Connection refused. Make sure backend is running.");
    }
  };

  const handleOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanValue.substring(0, 1);
    setOtp(newOtp);

    // Auto focus next input
    if (index < 3 && cleanValue) {
      setTimeout(() => {
        if (otpRefs[index + 1].current) otpRefs[index + 1].current.focus();
      }, 10);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        setTimeout(() => {
          if (otpRefs[index - 1].current) otpRefs[index - 1].current.focus();
        }, 10);
      }
    }
  };

  // Auto-verify when OTP is fully entered
  useEffect(() => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/auth/phone-login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: `${countryCode}${phoneNumber}`,
          otp: otp.join(""),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP code.");
      }

      const userData = data.data.user;

      setLoading(false);
      setSuccess(true);

      // Save directly to localStorage for robust fallback
      localStorage.setItem("user", JSON.stringify(userData));

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message || "OTP verification failed. Please try again.");
      setOtp(["", "", "", ""]);
      setTimeout(() => {
        if (otpRefs[0].current) otpRefs[0].current.focus();
      }, 100);
    }
  };

  const handleResendOTP = () => {
    if (timer > 0) return;
    setOtp(["", "", "", ""]);
    setTimer(30);
    setError("");
    setTimeout(() => {
      if (otpRefs[0].current) otpRefs[0].current.focus();
    }, 100);
  };

  const isPhoneValid = phoneNumber.length === 10;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-end sm:items-center justify-center sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-3xl"
          />

          {/* Modal/Bottom Sheet Content */}
          <motion.div
            initial={{
              opacity: 0,
              y:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? "100%"
                  : 30,
              scale:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 1
                  : 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? "100%"
                  : 30,
              scale:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 1
                  : 0.9,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-background border border-border/50 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Pull Handle for Native Mobile Feel */}
            <div className="sm:hidden w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mt-4 mb-2" />

            {/* Header Area */}
            <div className="relative pt-10 sm:pt-14 px-8 sm:px-10 pb-6 text-center border-b border-border/50">
              <button
                onClick={onClose}
                className="hidden sm:flex absolute top-6 right-6 w-10 h-10 rounded-full glass border border-border items-center justify-center text-foreground/40 hover:text-primary transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-4">
                <Flame className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                  spicy access
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-light font-serif tracking-tighter mb-2 lowercase text-foreground">
                {success
                  ? "Identity Confirmed"
                  : step === "phone"
                    ? "mindful wellness."
                    : "Verification."}
              </h2>
              <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                {success
                  ? "Access granted to your wellness profile"
                  : step === "phone"
                    ? "Unlock exclusive subscription rewards & benefits"
                    : "Enter the OTP sent to your phone"}
              </p>
            </div>

            <div className="p-8 sm:p-10 space-y-6">
              {success ? (
                <div className="flex flex-col items-center py-6 text-center space-y-4">
                  <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                    <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-30" />
                  </div>
                  <p className="text-sm font-black font-heading uppercase tracking-widest text-foreground">
                    Identity Verified
                  </p>
                  <p className="text-xs text-foreground/50 max-w-[280px]">
                    Welcome back to the Imperial Court. Session initiating...
                  </p>
                </div>
              ) : step === "phone" ? (
                <form className="space-y-4" onSubmit={handleRequestOTP}>
                  {error && (
                    <div className="text-[10px] font-black text-red-500 bg-red-500/5 border border-red-500/10 p-4 rounded-xl tracking-widest uppercase">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-4 transition-all">
                    <div className="flex items-center gap-1 cursor-pointer select-none text-[10px] font-black tracking-widest">
                      <Phone className="w-4 h-4 text-foreground/20" />
                      <span className="text-foreground/80">{countryCode}</span>
                    </div>
                    <div className="w-px h-6 bg-border" />
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="PHONE NUMBER"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="w-full h-full bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={!isPhoneValid || loading}
                      className="w-full h-16 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl group flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-primary-foreground" />
                      ) : (
                        <>
                          Request OTP
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setStep("phone")}
                      className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest hover:text-amber-500 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Change number
                    </button>
                    <span className="text-[9px] font-black text-foreground/30 tracking-widest uppercase">
                      Sent to {countryCode} {phoneNumber.substring(0, 3)}****
                      {phoneNumber.substring(7)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 px-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpRefs[idx]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        className={`w-14 h-16 text-center text-xl font-bold bg-foreground/3 border-2 rounded-2xl outline-none focus:bg-background transition-all ${
                          digit
                            ? "border-primary text-foreground"
                            : "border-transparent text-foreground/40"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-center py-2">
                    {timer > 0 ? (
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/20">
                        Resend code in{" "}
                        <span className="text-primary">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        className="text-[10px] font-black text-primary hover:text-amber-500 transition-colors uppercase tracking-widest"
                      >
                        Resend OTP Code
                      </button>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.join("").length !== 4 || loading}
                      className="w-full h-16 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl group flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-primary-foreground" />
                      ) : (
                        <>
                          Verify OTP
                          <ShieldCheck className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-center pb-2">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/20 leading-relaxed">
                  By signing in, you consent to the imperial terms of honor and
                  dining protocols.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
