"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile, setProfile } from "@/features/user/userSlice";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";
import PhoneRequestForm from "@/components/auth/PhoneRequestForm";
import OtpVerificationStep from "@/components/auth/OtpVerificationStep";
import SignupDetailsForm from "@/components/auth/SignupDetailsForm";
import ForgotResetForm from "@/components/auth/ForgotResetForm";

const API_BASE = "";

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
      const res = await fetch(
        `${API_BASE}/api/v1/auth/phone-forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile }),
        },
      );
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
            Checkout Authentication
          </span>
        </div>
        <h2 className="text-2xl font-black font-heading tracking-tight">
          {step === "login" && "Sign In to Complete Order"}
          {step === "signup" && "Create Account"}
          {(step === "signup-otp" || step === "forgot-otp") && "Verify Phone"}
          {step === "signup-details" && "Your Information"}
          {step === "forgot-password" && "Reset Password"}
          {step === "forgot-reset" && "New Password"}
        </h2>
      </div>

      {error && (
        <div
          className={`mb-4 text-[9px] font-black p-3 rounded-xl tracking-widest uppercase text-center ${
            error.includes("successful")
              ? "text-green-500 bg-green-500/5 border border-green-500/10"
              : "text-red-500 bg-red-500/5 border border-red-500/10"
          }`}
        >
          {error}
        </div>
      )}

      {step === "login" && (
        <LoginForm
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          showPwd={showPwd}
          setShowPwd={setShowPwd}
          loading={loading}
          onLogin={handleLogin}
          onForgotPassword={() => {
            setStep("forgot-password");
            setError("");
          }}
          onSignUp={() => {
            setStep("signup");
            setError("");
          }}
        />
      )}

      {(step === "signup" || step === "forgot-password") && (
        <PhoneRequestForm
          step={step}
          phone={phone}
          setPhone={setPhone}
          loading={loading}
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
          onSubmit={
            step === "signup" ? handleSignupRequest : handleForgotRequest
          }
          onBackToLogin={() => {
            setStep("login");
            setError("");
          }}
        />
      )}

      {(step === "signup-otp" || step === "forgot-otp") && (
        <OtpVerificationStep
          step={step}
          fullMobile={maskedPhone}
          otp={otp}
          otpRefs={otpRefs}
          timer={timer}
          handleOtpKey={handleOtpKey}
          handleOtpChange={handleOtpChange}
          onResend={async () => {
            setError("");
            setOtp(["", "", "", ""]);
            try {
              step === "signup-otp"
                ? await handleSignupRequest()
                : await handleForgotRequest();
            } catch (e) {}
          }}
          onChangeNumber={() => {
            setStep(step === "signup-otp" ? "signup" : "forgot-password");
            setOtp(["", "", "", ""]);
            setError("");
          }}
        />
      )}

      {step === "signup-details" && (
        <SignupDetailsForm
          name={name}
          setName={setName}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          showNewPwd={showNewPwd}
          setShowNewPwd={setShowNewPwd}
          loading={loading}
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
          onSubmit={handleSignupVerify}
        />
      )}

      {step === "forgot-reset" && (
        <ForgotResetForm
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          showNewPwd={showNewPwd}
          setShowNewPwd={setShowNewPwd}
          loading={loading}
          onSubmit={handleForgotVerify}
        />
      )}
    </motion.div>
  );
}
