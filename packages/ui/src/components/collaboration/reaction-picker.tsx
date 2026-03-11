'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmilePlus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Reaction {
  emoji: string;
  count: number;
  active: boolean;
}

export interface ReactionPickerProps {
  reactions: Reaction[];
  onReact: (emoji: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const commonEmojis = ['👍', '❤️', '😂', '🎉', '🔥', '👀', '🚀', '💯'];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  reactions,
  onReact,
  className,
}) => {
  const [showPicker, setShowPicker] = React.useState(false);
  const [justClicked, setJustClicked] = React.useState<string | null>(null);
  const pickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReact = (emoji: string) => {
    setJustClicked(emoji);
    onReact(emoji);
    setTimeout(() => setJustClicked(null), 400);
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)} ref={pickerRef}>
      <AnimatePresence mode="popLayout">
        {reactions.map((reaction) => (
          <motion.button
            key={reaction.emoji}
            layout
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileTap={{ scale: 1.3 }}
            onClick={() => handleReact(reaction.emoji)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm transition-colors',
              'border cursor-pointer select-none',
            )}
            style={{
              borderColor: reaction.active
                ? 'hsl(var(--primary))'
                : 'hsl(var(--border))',
              backgroundColor: reaction.active
                ? 'hsl(var(--primary) / 0.1)'
                : 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
            }}
          >
            <motion.span
              animate={
                justClicked === reaction.emoji
                  ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] }
                  : {}
              }
              transition={{ duration: 0.35 }}
              className="leading-none"
            >
              {reaction.emoji}
            </motion.span>
            <motion.span
              key={reaction.count}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xs font-medium tabular-nums"
              style={{
                color: reaction.active
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--muted-foreground))',
              }}
            >
              {reaction.count}
            </motion.span>
          </motion.button>
        ))}
      </AnimatePresence>

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPicker(!showPicker)}
          className="inline-flex items-center justify-center rounded-full border p-1.5 cursor-pointer"
          style={{
            borderColor: 'hsl(var(--border))',
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--muted-foreground))',
          }}
        >
          {showPicker ? <Plus className="h-3.5 w-3.5 rotate-45" /> : <SmilePlus className="h-3.5 w-3.5" />}
        </motion.button>

        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-lg border p-2 shadow-lg z-50"
              style={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
              }}
            >
              <div className="flex items-center gap-1">
                {commonEmojis.map((emoji, i) => (
                  <motion.button
                    key={emoji}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      handleReact(emoji);
                      setShowPicker(false);
                    }}
                    className="p-1 text-lg cursor-pointer rounded hover:bg-black/5"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

ReactionPicker.displayName = 'ReactionPicker';
