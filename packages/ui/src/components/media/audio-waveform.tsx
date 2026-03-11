'use client'

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export interface AudioWaveformProps {
  src: string
  title?: string
  artist?: string
  duration?: number
  className?: string
}

// ---- Component ----

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function generateBars(count: number): number[] {
  const bars: number[] = []
  for (let i = 0; i < count; i++) {
    const base = Math.sin((i / count) * Math.PI) * 0.6
    const noise = Math.sin(i * 1.7) * 0.2 + Math.cos(i * 3.1) * 0.15
    bars.push(Math.max(0.1, Math.min(1, base + noise + 0.3)))
  }
  return bars
}

const BAR_COUNT = 60

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  src,
  title = 'Untitled Track',
  artist = 'Unknown Artist',
  duration: initialDuration = 210,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(initialDuration)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const bars = useMemo(() => generateBars(BAR_COUNT), [])
  const progress = duration > 0 ? currentTime / duration : 0

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 0.25
        })
      }, 250)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, duration])

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), [])

  const handleBarClick = useCallback(
    (index: number) => {
      const pct = index / BAR_COUNT
      setCurrentTime(pct * duration)
    },
    [duration],
  )

  const skip = useCallback(
    (seconds: number) => {
      setCurrentTime((prev) => Math.max(0, Math.min(duration, prev + seconds)))
    },
    [duration],
  )

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/10">
          <Music className="h-6 w-6 text-[hsl(var(--primary))]" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="truncate text-sm font-semibold text-[hsl(var(--card-foreground))]">{title}</h4>
          <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">{artist}</p>
        </div>
        <span className="text-xs tabular-nums text-[hsl(var(--muted-foreground))]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="flex h-16 items-end gap-[2px]">
        {bars.map((height, i) => {
          const barProgress = i / BAR_COUNT
          const isPast = barProgress <= progress
          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.01, duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'flex-1 cursor-pointer rounded-sm transition-colors duration-150 origin-bottom',
                isPast
                  ? 'bg-[hsl(var(--primary))]'
                  : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))]',
              )}
              style={{ height: `${height * 100}%` }}
              onClick={() => handleBarClick(i)}
            />
          )
        })}
      </div>

      <motion.div
        className="h-0.5 rounded-full bg-[hsl(var(--primary))]"
        initial={{ width: '0%' }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.25, ease: 'linear' }}
      />

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => skip(-10)}
          className="rounded-full p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] transition-transform hover:scale-105"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>
        <button
          onClick={() => skip(10)}
          className="rounded-full p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

AudioWaveform.displayName = 'AudioWaveform'
