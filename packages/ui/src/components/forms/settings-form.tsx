"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SettingsField {
  /** Display label */
  label: string;
  /** Field type */
  type: "text" | "email" | "number" | "toggle" | "select" | "textarea";
  /** Unique key for the field */
  key: string;
  /** Current value */
  value: string | number | boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Description shown below the field */
  description?: string;
  /** Options for select type */
  options?: { label: string; value: string }[];
  /** Whether the field is disabled */
  disabled?: boolean;
}

export interface SettingsSection {
  /** Section title */
  title: string;
  /** Section description */
  description?: string;
  /** Fields in this section */
  fields: SettingsField[];
}

export interface SettingsFormProps {
  /** Array of settings sections */
  sections: SettingsSection[];
  /** Callback fired when settings are saved */
  onSave: (values: Record<string, string | number | boolean>) => void;
  /** Callback fired when any field changes */
  onChange?: (key: string, value: string | number | boolean) => void;
  /** Whether the form is saving */
  loading?: boolean;
  /** Additional class names */
  className?: string;
}

export function SettingsForm({
  sections,
  onSave,
  onChange,
  loading = false,
  className,
}: SettingsFormProps) {
  const initialValues = useMemo(() => {
    const vals: Record<string, string | number | boolean> = {};
    for (const section of sections) {
      for (const field of section.fields) {
        vals[field.key] = field.value;
      }
    }
    return vals;
  }, [sections]);

  const [values, setValues] = useState<Record<string, string | number | boolean>>(initialValues);

  const hasChanges = useMemo(() => {
    return Object.keys(initialValues).some(
      (key) => initialValues[key] !== values[key]
    );
  }, [initialValues, values]);

  const handleChange = useCallback(
    (key: string, value: string | number | boolean) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      onChange?.(key, value);
    },
    [onChange]
  );

  const handleSave = useCallback(() => {
    if (!loading) {
      onSave(values);
    }
  }, [loading, onSave, values]);

  const handleReset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return (
    <div className={cn("relative w-full max-w-3xl", className)}>
      <div className="space-y-8">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1, duration: 0.4 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {section.title}
              </h3>
              {section.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {section.description}
                </p>
              )}
            </div>

            <div className="space-y-5">
              {section.fields.map((field) => (
                <div
                  key={field.key}
                  className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-8"
                >
                  <div className="sm:w-1/3 sm:pt-2">
                    <label className="text-sm font-medium text-foreground">
                      {field.label}
                    </label>
                    {field.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {field.description}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    {field.type === "toggle" ? (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!!values[field.key]}
                        disabled={field.disabled}
                        onClick={() =>
                          handleChange(field.key, !values[field.key])
                        }
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                          values[field.key]
                            ? "bg-primary"
                            : "bg-muted-foreground/30",
                          field.disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <motion.span
                          className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm"
                          animate={{
                            x: values[field.key] ? 20 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      </button>
                    ) : field.type === "select" ? (
                      <select
                        value={String(values[field.key] ?? "")}
                        onChange={(e) =>
                          handleChange(field.key, e.target.value)
                        }
                        disabled={field.disabled}
                        className={cn(
                          "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground",
                          "outline-none transition-all duration-200",
                          "focus:border-primary focus:ring-2 focus:ring-primary/20",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={String(values[field.key] ?? "")}
                        onChange={(e) =>
                          handleChange(field.key, e.target.value)
                        }
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        rows={3}
                        className={cn(
                          "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground",
                          "placeholder:text-muted-foreground",
                          "outline-none transition-all duration-200",
                          "focus:border-primary focus:ring-2 focus:ring-primary/20",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={String(values[field.key] ?? "")}
                        onChange={(e) =>
                          handleChange(
                            field.key,
                            field.type === "number"
                              ? Number(e.target.value)
                              : e.target.value
                          )
                        }
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        className={cn(
                          "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground",
                          "placeholder:text-muted-foreground",
                          "outline-none transition-all duration-200",
                          "focus:border-primary focus:ring-2 focus:ring-primary/20",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sticky save bar */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm"
          >
            <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
              <p className="text-sm text-muted-foreground">
                You have unsaved changes
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discard
                </button>
                <motion.button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground",
                    "disabled:opacity-70 disabled:cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {loading ? "Saving..." : "Save changes"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
