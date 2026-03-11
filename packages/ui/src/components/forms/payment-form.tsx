"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

export interface PaymentFormProps {
  /** Callback fired on form submission */
  onSubmit: (data: PaymentFormData) => void;
  /** Whether to show the live card preview */
  showCardPreview?: boolean;
  /** Whether the form is submitting */
  loading?: boolean;
  /** Additional class names */
  className?: string;
}

type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown";

function detectCardType(number: string): CardType {
  const cleaned = number.replace(/\s/g, "");
  if (/^4/.test(cleaned)) return "visa";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  if (/^6(?:011|5)/.test(cleaned)) return "discover";
  return "unknown";
}

function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
}

function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
}

function maskCardNumber(number: string): string {
  const cleaned = number.replace(/\s/g, "");
  if (cleaned.length <= 4) return formatCardNumber(cleaned);
  const masked =
    cleaned.slice(0, 4) +
    " " +
    "**** **** " +
    cleaned.slice(-4).padStart(4, "*");
  return masked;
}

const cardTypeLabels: Record<CardType, string> = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
  discover: "DISC",
  unknown: "",
};

const cardTypeColors: Record<CardType, string> = {
  visa: "from-blue-600 to-blue-900",
  mastercard: "from-red-600 to-orange-600",
  amex: "from-slate-600 to-slate-900",
  discover: "from-orange-500 to-amber-600",
  unknown: "from-zinc-600 to-zinc-900",
};

export function PaymentForm({
  onSubmit,
  showCardPreview = true,
  loading = false,
  className,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  const cardType = useMemo(
    () => detectCardType(cardNumber),
    [cardNumber]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onSubmit({ cardNumber, cardHolder, expiry, cvv });
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(formatCardNumber(raw));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setExpiry(formatExpiry(raw));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(raw);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("w-full max-w-md space-y-6", className)}
    >
      {/* Card Preview */}
      {showCardPreview && (
        <div className="perspective-1000">
          <motion.div
            className="relative"
            animate={{ rotateY: isCvvFocused ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front */}
            <div
              className={cn(
                "relative h-48 w-full rounded-2xl bg-gradient-to-br p-6 text-white shadow-xl",
                cardTypeColors[cardType]
              )}
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-12 rounded-md bg-yellow-300/80" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cardType}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold tracking-wider opacity-80"
                  >
                    {cardTypeLabels[cardType]}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="mt-6 font-mono text-xl tracking-[0.2em]">
                {cardNumber
                  ? maskCardNumber(cardNumber)
                  : "**** **** **** ****"}
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">
                    Card Holder
                  </p>
                  <p className="text-sm font-medium tracking-wider">
                    {cardHolder || "YOUR NAME"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">
                    Expires
                  </p>
                  <p className="text-sm font-medium">
                    {expiry || "MM/YY"}
                  </p>
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className={cn(
                "absolute inset-0 h-48 w-full rounded-2xl bg-gradient-to-br p-6 text-white shadow-xl",
                cardTypeColors[cardType]
              )}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="mt-4 h-10 w-full bg-black/40" />
              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="h-8 flex-1 rounded bg-white/20" />
                <div className="flex h-8 w-16 items-center justify-center rounded bg-white/30 font-mono text-sm tracking-wider">
                  {cvv || "CVV"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              required
              className={cn(
                "h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground",
                "placeholder:text-muted-foreground",
                "outline-none transition-all duration-200",
                "focus:border-primary focus:ring-2 focus:ring-primary/20"
              )}
            />
          </div>
        </div>

        {/* Card Holder */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Card Holder
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            placeholder="JOHN DOE"
            required
            className={cn(
              "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground",
              "placeholder:text-muted-foreground",
              "outline-none transition-all duration-200",
              "focus:border-primary focus:ring-2 focus:ring-primary/20"
            )}
          />
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Expiry Date
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              required
              className={cn(
                "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground",
                "placeholder:text-muted-foreground",
                "outline-none transition-all duration-200",
                "focus:border-primary focus:ring-2 focus:ring-primary/20"
              )}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              CVV
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={cvv}
                onChange={handleCvvChange}
                onFocus={() => setIsCvvFocused(true)}
                onBlur={() => setIsCvvFocused(false)}
                placeholder="123"
                required
                className={cn(
                  "h-11 w-full rounded-lg border border-input bg-background pl-4 pr-10 text-sm text-foreground",
                  "placeholder:text-muted-foreground",
                  "outline-none transition-all duration-200",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20"
                )}
              />
              <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={cn(
            "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground",
            "transition-opacity duration-200",
            "disabled:opacity-70 disabled:cursor-not-allowed"
          )}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Pay securely
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </motion.div>
  );
}
