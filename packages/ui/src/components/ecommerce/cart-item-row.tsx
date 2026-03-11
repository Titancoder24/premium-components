'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItemRowProps {
  image: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Animated Price
// ---------------------------------------------------------------------------

function AnimatedPrice({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="text-sm font-semibold text-[var(--color-foreground,#111827)]"
    >
      ${value.toFixed(2)}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CartItemRow({
  image,
  name,
  variant,
  price,
  quantity,
  onQuantityChange,
  onRemove,
  className,
}: CartItemRowProps) {
  const [isRemoving, setIsRemoving] = React.useState(false);
  const lineTotal = price * quantity;

  const handleRemove = () => {
    setIsRemoving(true);
  };

  return (
    <AnimatePresence mode="popLayout">
      {!isRemoving ? (
        <motion.div
          layout
          initial={{ opacity: 1, x: 0, height: 'auto' }}
          exit={{
            x: 300,
            opacity: 0,
            transition: { duration: 0.25, ease: 'easeIn' },
          }}
          onAnimationComplete={(def: { x?: number }) => {
            if (def.x === 300) {
              onRemove();
            }
          }}
          className={cn(
            'flex items-center gap-4 rounded-lg border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] p-3',
            className,
          )}
        >
          {/* Thumbnail */}
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-[var(--color-muted,#f3f4f6)]">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
            <span className="truncate text-sm font-medium text-[var(--color-foreground,#111827)]">
              {name}
            </span>
            {variant && (
              <span className="text-xs text-[var(--color-muted-foreground,#6b7280)]">
                {variant}
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border,#e5e7eb)] text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-[var(--color-muted,#f3f4f6)] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>

            <AnimatePresence mode="wait">
              <motion.span
                key={quantity}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex h-7 w-8 items-center justify-center text-sm font-medium text-[var(--color-foreground,#111827)]"
              >
                {quantity}
              </motion.span>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border,#e5e7eb)] text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-[var(--color-muted,#f3f4f6)]"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Line total */}
          <div className="w-20 text-right">
            <AnimatePresence mode="wait">
              <AnimatedPrice value={lineTotal} />
            </AnimatePresence>
          </div>

          {/* Remove */}
          <motion.button
            type="button"
            onClick={handleRemove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label={`Remove ${name}`}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          animate={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.05 }}
          onAnimationComplete={() => onRemove()}
          className="overflow-hidden"
        />
      )}
    </AnimatePresence>
  );
}

CartItemRow.displayName = 'CartItemRow';
