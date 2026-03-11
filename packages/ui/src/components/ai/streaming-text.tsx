'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  speed?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// StreamingText
// ---------------------------------------------------------------------------

export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  isStreaming,
  speed = 2,
  className,
}) => {
  const [displayedLength, setDisplayedLength] = React.useState(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (!isStreaming) {
      setDisplayedLength(text.length);
      return;
    }

    setDisplayedLength(0);

    const intervalMs = Math.max(5, 50 / speed);
    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        const charsPerTick = Math.max(1, Math.round(speed));
        const next = prev + charsPerTick;
        if (next >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return text.length;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, isStreaming, speed]);

  const displayedText = text.slice(0, displayedLength);
  const isComplete = displayedLength >= text.length;

  return (
    <span className={cn('inline', className)}>
      <span className="whitespace-pre-wrap">{displayedText}</span>
      <AnimatePresence>
        {(!isComplete || isStreaming) && (
          <motion.span
            key="cursor"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0] }}
            exit={{ opacity: 0 }}
            transition={
              isComplete
                ? { duration: 0.5 }
                : { duration: 0.6, repeat: Infinity, repeatType: 'reverse' }
            }
            className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-[hsl(var(--foreground))]"
          />
        )}
      </AnimatePresence>
    </span>
  );
};

StreamingText.displayName = 'StreamingText';
