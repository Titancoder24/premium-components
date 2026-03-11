'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inbox, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface UnreadGroup {
  id: string
  label: string
  icon?: React.ReactNode
  count: number
  color?: string
}

export interface UnreadBadgeStackProps {
  groups: UnreadGroup[]
  onGroupClick?: (id: string) => void
  className?: string
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
  exit: { opacity: 0, x: 12, transition: { duration: 0.15 } },
}

const badgeVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: [1.3, 0.9, 1],
    opacity: 1,
    transition: { type: 'spring', stiffness: 500, damping: 15 },
  },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.15 } },
}

const defaultColors = [
  'hsl(var(--primary))',
  'hsl(220, 70%, 55%)',
  'hsl(150, 60%, 42%)',
  'hsl(35, 90%, 55%)',
  'hsl(280, 60%, 55%)',
  'hsl(0, 70%, 55%)',
]

export const UnreadBadgeStack: React.FC<UnreadBadgeStackProps> = ({
  groups,
  onGroupClick,
  className,
}) => {
  const totalCount = groups.reduce((sum, g) => sum + g.count, 0)

  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-[hsl(var(--primary))]" />
          <h3 className="text-sm font-semibold text-[hsl(var(--card-foreground))]">
            Unread Messages
          </h3>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={totalCount}
            variants={badgeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-bold"
          >
            {totalCount}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="divide-y divide-[hsl(var(--border))]">
        <AnimatePresence>
          {groups.map((group, i) => {
            const color = group.color || defaultColors[i % defaultColors.length]

            return (
              <motion.button
                key={group.id}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => onGroupClick?.(group.id)}
                className="flex items-center gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-[hsl(var(--muted)/0.4)]"
              >
                <div
                  className="flex items-center justify-center h-9 w-9 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  {group.icon || (
                    <Inbox className="h-4 w-4" style={{ color }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[hsl(var(--card-foreground))] truncate">
                    {group.label}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {group.count === 0
                      ? 'All caught up'
                      : `${group.count} unread message${group.count !== 1 ? 's' : ''}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {group.count > 0 && (
                      <motion.span
                        key={group.count}
                        variants={badgeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {group.count > 99 ? '99+' : group.count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground)/0.5)]" />
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-[hsl(var(--muted-foreground))]">
          <Inbox className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-sm">No message groups</p>
        </div>
      )}

      {totalCount === 0 && groups.length > 0 && (
        <div className="px-4 py-3 bg-[hsl(var(--muted)/0.2)] border-t border-[hsl(var(--border))]">
          <p className="text-xs text-center text-[hsl(var(--muted-foreground))]">
            You are all caught up!
          </p>
        </div>
      )}
    </div>
  )
}

UnreadBadgeStack.displayName = 'UnreadBadgeStack'
