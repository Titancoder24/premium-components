'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, X, Crosshair } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface LocationPickerValue {
  lat: number
  lng: number
  address: string
}

export interface LocationPickerProps {
  value?: LocationPickerValue | null
  onChange?: (value: LocationPickerValue | null) => void
  placeholder?: string
  className?: string
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  placeholder = 'Search for a location...',
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [pinDropped, setPinDropped] = useState(!!value)

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!searchQuery.trim()) return
      const newValue: LocationPickerValue = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
        address: searchQuery,
      }
      setPinDropped(true)
      onChange?.(newValue)
    },
    [searchQuery, onChange],
  )

  const handleClear = useCallback(() => {
    setSearchQuery('')
    setPinDropped(false)
    onChange?.(null)
  }, [onChange])

  const handleMapClick = useCallback(() => {
    const newValue: LocationPickerValue = {
      lat: 40.7128 + (Math.random() - 0.5) * 0.2,
      lng: -74.006 + (Math.random() - 0.5) * 0.2,
      address: 'Selected location',
    }
    setPinDropped(true)
    onChange?.(newValue)
  }, [onChange])

  return (
    <div className={cn('w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden', className)}>
      <form onSubmit={handleSearch} className="relative flex items-center border-b border-[hsl(var(--border))]">
        <Search className="ml-3 h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none"
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="mr-2 rounded-full p-1 hover:bg-[hsl(var(--muted))]"
            >
              <X className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      <div
        role="button"
        tabIndex={0}
        onClick={handleMapClick}
        onKeyDown={(e) => e.key === 'Enter' && handleMapClick()}
        className="relative h-48 bg-[hsl(var(--muted))] cursor-crosshair flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-[hsl(var(--muted-foreground))]"
              style={{
                left: `${(i + 1) * 12}%`,
                top: 0,
                bottom: 0,
                borderLeftWidth: 1,
              }}
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-[hsl(var(--muted-foreground))]"
              style={{
                top: `${(i + 1) * 18}%`,
                left: 0,
                right: 0,
                borderTopWidth: 1,
              }}
            />
          ))}
        </div>

        <Crosshair className="absolute h-5 w-5 text-[hsl(var(--muted-foreground))] opacity-30" />

        <AnimatePresence>
          {(pinDropped || value) && (
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute flex flex-col items-center"
            >
              <MapPin className="h-8 w-8 text-[hsl(var(--primary))] fill-[hsl(var(--primary))]" />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.3 }}
                transition={{ delay: 0.2 }}
                className="mt-[-2px] h-2 w-4 rounded-full bg-[hsl(var(--foreground))]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[hsl(var(--border))]"
          >
            <div className="flex items-start gap-2 px-3 py-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">
                  {value.address}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

LocationPicker.displayName = 'LocationPicker'

export { LocationPicker }
