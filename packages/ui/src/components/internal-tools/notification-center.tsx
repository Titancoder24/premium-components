'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  X,
  Info,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  AtSign,
  Inbox,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationType = 'info' | 'warning' | 'success' | 'mention' | 'message';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  /** ISO date string for grouping */
  date: string;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

type FilterTab = 'all' | 'unread' | 'mentions';

// ---------------------------------------------------------------------------
// Icon config
// ---------------------------------------------------------------------------

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/40' },
  mention: { icon: AtSign, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/40' },
  message: { icon: MessageSquare, color: 'text-foreground', bg: 'bg-muted' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupByDate(notifications: Notification[]): { label: string; items: Notification[] }[] {
  const groups = new Map<string, Notification[]>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const n of notifications) {
    const d = new Date(n.date);
    d.setHours(0, 0, 0, 0);
    let label: string;
    if (d.getTime() === today.getTime()) label = 'Today';
    else if (d.getTime() === yesterday.getTime()) label = 'Yesterday';
    else label = 'Earlier';

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(n);
  }

  const order = ['Today', 'Yesterday', 'Earlier'];
  return order
    .filter((l) => groups.has(l))
    .map((label) => ({ label, items: groups.get(label)! }));
}

// ---------------------------------------------------------------------------
// Animated badge count
// ---------------------------------------------------------------------------

function AnimatedBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={count}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white"
      >
        {count > 99 ? '99+' : count}
      </motion.span>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Notification item
// ---------------------------------------------------------------------------

function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
}: {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;
  const [swiping, setSwiping] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      onClick={() => {
        if (!notification.read) onMarkRead?.(notification.id);
      }}
      className={cn(
        'group relative flex cursor-pointer gap-3 rounded-lg px-3 py-3 transition-colors',
        notification.read
          ? 'hover:bg-muted/50'
          : 'bg-primary/[0.03] hover:bg-primary/[0.06] dark:bg-primary/[0.05] dark:hover:bg-primary/[0.08]',
      )}
    >
      {/* Icon */}
      <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', config.bg)}>
        <Icon className={cn('h-4 w-4', config.color)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm', notification.read ? 'text-foreground' : 'font-medium text-foreground')}>
            {notification.title}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">{notification.timestamp}</span>
            {/* Unread dot */}
            <AnimatePresence>
              {!notification.read && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="relative flex h-2 w-2"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss?.(notification.id);
        }}
        className="absolute right-2 top-2 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// NotificationCenter
// ---------------------------------------------------------------------------

export function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  className,
}: NotificationCenterProps) {
  const [filter, setFilter] = React.useState<FilterTab>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = React.useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    if (filter === 'mentions') return notifications.filter((n) => n.type === 'mention');
    return notifications;
  }, [notifications, filter]);

  const groups = React.useMemo(() => groupByDate(filtered), [filtered]);

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'mentions', label: 'Mentions' },
  ];

  return (
    <div className={cn('w-full rounded-lg border border-border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          <AnimatedBadge count={unreadCount} />
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </motion.button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="relative flex border-b border-border px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              'relative px-3 py-2.5 text-xs font-medium transition-colors',
              filter === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
            {filter === tab.id && (
              <motion.div
                layoutId="notification-tab-indicator"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="max-h-[480px] overflow-y-auto">
        {groups.length === 0 ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2 py-16 text-muted-foreground"
          >
            <Inbox className="h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs">You&apos;re all caught up!</p>
          </motion.div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <div className="sticky top-0 z-10 bg-card/95 px-4 py-2 backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground">{group.label}</span>
              </div>
              <div className="px-1">
                <AnimatePresence mode="popLayout">
                  {group.items.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={onMarkRead}
                      onDismiss={onDismiss}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

NotificationCenter.displayName = 'NotificationCenter';
