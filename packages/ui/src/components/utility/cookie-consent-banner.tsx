'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CookieCategory {
  name: string;
  description: string;
  required?: boolean;
}

export interface CookiePreferences {
  [categoryName: string]: boolean;
}

export interface CookieConsentBannerProps {
  /** Accept all categories. */
  onAcceptAll: () => void;
  /** Reject all non-required categories. */
  onRejectAll: () => void;
  /** Submit custom preferences. */
  onCustomize: (preferences: CookiePreferences) => void;
  /** Available cookie categories. */
  categories: CookieCategory[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const bannerVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CookieConsentBanner({
  onAcceptAll,
  onRejectAll,
  onCustomize,
  categories,
  className,
}: CookieConsentBannerProps) {
  const [visible, setVisible] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [preferences, setPreferences] = React.useState<CookiePreferences>(() => {
    const initial: CookiePreferences = {};
    categories.forEach((cat) => {
      initial[cat.name] = cat.required ?? false;
    });
    return initial;
  });

  const dismiss = (action: () => void) => () => {
    action();
    setVisible(false);
  };

  const handleCustomSave = () => {
    onCustomize(preferences);
    setVisible(false);
  };

  const toggleCategory = (name: string) => {
    setPreferences((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 p-4',
            className,
          )}
        >
          <div
            className={cn(
              'mx-auto max-w-2xl rounded-2xl border border-[var(--color-border)]',
              'bg-[var(--color-bg-primary)] p-5 shadow-lg',
            )}
          >
            {/* Header row */}
            <div className="flex items-start gap-3">
              <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-text-tertiary)]" />
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  We use cookies to enhance your browsing experience, serve personalised content, and
                  analyse our traffic. You can customise your preferences below.
                </p>
              </div>
            </div>

            {/* Customize toggle */}
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              Customise
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>

            {/* Expandable categories */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3 border-t border-[var(--color-border)] pt-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.name}
                        className="flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            {cat.name}
                          </p>
                          <p className="text-xs text-[var(--color-text-tertiary)]">
                            {cat.description}
                          </p>
                        </div>

                        {/* Toggle */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={preferences[cat.name]}
                          disabled={cat.required}
                          onClick={() => toggleCategory(cat.name)}
                          className={cn(
                            'relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors',
                            preferences[cat.name]
                              ? 'bg-[var(--color-accent)]'
                              : 'bg-[var(--color-bg-tertiary)]',
                            cat.required && 'opacity-60 cursor-not-allowed',
                          )}
                        >
                          <motion.span
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={cn(
                              'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm',
                              preferences[cat.name] && 'left-[calc(100%-1.125rem)]',
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleCustomSave}
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium',
                        'bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity',
                      )}
                    >
                      Save preferences
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action row */}
            {!expanded && (
              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={dismiss(onRejectAll)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium',
                    'border border-[var(--color-border)] text-[var(--color-text-secondary)]',
                    'hover:bg-[var(--color-bg-secondary)] transition-colors',
                  )}
                >
                  Reject all
                </button>
                <button
                  type="button"
                  onClick={dismiss(onAcceptAll)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium',
                    'bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity',
                  )}
                >
                  Accept all
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

CookieConsentBanner.displayName = 'CookieConsentBanner';
