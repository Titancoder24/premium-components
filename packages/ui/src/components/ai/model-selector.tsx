'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Cpu, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextWindow: number;
}

export interface ModelSelectorProps {
  models: ModelInfo[];
  selected: string;
  onChange: (modelId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatContextWindow(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`;
  return `${tokens}`;
}

// ---------------------------------------------------------------------------
// ModelSelector
// ---------------------------------------------------------------------------

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selected,
  onChange,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedModel = models.find((m) => m.id === selected);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm transition-colors',
          'hover:bg-[hsl(var(--muted))]',
          open && 'ring-2 ring-[hsl(var(--ring))]',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Cpu className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <span className="font-medium text-[hsl(var(--foreground))]">
          {selectedModel?.name ?? 'Select model'}
        </span>
        {selectedModel && (
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {selectedModel.provider}
          </span>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto"
        >
          <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 z-20 mt-1.5 w-full min-w-[320px] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5 shadow-lg"
            role="listbox"
          >
            {models.map((model) => {
              const isSelected = model.id === selected;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onChange(model.id);
                    setOpen(false);
                  }}
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    isSelected
                      ? 'bg-[hsl(var(--muted))]'
                      : 'hover:bg-[hsl(var(--muted))]',
                  )}
                >
                  {/* Model info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {model.name}
                      </span>
                      <span className="rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
                        {model.provider}
                      </span>
                    </div>

                    {/* Capabilities */}
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {model.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="inline-flex items-center gap-0.5 text-[11px] text-[hsl(var(--muted-foreground))]"
                        >
                          <Sparkles className="h-2.5 w-2.5" />
                          {cap}
                        </span>
                      ))}
                      <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                        {formatContextWindow(model.contextWindow)} ctx
                      </span>
                    </div>
                  </div>

                  {/* Checkmark */}
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isSelected && (
                        <motion.span
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <Check className="h-4 w-4 text-[hsl(var(--primary))]" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ModelSelector.displayName = 'ModelSelector';
