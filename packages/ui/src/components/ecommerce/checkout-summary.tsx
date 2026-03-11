'use client';

import * as React from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckoutSummaryItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CheckoutSummaryProps {
  items: CheckoutSummaryItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  promoCode?: string | null;
  className?: string;
}

// ---------------------------------------------------------------------------
// Animated number
// ---------------------------------------------------------------------------

function AnimatedCurrency({
  value,
  className,
  prefix = '$',
}: {
  value: number;
  className?: string;
  prefix?: string;
}) {
  const motionVal = useMotionValue(value);
  const spring = useSpring(motionVal, { stiffness: 200, damping: 25 });
  const display = useTransform(spring, (v) => `${prefix}${v.toFixed(2)}`);

  React.useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  return <motion.span className={className}>{display}</motion.span>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CheckoutSummary({
  items,
  subtotal,
  tax,
  shipping,
  discount = 0,
  total,
  promoCode,
  className,
}: CheckoutSummaryProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] p-6',
        className,
      )}
    >
      <h3 className="mb-4 text-base font-semibold text-[var(--color-foreground,#111827)]">
        Order Summary
      </h3>

      {/* Item list */}
      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <motion.div
            key={`${item.name}-${idx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.25 }}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex-1 truncate text-[var(--color-muted-foreground,#6b7280)]">
              {item.name}
              {item.quantity > 1 && (
                <span className="ml-1 text-xs opacity-70">x{item.quantity}</span>
              )}
            </span>
            <AnimatedCurrency
              value={item.price * item.quantity}
              className="font-medium text-[var(--color-foreground,#111827)]"
            />
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-[var(--color-border,#e5e7eb)]" />

      {/* Subtotal */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-muted-foreground,#6b7280)]">Subtotal</span>
        <AnimatedCurrency
          value={subtotal}
          className="font-medium text-[var(--color-foreground,#111827)]"
        />
      </div>

      {/* Shipping */}
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-[var(--color-muted-foreground,#6b7280)]">Shipping</span>
        {shipping === 0 ? (
          <span className="text-sm font-medium text-emerald-600">Free</span>
        ) : (
          <AnimatedCurrency
            value={shipping}
            className="font-medium text-[var(--color-foreground,#111827)]"
          />
        )}
      </div>

      {/* Tax */}
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-[var(--color-muted-foreground,#6b7280)]">Tax</span>
        <AnimatedCurrency
          value={tax}
          className="font-medium text-[var(--color-foreground,#111827)]"
        />
      </div>

      {/* Discount */}
      <AnimatePresence>
        {discount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-emerald-600">
                Discount
                {promoCode && (
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium">
                    {promoCode}
                  </span>
                )}
              </span>
              <AnimatedCurrency
                value={-discount}
                prefix="-$"
                className="font-medium text-emerald-600"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total */}
      <div className="mt-4 border-t border-[var(--color-border,#e5e7eb)] pt-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-[var(--color-foreground,#111827)]">
            Total
          </span>
          <motion.div
            key={total}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <AnimatedCurrency
              value={total}
              className="text-lg font-bold text-[var(--color-foreground,#111827)]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

CheckoutSummary.displayName = 'CheckoutSummary';
