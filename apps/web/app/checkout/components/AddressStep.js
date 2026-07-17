"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  MapPin,
  Loader2,
  LocateFixed,
  Home,
  Briefcase,
  Map,
} from "lucide-react";

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

export default function AddressStep({ user, onConfirm }) {
  const defaultAddress =
    user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [form, setForm] = useState({
    ...EMPTY_ADDRESS,
    fullName: user?.name || "",
    mobile: user?.mobile?.replace(/^\+91/, "") || "",
  });
  const [hasLoadedDefault, setHasLoadedDefault] = useState(false);

  useEffect(() => {
    if (defaultAddress && !hasLoadedDefault) {
      setForm({
        label: defaultAddress.label || "Home",
        fullName: defaultAddress.fullName || user?.name || "",
        line1: defaultAddress.line1 || "",
        line2: defaultAddress.line2 || "",
        city: defaultAddress.city || "",
        state: defaultAddress.state || "",
        pincode: defaultAddress.pincode || "",
        mobile: (defaultAddress.mobile || user?.mobile || "").replace(
          /^\+91/,
          "",
        ),
      });
      setHasLoadedDefault(true);
    }
  }, [defaultAddress, user, hasLoadedDefault]);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const set = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
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
