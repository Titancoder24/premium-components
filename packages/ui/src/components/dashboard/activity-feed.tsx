'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Zap, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActivityUser {
  name: string;
  avatar?: string;
}

export type ActivityType = 'action' | 'comment' | 'system' | 'alert';

export interface ActivityItem {
  id: string;
  user: ActivityUser;
  action: string;
  target?: string;
  timestamp: string;
  type: ActivityType;
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const typeIcons: Record<ActivityType, React.ReactNode> = {
  action: <Activity className="h-3.5 w-3.5" />,
  comment: <MessageSquare className="h-3.5 w-3.5" />,
  system: <Zap className="h-3.5 w-3.5" />,
  alert: <AlertTriangle className="h-3.5 w-3.5" />,
};

const typeDotColors: Record<ActivityType, string> = {
  action: 'bg-blue-500',
  comment: 'bg-emerald-500',
  system: 'bg-violet-500',
  alert: 'bg-amber-500',
};

function UserAvatar({ user }: { user: ActivityUser }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="h-7 w-7 rounded-full object-cover"
      />
    );
  }

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
      {initials}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Container + Item variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
};

// ---------------------------------------------------------------------------
// ActivityFeed
// ---------------------------------------------------------------------------

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  maxItems,
  className,
}) => {
  const visibleItems = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'rounded-xl border border-border bg-card p-5',
        className,
      )}
    >
      <ul className="space-y-3">
        <AnimatePresence initial={false}>
          {visibleItems.map((item) => (
            <motion.li
              key={item.id}
              variants={itemVariants}
              layout
              className="flex items-start gap-3"
            >
              {/* Timeline dot */}
              <div className="relative mt-2 flex flex-col items-center">
                <span
                  className={cn(
                    'block h-2 w-2 rounded-full',
                    typeDotColors[item.type],
                  )}
                />
              </div>

              {/* Avatar */}
              <UserAvatar user={item.user} />

              {/* Content */}
              <div className="flex-1 text-sm leading-snug">
                <span className="font-medium text-foreground">
                  {item.user.name}
                </span>{' '}
                <span className="text-muted-foreground">{item.action}</span>
                {item.target && (
                  <>
                    {' '}
                    <span className="font-medium text-foreground">
                      {item.target}
                    </span>
                  </>
                )}
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {typeIcons[item.type]}
                  <time>{item.timestamp}</time>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
};

ActivityFeed.displayName = 'ActivityFeed';
