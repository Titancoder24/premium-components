'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TwoFactorAuthProps {
  /** Verification method: authenticator app or SMS */
  method: 'authenticator' | 'sms';
  /** Callback fired with the full OTP code */
  onVerify: (code: string) => void;
  /** Callback to resend a code (SMS only) */
  onResend?: () => void;
  /** QR code image URL for authenticator setup */
  qrCodeUrl?: string;
  /** Error message to display */
  error?: string;
  /** Whether verification is in progress */
  loading?: boolean;
  /** Whether verification succeeded */
  success?: boolean;
  /** Number of OTP digits */
  codeLength?: number;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Shake animation
// ---------------------------------------------------------------------------

const shakeAnimation = {
  x: [0, -10, 10, -8, 8, -4, 4, 0],
  transition: { duration: 0.5 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TwoFactorAuth({
  method,
  onVerify,
  onResend,
  qrCodeUrl,
  error,
  loading = false,
  success = false,
  codeLength = 6,
  className,
}: TwoFactorAuthProps) {
  const [digits, setDigits] = React.useState<string[]>(
    Array(codeLength).fill(''),
  );
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [shakeKey, setShakeKey] = React.useState(0);

  // Trigger shake on new errors
  React.useEffect(() => {
    if (error) {
      setShakeKey((k) => k + 1);
    }
  }, [error]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    // Only accept single digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < codeLength - 1) {
      focusInput(index + 1);
    }

    // Auto-submit when all filled
    if (digit && index === codeLength - 1 && next.every((d) => d !== '')) {
      onVerify(next.join(''));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace') {
      if (digits[index] === '' && index > 0) {
        focusInput(index - 1);
      } else {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < codeLength - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, codeLength);
    if (pasted.length === 0) return;

    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);

    const focusIdx = Math.min(pasted.length, codeLength - 1);
    focusInput(focusIdx);

    if (next.every((d) => d !== '')) {
      onVerify(next.join(''));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-lg',
        className,
      )}
    >
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {method === 'authenticator' ? (
            <ShieldCheck className="h-6 w-6 text-primary" />
          ) : (
            <Smartphone className="h-6 w-6 text-primary" />
          )}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Two-Factor Authentication
        </h2>
        <p className="text-sm text-muted-foreground">
          {method === 'authenticator'
            ? 'Enter the code from your authenticator app'
            : 'Enter the code we sent to your phone'}
        </p>
      </div>

      {/* QR Code for authenticator */}
      {method === 'authenticator' && qrCodeUrl && !success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <div className="rounded-xl border border-border bg-white p-4">
            <img
              src={qrCodeUrl}
              alt="Scan QR code with your authenticator app"
              className="h-40 w-40"
            />
          </div>
        </motion.div>
      )}

      {/* Success state */}
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.175, 0.885, 0.32, 1.275],
            }}
            className="flex flex-col items-center gap-3 py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.5,
                ease: [0.175, 0.885, 0.32, 1.275],
              }}
            >
              <CheckCircle2 className="h-16 w-16 text-[var(--color-success,#22c55e)]" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-semibold text-foreground"
            >
              Verified successfully
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="input" className="space-y-4">
            {/* OTP Input */}
            <motion.div
              key={shakeKey}
              animate={error ? shakeAnimation : {}}
              className="flex justify-center gap-2"
            >
              {digits.map((digit, i) => (
                <motion.input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  autoFocus={i === 0}
                  className={cn(
                    'h-14 w-12 rounded-lg border text-center text-xl font-bold',
                    'bg-background text-foreground',
                    'outline-none transition-all duration-200',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    error
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'border-input',
                  )}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                />
              ))}
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-center gap-2 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verify button */}
            <motion.button
              type="button"
              disabled={loading || digits.some((d) => d === '')}
              onClick={() => onVerify(digits.join(''))}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={cn(
                'relative flex h-11 w-full items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground',
                'transition-opacity duration-200',
                'disabled:opacity-70 disabled:cursor-not-allowed',
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
                    Verifying...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Verify Code
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Resend for SMS */}
            {method === 'sms' && onResend && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={onResend}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Didn&apos;t receive a code? Resend
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
