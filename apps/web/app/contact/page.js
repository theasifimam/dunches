"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  Send,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002"}/api/v1/settings`
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002"}/api/v1/settings/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      setSuccess("Your message has been sent to the admin successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-40 relative overflow-hidden">
      {/* Premium Background Aura Lights */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/4 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/3 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 max-w-5xl relative z-10 space-y-16"
      >
        {/* Title Header */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-primary fill-primary/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
              get in touch
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground font-sans lowercase leading-[0.95]">
            we&apos;d love to <br />
            <span className="font-serif italic font-light text-foreground/45">
              hear from you.
            </span>
          </h1>
          <p className="text-[11px] text-foreground/40 font-black uppercase tracking-[0.25em] leading-loose max-w-md mx-auto">
            Reach out for queries, bulk orders, or flavor suggestions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Quick Channels Column (Left) */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 px-2 pb-1">
              Direct Channels
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${settings?.whatsappNumber || "919876543210"}?text=Hi%20Dunches!%20I%20have%20a%20query%20about%20your%20snacks.`}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-6 rounded-[2.5rem] border border-border/40 bg-foreground/2 hover:border-primary/20 hover:bg-foreground/3 hover:scale-102 transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-5 h-5 fill-green-500/10" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      WhatsApp Chat
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light">
                      {settings?.whatsappNumber ? `+${settings.whatsappNumber}` : "+91 98765 43210"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Email */}
            <a href={`mailto:${settings?.contactEmail || "eatdunches@gmail.com"}`} className="block group">
              <div className="p-6 rounded-[2.5rem] border border-border/40 bg-foreground/2 hover:border-primary/20 hover:bg-foreground/3 hover:scale-102 transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-5 h-5 fill-primary/10" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Email Inquiry
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light">
                      {settings?.contactEmail || "eatdunches@gmail.com"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Phone Call */}
            <a href={`tel:${settings?.contactPhone || "+919876543210"}`} className="block group">
              <div className="p-6 rounded-[2.5rem] border border-border/40 bg-foreground/2 hover:border-primary/20 hover:bg-foreground/3 hover:scale-102 transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-5 h-5 fill-blue-500/10" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Call Hotline
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light">
                      {settings?.contactPhone || "+91 98765 43210"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Instagram */}
            <a
              href={settings?.instagramUrl || "https://instagram.com/eatdunches"}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-6 rounded-[2.5rem] border border-border/40 bg-foreground/2 hover:border-primary/20 hover:bg-foreground/3 hover:scale-102 transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="rgba(244,63,94,0.1)" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Instagram Feed
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light">
                      {settings?.instagramUrl ? `@${settings.instagramUrl.split("/").filter(Boolean).pop()}` : "@eatdunches"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Facebook */}
            <a
              href={settings?.facebookUrl || "https://fb.com/eatdunches"}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-6 rounded-[2.5rem] border border-border/40 bg-foreground/2 hover:border-primary/20 hover:bg-foreground/3 hover:scale-102 transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="rgba(37,99,235,0.1)" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Facebook Page
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light font-medium">
                      {settings?.facebookUrl ? settings.facebookUrl.split("/").filter(Boolean).pop() : "eatdunches"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Store Address Location */}
            {settings?.address && (
              <div className="p-6 rounded-[2.5rem] border border-border/40 bg-foreground/2 flex items-start gap-4 shadow-xs hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  <MapPin className="w-5 h-5 fill-amber-500/10" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1 text-foreground">
                    Store Location
                  </h3>
                  <p className="text-[10px] text-foreground/60 leading-relaxed font-medium whitespace-pre-line">
                    {settings.address}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Form Message Box (Right) */}
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 px-2 pb-1">
              Send Support Message
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-[2.5rem] border border-border/40 bg-foreground/2 backdrop-blur-xl space-y-6"
            >
              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold rounded-2xl flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-2xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/45 block px-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="w-full bg-foreground/3 border border-border/40 focus:border-primary/40 focus:bg-background focus:ring-4 focus:ring-primary/5 rounded-3xl h-12 px-5 text-xs font-bold tracking-wide placeholder:text-foreground/20 outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/45 block px-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="w-full bg-foreground/3 border border-border/40 focus:border-primary/40 focus:bg-background focus:ring-4 focus:ring-primary/5 rounded-3xl h-12 px-5 text-xs font-bold tracking-wide placeholder:text-foreground/20 outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/45 block px-1">
                  Your Message
                </label>
                <textarea
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-foreground/3 border border-border/40 focus:border-primary/40 focus:bg-background focus:ring-4 focus:ring-primary/5 rounded-[1.5rem] p-5 text-xs font-bold tracking-wide placeholder:text-foreground/20 outline-none transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-3xl text-[10px] font-black tracking-[0.2em] uppercase shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

