'use client';

import * as React from 'react';
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useMotionValue,
} from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartDrawerItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface ShoppingCartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartDrawerItem[];
  subtotal: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Animated Currency
// ---------------------------------------------------------------------------

function AnimatedCurrency({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const motionVal = useMotionValue(value);
  const spring = useSpring(motionVal, { stiffness: 200, damping: 25 });
  const display = useTransform(spring, (v) => `$${v.toFixed(2)}`);

  React.useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  return <motion.span className={className}>{display}</motion.span>;
}

// ---------------------------------------------------------------------------
// Cart Item
// ---------------------------------------------------------------------------

function DrawerCartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartDrawerItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  const [isRemoving, setIsRemoving] = React.useState(false);
  const lineTotal = item.price * item.quantity;

  return (
    <AnimatePresence mode="popLayout">
      {!isRemoving ? (
        <motion.div
          layout
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{
            x: 300,
            opacity: 0,
            transition: { duration: 0.25, ease: 'easeIn' },
          }}
          className="flex gap-3 rounded-lg border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] p-3"
        >
          {/* Thumbnail */}
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-[var(--color-muted,#f3f4f6)]">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col gap-1 overflow-hidden">
            <span className="truncate text-sm font-medium text-[var(--color-foreground,#111827)]">
              {item.name}
            </span>
            {item.variant && (
              <span className="text-xs text-[var(--color-muted-foreground,#6b7280)]">
                {item.variant}
              </span>
            )}

            <div className="mt-auto flex items-center justify-between">
              {/* Quantity controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateQuantity(Math.max(1, item.quantity - 1))
                  }
                  disabled={item.quantity <= 1}
                  className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-border,#e5e7eb)] text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-[var(--color-muted,#f3f4f6)] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </button>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.quantity}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.12 }}
                    className="flex h-6 w-7 items-center justify-center text-xs font-medium text-[var(--color-foreground,#111827)]"
                  >
                    {item.quantity}
                  </motion.span>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.quantity + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-border,#e5e7eb)] text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-[var(--color-muted,#f3f4f6)]"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Line total */}
              <AnimatedCurrency
                value={lineTotal}
                className="text-sm font-semibold text-[var(--color-foreground,#111827)]"
              />
            </div>
          </div>

          {/* Remove */}
          <motion.button
            type="button"
            onClick={() => setIsRemoving(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center self-start rounded text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          animate={{
            height: 0,
            opacity: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.05 }}
          onAnimationComplete={() => onRemove()}
          className="overflow-hidden"
        />
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ShoppingCartDrawer({
  open,
  onClose,
  items,
  subtotal,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  className,
}: ShoppingCartDrawerProps) {
  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-50', className)}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col border-l border-[var(--color-border,#e5e7eb)] bg-[var(--color-background,#ffffff)] shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border,#e5e7eb)] px-5 py-4">
              <h2 className="text-lg font-semibold text-[var(--color-foreground,#111827)]">
                Cart
                {items.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-[var(--color-muted-foreground,#6b7280)]">
                    ({items.length} item{items.length !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-[var(--color-muted,#f3f4f6)]"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence mode="wait">
                {items.length > 0 ? (
                  <motion.div
                    key="items"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3"
                  >
                    {items.map((item) => (
                      <DrawerCartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={(qty) =>
                          onUpdateQuantity(item.id, qty)
                        }
                        onRemove={() => onRemoveItem(item.id)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-muted,#f3f4f6)]">
                      <ShoppingBag className="h-7 w-7 text-[var(--color-muted-foreground,#6b7280)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-foreground,#111827)]">
                      Your cart is empty
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted-foreground,#6b7280)]">
                      Add items to get started
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-[var(--color-border,#e5e7eb)] px-5 py-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--color-muted-foreground,#6b7280)]">
                      Subtotal
                    </span>
                    <AnimatedCurrency
                      value={subtotal}
                      className="text-lg font-bold text-[var(--color-foreground,#111827)]"
                    />
                  </div>
                  <motion.button
                    type="button"
                    onClick={onCheckout}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-[var(--color-primary,#3b82f6)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary,#3b82f6)]/90"
                  >
                    Checkout
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

ShoppingCartDrawer.displayName = 'ShoppingCartDrawer';
