'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, MapPin, Gauge, Radio, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface EtaCardProps {
  eta: string
  distance: string
  speed?: string
  status?: 'on-time' | 'delayed' | 'early'
  updatedAt?: string
  className?: string
}

const statusConfig = {
  'on-time': {
    label: 'On Time',
    icon: CheckCircle2,
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-600',
    dotClass: 'bg-emerald-500',
  },
  delayed: {
    label: 'Delayed',
    icon: AlertTriangle,
    bgClass: 'bg-red-500/15',
    textClass: 'text-red-600',
    dotClass: 'bg-red-500',
  },
  early: {
    label: 'Early',
    icon: TrendingDown,
    bgClass: 'bg-blue-500/15',
    textClass: 'text-blue-600',
    dotClass: 'bg-blue-500',
  },
}

const EtaCard: React.FC<EtaCardProps> = ({
  eta,
  distance,
  speed,
  status = 'on-time',
  updatedAt,
  className,
}) => {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Estimated Arrival
          </h3>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={status}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
              config.bgClass,
              config.textClass,
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="p-4">
        <div className="text-center mb-4">
          <motion.p
            key={eta}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold text-[hsl(var(--foreground))] tracking-tight"
          >
            {eta}
          </motion.p>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            Estimated time of arrival
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-[hsl(var(--muted))] px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
              <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
                Distance
              </span>
            </div>
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{distance}</p>
          </div>
          <div className="rounded-md bg-[hsl(var(--muted))] px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Gauge className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
              <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
                Speed
              </span>
            </div>
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
              {speed || '--'}
            </p>
          </div>
        </div>

        {updatedAt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 flex items-center justify-center gap-1.5"
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)}
            />
            <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
              <Radio className="h-3 w-3" />
              <span>Live</span>
              <span className="mx-0.5">&middot;</span>
              <span>Updated {updatedAt}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

EtaCard.displayName = 'EtaCard'

export { EtaCard }
