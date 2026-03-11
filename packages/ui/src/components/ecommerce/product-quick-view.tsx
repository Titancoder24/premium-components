'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductVariant {
  type: string;
  options: string[];
}

export interface QuickViewProduct {
  images: string[];
  name: string;
  description: string;
  price: number;
  variants: ProductVariant[];
}

export interface ProductQuickViewProps {
  open: boolean;
  onClose: () => void;
  product: QuickViewProduct;
  onAddToCart: (selections: Record<string, string>) => void;
  onViewFull: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Image Gallery
// ---------------------------------------------------------------------------

function QuickViewGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const goTo = (idx: number) => {
    setActiveIndex(
      ((idx % images.length) + images.length) % images.length,
    );
  };

  return (
    <div className="relative flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--color-muted,#f3f4f6)]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex]}
            alt={`${alt} ${activeIndex + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-surface,#ffffff)]/80 text-[var(--color-foreground,#111827)] shadow backdrop-blur-sm transition-colors hover:bg-[var(--color-surface,#ffffff)]"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-surface,#ffffff)]/80 text-[var(--color-foreground,#111827)] shadow backdrop-blur-sm transition-colors hover:bg-[var(--color-surface,#ffffff)]"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                idx === activeIndex
                  ? 'border-[var(--color-primary,#3b82f6)]'
                  : 'border-transparent hover:border-[var(--color-border,#e5e7eb)]',
              )}
            >
              <img
                src={img}
                alt={`${alt} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
              {idx === activeIndex && (
                <motion.div
                  layoutId="quickview-thumb-border"
                  className="absolute inset-0 rounded-lg ring-2 ring-[var(--color-primary,#3b82f6)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductQuickView({
  open,
  onClose,
  product,
  onAddToCart,
  onViewFull,
  className,
}: ProductQuickViewProps) {
  const [selections, setSelections] = React.useState<Record<string, string>>(
    {},
  );
  const [addedToCart, setAddedToCart] = React.useState(false);

  // Reset state when product changes or modal opens
  React.useEffect(() => {
    if (open) {
      setSelections({});
      setAddedToCart(false);
    }
  }, [open, product]);

  // Lock body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const handleAddToCart = () => {
    onAddToCart(selections);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleSelect = (type: string, option: string) => {
    setSelections((prev) => ({ ...prev, [type]: option }));
  };

  return (
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}>
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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative z-10 grid w-full max-w-3xl grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-[var(--color-border,#e5e7eb)] bg-[var(--color-background,#ffffff)] p-6 shadow-2xl sm:grid-cols-2"
            role="dialog"
            aria-label={`Quick view: ${product.name}`}
          >
            {/* Close */}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-[var(--color-muted,#f3f4f6)]"
              aria-label="Close quick view"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Gallery */}
            <QuickViewGallery images={product.images} alt={product.name} />

            {/* Product info */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-foreground,#111827)]">
                  {product.name}
                </h2>
                <p className="mt-1 text-2xl font-semibold text-[var(--color-foreground,#111827)]">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-[var(--color-muted-foreground,#6b7280)]">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants.map((variant) => (
                <div key={variant.type} className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--color-foreground,#111827)]">
                    {variant.type}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => {
                      const isSelected = selections[variant.type] === option;
                      return (
                        <motion.button
                          key={option}
                          type="button"
                          onClick={() => handleSelect(variant.type, option)}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          className={cn(
                            'relative rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                            isSelected
                              ? 'border-[var(--color-primary,#3b82f6)] bg-[var(--color-primary,#3b82f6)]/10 text-[var(--color-primary,#3b82f6)]'
                              : 'border-[var(--color-border,#e5e7eb)] text-[var(--color-foreground,#111827)] hover:border-[var(--color-primary,#3b82f6)]/50',
                          )}
                        >
                          {option}
                          {isSelected && (
                            <motion.span
                              layoutId={`pill-ring-${variant.type}`}
                              className="absolute inset-0 rounded-full ring-2 ring-[var(--color-primary,#3b82f6)]"
                              transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-2 pt-4">
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors',
                    addedToCart
                      ? 'bg-emerald-500'
                      : 'bg-[var(--color-primary,#3b82f6)] hover:bg-[var(--color-primary,#3b82f6)]/90',
                  )}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Added to Cart
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <button
                  type="button"
                  onClick={onViewFull}
                  className="rounded-xl border border-[var(--color-border,#e5e7eb)] py-3 text-sm font-medium text-[var(--color-foreground,#111827)] transition-colors hover:bg-[var(--color-muted,#f3f4f6)]"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

ProductQuickView.displayName = 'ProductQuickView';
