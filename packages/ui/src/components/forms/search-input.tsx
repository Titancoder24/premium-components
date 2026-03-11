"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Clock, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SearchInputProps {
  /** Callback fired when search is submitted */
  onSearch: (query: string) => void;
  /** Suggestions to display */
  suggestions?: string[];
  /** Recent searches to display */
  recentSearches?: string[];
  /** Placeholder text */
  placeholder?: string;
  /** Whether suggestions are loading */
  loading?: boolean;
  /** Additional class names */
  className?: string;
}

export function SearchInput({
  onSearch,
  suggestions = [],
  recentSearches = [],
  placeholder = "Search...",
  loading = false,
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRecent = recentSearches.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [
    ...filteredRecent.map((s) => ({ type: "recent" as const, value: s })),
    ...filteredSuggestions.map((s) => ({ type: "suggestion" as const, value: s })),
  ];

  const showDropdown = isFocused && (allItems.length > 0 || loading);

  const handleSelect = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [onSearch]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim());
        setIsFocused(false);
        inputRef.current?.blur();
      }
    },
    [query, onSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < allItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : allItems.length - 1
        );
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(allItems[activeIndex].value);
      } else if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    },
    [showDropdown, activeIndex, allItems, handleSelect]
  );

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-lg", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "h-11 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "outline-none transition-all duration-200",
            "focus:border-primary focus:ring-2 focus:ring-primary/20"
          )}
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : query.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg"
          >
            {loading && allItems.length === 0 ? (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              <ul className="max-h-64 overflow-y-auto py-1">
                {allItems.map((item, index) => (
                  <motion.li
                    key={`${item.type}-${item.value}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(item.value)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "relative flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground",
                        "transition-colors duration-100"
                      )}
                    >
                      {/* Active highlight slider */}
                      {activeIndex === index && (
                        <motion.div
                          layoutId="search-highlight"
                          className="absolute inset-0 bg-accent"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 40,
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-3">
                        {item.type === "recent" ? (
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <Search className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        {item.value}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
