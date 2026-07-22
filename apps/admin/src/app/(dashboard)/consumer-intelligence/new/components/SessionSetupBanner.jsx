"use client";

import React from "react";
import { MapPin, Settings, RefreshCw } from "lucide-react";

export default function SessionSetupBanner({
  formData,
  handleChange,
  showSessionDetails,
  setShowSessionDetails,
  handleResetSession,
  sources,
}) {
  return (
    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex flex-col gap-2 mb-6">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-bold text-primary">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>
            {formData.samplingLocation || formData.societyEventName
              ? `${formData.source} @ ${formData.samplingLocation || ""} ${
                  formData.societyEventName
                    ? `(${formData.societyEventName})`
                    : ""
                }`
              : `${formData.source} Session Setup`}
            {formData.executiveName ? ` • By ${formData.executiveName}` : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowSessionDetails(!showSessionDetails)}
          className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline"
        >
          <Settings className="h-3 w-3" />
          {showSessionDetails ? "Hide Setup" : "Edit Setup"}
        </button>
      </div>

      {showSessionDetails && (
        <div className="pt-3 border-t border-primary/10 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-in fade-in duration-350">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => handleChange("source", e.target.value)}
              className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
              Location
            </label>
            <input
              type="text"
              value={formData.samplingLocation}
              onChange={(e) => handleChange("samplingLocation", e.target.value)}
              className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Select Citywalk"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
              Event Name
            </label>
            <input
              type="text"
              value={formData.societyEventName}
              onChange={(e) => handleChange("societyEventName", e.target.value)}
              className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="DLF Phase 1"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
              Executive
            </label>
            <input
              type="text"
              value={formData.executiveName}
              onChange={(e) => handleChange("executiveName", e.target.value)}
              className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Your Name"
            />
          </div>
          <div className="sm:col-span-4 flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleResetSession}
              className="text-[9px] font-black uppercase tracking-widest text-destructive hover:opacity-85 flex items-center gap-1"
            >
              <RefreshCw className="h-2.5 w-2.5" /> Reset Session Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
