'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PasswordResetFlowProps {
  /** Current step of the reset flow */
  step: 'request' | 'reset';
  /** Callback fired when user requests a password reset email */
  onRequestReset: (email: string) => void;
  /** Callback fired when user submits the new password */
  onResetPassword: (password: string) => void;
  /** Whether an action is in progress */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Whether the current step completed successfully */
  success?: boolean;
  /** Callback to navigate back to request step */
  onBack?: () => void;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Password strength calculation
// ---------------------------------------------------------------------------

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
}

function getPasswordStrength(password: string): StrengthResult {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 0.5;

  const rounded = Math.min(4, Math.round(score));

  const levels: Record<number, { label: string; color: string }> = {
    0: { label: 'Too weak', color: 'var(--color-destructive, #ef4444)' },
    1: { label: 'Weak', color: 'var(--color-destructive, #ef4444)' },
    2: { label: 'Fair', color: 'var(--color-warning, #f59e0b)' },
    3: { label: 'Good', color: 'var(--color-info, #3b82f6)' },
    4: { label: 'Strong', color: 'var(--color-success, #22c55e)' },
  };

  return { score: rounded, ...levels[rounded] };
}

// ---------------------------------------------------------------------------
// Animated envelope
// ---------------------------------------------------------------------------

function AnimatedEnvelope() {
  return (
    <motion.div
      className="relative mx-auto flex h-24 w-24 items-center justify-center"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Mail className="h-10 w-10 text-primary" />
      </motion.div>
      <motion.div
        className="absolute -right-1 -top-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        <CheckCircle2 className="h-8 w-8 text-[var(--color-success,#22c55e)]" />
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Animated lock success
// ---------------------------------------------------------------------------

function AnimatedLockSuccess() {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-success,#22c55e)]/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
        >
          <Lock className="h-10 w-10 text-[var(--color-success,#22c55e)]" />
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 0] }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="h-24 w-24 rounded-full border-2 border-[var(--color-success,#22c55e)]/30" />
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PasswordResetFlow({
  step,
  onRequestReset,
  onResetPassword,
  loading = false,
  error,
  success = false,
  onBack,
  className,
}: PasswordResetFlowProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const strength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword;
  const canSubmitReset =
    password.length >= 8 && passwordsMatch && strength.score >= 2;

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onRequestReset(email.trim());
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmitReset) {
      onResetPassword(password);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-lg',
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {/* ---- REQUEST STEP ---- */}
        {step === 'request' && (
          <motion.div
            key="request"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="p-8"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="email-sent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-center"
                >
                  <AnimatedEnvelope />
                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-foreground"
                  >
                    Check your email
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-muted-foreground"
                  >
                    We sent a reset link to{' '}
                    <span className="font-medium text-foreground">{email}</span>
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="request-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleRequestSubmit}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                      Reset password
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your email and we&apos;ll send you a reset link
                    </p>
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="reset-email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email address
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      className={cn(
                        'flex h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground',
                        'outline-none transition-all duration-200',
                        'placeholder:text-muted-foreground',
                        'focus:border-primary focus:ring-2 focus:ring-primary/20',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error
                          ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                          : 'border-input',
                      )}
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-sm text-destructive"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading || !email.trim()}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={cn(
                      'flex h-11 w-full items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground',
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
                          Sending...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Send Reset Link
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ---- RESET STEP ---- */}
        {step === 'reset' && (
          <motion.div
            key="reset"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="p-8"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="reset-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-center"
                >
                  <AnimatedLockSuccess />
                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-bold text-foreground"
                  >
                    Password updated
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-muted-foreground"
                  >
                    Your password has been reset successfully.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleResetSubmit}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                      Create new password
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Choose a strong password for your account
                    </p>
                  </div>

                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  )}

                  {/* New password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="new-password"
                      className="text-sm font-medium text-foreground"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        disabled={loading}
                        className={cn(
                          'flex h-11 w-full rounded-lg border bg-background px-3 pr-10 text-sm text-foreground',
                          'outline-none transition-all duration-200',
                          'placeholder:text-muted-foreground',
                          'focus:border-primary focus:ring-2 focus:ring-primary/20',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          error
                            ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                            : 'border-input',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-1.5"
                      >
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="h-1.5 flex-1 rounded-full bg-muted"
                            >
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                  width: i < strength.score ? '100%' : '0%',
                                }}
                                style={{ backgroundColor: strength.color }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                              />
                            </motion.div>
                          ))}
                        </div>
                        <p
                          className="text-xs font-medium"
                          style={{ color: strength.color }}
                        >
                          {strength.label}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        disabled={loading}
                        className={cn(
                          'flex h-11 w-full rounded-lg border bg-background px-3 pr-10 text-sm text-foreground',
                          'outline-none transition-all duration-200',
                          'placeholder:text-muted-foreground',
                          'focus:border-primary focus:ring-2 focus:ring-primary/20',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          confirmPassword && !passwordsMatch
                            ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                            : 'border-input',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-destructive"
                      >
                        Passwords do not match
                      </motion.p>
                    )}
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-sm text-destructive"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading || !canSubmitReset}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={cn(
                      'flex h-11 w-full items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground',
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
                          Updating...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Reset Password
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
