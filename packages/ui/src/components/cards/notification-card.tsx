'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NotificationCardProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  onClick?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// NotificationCard
// ---------------------------------------------------------------------------

export const NotificationCard: React.FC<NotificationCardProps> = ({
  icon,
  title,
  message,
  timestamp,
  read = false,
  onClick,
  className,
}) => {
  const [isRead, setIsRead] = React.useState(read);

  const handleClick = () => {
    setIsRead(true);
    onClick?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors',
        !isRead && 'bg-primary/[0.03]',
        className,
      )}
    >
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              'truncate text-sm text-foreground',
              !isRead ? 'font-semibold' : 'font-medium',
            )}
          >
            {title}
          </h4>

          {/* Unread dot */}
          <motion.div
            initial={false}
            animate={{
              scale: isRead ? 0 : 1,
              opacity: isRead ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="relative mt-1.5 shrink-0"
          >
            <span className="block h-2 w-2 rounded-full bg-primary" />
            {!isRead && (
              <motion.span
                className="absolute inset-0 rounded-full bg-primary"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.div>
        </div>

        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {message}
        </p>
        <span className="mt-1.5 block text-[11px] text-muted-foreground/70">
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
};

NotificationCard.displayName = 'NotificationCard';
