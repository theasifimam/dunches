"use client";

import { motion } from "framer-motion";
import { Check, Phone, MapPin, CreditCard } from "lucide-react";

const STEPS = [
  { id: 1, label: "Verify", sublabel: "Mobile OTP", icon: Phone },
  { id: 2, label: "Address", sublabel: "Delivery Location", icon: MapPin },
  { id: 3, label: "Payment", sublabel: "Place Order", icon: CreditCard },
];

export default function CheckoutSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-sm mx-auto">
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: isCompleted
                    ? "hsl(var(--primary))"
                    : isActive
                    ? "hsl(var(--primary) / 0.15)"
                    : "hsl(var(--foreground) / 0.05)",
                  borderColor: isCompleted || isActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--border))",
                }}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all"
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-primary" : "text-foreground/25"
                    }`}
                  />
                )}
              </motion.div>
              <div className="text-center">
                <p
                  className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-foreground/60"
                      : "text-foreground/25"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[8px] text-foreground/30 font-medium tracking-wide hidden sm:block">
                  {step.sublabel}
                </p>
              </div>
            </div>

            {/* Connector line between steps */}
            {idx < STEPS.length - 1 && (
              <motion.div
                animate={{
                  backgroundColor:
                    currentStep > step.id
                      ? "hsl(var(--primary))"
                      : "hsl(var(--border))",
                }}
                className="h-px w-12 sm:w-20 mx-2 mb-6 transition-colors"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
