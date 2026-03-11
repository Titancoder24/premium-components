'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TestimonialAuthor {
  name: string;
  title: string;
  company: string;
  avatar: string;
}

export interface TestimonialCardProps {
  quote: string;
  author: TestimonialAuthor;
  rating: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

// ---------------------------------------------------------------------------
// TestimonialCard
// ---------------------------------------------------------------------------

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  rating,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors',
        className,
      )}
    >
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
          >
            <Star
              className={cn(
                'h-4 w-4',
                i < rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-muted text-muted',
              )}
            />
          </motion.div>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2">
        <img
          src={author.avatar}
          alt={author.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {author.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {author.title}, {author.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

TestimonialCard.displayName = 'TestimonialCard';
