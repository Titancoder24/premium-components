'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  Camera,
  User,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProfileField {
  /** Unique key for the field */
  key: string;
  /** Display label */
  label: string;
  /** Input type */
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select';
  /** Whether the field is required for completion tracking */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Options for select fields */
  options?: { label: string; value: string }[];
}

export interface ProfileSetupCardProps {
  /** Callback fired with all field values on save */
  onSave: (values: Record<string, string>) => void;
  /** Field definitions */
  fields: ProfileField[];
  /** Completion percentage (0-100), overrides auto-calculation when provided */
  completionPercentage?: number;
  /** Whether save is in progress */
  loading?: boolean;
  /** Whether save succeeded */
  success?: boolean;
  /** Error message */
  error?: string;
  /** Callback for avatar upload */
  onAvatarChange?: (file: File) => void;
  /** Current avatar URL */
  avatarUrl?: string;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Circular progress ring
// ---------------------------------------------------------------------------

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 6,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="absolute inset-0"
    >
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      {/* Progress ring */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-primary, #6366f1)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProfileSetupCard({
  onSave,
  fields,
  completionPercentage,
  loading = false,
  success = false,
  error,
  onAvatarChange,
  avatarUrl,
  className,
}: ProfileSetupCardProps) {
  const [values, setValues] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      initial[f.key] = '';
    });
    return initial;
  });
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
    avatarUrl ?? null,
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Compute auto-completion if not overridden
  const autoCompletion = React.useMemo(() => {
    const requiredFields = fields.filter((f) => f.required);
    if (requiredFields.length === 0) {
      const filledCount = fields.filter(
        (f) => values[f.key]?.trim() !== '',
      ).length;
      return fields.length > 0
        ? Math.round((filledCount / fields.length) * 100)
        : 0;
    }
    const filled = requiredFields.filter(
      (f) => values[f.key]?.trim() !== '',
    ).length;
    return Math.round((filled / requiredFields.length) * 100);
  }, [fields, values]);

  const percentage = completionPercentage ?? autoCompletion;

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    onAvatarChange?.(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-md rounded-2xl border border-border bg-card shadow-lg',
        className,
      )}
    >
      <form onSubmit={handleSubmit}>
        {/* Avatar section */}
        <div className="flex flex-col items-center gap-3 pb-2 pt-8 px-8">
          <div className="relative h-[120px] w-[120px]">
            <ProgressRing percentage={percentage} size={120} />
            <motion.button
              type="button"
              onClick={handleAvatarClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="absolute inset-[6px] flex items-center justify-center overflow-hidden rounded-full bg-muted transition-shadow hover:shadow-md"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 hover:bg-black/30 transition-colors">
                <Camera className="h-5 w-5 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Percentage label */}
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground"
              key={percentage}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {percentage}%
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground">
            Click to upload a profile photo
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-4 p-8 pt-4">
          {fields.map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="space-y-1.5"
            >
              <label
                htmlFor={`profile-${field.key}`}
                className="flex items-center gap-1 text-sm font-medium text-foreground"
              >
                {field.label}
                {field.required && (
                  <span className="text-destructive">*</span>
                )}
                {values[field.key]?.trim() && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success,#22c55e)]" />
                  </motion.span>
                )}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  id={`profile-${field.key}`}
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    handleFieldChange(field.key, e.target.value)
                  }
                  placeholder={field.placeholder}
                  disabled={loading}
                  rows={3}
                  className={cn(
                    'flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground',
                    'outline-none transition-all duration-200 resize-none',
                    'placeholder:text-muted-foreground',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                />
              ) : field.type === 'select' ? (
                <select
                  id={`profile-${field.key}`}
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    handleFieldChange(field.key, e.target.value)
                  }
                  disabled={loading}
                  className={cn(
                    'flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground',
                    'outline-none transition-all duration-200',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                >
                  <option value="">
                    {field.placeholder ?? 'Select...'}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`profile-${field.key}`}
                  type={field.type}
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    handleFieldChange(field.key, e.target.value)
                  }
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={cn(
                    'flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground',
                    'outline-none transition-all duration-200',
                    'placeholder:text-muted-foreground',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                />
              )}
            </motion.div>
          ))}

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

          {/* Save button */}
          <motion.button
            type="submit"
            disabled={loading}
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
                  Saving...
                </motion.span>
              ) : success ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </motion.span>
                  Saved!
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Save Profile
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
