'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Megaphone,
  Send,
  Clock,
  ToggleLeft,
  ToggleRight,
  Calendar,
  X,
  Users,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export interface BroadcastChannel {
  id: string
  name: string
  enabled: boolean
}

export interface BroadcastComposerProps {
  channels: BroadcastChannel[]
  onToggleChannel: (id: string) => void
  subject?: string
  body?: string
  onSend: (data: { subject: string; body: string; scheduledAt?: string }) => void
  scheduledAt?: string
  className?: string
}

const toggleVariants = {
  off: { x: 0 },
  on: { x: 16 },
}

const sendVariants = {
  idle: { scale: 1 },
  sending: {
    scale: [1, 0.95, 1.05, 1],
    transition: { duration: 0.4 },
  },
}

export const BroadcastComposer: React.FC<BroadcastComposerProps> = ({
  channels,
  onToggleChannel,
  subject: initialSubject = '',
  body: initialBody = '',
  onSend,
  scheduledAt: initialSchedule,
  className,
}) => {
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const [showSchedule, setShowSchedule] = useState(!!initialSchedule)
  const [scheduledAt, setScheduledAt] = useState(initialSchedule ?? '')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const enabledCount = channels.filter((c) => c.enabled).length

  const handleSend = () => {
    if (!subject.trim() || !body.trim() || enabledCount === 0) return
    setSending(true)
    setTimeout(() => {
      onSend({ subject, body, scheduledAt: showSchedule ? scheduledAt : undefined })
      setSending(false)
      setSent(true)
      setTimeout(() => setSent(false), 2000)
    }, 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-2xl rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 py-4 bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))]">
        <Megaphone className="h-5 w-5 text-[hsl(var(--primary))]" />
        <h2 className="text-base font-semibold text-[hsl(var(--card-foreground))]">
          Broadcast Message
        </h2>
        <span className="ml-auto text-xs text-[hsl(var(--muted-foreground))]">
          <Users className="inline h-3.5 w-3.5 mr-1" />
          {enabledCount} channel{enabledCount !== 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="px-5 py-4 border-b border-[hsl(var(--border))]">
        <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
          Channels
        </p>
        <div className="flex flex-wrap gap-2">
          {channels.map((channel) => (
            <motion.button
              key={channel.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleChannel(channel.id)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                channel.enabled
                  ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]'
                  : 'border-[hsl(var(--border))] bg-transparent text-[hsl(var(--muted-foreground))]',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={channel.enabled ? 'on' : 'off'}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {channel.enabled ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </motion.span>
              </AnimatePresence>
              {channel.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[hsl(var(--border))]">
        <div className="flex items-center px-5 py-3">
          <span className="text-sm text-[hsl(var(--muted-foreground))] w-20">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[hsl(var(--card-foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
            placeholder="Announcement subject..."
          />
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full px-5 py-3 bg-transparent text-sm text-[hsl(var(--card-foreground))] outline-none resize-none placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
          placeholder="Write your broadcast message..."
        />
      </div>

      <AnimatePresence>
        {showSchedule && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: 0.25 } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            className="overflow-hidden border-t border-[hsl(var(--border))]"
          >
            <div className="flex items-center gap-3 px-5 py-3">
              <Calendar className="h-4 w-4 text-[hsl(var(--primary))]" />
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[hsl(var(--card-foreground))] outline-none"
              />
              <button
                onClick={() => {
                  setShowSchedule(false)
                  setScheduledAt('')
                }}
                className="p-1 rounded hover:bg-[hsl(var(--muted))] transition-colors"
              >
                <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-5 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.2)]">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors',
            showSchedule
              ? 'text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]'
              : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
          )}
        >
          <Clock className="h-4 w-4" />
          Schedule
        </button>

        <motion.button
          variants={sendVariants}
          animate={sending ? 'sending' : 'idle'}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSend}
          disabled={sending || enabledCount === 0 || !subject.trim()}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors',
            'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
            'hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.span
                key="done"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Sent!
              </motion.span>
            ) : (
              <motion.span
                key="send"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {sending ? 'Sending...' : showSchedule && scheduledAt ? 'Schedule' : 'Broadcast'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  )
}

BroadcastComposer.displayName = 'BroadcastComposer'
