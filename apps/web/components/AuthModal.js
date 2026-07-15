"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X, Flame, ArrowRight, ShieldCheck, Phone, ArrowLeft,
  RefreshCw, Lock, Eye, EyeOff, User, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { fetchProfile, setProfile } from "@/features/user/userSlice";

// Step flow:
//  "phone"    → user enters mobile
//  "password" → existing user enters password (no SMS)
//  "otp"      → new user enters OTP from SMS
//  "register" → new user enters name + password + OTP verify

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const dispatch = useDispatch();

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [countryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (!isOpen) {
      setStep("phone"); setPhone(""); setPassword(""); setName(""); setNewPassword("");
      setOtp(["", "", "", ""]); setTimer(30); setLoading(false); setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    let t;
    if (step === "otp" && timer > 0) t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, timer]);

  const mobile = `${countryCode}${phone}`;

  // ── Step 1: Check phone ──────────────────────────────────────────────────
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) { setError("Enter a valid 10-digit number"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/phone-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Check failed");
      if (data.data.exists && data.data.hasPassword) {
        setStep("password");  // existing user → password login
      } else {
        // new user → request OTP for registration
        await sendOTP();
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const sendOTP = async () => {
    const res = await fetch("/api/v1/auth/phone-login-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send OTP");
    setTimer(30); setStep("otp");
    setTimeout(() => { if (otpRefs[0].current) otpRefs[0].current.focus(); }, 100);
  };

  // ── Step 2a: Password login (existing user) ──────────────────────────────
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!password) { setError("Enter your password"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/phone-login-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      handleSuccess(data.data.user);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // ── Step 2b: OTP entry (new user) ────────────────────────────────────────
  const handleOtpChange = (val, idx) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) { const n = [...otp]; n[idx] = ""; setOtp(n); return; }
    const n = [...otp]; n[idx] = clean[0]; setOtp(n);
    if (idx < 3 && clean) setTimeout(() => { otpRefs[idx + 1]?.current?.focus(); }, 10);
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
      const n = [...otp]; n[idx - 1] = ""; setOtp(n);
      setTimeout(() => otpRefs[idx - 1]?.current?.focus(), 10);
    }
  };

  useEffect(() => {
    if (step === "otp" && otp.join("").length === 4) {
      // OTP complete — advance to the register info step
      setStep("register");
    }
  }, [otp, step]);

  // ── Step 3: Registration details + verify OTP ────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Enter your name"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/phone-login-verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: otp.join(""), name: name.trim(), password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      handleSuccess(data.data.user);
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", ""]); setStep("otp");
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } finally { setLoading(false); }
  };

  const handleSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch(setProfile(userData));
    dispatch(fetchProfile());
    onLoginSuccess?.(userData);
    onClose?.();
  };

  const fullMobile = `${countryCode} ${phone.slice(0, 3)}****${phone.slice(7)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-background/60 backdrop-blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: typeof window !== "undefined" && window.innerWidth < 640 ? "100%" : 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: typeof window !== "undefined" && window.innerWidth < 640 ? "100%" : 30 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="relative w-full max-w-sm bg-background border border-border/50 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.35)] overflow-hidden"
          >
            <div className="sm:hidden w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mt-4" />

            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30">Dunches</p>
                  <p className="text-sm font-black font-heading tracking-tight">
                    {step === "phone" && "Sign In / Sign Up"}
                    {step === "password" && "Welcome back!"}
                    {step === "otp" && "Verify Number"}
                    {step === "register" && "Create Account"}
                  </p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center text-foreground/40 hover:text-primary transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="px-8 pb-10 pt-2">
              {error && (
                <div className="mb-4 text-[9px] font-black text-red-500 bg-red-500/5 border border-red-500/10 p-3 rounded-xl tracking-widest uppercase text-center">
                  {error}
                </div>
              )}

              {/* ─ Step: Phone ─────────────────────────────────────────────── */}
              {step === "phone" && (
                <motion.form key="phone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handlePhoneSubmit} className="space-y-4">
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mb-5">
                    Enter your mobile number to continue
                  </p>
                  <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-4 pr-4 transition-all">
                    <Phone className="w-4 h-4 text-foreground/20 shrink-0" />
                    <span className="text-[10px] font-black tracking-widest text-foreground/60 shrink-0">+91</span>
                    <div className="w-px h-5 bg-border shrink-0" />
                    <input type="tel" maxLength={10} placeholder="MOBILE NUMBER" value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20" />
                  </div>
                  <Button type="submit" disabled={phone.length !== 10 || loading}
                    className="w-full h-13 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-2">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                  <p className="text-center text-[9px] text-foreground/30 font-medium">
                    Existing users log in with password · New users get a one-time OTP
                  </p>
                </motion.form>
              )}

              {/* ─ Step: Password (existing user) ──────────────────────────── */}
              {step === "password" && (
                <motion.form key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handlePasswordLogin} className="space-y-4">
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mb-5">
                    Enter password for <span className="text-foreground/70">{fullMobile}</span>
                  </p>
                  <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-4 pr-3 transition-all">
                    <Lock className="w-4 h-4 text-foreground/20 shrink-0" />
                    <input
                      type={showPwd ? "text" : "password"}
                      placeholder="YOUR PASSWORD"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20"
                    />
                    <button type="button" onClick={() => setShowPwd(p => !p)} className="text-foreground/30 hover:text-primary transition-colors">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button type="submit" disabled={!password || loading}
                    className="w-full h-13 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-2">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Sign In</>}
                  </Button>
                  <button type="button" onClick={() => { setStep("phone"); setPassword(""); setError(""); }}
                    className="w-full text-center text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Change number
                  </button>
                </motion.form>
              )}

              {/* ─ Step: OTP entry (new user) ───────────────────────────────── */}
              {step === "otp" && (
                <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                    OTP sent to <span className="text-foreground/70">{fullMobile}</span>
                  </p>
                  <div className="flex justify-between gap-3">
                    {otp.map((digit, idx) => (
                      <input key={idx} ref={otpRefs[idx]} type="text" maxLength={1} value={digit}
                        onKeyDown={(e) => handleOtpKey(e, idx)}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        className={`w-14 h-16 text-center text-xl font-bold bg-foreground/3 border-2 rounded-2xl outline-none focus:bg-background transition-all ${digit ? "border-primary text-foreground" : "border-transparent text-foreground/40"}`}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    {timer > 0
                      ? <p className="text-[9px] font-black uppercase tracking-widest text-foreground/20">Resend in <span className="text-primary">{timer}s</span></p>
                      : <button onClick={async () => { setError(""); try { await sendOTP(); } catch(e) { setError(e.message); } }}
                          className="text-[10px] font-black text-primary hover:text-amber-500 transition-colors uppercase tracking-widest">Resend OTP</button>
                    }
                  </div>
                  <button onClick={() => { setStep("phone"); setOtp(["", "", "", ""]); setError(""); }}
                    className="w-full text-center text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Change number
                  </button>
                </motion.div>
              )}

              {/* ─ Step: Register details ───────────────────────────────────── */}
              {step === "register" && (
                <motion.form key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleRegister} className="space-y-4">
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mb-5">
                    Almost there! Just a few more details.
                  </p>
                  {/* Name */}
                  <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-4 pr-4 transition-all">
                    <User className="w-4 h-4 text-foreground/20 shrink-0" />
                    <input type="text" placeholder="YOUR NAME" value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20" />
                  </div>
                  {/* Password */}
                  <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-4 pr-3 transition-all">
                    <Lock className="w-4 h-4 text-foreground/20 shrink-0" />
                    <input type={showNewPwd ? "text" : "password"} placeholder="CREATE A PASSWORD"
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20" />
                    <button type="button" onClick={() => setShowNewPwd(p => !p)} className="text-foreground/30 hover:text-primary transition-colors">
                      {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[9px] text-foreground/30 font-medium px-1">Minimum 6 characters — you'll use this to log in next time.</p>
                  <Button type="submit" disabled={!name || newPassword.length < 6 || loading}
                    className="w-full h-13 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-2">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Create Account</>}
                  </Button>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
