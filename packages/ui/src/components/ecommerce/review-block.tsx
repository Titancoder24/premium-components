'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface ReviewBlockProps {
  averageRating: number;
  totalReviews: number;
  distribution: Record<string, number>;
  reviews: Review[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StarRating({
  rating,
  size = 'sm',
  animate = false,
}: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}) {
  const sizeClasses = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-6 w-6' };

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={animate ? { opacity: 0, scale: 0 } : false}
          animate={animate ? { opacity: 1, scale: 1 } : undefined}
          transition={animate ? { delay: i * 0.08, type: 'spring', stiffness: 400, damping: 15 } : undefined}
        >
          <Star
            className={cn(
              sizeClasses[size],
              i < Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-[var(--color-muted,#e5e7eb)] text-[var(--color-muted,#e5e7eb)]',
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}

function DistributionBar({
  label,
  count,
  max,
  index,
}: {
  label: string;
  count: number;
  max: number;
  index: number;
}) {
  const percent = max > 0 ? (count / max) * 100 : 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-8 text-right text-[var(--color-muted-foreground,#6b7280)]">
        {label}
      </span>
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-muted,#f3f4f6)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded-full bg-amber-400"
        />
      </div>
      <span className="w-8 text-xs text-[var(--color-muted-foreground,#6b7280)]">
        {count}
      </span>
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-lg border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] p-4"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-[var(--color-foreground,#111827)]">
            {review.author}
          </span>
          <StarRating rating={review.rating} />
        </div>
        <span className="text-xs text-[var(--color-muted-foreground,#6b7280)]">
          {review.date}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-muted-foreground,#6b7280)]">
        {review.comment}
      </p>
      {review.helpful > 0 && (
        <div className="mt-3 flex items-center gap-1 text-xs text-[var(--color-muted-foreground,#6b7280)]">
          <ThumbsUp className="h-3 w-3" />
          {review.helpful} found this helpful
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReviewBlock({
  averageRating,
  totalReviews,
  distribution,
  reviews,
  className,
}: ReviewBlockProps) {
  const sortedKeys = Object.keys(distribution).sort(
    (a, b) => Number(b) - Number(a),
  );
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Summary row */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Average rating */}
        <div className="flex flex-col items-center gap-1">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-4xl font-bold text-[var(--color-foreground,#111827)]"
          >
            {averageRating.toFixed(1)}
          </motion.span>
          <StarRating rating={averageRating} size="md" animate />
          <span className="text-sm text-[var(--color-muted-foreground,#6b7280)]">
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Distribution */}
        <div className="flex flex-1 flex-col gap-1.5">
          {sortedKeys.map((key, idx) => (
            <DistributionBar
              key={key}
              label={key}
              count={distribution[key]}
              max={maxCount}
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-3">
        {reviews.map((review, idx) => (
          <ReviewCard key={review.id} review={review} index={idx} />
        ))}
      </div>
    </div>
  );
}

ReviewBlock.displayName = 'ReviewBlock';
