'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface StoreLocatorCardProps {
  name: string
  address: string
  distance: string
  phone?: string
  hours?: string
  isOpen?: boolean
  className?: string
}

const StoreLocatorCard: React.FC<StoreLocatorCardProps> = ({
  name,
  address,
  distance,
  phone,
  hours,
  isOpen,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      className={cn(
        'rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-colors',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[hsl(var(--foreground))]">
            {name}
          </h3>
          <div className="mt-1 flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--muted-foreground))]" />
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
              {address}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {typeof isOpen === 'boolean' && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                isOpen
                  ? 'bg-emerald-500/15 text-emerald-600'
                  : 'bg-red-500/15 text-red-600',
              )}
            >
              <span
                className={cn(
                  'mr-1 h-1.5 w-1.5 rounded-full',
                  isOpen ? 'bg-emerald-500' : 'bg-red-500',
                )}
              />
              {isOpen ? 'Open' : 'Closed'}
            </motion.span>
          )}
          <div className="flex items-center gap-1 text-xs text-[hsl(var(--primary))] font-medium">
            <Navigation className="h-3 w-3" />
            {distance}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[hsl(var(--border))] pt-3">
        {phone && (
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
            <Phone className="h-3 w-3" />
            <a
              href={`tel:${phone}`}
              className="hover:text-[hsl(var(--primary))] transition-colors"
            >
              {phone}
            </a>
          </div>
        )}
        {hours && (
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
            <Clock className="h-3 w-3" />
            <span>{hours}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[hsl(var(--primary))] px-3 py-2 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:opacity-90"
        >
          <Navigation className="h-3.5 w-3.5" />
          Directions
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-1.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Details
        </motion.button>
      </div>
    </motion.div>
  )
}

StoreLocatorCard.displayName = 'StoreLocatorCard'

export { StoreLocatorCard }
