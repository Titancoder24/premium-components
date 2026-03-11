'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: TooltipSide;
  delay?: number;
  maxWidth?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Translate offsets per side
// ---------------------------------------------------------------------------

const translateMap: Record<TooltipSide, { initial: { x: number; y: number } }> = {
  top: { initial: { x: 0, y: 5 } },
  bottom: { initial: { x: 0, y: -5 } },
  left: { initial: { x: 5, y: 0 } },
  right: { initial: { x: -5, y: 0 } },
};

const positionClasses: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 300,
  maxWidth = 220,
  className,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const show = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const offset = translateMap[side];

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, x: offset.initial.x, y: offset.initial.y }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: offset.initial.x, y: offset.initial.y }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ maxWidth }}
            className={cn(
              'pointer-events-none absolute z-50 whitespace-normal rounded-md bg-[var(--color-foreground,#111827)] px-2.5 py-1.5 text-xs text-[var(--color-surface,#ffffff)] shadow-md',
              positionClasses[side],
              className,
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
