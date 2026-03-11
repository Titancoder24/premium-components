'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, CheckCircle2, Truck, Clock, CircleDot, MapPin } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface DeliveryStep {
  label: string
  completed: boolean
  time?: string
}

export interface DeliveryTrackerProps {
  orderId: string
  status: 'placed' | 'confirmed' | 'shipped' | 'out-for-delivery' | 'delivered'
  estimatedTime?: string
  steps?: DeliveryStep[]
  className?: string
}

const statusConfig = {
  placed: { label: 'Order Placed', color: 'text-[hsl(var(--muted-foreground))]', icon: Package },
  confirmed: { label: 'Confirmed', color: 'text-blue-500', icon: CheckCircle2 },
  shipped: { label: 'Shipped', color: 'text-amber-500', icon: Package },
  'out-for-delivery': { label: 'Out for Delivery', color: 'text-orange-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-emerald-500', icon: MapPin },
}

const statusOrder: DeliveryTrackerProps['status'][] = [
  'placed',
  'confirmed',
  'shipped',
  'out-for-delivery',
  'delivered',
]

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  orderId,
  status,
  estimatedTime,
  steps = [],
  className,
}) => {
  const currentIndex = statusOrder.indexOf(status)
  const StatusIcon = statusConfig[status].icon
  const isDelivered = status === 'delivered'

  return (
    <div
      className={cn(
        'rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      <div className="border-b border-[hsl(var(--border))] px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Delivery Tracker</h3>
          <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
            #{orderId}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn('flex items-center gap-1.5', statusConfig[status].color)}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{statusConfig[status].label}</span>
          </motion.div>
          {estimatedTime && !isDelivered && (
            <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
              <Clock className="h-3 w-3" />
              <span>ETA: {estimatedTime}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="relative mb-3">
          <div className="flex items-center justify-between">
            {statusOrder.map((s, index) => {
              const isCompleted = index <= currentIndex
              const isCurrent = index === currentIndex
              return (
                <div key={s} className="relative flex flex-col items-center" style={{ zIndex: 1 }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
                      isCompleted
                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]'
                        : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]',
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--primary-foreground))]" />
                    ) : (
                      <CircleDot className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                    )}
                  </motion.div>
                  {isCurrent && (
                    <motion.div
                      layoutId="tracker-indicator"
                      className="absolute -bottom-1 h-1 w-1 rounded-full bg-[hsl(var(--primary))]"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <div className="absolute top-3 left-3 right-3 h-0.5 bg-[hsl(var(--border))]" style={{ zIndex: 0 }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(currentIndex / (statusOrder.length - 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-[hsl(var(--primary))]"
            />
          </div>
        </div>

        <div className="flex justify-between text-[9px] text-[hsl(var(--muted-foreground))] mb-4">
          {statusOrder.map((s) => (
            <span key={s} className="w-12 text-center leading-tight">
              {statusConfig[s].label}
            </span>
          ))}
        </div>
      </div>

      {steps.length > 0 && (
        <div className="border-t border-[hsl(var(--border))] px-4 py-3">
          <p className="mb-2 text-xs font-medium text-[hsl(var(--foreground))]">Activity</p>
          <div className="space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative flex gap-3 pb-3 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0 mt-1',
                      step.completed
                        ? 'bg-[hsl(var(--primary))]'
                        : 'bg-[hsl(var(--muted-foreground))]/40',
                    )}
                  />
                  {index < steps.length - 1 && (
                    <div className="mt-1 h-full w-px bg-[hsl(var(--border))]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-xs',
                      step.completed
                        ? 'text-[hsl(var(--foreground))] font-medium'
                        : 'text-[hsl(var(--muted-foreground))]',
                    )}
                  >
                    {step.label}
                  </p>
                  {step.time && (
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{step.time}</p>
                  )}
                </div>
                <AnimatePresence>
                  {step.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="shrink-0"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

DeliveryTracker.displayName = 'DeliveryTracker'

export { DeliveryTracker }
