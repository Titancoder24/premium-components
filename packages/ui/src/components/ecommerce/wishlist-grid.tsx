'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface WishlistGridProps {
  items: WishlistItem[];
  onAddToCart: (id: string) => void;
  onRemove: (id: string) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

// ---------------------------------------------------------------------------
// Grid item
// ---------------------------------------------------------------------------

function WishlistCard({
  item,
  onAddToCart,
  onRemove,
}: {
  item: WishlistItem;
  onAddToCart: () => void;
  onRemove: () => void;
}) {
  const [addedToCart, setAddedToCart] = React.useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    onAddToCart();
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-xl border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] shadow-sm"
    >
      {/* Remove button */}
      <motion.button
        type="button"
        onClick={onRemove}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-surface,#ffffff)]/80 text-[var(--color-muted-foreground,#6b7280)] shadow-sm backdrop-blur-sm transition-colors hover:bg-red-50 hover:text-red-500"
        aria-label={`Remove ${item.name}`}
      >
        <X className="h-3.5 w-3.5" />
      </motion.button>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-[var(--color-muted,#f3f4f6)]">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3">
        <h4 className="truncate text-sm font-medium text-[var(--color-foreground,#111827)]">
          {item.name}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-foreground,#111827)]">
            ${item.price.toFixed(2)}
          </span>

          <motion.button
            type="button"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              addedToCart
                ? 'bg-emerald-500 text-white'
                : 'bg-[var(--color-primary,#3b82f6)] text-white hover:bg-[var(--color-primary,#3b82f6)]/90',
            )}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" />
                  Added
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const colClasses: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
};

export function WishlistGrid({
  items,
  onAddToCart,
  onRemove,
  columns = 4,
  className,
}: WishlistGridProps) {
  return (
    <div className={cn('grid gap-4', colClasses[columns], className)}>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <WishlistCard
            key={item.id}
            item={item}
            onAddToCart={() => onAddToCart(item.id)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </AnimatePresence>

      {/* Empty state */}
      <AnimatePresence>
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-16 text-center"
          >
            <p className="text-sm text-[var(--color-muted-foreground,#6b7280)]">
              Your wishlist is empty
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

WishlistGrid.displayName = 'WishlistGrid';
