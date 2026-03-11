'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeedbackPayload {
  rating: number;
  comment: string;
}

export interface FeedbackWidgetProps {
  /** Called when the user submits feedback. */
  onSubmit: (feedback: FeedbackPayload) => void;
  /** Which corner to pin the widget to. */
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMOJIS = [
  { value: 1, emoji: '\u{1F61E}', label: 'Terrible' },
  { value: 2, emoji: '\u{1F641}', label: 'Bad' },
  { value: 3, emoji: '\u{1F610}', label: 'Okay' },
  { value: 4, emoji: '\u{1F642}', label: 'Good' },
  { value: 5, emoji: '\u{1F929}', label: 'Amazing' },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const panelVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 8,
    transition: { duration: 0.18 },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FeedbackWidget({
  onSubmit,
  position = 'bottom-right',
  className,
}: FeedbackWidgetProps) {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<number | null>(null);
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  // Pulse the trigger button every 30 seconds
  const [pulse, setPulse] = React.useState(false);
  React.useEffect(() => {
    if (open || submitted) return;
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, [open, submitted]);

  const handleSubmit = () => {
    if (rating === null) return;
    onSubmit({ rating, comment });
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      // Reset after close animation
      setTimeout(() => {
        setSubmitted(false);
        setRating(null);
        setComment('');
      }, 300);
    }, 1800);
  };

  const positionClasses =
    position === 'bottom-right' ? 'right-4 bottom-4' : 'left-4 bottom-4';

  return (
    <div className={cn('fixed z-50', positionClasses, className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'mb-3 w-80 rounded-2xl border border-[var(--color-border)]',
              'bg-[var(--color-bg-primary)] p-5 shadow-xl',
            )}
            style={{
              transformOrigin:
                position === 'bottom-right' ? 'bottom right' : 'bottom left',
            }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15"
                  >
                    <Check className="h-6 w-6 text-emerald-500" />
                  </motion.div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    Thank you for your feedback!
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0 }}>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                      Send Feedback
                    </h3>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-lg p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Emoji rating */}
                  <div className="mt-4 flex justify-between">
                    {EMOJIS.map((item) => (
                      <motion.button
                        key={item.value}
                        type="button"
                        onClick={() => setRating(item.value)}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'flex flex-col items-center gap-1 rounded-lg p-2 transition-colors',
                          rating === item.value
                            ? 'bg-[var(--color-bg-tertiary)]'
                            : 'hover:bg-[var(--color-bg-secondary)]',
                        )}
                        aria-label={item.label}
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="text-[10px] text-[var(--color-text-tertiary)]">
                          {item.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Comment */}
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us more (optional)..."
                    rows={3}
                    className={cn(
                      'mt-4 w-full resize-none rounded-lg border border-[var(--color-border)]',
                      'bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)]',
                      'placeholder:text-[var(--color-text-tertiary)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40',
                    )}
                  />

                  {/* Submit */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={rating === null}
                    className={cn(
                      'mt-3 w-full rounded-lg px-4 py-2 text-sm font-medium transition-opacity',
                      'bg-[var(--color-accent)] text-white',
                      rating === null ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
                    )}
                  >
                    Submit Feedback
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={
          pulse
            ? { scale: [1, 1.12, 1], transition: { duration: 0.6 } }
            : {}
        }
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full shadow-lg',
          'bg-[var(--color-accent)] text-white',
          'hover:opacity-90 transition-opacity',
        )}
        aria-label="Send feedback"
      >
        <MessageSquare className="h-5 w-5" />
      </motion.button>
    </div>
  );
}

FeedbackWidget.displayName = 'FeedbackWidget';
