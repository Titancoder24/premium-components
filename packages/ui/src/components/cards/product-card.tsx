'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductCardProps {
  images: string[];
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  onAddToCart?: () => void;
  onQuickView?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// ProductCard
// ---------------------------------------------------------------------------

export const ProductCard: React.FC<ProductCardProps> = ({
  images,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  onAddToCart,
  onQuickView,
  className,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [addedToCart, setAddedToCart] = React.useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    onAddToCart?.();
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors',
        className,
      )}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* Primary image */}
        <motion.img
          src={images[0]}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          animate={{ opacity: hovered && images.length > 1 ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Secondary image crossfade */}
        {images.length > 1 && (
          <motion.img
            src={images[1]}
            alt={`${name} alternate`}
            className="absolute inset-0 h-full w-full object-cover"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}

        {/* Quick view overlay */}
        <AnimatePresence>
          {hovered && onQuickView && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              onClick={onQuickView}
              className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur-sm hover:bg-background"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="truncate text-sm font-semibold text-foreground">{name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < Math.round(rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-muted text-muted',
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Price + add to cart */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-foreground">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              addedToCart
                ? 'bg-emerald-500 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <ShoppingCart className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

ProductCard.displayName = 'ProductCard';
