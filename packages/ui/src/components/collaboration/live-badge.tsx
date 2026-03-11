'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LiveAvatar {
  name: string;
  color: string;
}

export interface LiveBadgeProps {
  count: number;
  maxDisplay?: number;
  avatars?: LiveAvatar[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AvatarCircle: React.FC<{
  avatar: LiveAvatar;
  index: number;
  total: number;
}> = ({ avatar, index, total }) => {
  const initials = avatar.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: -8 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0, x: -8 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
      className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold"
      style={{
        backgroundColor: avatar.color,
        color: '#fff',
        borderColor: 'hsl(var(--background))',
        marginLeft: index > 0 ? -8 : 0,
        zIndex: total - index,
      }}
      title={avatar.name}
    >
      {initials}
    </motion.div>
  );
};

export const LiveBadge: React.FC<LiveBadgeProps> = ({
  count,
  maxDisplay = 3,
  avatars = [],
  className,
}) => {
  const displayAvatars = avatars.slice(0, maxDisplay);
  const overflow = Math.max(0, avatars.length - maxDisplay);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5',
        className,
      )}
      style={{
        borderColor: 'hsl(var(--border))',
        backgroundColor: 'hsl(var(--card))',
      }}
    >
      {/* Live pulse dot */}
      <div className="relative flex items-center justify-center">
        <motion.span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: 'hsl(142, 71%, 45%)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: 'hsl(142, 71%, 45%)' }}
          animate={{
            scale: [1, 2.2, 2.2],
            opacity: [0.4, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </div>

      {/* Avatar stack */}
      {displayAvatars.length > 0 && (
        <div className="flex items-center">
          <AnimatePresence mode="popLayout">
            {displayAvatars.map((avatar, index) => (
              <AvatarCircle
                key={avatar.name}
                avatar={avatar}
                index={index}
                total={displayAvatars.length}
              />
            ))}
          </AnimatePresence>
          {overflow > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-medium"
              style={{
                backgroundColor: 'hsl(var(--muted))',
                color: 'hsl(var(--muted-foreground))',
                borderColor: 'hsl(var(--background))',
                marginLeft: -8,
                zIndex: 0,
              }}
            >
              +{overflow}
            </motion.div>
          )}
        </div>
      )}

      {/* Count */}
      <div className="flex items-center gap-1">
        <Eye className="h-3.5 w-3.5" style={{ color: 'hsl(var(--muted-foreground))' }} />
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium tabular-nums"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {count}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
          viewing
        </span>
      </div>
    </motion.div>
  );
};

LiveBadge.displayName = 'LiveBadge';
