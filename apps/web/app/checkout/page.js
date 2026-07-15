"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectCartHydrated,
  clearCart,
} from "@/features/cart/cartSlice";
import { fetchProfile, setProfile } from "@/features/user/userSlice";
import { Button } from "@/components/ui/button";
import CheckoutSteps from "@/components/CheckoutSteps";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  LocateFixed,
  Loader2,
  CreditCard,
  Flame,
  Lock,
  Eye,
  EyeOff,
  User,
  Truck,
  Home,
  Briefcase,
  Map,
  Check,
  X,
  Package,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const LABEL_OPTIONS = [
  { value: "Home", icon: Home },
  { value: "Work", icon: Briefcase },
  { value: "Other", icon: Map },
];

const EMPTY_ADDRESS = {
  label: "Home",
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  mobile: "",
};

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "DunchesApp/1.0" },
  });
  if (!res.ok) throw new Error("Geocode failed");
  return res.json();
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Step 1: Smart Auth (password for existing, OTP for new) ─────────────────
function AuthStep({ onSuccess }) {
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
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

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
    if (phone.length !== 10) { setError("Enter a valid 10-digit number"); return; }
    if (!password) { setError("Enter your password"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/phone-login-password", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      handleAuthSuccess(data.data.user);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleSignupRequest = async (e) => {
    if (e) e.preventDefault();
    if (phone.length !== 10) { setError("Enter a valid 10-digit number"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/phone-login-request", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setTimer(30); setStep("signup-otp"); setOtp(["", "", "", ""]);
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleForgotRequest = async (e) => {
    if (e) e.preventDefault();
    if (phone.length !== 10) { setError("Enter a valid 10-digit number"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/phone-forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setTimer(30); setStep("forgot-otp"); setOtp(["", "", "", ""]);
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleSignupVerify = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Enter your name"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/phone-login-verify", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: otp.join(""), name: name.trim(), password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      handleAuthSuccess(data.data.user);
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", ""]); setStep("signup-otp");
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } finally { setLoading(false); }
  };

  const handleForgotVerify = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/phone-reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: otp.join(""), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setStep("login"); setPassword(""); setNewPassword(""); setError("");
      setTimeout(() => setError("Password reset successfully. You can now login."), 10);
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", ""]); setStep("forgot-otp");
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } finally { setLoading(false); }
  };

  const handleOtpChange = (val, idx) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) {
      const n = [...otp]; n[idx] = ""; setOtp(n);
      return;
    }
    const n = [...otp]; n[idx] = clean[0]; setOtp(n);
    if (idx < 3 && clean) setTimeout(() => otpRefs[idx + 1]?.current?.focus(), 10);
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
      const n = [...otp]; n[idx - 1] = ""; setOtp(n);
      setTimeout(() => otpRefs[idx - 1]?.current?.focus(), 10);
    }
  };

  useEffect(() => {
    if (step === "signup-otp" && otp.join("").length === 4) setStep("signup-details");
    if (step === "forgot-otp" && otp.join("").length === 4) setStep("forgot-reset");
  }, [otp, step]);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch(setProfile(userData));
    dispatch(fetchProfile());
    onSuccess(userData);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto">
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
          {(step === "signup-otp" || step === "forgot-otp") && "enter the code."}
          {step === "signup-details" && "one last step."}
          {step === "forgot-password" && "forgot password?"}
          {step === "forgot-reset" && "secure account."}
        </h2>
        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
          {(step === "login" || step === "signup" || step === "forgot-password") && "Enter your mobile number"}
          {(step === "signup-otp" || step === "forgot-otp") && `OTP sent to ${maskedPhone}`}
          {step === "signup-details" && "Set your name and password"}
          {step === "forgot-reset" && "Create a new password"}
        </p>
      </div>

      {error && (
        <div className={`mb-4 text-[10px] font-black p-3 rounded-2xl tracking-widest uppercase text-center ${error.includes('successful') ? 'text-green-500 bg-green-500/5 border border-green-500/10' : 'text-red-500 bg-red-500/5 border border-red-500/10'}`}>
          {error}
        </div>
      )}

      {/* LOGIN */}
      {step === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-4 transition-all">
            <Phone className="w-4 h-4 text-foreground/20" />
            <span className="text-[10px] font-black tracking-widest text-foreground/80">{countryCode}</span>
            <div className="w-px h-6 bg-border" />
            <input type="tel" maxLength={10} placeholder="MOBILE NUMBER" value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full h-full bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground" />
          </div>
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-3 transition-all">
            <ShieldCheck className="w-4 h-4 text-foreground/20" />
            <input type={showPwd ? "text" : "password"} placeholder="YOUR PASSWORD" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground" />
            <button type="button" onClick={() => setShowPwd((p) => !p)} className="text-foreground/30 hover:text-primary transition-colors p-1">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button type="submit" disabled={phone.length !== 10 || !password || loading}
            className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Sign In</>}
          </Button>
          <div className="flex justify-between items-center pt-2 px-1">
            <button type="button" onClick={() => { setStep("forgot-password"); setError(""); }}
              className="text-[10px] font-black text-primary/80 hover:text-primary uppercase tracking-widest transition-colors">
              Forgot Password?
            </button>
            <button type="button" onClick={() => { setStep("signup"); setError(""); }}
              className="text-[10px] font-black text-foreground/60 hover:text-foreground uppercase tracking-widest transition-colors">
              Sign Up
            </button>
          </div>
        </form>
      )}

      {/* SIGNUP / FORGOT PASSWORD - PHONE */}
      {(step === "signup" || step === "forgot-password") && (
        <form onSubmit={step === "signup" ? handleSignupRequest : handleForgotRequest} className="space-y-4">
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-4 transition-all">
            <Phone className="w-4 h-4 text-foreground/20" />
            <span className="text-[10px] font-black tracking-widest text-foreground/80">{countryCode}</span>
            <div className="w-px h-6 bg-border" />
            <input type="tel" maxLength={10} placeholder="MOBILE NUMBER" value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full h-full bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground" />
          </div>
          <Button type="submit" disabled={phone.length !== 10 || loading}
            className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
          </Button>
          <button type="button" onClick={() => { setStep("login"); setError(""); }}
            className="w-full text-center text-[10px] font-black text-foreground/60 hover:text-foreground uppercase tracking-widest flex items-center justify-center gap-1 mt-4">
            <ArrowLeft className="w-3 h-3" /> Back to Login
          </button>
        </form>
      )}

      {/* OTP (SIGNUP & FORGOT) */}
      {(step === "signup-otp" || step === "forgot-otp") && (
        <div className="space-y-6">
          <div className="flex justify-between gap-3 px-2">
            {otp.map((digit, idx) => (
              <input key={idx} ref={otpRefs[idx]} type="text" maxLength={1} value={digit}
                onKeyDown={(e) => handleOtpKey(e, idx)} onChange={(e) => handleOtpChange(e.target.value, idx)}
                className={`w-14 h-16 text-center text-xl font-bold bg-foreground/3 border-2 rounded-2xl outline-none focus:bg-background transition-all ${digit ? "border-primary text-foreground" : "border-transparent text-foreground/40"}`} />
            ))}
          </div>
          <div className="text-center">
            {timer > 0 ? (
              <p className="text-[9px] font-black uppercase tracking-widest text-foreground/20">Resend in <span className="text-primary">{timer}s</span></p>
            ) : (
              <button onClick={async () => { setError(""); setOtp(["", "", "", ""]); try { step === "signup-otp" ? await handleSignupRequest() : await handleForgotRequest(); } catch (e) {} }}
                className="text-[10px] font-black text-primary hover:text-amber-500 transition-colors uppercase tracking-widest">Resend OTP</button>
            )}
          </div>
          <button onClick={() => { setStep(step === "signup-otp" ? "signup" : "forgot-password"); setOtp(["", "", "", ""]); setError(""); }}
            className="w-full text-center text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest flex items-center justify-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Change number
          </button>
        </div>
      )}

      {/* SIGNUP DETAILS */}
      {step === "signup-details" && (
        <form onSubmit={handleSignupVerify} className="space-y-4">
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-4 transition-all">
            <User className="w-4 h-4 text-foreground/20" />
            <input type="text" placeholder="YOUR NAME" value={name} onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground" />
          </div>
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-3 transition-all">
            <ShieldCheck className="w-4 h-4 text-foreground/20" />
            <input type={showNewPwd ? "text" : "password"} placeholder="CREATE A PASSWORD" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground" />
            <button type="button" onClick={() => setShowNewPwd((p) => !p)} className="text-foreground/30 hover:text-primary transition-colors p-1">
              {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[9px] text-foreground/30 font-medium px-1">Min. 6 characters — use this to log in next time</p>
          <Button type="submit" disabled={!name || newPassword.length < 6 || loading}
            className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3 mt-4">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Create Account & Continue</>}
          </Button>
        </form>
      )}

      {/* FORGOT RESET */}
      {step === "forgot-reset" && (
        <form onSubmit={handleForgotVerify} className="space-y-4">
          <div className="flex items-center gap-2 bg-foreground/3 border border-transparent focus-within:border-primary/40 focus-within:bg-background rounded-2xl h-14 pl-5 pr-3 transition-all">
            <ShieldCheck className="w-4 h-4 text-foreground/20" />
            <input type={showNewPwd ? "text" : "password"} placeholder="NEW PASSWORD" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-foreground/20 text-foreground" />
            <button type="button" onClick={() => setShowNewPwd((p) => !p)} className="text-foreground/30 hover:text-primary transition-colors p-1">
              {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[9px] text-foreground/30 font-medium px-1">Min. 6 characters.</p>
          <Button type="submit" disabled={newPassword.length < 6 || loading}
            className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3 mt-4">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Reset Password</>}
          </Button>
        </form>
      )}
    </motion.div>
  );
}


