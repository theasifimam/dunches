"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  selectDeleteRequested,
  selectDeletionLoading,
  selectDeletionError,
  requestAccountDeletion,
  deleteAccount,
} from "@/features/user/userSlice";

export default function SecurityPage() {
  const dispatch = useDispatch();
  const deleteRequested = useSelector(selectDeleteRequested);
  const deletionLoading = useSelector(selectDeletionLoading);
  const deletionError = useSelector(selectDeletionError);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [successMsg, setSuccessMsg] = useState("");
  const [localError, setLocalError] = useState("");
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleRequestDelete = async () => {
    setLocalError("");
    setSuccessMsg("");
    try {
      const result = await dispatch(requestAccountDeletion()).unwrap();
      setSuccessMsg("Verification OTP sent to your registered email address.");
    } catch (err) {
      setLocalError(err || "Failed to send deletion OTP.");
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
    if (idx < 3 && clean) {
      setTimeout(() => otpRefs[idx + 1]?.current?.focus(), 10);
    }
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
      const n = [...otp];
      n[idx - 1] = "";
      setOtp(n);
      setTimeout(() => otpRefs[idx - 1]?.current?.focus(), 10);
    }
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setLocalError("");
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setLocalError("Please enter a valid 4-digit OTP.");
      return;
    }
    try {
      await dispatch(deleteAccount(otpCode)).unwrap();
      // On success, deleteAccount clears session and profile, layout will redirect.
    } catch (err) {
      setLocalError(err || "Failed to delete account. Please verify the OTP.");
      setOtp(["", "", "", ""]);
      setTimeout(() => otpRefs[0]?.current?.focus(), 10);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-foreground/30 mb-1">
          Security Vault
        </p>
        <h1 className="text-2xl font-black font-heading tracking-tight">
          Account Security
        </h1>
      </div>

      {/* Security Info Card */}
      <div className="p-6 bg-foreground/2 border border-border/50 rounded-4xl flex items-start gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-black uppercase tracking-wider">
            Protected Session
          </h3>
          <p className="text-[10px] text-foreground/40 leading-relaxed">
            Your login, session details, and personal data are safeguarded under modern encrypted storage protocols. Double check your settings here.
          </p>
        </div>
      </div>

      {/* Danger Zone / Delete Account */}
      <div className="border border-red-500/20 bg-red-500/2 rounded-4xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 border border-red-500/20 shrink-0 mt-0.5 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-500">
              Danger Zone: Delete Account
            </h3>
            <p className="text-[10px] text-red-500/60 leading-relaxed">
              Once you delete your account, your profile details, order histories, and saved addresses will be permanently archived and erased. This action is irreversible.
            </p>
          </div>
        </div>

        {/* Display messages */}
        {localError && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest">
            <XCircle className="w-4 h-4 shrink-0" />
            {localError}
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Action interface */}
        {!deleteRequested ? (
          <div className="pt-2">
            <Button
              onClick={handleRequestDelete}
              disabled={deletionLoading}
              className="h-12 px-6 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-2"
            >
              {deletionLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Requesting...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Permanently Delete My Account
                </>
              )}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleConfirmDelete} className="space-y-4 pt-2">
            <p className="text-[9px] font-black uppercase tracking-wider text-foreground/40">
              Enter 4-Digit Deletion Verification OTP
            </p>
            <div className="flex gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onKeyDown={(e) => handleOtpKey(e, idx)}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className={`w-12 h-14 text-center text-lg font-bold bg-foreground/3 border-2 rounded-2xl outline-none focus:bg-background transition-all ${
                    digit ? "border-red-500 text-foreground" : "border-transparent text-foreground/40"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={deletionLoading}
                className="h-12 px-6 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-2"
              >
                {deletionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Confirm Permanent Deletion"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOtp(["", "", "", ""]);
                  setSuccessMsg("");
                  setLocalError("");
                  // Trigger reload or reset flow by changing window state if needed
                  window.location.reload();
                }}
                className="h-12 px-6 rounded-full text-[10px] font-black uppercase tracking-widest border-border/60"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
