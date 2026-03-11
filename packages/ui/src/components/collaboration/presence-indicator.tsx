'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Clock, MinusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PresenceStatus = 'online' | 'offline' | 'away' | 'busy';

export interface PresenceIndicatorProps {
  status: PresenceStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const statusConfig: Record<
  PresenceStatus,
  { color: string; label: string; icon: React.ElementType }
> = {
  online: { color: 'hsl(142, 71%, 45%)', label: 'Online', icon: Wifi },
  offline: { color: 'hsl(var(--muted-foreground))', label: 'Offline', icon: WifiOff },
  away: { color: 'hsl(48, 96%, 53%)', label: 'Away', icon: Clock },
  busy: { color: 'hsl(var(--destructive))', label: 'Busy', icon: MinusCircle },
};

const sizeConfig: Record<string, { dot: number; text: string; icon: number; gap: string }> = {
  sm: { dot: 8, text: 'text-xs', icon: 10, gap: 'gap-1' },
  md: { dot: 12, text: 'text-sm', icon: 14, gap: 'gap-1.5' },
  lg: { dot: 16, text: 'text-base', icon: 18, gap: 'gap-2' },
};

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const { color, label, icon: Icon } = statusConfig[status];
  const { dot, text, icon, gap } = sizeConfig[size]!;

  return (
    <div
      className={cn('inline-flex items-center', gap, className)}
      role="status"
      aria-label={label}
    >
      <div className="relative inline-flex items-center justify-center">
        <motion.span
          className="rounded-full block"
          style={{
            width: dot,
            height: dot,
            backgroundColor: color,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        />
        {status === 'online' && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              scale: [1, 1.8, 1.8],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
        {status === 'busy' && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              opacity: [1, 0.4, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {showLabel && (
        <motion.div
          className={cn('flex items-center', gap)}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon style={{ width: icon, height: icon, color }} />
          <span className={cn('font-medium', text)} style={{ color: 'hsl(var(--foreground))' }}>
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
};

PresenceIndicator.displayName = 'PresenceIndicator';
