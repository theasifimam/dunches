"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  Send,
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
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/settings/contact`,
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

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-40 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.02]" />
      <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/3 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 space-y-12">
        {/* Title Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light font-serif tracking-tighter lowercase">
            we&apos;d love to hear from you
          </h1>
          <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest leading-loose">
            Reach out for queries, bulk orders, or flavor suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Quick Channels Column (Left) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 px-1 pb-1">
              Direct Channels
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210?text=Hi%20Dunches!%20I%20have%20a%20query%20about%20your%20snacks."
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-6 rounded-[2rem] border border-border/50 bg-foreground/2 hover:border-primary/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      WhatsApp Chat
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light">
                      Instant reply in minutes
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Email */}
            <a href="mailto:eatdunches@gmail.com" className="block group">
              <div className="p-6 rounded-[2rem] border border-border/50 bg-foreground/2 hover:border-primary/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Email Inquiry
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light">
                      eatdunches@gmail.com
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Phone Call */}
            <a href="tel:+919876543210" className="block group">
              <div className="p-6 rounded-[2rem] border border-border/50 bg-foreground/2 hover:border-primary/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Call Hotline
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/eatdunches"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-6 rounded-[2rem] border border-border/50 bg-foreground/2 hover:border-primary/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Instagram Feed
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light">
                      @eatdunches
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Facebook */}
            <a
              href="https://fb.com/eatdunches"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-6 rounded-[2rem] border border-border/50 bg-foreground/2 hover:border-primary/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Facebook Page
                    </h3>
                    <p className="text-[10px] text-foreground/45 mt-0.5 font-light">
                      fb.com/eatdunches
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>
          </div>

          {/* Form Message Box (Right) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 px-1 pb-1">
              Send Support Message
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2.5rem] border border-border/50 bg-foreground/2 backdrop-blur-xl space-y-6"
            >
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold rounded-2xl">
                  {success}
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-2xl">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/45 block mb-2 px-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="w-full bg-foreground/3 border border-transparent focus:border-primary/40 focus:bg-background rounded-2xl h-12 px-4 text-xs font-bold tracking-wide placeholder:text-foreground/20 outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/45 block mb-2 px-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="w-full bg-foreground/3 border border-transparent focus:border-primary/40 focus:bg-background rounded-2xl h-12 px-4 text-xs font-bold tracking-wide placeholder:text-foreground/20 outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/45 block mb-2 px-1">
                  Your Message
                </label>
                <textarea
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-foreground/3 border border-transparent focus:border-primary/40 focus:bg-background rounded-2xl p-4 text-xs font-bold tracking-wide placeholder:text-foreground/20 outline-none transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3"
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
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}
