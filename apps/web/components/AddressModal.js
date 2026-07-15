"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Home,
  Briefcase,
  Map,
  RefreshCw,
  Check,
  LocateFixed,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";

const LABEL_OPTIONS = [
  { value: "Home", icon: Home },
  { value: "Work", icon: Briefcase },
  { value: "Other", icon: Map },
];

const EMPTY_FORM = {
  label: "Home",
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  mobile: "",
  isDefault: false,
};

// Reverse geocode using OpenStreetMap Nominatim (free, no key required)
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "DunchesApp/1.0" },
  });
  if (!res.ok) throw new Error("Geocoding failed");
  return res.json();
}

export default function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  error,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
      setGpsError("");
    }
  }, [isOpen, initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const geo = await reverseGeocode(latitude, longitude);
          const addr = geo.address || {};

          // Build address fields from Nominatim response
          const road = addr.road || addr.pedestrian || addr.footway || "";
          const houseNumber = addr.house_number ? `${addr.house_number}, ` : "";
          const neighbourhood =
            addr.neighbourhood || addr.suburb || addr.quarter || "";
          const city =
            addr.city || addr.town || addr.village || addr.county || "";
          const state = addr.state || "";
          const postcode = (addr.postcode || "").replace(/\s/g, "").slice(0, 6);

          setForm((prev) => ({
            ...prev,
            line1: `${houseNumber}${road}`.trim(),
            line2: neighbourhood,
            city,
            state,
            pincode: postcode,
          }));
        } catch {
          setGpsError("Could not fetch address from location. Please fill manually.");
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) {
          setGpsError("Location access denied. Please allow location permission and try again.");
        } else {
          setGpsError("Unable to get your location. Please fill the address manually.");
        }
      },
      { timeout: 10000, maximumAge: 0 }
    );
  };

  const isEdit = !!initialData;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-300 flex items-end sm:items-center justify-center sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-3xl"
          />

          <motion.div
            initial={{
              opacity: 0,
              y:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? "100%"
                  : 30,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? "100%"
                  : 30,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-background border border-border/50 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.3)] overflow-hidden max-h-[90dvh] overflow-y-auto"
          >
            {/* Pull Handle */}
            <div className="sm:hidden w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mt-4 mb-2" />

            {/* Header */}
            <div className="sticky top-0 bg-background z-10 flex items-center justify-between px-8 sm:px-10 pt-8 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30">
                    Delivery Address
                  </p>
                  <h2 className="text-lg font-black font-heading tracking-tight">
                    {isEdit ? "Edit Address" : "Add New Address"}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full glass border border-border flex items-center justify-center text-foreground/40 hover:text-primary transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-5">
              {/* Error */}
              {error && (
                <div className="text-[10px] font-black text-red-500 bg-red-500/5 border border-red-500/10 p-4 rounded-xl tracking-widest uppercase">
                  {error}
                </div>
              )}

              {/* GPS Auto-fill Button */}
              <div>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={gpsLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-60"
                >
                  {gpsLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Fetching your location...
                    </>
                  ) : (
                    <>
                      <LocateFixed className="w-4 h-4" />
                      Use My Current Location
                    </>
                  )}
                </button>
                {gpsError && (
                  <p className="text-[9px] font-bold text-red-500 mt-2 px-1 tracking-wide">
                    {gpsError}
                  </p>
                )}
              </div>

              {/* Label */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">
                  Address Label
                </p>
                <div className="flex gap-2">
                  {LABEL_OPTIONS.map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleChange("label", value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        form.label === value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 text-foreground/40 hover:border-primary/40"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <InputField
                label="Full Name"
                placeholder="Recipient full name"
                value={form.fullName}
                onChange={(v) => handleChange("fullName", v)}
                required
              />

              {/* Address Lines */}
              <InputField
                label="Address Line 1"
                placeholder="House / Flat / Building no., Street"
                value={form.line1}
                onChange={(v) => handleChange("line1", v)}
                required
              />
              <InputField
                label="Address Line 2"
                placeholder="Area, Colony, Landmark (optional)"
                value={form.line2}
                onChange={(v) => handleChange("line2", v)}
              />

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="City"
                  placeholder="City"
                  value={form.city}
                  onChange={(v) => handleChange("city", v)}
                  required
                />
                <InputField
                  label="State"
                  placeholder="State"
                  value={form.state}
                  onChange={(v) => handleChange("state", v)}
                  required
                />
              </div>

              {/* Pincode & Mobile */}
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Pincode"
                  placeholder="6-digit pincode"
                  value={form.pincode}
                  onChange={(v) =>
                    handleChange("pincode", v.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                />
                <InputField
                  label="Mobile"
                  placeholder="10-digit mobile"
                  value={form.mobile}
                  onChange={(v) =>
                    handleChange("mobile", v.replace(/\D/g, "").slice(0, 10))
                  }
                  required
                />
              </div>

              {/* Default Toggle */}
              <button
                type="button"
                onClick={() => handleChange("isDefault", !form.isDefault)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  form.isDefault
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border/50 text-foreground/40 hover:border-primary/30"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Set as Default Address
                </span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    form.isDefault
                      ? "border-primary bg-primary"
                      : "border-foreground/20"
                  }`}
                >
                  {form.isDefault && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
              </button>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isEdit ? "Update Address" : "Save Address"}
                    <MapPin className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function InputField({ label, placeholder, value, onChange, required }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-2">
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
