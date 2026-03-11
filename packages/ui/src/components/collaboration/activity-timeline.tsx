'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, FileText, MessageSquare, UserPlus, Settings, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TimelineActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  icon?: string;
}

export interface ActivityTimelineProps {
  activities: TimelineActivity[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const iconMap: Record<string, React.ElementType> = {
  file: FileText,
  comment: MessageSquare,
  user: UserPlus,
  settings: Settings,
  star: Star,
  default: Activity,
};

const getIcon = (iconName?: string): React.ElementType => {
  if (iconName && iconMap[iconName]) return iconMap[iconName]!;
  return iconMap['default']!;
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  className,
}) => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
          Recent Activity
        </h3>
        <span
          className="ml-auto text-xs rounded-full px-2 py-0.5"
          style={{
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--muted-foreground))',
          }}
        >
          {activities.length} events
        </span>
      </div>

      <div className="relative ml-3">
        {/* Vertical line */}
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{ backgroundColor: 'hsl(var(--border))' }}
        />

        <AnimatePresence>
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.icon);
            const isHovered = hoveredId === activity.id;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
                className="relative flex gap-3 pb-4 last:pb-0"
                onMouseEnter={() => setHoveredId(activity.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Dot */}
                <motion.div
                  className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: isHovered
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--border))',
                    backgroundColor: isHovered
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--background))',
                    transition: 'all 0.2s',
                  }}
                  animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                />

                {/* Content */}
                <motion.div
                  className="flex-1 min-w-0 rounded-lg px-3 py-2 -mt-0.5"
                  style={{
                    backgroundColor: isHovered
                      ? 'hsl(var(--accent))'
                      : 'transparent',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: 'hsl(var(--primary))' }}
                    />
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {activity.user}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {activity.action}{' '}
                    <span
                      className="font-medium"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {activity.target}
                    </span>
                  </p>
                  <span
                    className="text-xs mt-1 block"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  >
                    {activity.timestamp}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

ActivityTimeline.displayName = 'ActivityTimeline';
