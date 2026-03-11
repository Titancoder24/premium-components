'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inbox, Check, Bell, Archive, Circle } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface InboxNotification {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  category: string
}

export interface InboxPanelProps {
  notifications: InboxNotification[]
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
  onMarkRead: (id: string) => void
  className?: string
}

const tabVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.25 },
  }),
}

export const InboxPanel: React.FC<InboxPanelProps> = ({
  notifications,
  tabs,
  activeTab,
  onTabChange,
  onMarkRead,
  className,
}) => {
  const filtered = useMemo(
    () =>
      activeTab === tabs[0]
        ? notifications
        : notifications.filter((n) => n.category === activeTab),
    [notifications, activeTab, tabs],
  )

  const unreadCount = useMemo(
    () => filtered.filter((n) => !n.read).length,
    [filtered],
  )

  return (
    <div
      className={cn(
        'flex flex-col w-full max-w-md rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
            Inbox
          </h2>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-medium"
            >
              {unreadCount}
            </motion.span>
          )}
        </div>
        <Archive className="h-4 w-4 text-[hsl(var(--muted-foreground))] cursor-pointer hover:text-[hsl(var(--foreground))] transition-colors" />
      </div>

      <div className="flex gap-1 px-4 pb-2 border-b border-[hsl(var(--border))]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              'relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              activeTab === tab
                ? 'text-[hsl(var(--primary))]'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="inbox-tab-indicator"
                className="absolute inset-0 rounded-md bg-[hsl(var(--primary)/0.1)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto max-h-96">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="divide-y divide-[hsl(var(--border))]"
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--muted-foreground))]">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              filtered.map((notification, i) => (
                <motion.div
                  key={notification.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[hsl(var(--muted)/0.5)]',
                    !notification.read && 'bg-[hsl(var(--primary)/0.04)]',
                  )}
                  onClick={() => onMarkRead(notification.id)}
                >
                  <div className="mt-1.5 flex-shrink-0">
                    {notification.read ? (
                      <Check className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                    ) : (
                      <Circle className="h-2.5 w-2.5 fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          'text-sm truncate',
                          notification.read
                            ? 'text-[hsl(var(--muted-foreground))]'
                            : 'font-medium text-[hsl(var(--card-foreground))]',
                        )}
                      >
                        {notification.title}
                      </p>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] flex-shrink-0">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-2">
                      {notification.body}
                    </p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                      {notification.category}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

InboxPanel.displayName = 'InboxPanel'
