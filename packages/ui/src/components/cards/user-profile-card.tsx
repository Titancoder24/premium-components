'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = React.useState(0);
  const rafRef = React.useRef<number>();

  React.useEffect(() => {
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProfileStat {
  label: string;
  value: number;
}

export interface ProfileAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface UserProfileCardProps {
  avatar: string;
  name: string;
  role: string;
  stats: ProfileStat[];
  actions?: ProfileAction[];
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedStat
// ---------------------------------------------------------------------------

const AnimatedStat: React.FC<{ stat: ProfileStat }> = ({ stat }) => {
  const animated = useCountUp(stat.value);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-bold text-foreground">
        {animated.toLocaleString()}
      </span>
      <span className="text-xs text-muted-foreground">{stat.label}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// UserProfileCard
// ---------------------------------------------------------------------------

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  avatar,
  name,
  role,
  stats,
  actions = [],
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'group flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm',
        className,
      )}
    >
      {/* Avatar with animated ring */}
      <div className="relative">
        <motion.div
          className="absolute -inset-1 rounded-full border-2 border-primary/40"
          initial={{ rotate: 0 }}
          whileHover={{
            rotate: 360,
            borderColor: 'hsl(var(--primary) / 0.8)',
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        <img
          src={avatar}
          alt={name}
          className="relative h-20 w-20 rounded-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="text-base font-semibold text-foreground">{name}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{role}</p>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="flex w-full justify-evenly border-y border-border py-4">
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} stat={stat} />
          ))}
        </div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex w-full gap-3">
          {actions.map((action) => (
            <motion.button
              key={action.label}
              onClick={action.onClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                action.variant === 'secondary'
                  ? 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  : 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
              )}
            >
              {action.label}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

UserProfileCard.displayName = 'UserProfileCard';
