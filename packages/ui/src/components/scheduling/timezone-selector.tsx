'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export interface TimezoneOption {
  name: string;
  offset: string;
  city: string;
}

export interface TimezoneSelectorProps {
  timezones: TimezoneOption[];
  selected?: string;
  onChange?: (timezone: string) => void;
  className?: string;
}

// ---- Helpers ----

function currentTimeForOffset(offset: string): string {
  const match = offset.match(/^([+-])(\d{1,2}):?(\d{2})?$/);
  if (!match) return '--:--';
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2]!, 10);
  const mins = parseInt(match[3] ?? '0', 10);
  const totalOffsetMs = sign * (hours * 3600000 + mins * 60000);
  const utcNow = Date.now() + new Date().getTimezoneOffset() * 60000;
  const d = new Date(utcNow + totalOffsetMs);
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  return `${h}:${m} ${ampm}`;
}

// ---- Component ----

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  timezones,
  selected,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTz = useMemo(
    () => timezones.find((tz) => tz.name === selected),
    [timezones, selected],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return timezones;
    const q = query.toLowerCase();
    return timezones.filter(
      (tz) =>
        tz.name.toLowerCase().includes(q) ||
        tz.city.toLowerCase().includes(q) ||
        tz.offset.includes(q),
    );
  }, [timezones, query]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (name: string) => {
    onChange?.(name);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm shadow-sm',
          'hover:bg-[hsl(var(--accent))] transition-colors',
        )}
      >
        <Globe className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        {selectedTz ? (
          <span className="flex flex-1 items-center justify-between">
            <span className="font-medium text-[hsl(var(--foreground))]">{selectedTz.city}</span>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              UTC{selectedTz.offset} &middot; {currentTimeForOffset(selectedTz.offset)}
            </span>
          </span>
        ) : (
          <span className="flex-1 text-left text-[hsl(var(--muted-foreground))]">
            Select timezone...
          </span>
        )}
        <ChevronDown className={cn('h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute z-50 mt-1 w-full origin-top rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-lg"
          >
            {/* Search */}
            <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] px-3 py-2">
              <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search timezone..."
                autoFocus
                className="flex-1 bg-transparent text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="py-3 text-center text-xs text-[hsl(var(--muted-foreground))]">No timezones found</p>
              ) : (
                filtered.map((tz) => {
                  const isActive = tz.name === selected;
                  return (
                    <button
                      key={tz.name}
                      onClick={() => handleSelect(tz.name)}
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                        'hover:bg-[hsl(var(--accent))]',
                        isActive && 'bg-[hsl(var(--accent))]',
                      )}
                    >
                      {isActive ? (
                        <Check className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                      ) : (
                        <span className="h-3.5 w-3.5" />
                      )}
                      <span className="flex flex-1 items-center justify-between">
                        <span>
                          <span className="font-medium text-[hsl(var(--foreground))]">{tz.city}</span>
                          <span className="ml-1.5 text-xs text-[hsl(var(--muted-foreground))]">({tz.name})</span>
                        </span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          UTC{tz.offset} &middot; {currentTimeForOffset(tz.offset)}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

TimezoneSelector.displayName = 'TimezoneSelector';
