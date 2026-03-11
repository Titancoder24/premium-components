"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AddressData {
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface AddressFormProps {
  /** Callback fired when address is complete */
  onComplete: (address: AddressData) => void;
  /** Available countries */
  countries?: string[];
  /** Whether to enable autocomplete */
  autoComplete?: boolean;
  /** Autocomplete suggestions provider */
  onAutoComplete?: (query: string) => Promise<AddressData[]>;
  /** Whether the form is submitting */
  loading?: boolean;
  /** Initial address values */
  initialValues?: Partial<AddressData>;
  /** Additional class names */
  className?: string;
}

const defaultCountries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "India",
  "Mexico",
];

export function AddressForm({
  onComplete,
  countries = defaultCountries,
  autoComplete = false,
  onAutoComplete,
  loading = false,
  initialValues = {},
  className,
}: AddressFormProps) {
  const [address, setAddress] = useState<AddressData>({
    street: initialValues.street ?? "",
    apartment: initialValues.apartment ?? "",
    city: initialValues.city ?? "",
    state: initialValues.state ?? "",
    zipCode: initialValues.zipCode ?? "",
    country: initialValues.country ?? "",
  });
  const [suggestions, setSuggestions] = useState<AddressData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());
  const streetRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(
    (key: keyof AddressData, value: string) => {
      setAddress((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleStreetChange = useCallback(
    async (value: string) => {
      handleChange("street", value);

      if (autoComplete && onAutoComplete && value.length >= 3) {
        setAutoCompleteLoading(true);
        try {
          const results = await onAutoComplete(value);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch {
          setSuggestions([]);
        } finally {
          setAutoCompleteLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [autoComplete, onAutoComplete, handleChange]
  );

  const handleSuggestionSelect = useCallback((suggestion: AddressData) => {
    setAddress(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);

    // Trigger auto-fill animation
    const keys = Object.keys(suggestion) as (keyof AddressData)[];
    const filled = new Set<string>();
    keys.forEach((key, i) => {
      setTimeout(() => {
        filled.add(key);
        setFilledFields(new Set(filled));
      }, i * 100);
    });

    setTimeout(() => {
      setFilledFields(new Set());
    }, 1500);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onComplete(address);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputClass = (key: string) =>
    cn(
      "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground",
      "placeholder:text-muted-foreground",
      "outline-none transition-all duration-200",
      "focus:border-primary focus:ring-2 focus:ring-primary/20",
      filledFields.has(key) && "border-green-500 bg-green-500/5 ring-2 ring-green-500/20"
    );

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
          Shipping Address
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your delivery address
        </p>
      </div>

      <div className="space-y-4">
        {/* Country */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Country
          </label>
          <div className="relative">
            <select
              value={address.country}
              onChange={(e) => handleChange("country", e.target.value)}
              required
              className={cn(
                inputClass("country"),
                "appearance-none pr-10"
              )}
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Street Address */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="relative"
          ref={suggestionsRef}
        >
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Street Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={streetRef}
              type="text"
              value={address.street}
              onChange={(e) => handleStreetChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="123 Main Street"
              required
              className={cn(inputClass("street"), "pl-10")}
            />
            {autoCompleteLoading && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg"
              >
                {suggestions.map((suggestion, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span>
                      {suggestion.street}, {suggestion.city},{" "}
                      {suggestion.state} {suggestion.zipCode}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Apartment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Apartment, suite, etc.{" "}
            <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            type="text"
            value={address.apartment}
            onChange={(e) => handleChange("apartment", e.target.value)}
            placeholder="Apt 4B"
            className={inputClass("apartment")}
          />
        </motion.div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              City
            </label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="New York"
              required
              className={inputClass("city")}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              State / Province
            </label>
            <input
              type="text"
              value={address.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="NY"
              required
              className={inputClass("state")}
            />
          </motion.div>
        </div>

        {/* Zip Code */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            ZIP / Postal Code
          </label>
          <input
            type="text"
            value={address.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            placeholder="10001"
            required
            className={cn(inputClass("zipCode"), "max-w-[200px]")}
          />
        </motion.div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
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
              Saving...
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Save address
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
}
