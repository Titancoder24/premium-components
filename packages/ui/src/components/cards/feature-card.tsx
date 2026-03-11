'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// FeatureCard
// ---------------------------------------------------------------------------

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  href,
  className,
}) => {
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
      className={cn(
        'group rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors',
        href && 'cursor-pointer',
        className,
      )}
    >
      <Wrapper {...(wrapperProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)} className="flex flex-col gap-4">
        {/* Icon with float animation */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
        >
          {icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Arrow link */}
        {href && (
          <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-primary">
            <span>Learn more</span>
            <motion.span
              className="inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.span>
          </div>
        )}
      </Wrapper>
    </motion.div>
  );
};

FeatureCard.displayName = 'FeatureCard';
