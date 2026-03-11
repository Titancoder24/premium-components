'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Webhook,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  Globe,
  Code2,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export interface WebhookNotificationCardProps {
  source: string
  event: string
  payload: string
  receivedAt: string
  status: 'success' | 'failed'
  className?: string
}

const expandVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeInOut' },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const WebhookNotificationCard: React.FC<WebhookNotificationCardProps> = ({
  source,
  event,
  payload,
  receivedAt,
  status,
  className,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const isSuccess = status === 'success'

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(payload)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API may not be available
    }
  }

  let formattedPayload = payload
  try {
    formattedPayload = JSON.stringify(JSON.parse(payload), null, 2)
  } catch {
    // keep raw if not valid JSON
  }

  const payloadLines = formattedPayload.split('\n')
  const previewLines = payloadLines.slice(0, 3).join('\n')
  const hasMore = payloadLines.length > 3

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'w-full max-w-lg rounded-xl border overflow-hidden',
        isSuccess
          ? 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'
          : 'border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--card))]',
        'shadow-lg',
        className,
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <div
          className={cn(
            'flex items-center justify-center h-9 w-9 rounded-lg flex-shrink-0 mt-0.5',
            isSuccess
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))]',
          )}
        >
          <Webhook className="h-4.5 w-4.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
              <span className="text-sm font-semibold text-[hsl(var(--card-foreground))]">
                {source}
              </span>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
                isSuccess
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))]',
              )}
            >
              {isSuccess ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {isSuccess ? 'Success' : 'Failed'}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[hsl(var(--muted))] text-xs font-mono text-[hsl(var(--card-foreground))]">
              <Code2 className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
              {event}
            </span>
            <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
              <Clock className="h-3 w-3" />
              {receivedAt}
            </span>
          </div>

          <div
            className="relative rounded-lg bg-[hsl(var(--muted)/0.4)] border border-[hsl(var(--border))] cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-[hsl(var(--border)/0.5)]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                Payload
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-[hsl(var(--muted))] transition-colors"
                  title="Copy payload"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {expanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                  )}
                </motion.span>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  key="full"
                  variants={expandVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <pre className="px-3 py-2 text-xs font-mono text-[hsl(var(--card-foreground))] whitespace-pre-wrap break-all overflow-x-auto max-h-64 overflow-y-auto">
                    {formattedPayload}
                  </pre>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-3 py-2"
                >
                  <pre className="text-xs font-mono text-[hsl(var(--muted-foreground))] whitespace-pre-wrap break-all line-clamp-3">
                    {previewLines}
                  </pre>
                  {hasMore && (
                    <p className="text-[10px] text-[hsl(var(--primary))] mt-1 font-medium">
                      Click to expand ({payloadLines.length} lines)
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

WebhookNotificationCard.displayName = 'WebhookNotificationCard'
