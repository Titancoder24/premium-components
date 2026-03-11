"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface RegistrationField {
  /** Unique key for the field */
  key: string;
  /** Display label */
  label: string;
  /** HTML input type */
  type: "text" | "email" | "password" | "tel" | "select";
  /** Placeholder text */
  placeholder?: string;
  /** Whether this field is required */
  required?: boolean;
  /** Options for select type */
  options?: { label: string; value: string }[];
  /** Validation pattern (regex string) */
  pattern?: string;
}

export interface PasswordRequirement {
  /** Unique key */
  key: string;
  /** Display label */
  label: string;
  /** Validation function */
  test: (password: string) => boolean;
}

export interface RegistrationFormProps {
  /** Callback fired on form submission with field values */
  onSubmit: (values: Record<string, string>) => void;
  /** Configurable form fields */
  fields?: RegistrationField[];
  /** Password requirements to validate against */
  passwordRequirements?: PasswordRequirement[];
  /** URL to terms of service */
  termsUrl?: string;
  /** Whether the form is submitting */
  loading?: boolean;
  /** Additional class names */
  className?: string;
}

const defaultFields: RegistrationField[] = [
  { key: "name", label: "Full Name", type: "text", placeholder: "John Doe", required: true },
  { key: "email", label: "Email", type: "email", placeholder: "john@example.com", required: true },
  { key: "password", label: "Password", type: "password", placeholder: "Create a password", required: true },
  { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password", required: true },
];

const defaultPasswordRequirements: PasswordRequirement[] = [
  { key: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { key: "uppercase", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { key: "lowercase", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "One number", test: (p) => /\d/.test(p) },
  { key: "special", label: "One special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

function getStrengthColor(score: number): string {
  if (score <= 1) return "bg-red-500";
  if (score === 2) return "bg-orange-500";
  if (score === 3) return "bg-yellow-500";
  return "bg-green-500";
}

function getStrengthLabel(score: number): string {
  if (score <= 1) return "Weak";
  if (score === 2) return "Fair";
  if (score === 3) return "Good";
  return "Strong";
}

export function RegistrationForm({
  onSubmit,
  fields = defaultFields,
  passwordRequirements = defaultPasswordRequirements,
  termsUrl,
  loading = false,
  className,
}: RegistrationFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const password = values["password"] ?? "";

  const requirementsMet = useMemo(
    () => passwordRequirements.map((req) => ({ ...req, met: req.test(password) })),
    [password, passwordRequirements]
  );

  const strengthScore = useMemo(
    () => requirementsMet.filter((r) => r.met).length,
    [requirementsMet]
  );

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onSubmit(values);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-lg",
        className
      )}
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create an account
        </h2>
        <p className="text-sm text-muted-foreground">
          Fill in your details to get started
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>

            {field.type === "select" ? (
              <select
                value={values[field.key] ?? ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                className={cn(
                  "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground",
                  "outline-none transition-all duration-200",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20"
                )}
              >
                <option value="">{field.placeholder ?? "Select..."}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <input
                  type={
                    field.type === "password"
                      ? showPasswords[field.key]
                        ? "text"
                        : "password"
                      : field.type
                  }
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  onFocus={() => setFocusedField(field.key)}
                  onBlur={() => setFocusedField(null)}
                  required={field.required}
                  pattern={field.pattern}
                  className={cn(
                    "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground",
                    "placeholder:text-muted-foreground",
                    "outline-none transition-all duration-200",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20",
                    field.type === "password" && "pr-10"
                  )}
                />
                {field.type === "password" && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        [field.key]: !prev[field.key],
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPasswords[field.key] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Password strength meter */}
            {field.key === "password" && password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {/* Strength bar */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {Array.from({ length: passwordRequirements.length }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: i < strengthScore ? "100%" : "0%",
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full transition-colors duration-500",
                            getStrengthColor(strengthScore)
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors duration-500",
                      strengthScore <= 1 && "text-red-500",
                      strengthScore === 2 && "text-orange-500",
                      strengthScore === 3 && "text-yellow-500",
                      strengthScore >= 4 && "text-green-500"
                    )}
                  >
                    {getStrengthLabel(strengthScore)}
                  </span>
                </div>

                {/* Requirements list (visible when focused) */}
                <AnimatePresence>
                  {focusedField === "password" && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {requirementsMet.map((req) => (
                        <motion.li
                          key={req.key}
                          className="flex items-center gap-2 text-xs"
                          animate={{ opacity: 1 }}
                        >
                          {req.met ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span
                            className={cn(
                              "transition-colors duration-200",
                              req.met ? "text-green-500" : "text-muted-foreground"
                            )}
                          >
                            {req.label}
                          </span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {termsUrl && (
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the{" "}
            <a
              href={termsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Terms of Service
            </a>
          </span>
        </label>
      )}

      <motion.button
        type="submit"
        disabled={loading || (termsUrl ? !agreedToTerms : false)}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={cn(
          "flex h-11 w-full items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground",
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
              Creating account...
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Create account
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
}
