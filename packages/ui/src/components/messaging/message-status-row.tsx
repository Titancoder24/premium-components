'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Smartphone,
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  XCircle,
  Send,
  ArrowUpRight,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export type MessageChannel = 'email' | 'sms' | 'push'
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'pending'

export interface MessageStatusRowProps {
  recipient: string
  channel: MessageChannel
  status: MessageStatus
  sentAt: string
  className?: string
}

const channelConfig: Record<
  MessageChannel,
  { icon: React.ElementType; label: string }
> = {
  email: { icon: Mail, label: 'Email' },
  sms: { icon: Smartphone, label: 'SMS' },
  push: { icon: Bell, label: 'Push' },
}

const statusConfig: Record<
  MessageStatus,
  { icon: React.ElementType; label: string; color: string; bgColor: string }
> = {
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'text-[hsl(var(--muted-foreground))]',
    bgColor: 'bg-[hsl(var(--muted))]',
  },
  sent: {
    icon: Send,
    label: 'Sent',
    color: 'text-[hsl(var(--primary))]',
    bgColor: 'bg-[hsl(var(--primary)/0.1)]',
  },
  delivered: {
    icon: CheckCircle2,
    label: 'Delivered',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  read: {
    icon: Eye,
    label: 'Read',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-[hsl(var(--destructive))]',
    bgColor: 'bg-[hsl(var(--destructive)/0.1)]',
  },
}

const iconTransition = {
  initial: { scale: 0, rotate: -90 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  },
  exit: { scale: 0, rotate: 90, transition: { duration: 0.15 } },
}

export const MessageStatusRow: React.FC<MessageStatusRowProps> = ({
  recipient,
  channel,
  status,
  sentAt,
  className,
}) => {
  const { icon: ChannelIcon, label: channelLabel } = channelConfig[channel]
  const {
    icon: StatusIcon,
    label: statusLabel,
    color: statusColor,
    bgColor: statusBg,
  } = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'flex items-center gap-4 px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-md transition-shadow',
        className,
      )}
    >
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-[hsl(var(--muted))]">
        <ChannelIcon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-[hsl(var(--card-foreground))] truncate">
            {recipient}
          </p>
          <ArrowUpRight className="h-3 w-3 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {channelLabel}
          </span>
          <span className="text-[hsl(var(--border))]">&middot;</span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {sentAt}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            variants={iconTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              statusColor,
              statusBg,
            )}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            <span>{statusLabel}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

MessageStatusRow.displayName = 'MessageStatusRow'
