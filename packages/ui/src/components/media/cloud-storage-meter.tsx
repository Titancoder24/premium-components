'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HardDrive, AlertTriangle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export interface StorageBreakdownItem {
  label: string
  size: number
  color: string
}

export interface CloudStorageMeterProps {
  used: number
  total: number
  unit?: 'GB' | 'TB'
  breakdown?: StorageBreakdownItem[]
  className?: string
}

// ---- Component ----

function formatSize(value: number, unit: string): string {
  if (value >= 1000 && unit === 'GB') return `${(value / 1000).toFixed(1)} TB`
  return `${value.toFixed(value < 10 ? 1 : 0)} ${unit}`
}

export const CloudStorageMeter: React.FC<CloudStorageMeterProps> = ({
  used,
  total,
  unit = 'GB',
  breakdown = [],
  className,
}) => {
  const percentage = useMemo(() => Math.min(100, (used / total) * 100), [used, total])
  const isWarning = percentage >= 80
  const isCritical = percentage >= 95

  const circumference = 2 * Math.PI * 58
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const sortedBreakdown = useMemo(
    () => [...breakdown].sort((a, b) => b.size - a.size),
    [breakdown],
  )

  const breakdownTotal = useMemo(
    () => breakdown.reduce((sum, b) => sum + b.size, 0),
    [breakdown],
  )

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-[hsl(var(--primary))]" />
          <span className="text-sm font-semibold text-[hsl(var(--card-foreground))]">
            Cloud Storage
          </span>
        </div>
        {isCritical && (
          <div className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5">
            <AlertTriangle className="h-3 w-3 text-red-500" />
            <span className="text-xs font-medium text-red-500">Almost full</span>
          </div>
        )}
        {isWarning && !isCritical && (
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5">
            <Info className="h-3 w-3 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">Running low</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke={
                isCritical
                  ? 'rgb(239 68 68)'
                  : isWarning
                    ? 'rgb(245 158 11)'
                    : 'hsl(var(--primary))'
              }
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums text-[hsl(var(--card-foreground))]">
              {Math.round(percentage)}%
            </span>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">used</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-3">
            <span className="text-lg font-bold text-[hsl(var(--card-foreground))]">
              {formatSize(used, unit)}
            </span>
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              {' '}
              of {formatSize(total, unit)}
            </span>
          </div>

          <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
            {sortedBreakdown.length > 0 ? (
              <div className="flex h-full">
                {sortedBreakdown.map((item, i) => {
                  const width = (item.size / total) * 100
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ width: '0%' }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                      className="h-full"
                      style={{ backgroundColor: item.color }}
                    />
                  )
                })}
              </div>
            ) : (
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-[hsl(var(--primary))]',
                )}
                initial={{ width: '0%' }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            )}
          </div>

          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {formatSize(total - used, unit)} available
          </p>
        </div>
      </div>

      {sortedBreakdown.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[hsl(var(--border))] pt-4">
          {sortedBreakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="flex-1 truncate text-xs text-[hsl(var(--card-foreground))]">
                {item.label}
              </span>
              <span className="text-xs tabular-nums text-[hsl(var(--muted-foreground))]">
                {formatSize(item.size, unit)}
              </span>
            </div>
          ))}
          {breakdownTotal < used && (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--muted-foreground))]" />
              <span className="flex-1 text-xs text-[hsl(var(--card-foreground))]">Other</span>
              <span className="text-xs tabular-nums text-[hsl(var(--muted-foreground))]">
                {formatSize(used - breakdownTotal, unit)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

CloudStorageMeter.displayName = 'CloudStorageMeter'
