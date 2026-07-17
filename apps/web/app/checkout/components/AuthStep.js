"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile, setProfile } from "@/features/user/userSlice";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Phone,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Eye,
  EyeOff,
  User,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function AuthStep({ onSuccess }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState("login");
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
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    let t;
    if ((step === "signup-otp" || step === "forgot-otp") && timer > 0)
      t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, timer]);

  const mobile = `${countryCode}${phone}`;
  const maskedPhone = `${countryCode} ${phone.slice(0, 3)}****${phone.slice(7)}`;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit number");
      return;
    }
    if (!password) {
      setError("Enter your password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/phone-login-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      handleAuthSuccess(data.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRequest = async (e) => {
    if (e) e.preventDefault();
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/phone-login-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setTimer(30);
      setStep("signup-otp");
      setOtp(["", "", "", ""]);
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequest = async (e) => {
    if (e) e.preventDefault();
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/phone-forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setTimer(30);
      setStep("forgot-otp");
      setOtp(["", "", "", ""]);
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerify = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter your name");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/phone-login-verify`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile,
          otp: otp.join(""),
          name: name.trim(),
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      handleAuthSuccess(data.data.user);
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", ""]);
      setStep("signup-otp");
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotVerify = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/phone-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: otp.join(""), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setStep("login");
      setPassword("");
      setNewPassword("");
      setError("");
      setTimeout(
        () => setError("Password reset successfully. You can now login."),
        10,
      );
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", ""]);
      setStep("forgot-otp");
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) {
      const n = [...otp];
      n[idx] = "";
      setOtp(n);
      return;
    }
    const n = [...otp];
    n[idx] = clean[0];
    setOtp(n);
    if (idx < 3 && clean)
      setTimeout(() => otpRefs[idx + 1]?.current?.focus(), 10);
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
      const n = [...otp];
      n[idx - 1] = "";
      setOtp(n);
      setTimeout(() => otpRefs[idx - 1]?.current?.focus(), 10);
    }
  };

  useEffect(() => {
    if (step === "signup-otp" && otp.join("").length === 4)
      setStep("signup-details");
    if (step === "forgot-otp" && otp.join("").length === 4)
      setStep("forgot-reset");
  }, [otp, step]);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch(setProfile(userData));
    dispatch(fetchProfile());
    onSuccess(userData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-sm mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-4">
          <Flame className="w-3.5 h-3.5 text-primary" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
            {step === "login" && "Sign In"}
            {step === "signup" && "Sign Up"}
            {(step === "signup-otp" || step === "forgot-otp") && "Verify"}
            {step === "signup-details" && "Create Account"}
            {step === "forgot-password" && "Reset Password"}
            {step === "forgot-reset" && "New Password"}
          </span>
        </div>
        <h2 className="text-3xl font-light font-serif tracking-tighter mb-1 lowercase">
          {step === "login" && "welcome back."}
          {step === "signup" && "join us."}
          {(step === "signup-otp" || step === "forgot-otp") &&
            "enter the code."}
          {step === "signup-details" && "one last step."}
          {step === "forgot-password" && "forgot password?"}
          {step === "forgot-reset" && "secure account."}
        </h2>
        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
          {(step === "login" ||
            step === "signup" ||
            step === "forgot-password") &&
            "Enter your mobile number"}
          {(step === "signup-otp" || step === "forgot-otp") &&
            `OTP sent to ${maskedPhone}`}
          {step === "signup-details" && "Set your name and password"}
          {step === "forgot-reset" && "Create a new password"}
        </p>
      </div>

      {error && (
        <div
          className={`mb-4 text-[10px] font-black p-3 rounded-2xl tracking-widest uppercase text-center ${error.includes("successful") ? "text-green-500 bg-green-500/5 border border-green-500/10" : "text-red-500 bg-red-500/5 border border-red-500/10"}`}
        >
          {error}
        </div>
      )}

      {/* LOGIN */}
      {step === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-4 transition-all">
            <Phone className="w-4 h-4 text-foreground/20" />
            <span className="text-[10px] font-black tracking-widest text-foreground/80">
              {countryCode}
            </span>
            <div className="w-px h-6 bg-border" />
            <input
              type="tel"
              maxLength={10}
              placeholder="MOBILE NUMBER"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full h-full bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground"
            />
          </div>
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-3 transition-all">
            <ShieldCheck className="w-4 h-4 text-foreground/20" />
            <input
              type={showPwd ? "text" : "password"}
              placeholder="YOUR PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              className="text-foreground/30 hover:text-primary transition-colors p-1"
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
            className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Sign In
              </>
            )}
          </Button>
          <div className="flex justify-between items-center pt-2 px-1">
            <button
              type="button"
              onClick={() => {
                setStep("forgot-password");
                setError("");
              }}
              className="text-[10px] font-black text-primary/80 hover:text-primary uppercase tracking-widest transition-colors"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("signup");
                setError("");
              }}
              className="text-[10px] font-black text-foreground/60 hover:text-foreground uppercase tracking-widest transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      )}

      {/* SIGNUP / FORGOT PASSWORD - PHONE */}
      {(step === "signup" || step === "forgot-password") && (
        <form
          onSubmit={
            step === "signup" ? handleSignupRequest : handleForgotRequest
          }
          className="space-y-4"
        >
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-4 transition-all">
            <Phone className="w-4 h-4 text-foreground/20" />
            <span className="text-[10px] font-black tracking-widest text-foreground/80">
              {countryCode}
            </span>
            <div className="w-px h-6 bg-border" />
            <input
              type="tel"
              maxLength={10}
              placeholder="MOBILE NUMBER"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full h-full bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground"
            />
          </div>
          <Button
            type="submit"
            disabled={phone.length !== 10 || loading}
            className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3"
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
            onClick={() => {
              setStep("login");
              setError("");
            }}
            className="w-full text-center text-[10px] font-black text-foreground/60 hover:text-foreground uppercase tracking-widest flex items-center justify-center gap-1 mt-4"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Login
          </button>
        </form>
      )}

      {/* OTP (SIGNUP & FORGOT) */}
      {(step === "signup-otp" || step === "forgot-otp") && (
        <div className="space-y-6">
          <div className="flex justify-between gap-3 px-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={otpRefs[idx]}
                type="text"
                maxLength={1}
                value={digit}
                onKeyDown={(e) => handleOtpKey(e, idx)}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                className={`w-14 h-16 text-center text-xl font-bold bg-foreground/3 border-2 rounded-2xl outline-none focus:bg-background transition-all ${digit ? "border-primary text-foreground" : "border-transparent text-foreground/40"}`}
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
                onClick={async () => {
                  setError("");
                  setOtp(["", "", "", ""]);
                  try {
                    step === "signup-otp"
                      ? await handleSignupRequest()
                      : await handleForgotRequest();
                  } catch (e) {}
                }}
                className="text-[10px] font-black text-primary hover:text-amber-500 transition-colors uppercase tracking-widest"
              >
                Resend OTP
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setStep(step === "signup-otp" ? "signup" : "forgot-password");
              setOtp(["", "", "", ""]);
              setError("");
            }}
            className="w-full text-center text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Change number
          </button>
        </div>
      )}

      {/* SIGNUP DETAILS */}
      {step === "signup-details" && (
        <form onSubmit={handleSignupVerify} className="space-y-4">
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-4 transition-all">
            <User className="w-4 h-4 text-foreground/20" />
            <input
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground"
            />
          </div>
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-3 transition-all">
            <ShieldCheck className="w-4 h-4 text-foreground/20" />
            <input
              type={showNewPwd ? "text" : "password"}
              placeholder="CREATE A PASSWORD"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowNewPwd((p) => !p)}
              className="text-foreground/30 hover:text-primary transition-colors p-1"
            >
              {showNewPwd ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[9px] text-foreground/30 font-medium px-1">
            Min. 6 characters — use this to log in next time
          </p>
          <Button
            type="submit"
            disabled={!name || newPassword.length < 6 || loading}
            className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Create Account & Continue
              </>
            )}
          </Button>
        </form>
      )}

      {/* FORGOT RESET */}
      {step === "forgot-reset" && (
        <form onSubmit={handleForgotVerify} className="space-y-4">
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-3 transition-all">
            <ShieldCheck className="w-4 h-4 text-foreground/20" />
            <input
              type={showNewPwd ? "text" : "password"}
              placeholder="NEW PASSWORD"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowNewPwd((p) => !p)}
              className="text-foreground/30 hover:text-primary transition-colors p-1"
            >
              {showNewPwd ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[9px] text-foreground/30 font-medium px-1">
            Min. 6 characters.
          </p>
          <Button
            type="submit"
            disabled={newPassword.length < 6 || loading}
            className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Reset Password
              </>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
