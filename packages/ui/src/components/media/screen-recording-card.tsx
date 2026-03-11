'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle, Square, Pause, Play, Monitor, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'processing'

export interface ScreenRecordingCardProps {
  status?: RecordingStatus
  duration?: number
  onStart?: () => void
  onStop?: () => void
  onPause?: () => void
  className?: string
}

// ---- Component ----

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const parts: string[] = []
  if (h > 0) parts.push(h.toString().padStart(2, '0'))
  parts.push(m.toString().padStart(2, '0'))
  parts.push(s.toString().padStart(2, '0'))
  return parts.join(':')
}

const STATUS_CONFIG: Record<RecordingStatus, { label: string; color: string; bgColor: string }> = {
  idle: {
    label: 'Ready to record',
    color: 'text-[hsl(var(--muted-foreground))]',
    bgColor: 'bg-[hsl(var(--muted))]',
  },
  recording: {
    label: 'Recording',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  paused: {
    label: 'Paused',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  processing: {
    label: 'Processing...',
    color: 'text-[hsl(var(--primary))]',
    bgColor: 'bg-[hsl(var(--primary))]/10',
  },
}

export const ScreenRecordingCard: React.FC<ScreenRecordingCardProps> = ({
  status = 'idle',
  duration: externalDuration,
  onStart,
  onStop,
  onPause,
  className,
}) => {
  const [internalDuration, setInternalDuration] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const duration = externalDuration ?? internalDuration

  useEffect(() => {
    if (status === 'recording') {
      intervalRef.current = setInterval(() => {
        setInternalDuration((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    if (status === 'idle') {
      setInternalDuration(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [status])

  const config = STATUS_CONFIG[status]

  const handleStart = useCallback(() => {
    setInternalDuration(0)
    onStart?.()
  }, [onStart])

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-[hsl(var(--primary))]" />
          <span className="text-sm font-semibold text-[hsl(var(--card-foreground))]">
            Screen Recording
          </span>
        </div>
        <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1', config.bgColor)}>
          {status === 'recording' && (
            <motion.div
              className="h-2 w-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {status === 'processing' && (
            <Loader2 className="h-3 w-3 animate-spin text-[hsl(var(--primary))]" />
          )}
          <span className={cn('text-xs font-medium', config.color)}>{config.label}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-8">
        <div className="relative mb-6">
          <div className={cn(
            'flex h-24 w-40 items-center justify-center rounded-lg border-2 border-dashed',
            status === 'recording'
              ? 'border-red-500/40 bg-red-500/5'
              : 'border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50',
          )}>
            <Monitor className={cn('h-8 w-8', status === 'recording' ? 'text-red-500/50' : 'text-[hsl(var(--muted-foreground))]')} />
          </div>
          {status === 'recording' && (
            <motion.div
              className="absolute -inset-1 rounded-xl border-2 border-red-500/30"
              animate={{ opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="mb-6 text-center"
          >
            <div className={cn(
              'text-3xl font-bold tabular-nums tracking-wider',
              status === 'recording' ? 'text-red-500' : 'text-[hsl(var(--card-foreground))]',
            )}>
              {formatDuration(duration)}
            </div>
            {status === 'processing' && (
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                Encoding your recording...
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3">
          {status === 'idle' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
            >
              <Circle className="h-4 w-4 fill-current" />
              Start Recording
            </motion.button>
          )}

          {status === 'recording' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPause}
                className="flex items-center gap-2 rounded-full bg-[hsl(var(--muted))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--card-foreground))] transition-colors hover:bg-[hsl(var(--accent))]"
              >
                <Pause className="h-4 w-4" />
                Pause
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStop}
                className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop
              </motion.button>
            </>
          )}

          {status === 'paused' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPause}
                className="flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:opacity-90"
              >
                <Play className="h-4 w-4" />
                Resume
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStop}
                className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop
              </motion.button>
            </>
          )}

          {status === 'processing' && (
            <div className="flex items-center gap-2 rounded-full bg-[hsl(var(--muted))] px-5 py-2.5 text-sm text-[hsl(var(--muted-foreground))]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ScreenRecordingCard.displayName = 'ScreenRecordingCard'
