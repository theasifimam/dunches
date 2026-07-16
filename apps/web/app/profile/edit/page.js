"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Camera,
  User,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  selectUser,
  selectUserUpdating,
  selectUserError,
  updateProfile,
  clearError,
} from "@/features/user/userSlice";
import { isRealEmail } from "@/lib/utils";

const GENDERS = ["male", "female", "other"];

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updating = useSelector(selectUserUpdating);
  const serverError = useSelector(selectUserError);

  const avatarRef = useRef();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        mobile: user.mobile || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      });
    }
  }, [user]);

  const avatarSrc =
    avatarPreview ||
    (user?.avatar
      ? `${user.avatar.startsWith("/uploads") ? "" : "/uploads/"}${user.avatar.replace(/^\/uploads\//, "")}`
      : null);

  const set = (field) => (e) => {
    setSaved(false);
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let payload;
    if (avatarFile) {
      payload = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) payload.append(k, v);
      });
      payload.append("avatar", avatarFile);
    } else {
      payload = { ...form };
    }
    const result = await dispatch(updateProfile(payload));
    if (!result.error) {
      setSaved(true);
      setAvatarFile(null);
    }
  };

  const realEmail = isRealEmail(user?.email) ? user.email : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-foreground/30 mb-1">
          Personal Info
        </p>
        <h1 className="text-2xl font-black font-heading tracking-tight">
          Edit Profile
        </h1>
      </div>

      {/* Alerts */}
      {serverError && (
        <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {serverError}
          <button onClick={() => dispatch(clearError())} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/20 rounded-2xl text-green-600 text-[10px] font-black uppercase tracking-widest">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Profile updated successfully
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-foreground/2 border border-border/50 rounded-4xl p-6 sm:p-8 space-y-8"
      >
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-foreground/5 border-4 border-background shadow-xl overflow-hidden flex items-center justify-center ring-2 ring-primary/20">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-foreground/20" />
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary hover:bg-primary-hover rounded-full flex items-center justify-center shadow-lg border-2 border-background transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-sm font-black font-heading">{user?.name}</p>
            <p className="text-[10px] text-foreground/40 mt-1">
              Click the camera icon to change your photo
            </p>
            {avatarFile && (
              <button
                type="button"
                onClick={() => {
                  setAvatarFile(null);
                  setAvatarPreview(null);
                }}
                className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-2 hover:text-red-600 transition-colors"
              >
                Remove new photo
              </button>
            )}
          </div>
        </div>

        <Separator className="opacity-30" />

        {/* Fields */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/50"
              >
                Full Name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={set("name")}
                placeholder="Your full name"
                className="rounded-xl border-border/50 bg-foreground/3 focus-visible:ring-primary/30 h-11"
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/50"
              >
                Mobile Number
              </Label>
              <Input
                id="mobile"
                value={form.mobile}
                onChange={(e) => {
                  setSaved(false);
                  setForm((p) => ({
                    ...p,
                    mobile: e.target.value.replace(/\D/g, "").slice(0, 13),
                  }));
                }}
                placeholder="+91 XXXXXXXXXX"
                className="rounded-xl border-border/50 bg-foreground/3 focus-visible:ring-primary/30 h-11"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label
                htmlFor="dob"
                className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/50"
              >
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={form.dateOfBirth}
                onChange={set("dateOfBirth")}
                className="rounded-xl border-border/50 bg-foreground/3 focus-visible:ring-primary/30 h-11"
              />
            </div>

            {/* Email — read-only, only shown if real */}
            {realEmail && (
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/50">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    value={realEmail}
                    readOnly
                    className="rounded-xl border-border/30 bg-foreground/1.5 text-foreground/50 cursor-not-allowed h-11 pr-24"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-widest text-foreground/25 bg-foreground/5 px-2 py-1 rounded-full">
                    Read-only
                  </span>
                </div>
                <p className="text-[9px] text-foreground/30">
                  Email address cannot be changed. Contact support if needed.
                </p>
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/50">
              Gender
            </Label>
            <div className="flex gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setSaved(false);
                    setForm((p) => ({ ...p, gender: g }));
                  }}
                  className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                    form.gender === g
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 text-foreground/40 hover:border-primary/40 hover:text-foreground/70 bg-foreground/2"
                  }`}
                >
                  {g}
                </button>
              ))}
              {form.gender && (
                <button
                  type="button"
                  onClick={() => {
                    setSaved(false);
                    setForm((p) => ({ ...p, gender: "" }));
                  }}
                  className="px-3 py-2.5 rounded-xl border border-border/50 text-foreground/30 hover:text-foreground/60 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <Separator className="opacity-30" />

        {/* Submit */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-[9px] text-foreground/30 leading-relaxed hidden sm:block">
            Changes are saved to your account immediately.
          </p>
          <Button
            type="submit"
            disabled={updating}
            className="h-12 px-10 rounded-full text-[11px] font-black tracking-[0.2em] uppercase shadow-lg flex items-center gap-2"
          >
            {updating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
