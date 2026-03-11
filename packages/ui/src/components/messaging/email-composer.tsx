'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Save,
  Trash2,
  Bold,
  Italic,
  Underline,
  Link,
  Paperclip,
  ChevronDown,
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export interface EmailAttachment {
  name: string
  size: string
}

export interface EmailComposerProps {
  to?: string
  subject?: string
  body?: string
  onSend: (data: { to: string; subject: string; body: string }) => void
  onDraft?: () => void
  onDiscard?: () => void
  attachments?: EmailAttachment[]
  className?: string
}

const expandVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  to: initialTo = '',
  subject: initialSubject = '',
  body: initialBody = '',
  onSend,
  onDraft,
  onDiscard,
  attachments = [],
  className,
}) => {
  const [to, setTo] = useState(initialTo)
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const [showCc, setShowCc] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!to.trim() || !subject.trim()) return
    setSending(true)
    onSend({ to, subject, body })
    setTimeout(() => setSending(false), 1200)
  }

  const toolbarButtons = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: Underline, label: 'Underline' },
    { icon: Link, label: 'Link' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-2xl rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))]">
        <h3 className="text-sm font-semibold text-[hsl(var(--card-foreground))]">
          New Message
        </h3>
        <button
          onClick={onDiscard}
          className="p-1 rounded hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        </button>
      </div>

      <div className="divide-y divide-[hsl(var(--border))]">
        <div className="flex items-center px-4 py-2">
          <span className="text-sm text-[hsl(var(--muted-foreground))] w-16">To</span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[hsl(var(--card-foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
            placeholder="recipient@example.com"
          />
          <button
            onClick={() => setShowCc(!showCc)}
            className="text-xs text-[hsl(var(--primary))] hover:underline"
          >
            Cc/Bcc
            <ChevronDown className="inline h-3 w-3 ml-0.5" />
          </button>
        </div>

        <AnimatePresence>
          {showCc && (
            <motion.div
              variants={expandVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex items-center px-4 py-2 overflow-hidden"
            >
              <span className="text-sm text-[hsl(var(--muted-foreground))] w-16">Cc</span>
              <input
                type="text"
                className="flex-1 bg-transparent text-sm text-[hsl(var(--card-foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
                placeholder="cc@example.com"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center px-4 py-2">
          <span className="text-sm text-[hsl(var(--muted-foreground))] w-16">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[hsl(var(--card-foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
            placeholder="Subject"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-[hsl(var(--border))]">
        {toolbarButtons.map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={label}
            className="p-1.5 rounded hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <div className="h-4 w-px bg-[hsl(var(--border))] mx-1" />
        <button className="p-1.5 rounded hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
          <Paperclip className="h-4 w-4" />
        </button>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
        className="w-full px-4 py-3 bg-transparent text-sm text-[hsl(var(--card-foreground))] outline-none resize-none placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
        placeholder="Compose your email..."
      />

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {attachments.map((att) => (
            <span
              key={att.name}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[hsl(var(--muted))] text-xs text-[hsl(var(--muted-foreground))]"
            >
              <Paperclip className="h-3 w-3" />
              {att.name}
              <span className="opacity-60">({att.size})</span>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.2)]">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSend}
            disabled={sending}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
              'hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50',
            )}
          >
            <Send className="h-4 w-4" />
            {sending ? 'Sending...' : 'Send'}
          </motion.button>
          <button
            onClick={onDraft}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <Save className="h-4 w-4" />
            Draft
          </button>
        </div>
        <button
          onClick={onDiscard}
          className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)] transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

EmailComposer.displayName = 'EmailComposer'