// ─── Step 2: Address ──────────────────────────────────────────────────────────
function AddressStep({ user, onConfirm }) {
  const [form, setForm] = useState({
    ...EMPTY_ADDRESS,
    fullName: user?.name || "",
    mobile: user?.mobile?.replace(/^\+91/, "") || "",
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const set = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    setConfirmed(false);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const geo = await reverseGeocode(latitude, longitude);
          const a = geo.address || {};
          const road = a.road || a.pedestrian || a.footway || "";
          const houseNo = a.house_number ? `${a.house_number}, ` : "";
          set("line1", `${houseNo}${road}`.trim());
          set("line2", a.neighbourhood || a.suburb || a.quarter || "");
          set("city", a.city || a.town || a.village || a.county || "");
          set("state", a.state || "");
          set("pincode", (a.postcode || "").replace(/\s/g, "").slice(0, 6));
        } catch {
          setGpsError("Could not resolve address. Please fill manually.");
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(
          err.code === 1
            ? "Location permission denied. Please fill manually."
            : "Location unavailable.",
        );
      },
      { timeout: 10000 },
    );
  };

  const isValid =
    form.fullName.trim() &&
    form.line1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.pincode.length >= 6 &&
    form.mobile.length === 10;

  const handleConfirm = (e) => {
    e.preventDefault();
    setConfirmed(true);
    onConfirm(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-4">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
            Delivery Location
          </span>
        </div>
        <h2 className="text-3xl font-light font-serif tracking-tighter mb-1 lowercase">
          where to deliver?
        </h2>
        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
          Confirm your snack drop zone
        </p>
      </div>

      <form onSubmit={handleConfirm} className="space-y-4">
        {/* GPS Button */}
        <button
          type="button"
          onClick={handleGPS}
          disabled={gpsLoading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-60"
        >
          {gpsLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Detecting location...
            </>
          ) : (
            <>
              <LocateFixed className="w-4 h-4" /> Use My Current Location
            </>
          )}
        </button>
        {gpsError && (
          <p className="text-[9px] text-red-500 font-bold px-1">{gpsError}</p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">
            or fill manually
          </span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Label Selector */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">
            Address Type
          </p>
          <div className="flex gap-2">
            {LABEL_OPTIONS.map(({ value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => set("label", value)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                  form.label === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-foreground/40 hover:border-primary/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {value}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <Field
          label="Full Name"
          placeholder="Recipient name"
          value={form.fullName}
          onChange={(v) => set("fullName", v)}
          required
        />
        {/* Address Lines */}
        <Field
          label="Address Line 1"
          placeholder="Flat/House no., Street"
          value={form.line1}
          onChange={(v) => set("line1", v)}
          required
        />
        <Field
          label="Area / Landmark (optional)"
          placeholder="Colony, Landmark"
          value={form.line2}
          onChange={(v) => set("line2", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="City"
            placeholder="City"
            value={form.city}
            onChange={(v) => set("city", v)}
            required
          />
          <Field
            label="State"
            placeholder="State"
            value={form.state}
            onChange={(v) => set("state", v)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Pincode"
            placeholder="6-digit"
            value={form.pincode}
            onChange={(v) => set("pincode", v.replace(/\D/g, "").slice(0, 6))}
            required
          />
          <Field
            label="Mobile"
            placeholder="10-digit"
            value={form.mobile}
            onChange={(v) => set("mobile", v.replace(/\D/g, "").slice(0, 10))}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={!isValid}
          className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3 mt-2"
        >
          <MapPin className="w-4 h-4" /> Confirm Address
        </Button>
      </form>
    </motion.div>
  );
}

function Field({ label, placeholder, value, onChange, required }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-1.5">
        {label}
      </p>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-foreground/3 border border-transparent focus:border-primary/40 focus:bg-background rounded-2xl h-12 px-4 text-[11px] font-bold tracking-wide placeholder:text-foreground/20 outline-none transition-all"
      />
    </div>
  );
}

// ─── Step 3: Payment ──────────────────────────────────────────────────────────
function PaymentStep({ user, address, cartItems, cartTotal, onSuccess }) {
  const dispatch = useDispatch();
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + tax;

  const placeOrder = async () => {
    setLoading(true);
    setError("");
    try {
      // Build items array from Redux cart
      const items = cartItems.map((item) => ({
        productId: item.id || item._id,
        name: item.name,
        qty: item.quantity,
      }));

      const shippingAddress = {
        fullName: address.fullName,
        line1: address.line1,
        line2: address.line2 || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: "India",
        mobile: address.mobile,
      };

      const res = await fetch("/api/v1/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress, paymentMethod: method, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      if (method === "cod") {
        dispatch(clearCart());
        onSuccess({
          orderId: data.data.order._id,
          amount: grandTotal,
          method: "cod",
        });
        return;
      }

      // Online — open Razorpay
      const loaded = await loadRazorpay();
      if (!loaded)
        throw new Error("Payment gateway failed to load. Please try again.");

      const { order: dbOrder, razorpayOrder, key } = data.data;

      const rzp = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Dunches",
        description: "Crunchy Snacks Order",
        order_id: razorpayOrder.id,
        prefill: {
          name: user?.name || "",
          contact: `+91${address.mobile}`,
        },
        theme: { color: "#f97316" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/v1/orders/verify-payment", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok)
              throw new Error(
                verifyData.message || "Payment verification failed",
              );
            dispatch(clearCart());
            onSuccess({
              orderId: dbOrder._id,
              amount: grandTotal,
              method: "online",
            });
          } catch (verifyErr) {
            setError(verifyErr.message);
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-4">
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
            Payment
          </span>
        </div>
        <h2 className="text-3xl font-light font-serif tracking-tighter mb-1 lowercase">
          almost there.
        </h2>
        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
          Choose how you want to pay
        </p>
      </div>

      {/* Address Recap */}
      <div className="p-5 rounded-2xl bg-foreground/3 border border-border/50 mb-6 flex items-start gap-3">
        <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-1">
            Delivering to
          </p>
          <p className="text-sm font-bold">{address.fullName}</p>
          <p className="text-[11px] text-foreground/50 leading-relaxed">
            {address.line1}
            {address.line2 && `, ${address.line2}`}
            <br />
            {address.city}, {address.state} — {address.pincode}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-6 rounded-2xl bg-foreground/2 border border-border/50 mb-6 space-y-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
          Order Summary
        </p>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-[11px]">
              <span className="font-medium text-foreground/70 truncate flex-1 pr-4">
                {item.name} × {item.quantity}
              </span>
              <span className="font-bold shrink-0">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border/50 pt-4 space-y-2">
          <div className="flex justify-between text-[11px] text-foreground/50">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[11px] text-foreground/50">
            <span>GST (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-foreground/50">
            <span>Delivery</span>
            <span className="text-primary italic font-serif">Free</span>
          </div>
          <div className="flex justify-between font-black text-base">
            <span>Total</span>
            <span className="text-primary">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3 mb-6">
        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
          Payment Method
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod("cod")}
            className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
              method === "cod"
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/40"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === "cod" ? "bg-primary/15 text-primary" : "bg-foreground/5 text-foreground/30"}`}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p
                className={`text-[10px] font-black uppercase tracking-widest ${method === "cod" ? "text-primary" : "text-foreground/50"}`}
              >
                Cash on Delivery
              </p>
              <p className="text-[8px] text-foreground/30 font-medium mt-0.5">
                Pay when delivered
              </p>
            </div>
            {method === "cod" && <Check className="w-4 h-4 text-primary" />}
          </button>

          <button
            onClick={() => setMethod("online")}
            className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
              method === "online"
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/40"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === "online" ? "bg-primary/15 text-primary" : "bg-foreground/5 text-foreground/30"}`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p
                className={`text-[10px] font-black uppercase tracking-widest ${method === "online" ? "text-primary" : "text-foreground/50"}`}
              >
                Pay Online
              </p>
              <p className="text-[8px] text-foreground/30 font-medium mt-0.5">
                UPI · Cards · Net Banking
              </p>
            </div>
            {method === "online" && <Check className="w-4 h-4 text-primary" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-[10px] font-black text-red-500 bg-red-500/5 border border-red-500/10 p-4 rounded-xl tracking-widest uppercase mb-4 text-center">
          {error}
        </div>
      )}

      <Button
        onClick={placeOrder}
        disabled={loading}
        className="w-full h-16 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group"
      >
        <div className="relative z-10 flex items-center gap-3">
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
            </>
          ) : method === "cod" ? (
            <>
              <Truck className="w-5 h-5" /> Place Order — COD
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" /> Pay ₹
              {grandTotal.toLocaleString()}
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Button>

      <div className="flex items-center justify-center gap-2 mt-4 opacity-30">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-[9px] font-black tracking-[0.3em] uppercase">
          256-bit encrypted &amp; secure
        </span>
      </div>
    </motion.div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ result }) {
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

// ─── Main Checkout Page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartHydrated = useSelector(selectCartHydrated);

  // Initialise synchronously from localStorage — avoids the auth step flash
  // for users who are already logged in
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [step, setStep] = useState(() => {
    try {
      return localStorage.getItem("user") ? 2 : 1;
    } catch {
      return 1;
    }
  });

  const [address, setAddress] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  // Only redirect to cart AFTER hydration — avoids kicking user out
  // before localStorage cart items have been loaded into Redux state
  useEffect(() => {
    if (cartHydrated && !orderResult && cartItems.length === 0) {
      window.location.href = "/cart";
    }
  }, [cartHydrated, cartItems, orderResult]);

  if (orderResult) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-40 px-6 relative">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
        <SuccessScreen result={orderResult} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-40 px-4 relative">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />

      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Page Header */}
        <div className="text-center mb-10">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-foreground/30 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
          <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter mb-2">
            Check<span className="text-primary italic font-serif">out.</span>
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <CheckoutSteps currentStep={step} />
        </div>

        {/* Step Content */}
        <div className="glass border border-border/50 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AuthStep
                  onSuccess={(userData) => {
                    setUser(userData);
                    setStep(2);
                  }}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AddressStep
                  user={user}
                  onConfirm={(addr) => {
                    setAddress(addr);
                    setStep(3);
                  }}
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PaymentStep
                  user={user}
                  address={address}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  onSuccess={(result) => setOrderResult(result)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
