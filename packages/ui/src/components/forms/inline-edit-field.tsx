"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface InlineEditFieldProps {
  /** Current display value */
  value: string;
  /** Callback fired when saving a new value */
  onSave: (value: string) => void;
  /** Callback fired when editing is cancelled */
  onCancel?: () => void;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Whether to render a multiline textarea */
  multiline?: boolean;
  /** Additional class names */
  className?: string;
}

export function InlineEditField({
  value,
  onSave,
  onCancel,
  placeholder = "Click to edit...",
  multiline = false,
  className,
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = useCallback(() => {
    setEditValue(value);
    setIsEditing(true);
  }, [value]);

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed !== value) {
      onSave(trimmed);
    }
    setIsEditing(false);
  }, [editValue, value, onSave]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
    onCancel?.();
  }, [value, onCancel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !multiline) {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Enter" && multiline && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [multiline, handleSave, handleCancel]
  );

  const inputClassName = cn(
    "w-full rounded-lg border border-primary bg-background px-3 text-sm text-foreground",
    "outline-none ring-2 ring-primary/20",
    "transition-all duration-200",
    multiline ? "min-h-[80px] py-2 resize-none" : "h-9"
  );

  return (
    <div className={cn("group relative inline-block w-full", className)}>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-2"
          >
            {multiline ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={3}
                className={inputClassName}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={inputClassName}
              />
            )}

            <div className="flex shrink-0 gap-1">
              <motion.button
                type="button"
                onClick={handleSave}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
              </motion.button>
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="display"
            type="button"
            onClick={startEditing}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-left text-sm",
              "transition-all duration-200",
              "hover:border-border hover:bg-accent/50",
              value ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <span className="flex-1 truncate">
              {value || placeholder}
            </span>
            <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
