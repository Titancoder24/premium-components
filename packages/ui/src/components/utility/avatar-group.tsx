'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AvatarUser {
  name: string;
  avatar: string;
}

export interface AvatarGroupProps {
  /** List of users to display. */
  users: AvatarUser[];
  /** Maximum number of avatars to show before "+N". */
  max?: number;
  /** Avatar size. */
  size?: 'sm' | 'md' | 'lg';
  /** Called when the group is clicked. */
  onClick?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Size config
// ---------------------------------------------------------------------------

const sizeConfig = {
  sm: { avatar: 'h-7 w-7', text: 'text-[10px]', overlap: '-ml-2', ring: 'ring-2' },
  md: { avatar: 'h-9 w-9', text: 'text-xs', overlap: '-ml-3', ring: 'ring-2' },
  lg: { avatar: 'h-12 w-12', text: 'text-sm', overlap: '-ml-4', ring: 'ring-[3px]' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AvatarGroup({
  users,
  max = 5,
  size = 'md',
  onClick,
  className,
}: AvatarGroupProps) {
  const config = sizeConfig[size];
  const visible = users.slice(0, max);
  const remaining = users.slice(max);
  const hasOverflow = remaining.length > 0;

  const [hovered, setHovered] = React.useState(false);
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [showRemaining, setShowRemaining] = React.useState(false);

  return (
    <div
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setHoveredIdx(null);
        setShowRemaining(false);
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {visible.map((user, idx) => (
        <motion.div
          key={user.name}
          className={cn('relative', idx > 0 && config.overlap)}
          animate={{
            marginLeft: hovered && idx > 0 ? 4 : undefined,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <img
            src={user.avatar}
            alt={user.name}
            className={cn(
              config.avatar,
              config.ring,
              'rounded-full object-cover ring-[var(--color-bg-primary)]',
            )}
          />

          {/* Name tooltip */}
          <AnimatePresence>
            {hoveredIdx === idx && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className={cn(
                  'absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap',
                  'rounded-md bg-[var(--color-text-primary)] px-2 py-1',
                  'text-xs font-medium text-[var(--color-bg-primary)]',
                  'pointer-events-none shadow-sm z-10',
                )}
              >
                {user.name}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* +N overflow badge */}
      {hasOverflow && (
        <motion.div
          className={cn('relative', config.overlap)}
          animate={{ marginLeft: hovered ? 4 : undefined }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onMouseEnter={() => setShowRemaining(true)}
          onMouseLeave={() => setShowRemaining(false)}
        >
          <div
            className={cn(
              config.avatar,
              config.ring,
              config.text,
              'flex items-center justify-center rounded-full font-medium',
              'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
              'ring-[var(--color-bg-primary)]',
            )}
          >
            +{remaining.length}
          </div>

          {/* Remaining names tooltip */}
          <AnimatePresence>
            {showRemaining && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className={cn(
                  'absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full',
                  'rounded-lg bg-[var(--color-text-primary)] px-3 py-2',
                  'shadow-sm z-10 min-w-[120px]',
                )}
              >
                {remaining.map((user) => (
                  <p
                    key={user.name}
                    className="whitespace-nowrap text-xs text-[var(--color-bg-primary)]"
                  >
                    {user.name}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

AvatarGroup.displayName = 'AvatarGroup';
