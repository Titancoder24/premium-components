'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Announcement {
  message: string;
  href?: string;
}

export interface AnnouncementBarProps {
  /** One or more announcements to display. */
  announcements: Announcement[];
  /** Whether the bar can be dismissed. */
  dismissible?: boolean;
  /** Auto-rotate through multiple announcements. */
  autoRotate?: boolean;
  /** Rotation interval in milliseconds. */
  rotateInterval?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const barVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

const messageVariants = {
  enter: { opacity: 0, y: 8 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnnouncementBar({
  announcements,
  dismissible = true,
  autoRotate = false,
  rotateInterval = 5000,
  className,
}: AnnouncementBarProps) {
  const [visible, setVisible] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const hasMultiple = announcements.length > 1;

  React.useEffect(() => {
    if (!autoRotate || !hasMultiple || !visible) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, rotateInterval);
    return () => clearInterval(timer);
  }, [autoRotate, hasMultiple, visible, announcements.length, rotateInterval]);

  const current = announcements[currentIndex];
  if (!current) return null;

  const Content = current.href ? 'a' : 'span';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'overflow-hidden bg-[var(--color-accent)] text-white',
            className,
          )}
        >
          <div className="relative flex items-center justify-center px-4 py-2.5">
            {/* Announcement text with crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={messageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex items-center gap-2"
              >
                <Content
                  {...(current.href ? { href: current.href } : {})}
                  className={cn(
                    'text-sm font-medium',
                    current.href && 'hover:underline',
                  )}
                >
                  {current.message}
                </Content>
                {current.href && <ArrowRight className="h-3.5 w-3.5" />}
              </motion.div>
            </AnimatePresence>

            {/* Dismiss button */}
            {dismissible && (
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-white/15 transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Dot indicators */}
            {hasMultiple && (
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-1">
                {announcements.map((_, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      'h-1 w-1 rounded-full transition-colors',
                      idx === currentIndex ? 'bg-white' : 'bg-white/40',
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

AnnouncementBar.displayName = 'AnnouncementBar';
