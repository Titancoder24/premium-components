'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CopyButtonProps {
  /** The text to copy to clipboard. */
  text: string;
  /** Optional visible label. */
  label?: string;
  /** Display variant. */
  variant?: 'icon-only' | 'with-text';
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CopyButton({
  text,
  label,
  variant = 'icon-only',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg transition-colors',
          'border border-[var(--color-border)] text-[var(--color-text-secondary)]',
          'hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]',
          variant === 'icon-only' ? 'p-2' : 'px-3 py-1.5 text-sm font-medium',
        )}
        aria-label={copied ? 'Copied' : label ?? 'Copy to clipboard'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-4 w-4 text-emerald-500" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Copy className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>

        {variant === 'with-text' && (
          <span>{copied ? 'Copied!' : label ?? 'Copy'}</span>
        )}
      </button>

      {/* Tooltip for icon-only variant */}
      {variant === 'icon-only' && (
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap',
                'rounded-md bg-[var(--color-text-primary)] px-2 py-1',
                'text-xs font-medium text-[var(--color-bg-primary)]',
                'pointer-events-none shadow-sm',
              )}
            >
              Copied!
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

CopyButton.displayName = 'CopyButton';
