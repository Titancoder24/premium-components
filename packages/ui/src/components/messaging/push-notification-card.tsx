'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, X, GripHorizontal } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface PushNotificationAction {
  label: string
  onClick: () => void
}

export interface PushNotificationCardProps {
  appName: string
  appIcon?: React.ReactNode
  title: string
  body: string
  timestamp: string
  actions?: PushNotificationAction[]
  className?: string
}

const slideDown = {
  hidden: { opacity: 0, y: -40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

export const PushNotificationCard: React.FC<PushNotificationCardProps> = ({
  appName,
  appIcon,
  title,
  body,
  timestamp,
  actions = [],
  className,
}) => {
  const [dismissed, setDismissed] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)

  if (dismissed) return null

  return (
    <motion.div
      variants={slideDown}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'w-full max-w-sm rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-center pt-2 pb-1">
        <GripHorizontal className="h-4 w-6 text-[hsl(var(--muted-foreground)/0.4)]" />
      </div>

      <div
        className="px-4 pb-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex items-center justify-center h-5 w-5 rounded-md bg-[hsl(var(--primary)/0.15)]">
            {appIcon || (
              <Smartphone className="h-3 w-3 text-[hsl(var(--primary))]" />
            )}
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {appName}
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground)/0.6)] ml-auto">
            {timestamp}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDismissed(true)
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <X className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        <h3 className="text-sm font-semibold text-[hsl(var(--card-foreground))] leading-tight">
          {title}
        </h3>
        <motion.p
          animate={{ height: expanded ? 'auto' : '2.5em' }}
          className={cn(
            'text-sm text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed overflow-hidden',
            !expanded && 'line-clamp-2',
          )}
        >
          {body}
        </motion.p>
      </div>

      {actions.length > 0 && (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="flex border-t border-[hsl(var(--border))]"
        >
          {actions.map((action, idx) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--muted)/0.5)]',
                idx < actions.length - 1 &&
                  'border-r border-[hsl(var(--border))]',
              )}
            >
              {action.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

PushNotificationCard.displayName = 'PushNotificationCard'
