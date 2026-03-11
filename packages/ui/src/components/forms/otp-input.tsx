"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface OtpInputProps {
  /** Number of OTP digits */
  length?: number;
  /** Callback fired when all digits are entered */
  onComplete: (otp: string) => void;
  /** Callback fired when resend is clicked */
  onResend?: () => void;
  /** Cooldown in seconds before resend is available */
  resendCooldown?: number;
  /** Error message */
  error?: string;
  /** Whether the OTP is being verified */
  loading?: boolean;
  /** Additional class names */
  className?: string;
}

export function OtpInput({
  length = 6,
  onComplete,
  onResend,
  resendCooldown = 60,
  error,
  loading = false,
  className,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusInput = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputRefs.current[clamped]?.focus();
    setActiveIndex(clamped);
  }, [length]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only accept digits
      const digit = value.replace(/\D/g, "").slice(-1);
      const newDigits = [...digits];
      newDigits[index] = digit;
      setDigits(newDigits);
      setIsComplete(false);

      if (digit && index < length - 1) {
        // Auto-advance
        focusInput(index + 1);
      }

      // Check if complete
      const otp = newDigits.join("");
      if (otp.length === length && newDigits.every((d) => d !== "")) {
        setIsComplete(true);
        onComplete(otp);
      }
    },
    [digits, length, focusInput, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (digits[index]) {
          const newDigits = [...digits];
          newDigits[index] = "";
          setDigits(newDigits);
          setIsComplete(false);
        } else if (index > 0) {
          const newDigits = [...digits];
          newDigits[index - 1] = "";
          setDigits(newDigits);
          setIsComplete(false);
          focusInput(index - 1);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [digits, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (pasted.length === 0) return;

      const newDigits = [...digits];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);

      const otp = newDigits.join("");
      if (otp.length === length && newDigits.every((d) => d !== "")) {
        setIsComplete(true);
        onComplete(otp);
        inputRefs.current[length - 1]?.focus();
      } else {
        focusInput(Math.min(pasted.length, length - 1));
      }
    },
    [digits, length, focusInput, onComplete]
  );

  const handleResend = useCallback(() => {
    if (cooldown > 0) return;
    setCooldown(resendCooldown);
    setDigits(Array(length).fill(""));
    setIsComplete(false);
    focusInput(0);
    onResend?.();
  }, [cooldown, resendCooldown, length, focusInput, onResend]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("flex flex-col items-center gap-6", className)}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Verification Code
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the {length}-digit code sent to your device
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex items-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <motion.div
            key={index}
            animate={
              error
                ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
                : isComplete
                ? { scale: [1, 1.05, 1] }
                : {}
            }
            transition={
              error
                ? { duration: 0.5 }
                : isComplete
                ? { duration: 0.3, delay: index * 0.05 }
                : {}
            }
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => setActiveIndex(index)}
              disabled={loading}
              className={cn(
                "h-14 w-11 rounded-lg border-2 bg-background text-center text-xl font-semibold text-foreground sm:h-16 sm:w-14",
                "outline-none transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                error
                  ? "border-destructive bg-destructive/5"
                  : isComplete
                  ? "border-green-500 bg-green-500/5"
                  : activeIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : digit
                  ? "border-foreground/30"
                  : "border-input"
              )}
            />
          </motion.div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}

      {/* Loading indicator */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Verifying...
        </motion.div>
      )}

      {/* Resend */}
      {onResend && (
        <div className="text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Resend code in{" "}
              <span className="font-medium text-foreground">{cooldown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Resend code
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
