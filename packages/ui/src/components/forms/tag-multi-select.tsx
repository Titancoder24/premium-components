"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TagOption {
  label: string;
  value: string;
}

export interface TagMultiSelectProps {
  /** Currently selected values */
  value: string[];
  /** Available options */
  options: TagOption[];
  /** Callback fired when selection changes */
  onChange: (values: string[]) => void;
  /** Whether new tags can be created */
  creatable?: boolean;
  /** Maximum number of tags */
  maxTags?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class names */
  className?: string;
}

export function TagMultiSelect({
  value,
  options,
  onChange,
  creatable = false,
  maxTags,
  placeholder = "Select tags...",
  className,
}: TagMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter(
      (opt) =>
        !value.includes(opt.value) &&
        opt.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, value, query]);

  const canCreate =
    creatable &&
    query.trim().length > 0 &&
    !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase()) &&
    !value.includes(query.trim());

  const atLimit = maxTags !== undefined && value.length >= maxTags;

  const addTag = useCallback(
    (tagValue: string) => {
      if (atLimit) return;
      onChange([...value, tagValue]);
      setQuery("");
    },
    [value, onChange, atLimit]
  );

  const removeTag = useCallback(
    (tagValue: string) => {
      onChange(value.filter((v) => v !== tagValue));
    },
    [value, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && query === "" && value.length > 0) {
        removeTag(value[value.length - 1]);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (canCreate) {
          addTag(query.trim());
        } else if (filteredOptions.length > 0) {
          addTag(filteredOptions[0].value);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [query, value, canCreate, filteredOptions, addTag, removeTag]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = useCallback(
    (val: string) => {
      const opt = options.find((o) => o.value === val);
      return opt ? opt.label : val;
    },
    [options]
  );

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Input area */}
      <div
        onClick={() => {
          inputRef.current?.focus();
          setIsOpen(true);
        }}
        className={cn(
          "flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2",
          "cursor-text transition-all duration-200",
          isOpen && "border-primary ring-2 ring-primary/20"
        )}
      >
        <AnimatePresence>
          {value.map((v) => (
            <motion.span
              key={v}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {getLabel(v)}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(v);
                }}
                className="rounded-sm hover:bg-primary/20 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={atLimit}
          className={cn(
            "min-w-[60px] flex-1 bg-transparent text-sm text-foreground outline-none",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed"
          )}
        />

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {maxTags && (
        <p className="mt-1 text-xs text-muted-foreground">
          {value.length}/{maxTags} selected
        </p>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (filteredOptions.length > 0 || canCreate) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg"
          >
            <ul className="py-1">
              {filteredOptions.map((opt, index) => (
                <motion.li
                  key={opt.value}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.15 }}
                >
                  <button
                    type="button"
                    onClick={() => addTag(opt.value)}
                    disabled={atLimit}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm text-foreground",
                      "hover:bg-accent transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {opt.label}
                  </button>
                </motion.li>
              ))}

              {canCreate && (
                <motion.li
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: filteredOptions.length * 0.02 }}
                >
                  <button
                    type="button"
                    onClick={() => addTag(query.trim())}
                    disabled={atLimit}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-primary",
                      "hover:bg-accent transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create &quot;{query.trim()}&quot;
                  </button>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
